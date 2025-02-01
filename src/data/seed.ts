import { faker } from "@faker-js/faker";
import {
  AvatarSource,
  NotificationType,
  OnboardingStep,
  Post,
  PostStatus,
  PostType,
  Skill,
  User,
} from "@prisma/client";
import { UserService } from "~/services/user.service";
import * as fakeData from "./fake-data";
import { db } from "~/data/db";

export async function seedDatabase() {
  try {
    // clear database
    await clearDatabase();

    // create admin user
    const adminAzureId = "local-dev";
    const admin = await db.user.create({
      data: {
        ...generateUCUser(),
        username: "admin",
        email: "admin@ucollab.xyz",
        firstName: "Admin",
        lastName: "User",
        fullName: "Admin User",
        onboardingStep: OnboardingStep.COMPLETE,
        avatar: await UserService.generateDefaultAvatar(adminAzureId),
        avatarSource: AvatarSource.DEFAULT,
        azureAdId: adminAzureId,
        role: "ADMIN",
        profile: { create: {} },
        accounts: { create: fakeAccount() },
        NotificationPreferences: { create: {} },
      },
    });

    // Create default skills and technologies
    for (const skillName of DEFAULT_SKILLS) {
      await db.skill.create({
        data: { name: skillName, verified: true, createdById: admin.id },
      });
    }
    for (const techName of DEFAULT_TECHNOLOGIES) {
      await db.technology.create({
        data: { name: techName, verified: true, createdById: admin.id },
      });
    }

    const allSkills = await db.skill.findMany();

    // create test users
    await createTestUsers(allSkills);

    // create posts and notifications
    await createPostsAndNotifications();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

async function createTestUsers(allSkills: Skill[]) {
  // create one user in onboarding
  const azureId = faker.string.uuid();
  await db.user.create({
    data: {
      ...generateUCUser(),
      onboardingStep: OnboardingStep.STEP_ONE,
      avatar: await UserService.generateDefaultAvatar(azureId),
      avatarSource: AvatarSource.DEFAULT,
      azureAdId: azureId,
      profile: { create: {} },
      accounts: { create: fakeAccount() },
      NotificationPreferences: { create: {} },
    },
  });

  // create 50 completed users
  for (let i = 0; i < 250; i++) {
    const azureId = faker.string.uuid();
    await db.user.create({
      data: {
        ...generateUCUser(),
        onboardingStep: OnboardingStep.COMPLETE,
        avatar: await UserService.generateDefaultAvatar(azureId),
        avatarSource: AvatarSource.DEFAULT,
        azureAdId: azureId,
        role: faker.number.int({ min: 1, max: 10 }) === 1 ? "ADMIN" : "USER",
        profile: {
          create: {
            ...fakeData.fakeProfile(),
            skills: {
              connect: faker.helpers
                .shuffle(allSkills)
                .slice(0, faker.number.int({ min: 3, max: 8 }))
                .map((skill) => ({ id: skill.id })),
            },
          },
        },
        accounts: { create: fakeAccount() },
        NotificationPreferences: { create: {} },
      },
    });
  }
}

async function createPostsAndNotifications() {
  const completedUsers = await db.user.findMany({
    where: { onboardingStep: OnboardingStep.COMPLETE },
  });

  for (const user of completedUsers) {
    const postCount = faker.number.int({ min: 2, max: 6 });
    for (let i = 0; i < postCount; i++) {
      await createPost(user, completedUsers);
    }
    await createSystemNotifications(user);
  }
}

async function createPost(user: User, allUsers: User[]) {
  const postType = faker.helpers.arrayElement(Object.values(PostType));
  const conversation = faker.helpers.arrayElement(POST_CONTENT[postType]);
  const technologies = await db.technology.findMany();
  const techCount = faker.number.int({ min: 1, max: 4 });
  const selectedTechs = faker.helpers.shuffle(technologies).slice(0, techCount);

  const post = await db.post.create({
    data: {
      title: conversation.title,
      description: conversation.description,
      postType,
      status: faker.helpers.arrayElement(Object.values(PostStatus)),
      createdById: user.id,
      githubRepo: conversation.githubProject
        ? `github.com/${user.username}/${conversation.githubProject}.git`
        : null,
      technologies: {
        connect: selectedTechs.map((tech) => ({ id: tech.id })),
      },
    },
  });

  await createCommentsAndNotifications(post, conversation, allUsers, user);
}

async function createCommentsAndNotifications(
  post: Post,
  conversation: PostConversation,
  allUsers: User[],
  postCreator: User,
) {
  const commenters = faker.helpers
    .shuffle([...allUsers])
    .filter((u) => u.id !== postCreator.id)
    .slice(0, conversation.comments.length);

  for (let i = 0; i < commenters.length; i++) {
    const comment = await db.comment.create({
      data: {
        content: conversation.comments[i],
        createdById: commenters[i].id,
        postId: post.id,
      },
    });

    await db.notification.create({
      data: {
        userId: post.createdById,
        message: `${commenters[i].username} commented on your post "${post.title}"`,
        type: NotificationType.COMMENT,
        commentId: comment.id,
        triggeredById: commenters[i].id,
        isRead: faker.datatype.boolean(),
      },
    });
  }
}

async function createSystemNotifications(user: User) {
  const notificationCount = faker.number.int({ min: 1, max: 3 });
  for (let i = 0; i < notificationCount; i++) {
    await db.notification.create({
      data: {
        userId: user.id,
        message: faker.helpers.arrayElement(SYSTEM_MESSAGES),
        type: NotificationType.SYSTEM,
        isRead: faker.datatype.boolean(),
      },
    });
  }
}

async function clearDatabase() {
  await db.$transaction([
    db.skill.deleteMany(),
    db.technology.deleteMany(),
    db.notification.deleteMany(),
    db.comment.deleteMany(),
    db.post.deleteMany(),
    db.profile.deleteMany(),
    db.account.deleteMany(),
    db.user.deleteMany(),
  ]);
}

function generateUCUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const randomLetter = faker.string.alpha({ length: 1, casing: "lower" });

  const usernameBase = lastName.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, "");
  const username = `${usernameBase}${firstName[0].toLowerCase()}${randomLetter}`;
  const domain = faker.helpers.arrayElement(UC_DOMAINS);

  return {
    username,
    email: `${username}@${domain}`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  };
}

function fakeAccount() {
  return {
    type: "oauth",
    provider: "microsoft-entra-id",
    providerAccountId: faker.string.uuid(),
    access_token: faker.string.alphanumeric({ length: 64 }),
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: faker.string.alphanumeric({ length: 64 }),
    token_type: "Bearer",
    scope: "openid profile email User.Read User.ReadBasic.All",
  };
}

const UC_DOMAINS = [
  "mail.uc.edu",
  "law.uc.edu",
  "cs.uc.edu",
  "math.uc.edu",
  "ucmail.uc.edu",
  "alumni.uc.edu",
  "uc.edu",
  "mailuc.onmicrosoft.com",
  "email.uc.edu",
  "mailuc.mail.onmicrosoft.com",
  "innovation.uc.edu",
];

const DEFAULT_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Ruby",
  "PHP",
  "Scala",
  "R",
  "Dart",
  "React",
  "Angular",
  "Vue.js",
  "Next.js",
  "Svelte",
  "React Native",
  "Flutter",
  "HTML5",
  "CSS3",
  "Sass/SCSS",
  "Tailwind CSS",
  "WebGL",
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Spring Boot",
  "ASP.NET Core",
  "Laravel",
  "FastAPI",
  "GraphQL",
  "REST API Design",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub Actions",
  "CircleCI",
  "ArgoCD",
  "Helm",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Cassandra",
  "DynamoDB",
  "Neo4j",
  "InfluxDB",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Computer Vision",
  "NLP",
  "Data Analysis",
  "Big Data",
  "Data Visualization",
  "Pandas",
  "NumPy",
  "Jupyter",
  "CUDA",
  "MLOps",
  "Cybersecurity",
  "OAuth/OIDC",
  "Encryption",
  "Penetration Testing",
  "Security Auditing",
  "Zero Trust Architecture",
  "Microservices",
  "Event-Driven Architecture",
  "Domain-Driven Design",
  "CQRS",
  "System Design",
  "API Design",
  "Cloud Native",
  "Project Management",
  "Agile",
  "Scrum",
  "Technical Writing",
  "Public Speaking",
  "Team Leadership",
  "Problem Solving",
  "Blockchain",
  "Web3",
  "IoT",
  "Edge Computing",
  "Quantum Computing",
  "AR/VR",
  "5G Networks",
  "Serverless",
];

export const DEFAULT_TECHNOLOGIES = [
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "Angular",
  "Svelte",
  "SvelteKit",
  "Remix",
  "Gatsby",
  "Astro",
  "React Native",
  "Flutter",
  "Electron",
  "Three.js",
  "D3.js",
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "FastAPI",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET Core",
  "Phoenix",
  "Fiber",
  "Echo",
  "Gin",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Cassandra",
  "CockroachDB",
  "TimescaleDB",
  "Dgraph",
  "Memcached",
  "Apache Druid",
  "ClickHouse",
  "Apache Kafka",
  "RabbitMQ",
  "Redis Streams",
  "Apache Pulsar",
  "NATS",
  "Amazon SQS",
  "Azure Service Bus",
  "Docker",
  "Kubernetes",
  "Istio",
  "Linkerd",
  "Prometheus",
  "Grafana",
  "Jaeger",
  "Terraform",
  "Pulumi",
  "Ansible",
  "Chef",
  "Puppet",
  "GitHub Actions",
  "Jenkins",
  "GitLab CI",
  "CircleCI",
  "ArgoCD",
  "Tekton",
  "Spinnaker",
  "Harness",
  "AWS Lambda",
  "Azure Functions",
  "Google Cloud Functions",
  "AWS ECS",
  "AWS EKS",
  "Azure AKS",
  "GCP GKE",
  "Vercel",
  "Netlify",
  "Heroku",
  "DigitalOcean",
  "GraphQL",
  "REST",
  "gRPC",
  "WebSockets",
  "WebRTC",
  "Apollo",
  "tRPC",
  "OpenAPI",
  "Swagger",
  "Jest",
  "Cypress",
  "Playwright",
  "Selenium",
  "JUnit",
  "PyTest",
  "SonarQube",
  "ESLint",
  "Prettier",
  "Datadog",
  "New Relic",
  "Sentry",
  "ELK Stack",
  "OpenTelemetry",
  "Splunk",
  "Dynatrace",
  "Auth0",
  "Keycloak",
  "Vault",
  "Cert-Manager",
  "Let's Encrypt",
  "OpenID Connect",
  "OAuth2",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Hugging Face",
  "MLflow",
  "Kubeflow",
  "Ray",
  "VS Code",
  "Git",
  "Docker Desktop",
  "Postman",
  "Insomnia",
  "DBeaver",
  "pgAdmin",
];

const SYSTEM_MESSAGES = [
  "Welcome to UCollab! Complete your profile to get started.",
  "New feature alert: You can now follow other users!",
  "Don't forget to check out the trending projects.",
  "Your profile is gaining attention! Consider adding more skills.",
  "Weekly digest: Check out the most active discussions.",
];

type PostConversation = {
  title: string;
  description: string;
  comments: string[];
  githubProject?: string;
};

const POST_CONTENT: Record<PostType, PostConversation[]> = {
  CONTRIBUTION: [
    {
      title: "Built a React Component Library",
      description:
        "I've created a collection of React components following modern design patterns. Includes buttons, forms, navigation, and data display components. All components are fully accessible and TypeScript-ready. Looking for collaborators!",
      comments: [
        "This is exactly what I needed for my current project! The TypeScript support is a huge plus.",
        "Great work! Have you considered adding Storybook for component documentation?",
        "I can help with testing. Just finished a project using React Testing Library.",
      ],
      githubProject: "react-component-lib",
    },
    {
      title: "Created a Course Registration API",
      description:
        "Developed a RESTful API that simplifies course registration. Features include real-time seat availability, prerequisite checking, and waitlist management. Built with Node.js and Express.",
      comments: [
        "The architecture looks really clean. How are you handling concurrent registrations?",
        "The waitlist feature is brilliant. Would love to see the implementation details.",
        "Have you considered adding GraphQL support for more flexible queries?",
      ],
      githubProject: "course-registration-api",
    },
    {
      title: "Machine Learning Model for Academic Planning",
      description:
        "Built a predictive model using historical enrollment data to forecast course demand. Uses Python, scikit-learn, and handles features like major requirements and course prerequisites.",
      comments: [
        "Interesting approach! What's your current prediction accuracy?",
        "Have you tried using LSTM networks for the time-series aspects?",
        "The feature engineering looks solid. Would love to collaborate on expanding this.",
      ],
      githubProject: "academic-planning-ml",
    },
    {
      title: "Microservices Architecture for Student Services",
      description:
        "Building a scalable microservices architecture for handling student registration, course management, and academic records. Using Spring Boot, Kafka, and MongoDB.",
      comments: [
        "Have you considered using service mesh for better observability?",
        "Great architecture! How are you handling data consistency across services?",
        "The Kafka implementation looks solid. Would love to contribute to the event streaming part.",
        "Consider adding circuit breakers for better resilience.",
      ],
      githubProject: "student-services-ms",
    },
    {
      title: "AI-Powered Study Group Matcher",
      description:
        "Developing an ML model that matches students into study groups based on learning styles, schedules, and academic goals. Uses Python, scikit-learn, and FastAPI.",
      comments: [
        "The matching algorithm is impressive! Have you considered adding personality traits?",
        "Would love to help implement the recommendation engine.",
        "Great use of collaborative filtering!",
        "How are you handling cold start problems?",
      ],
      githubProject: "study-group-matcher",
    },
    {
      title: "Blockchain-Based Academic Credentials",
      description:
        "Implementing a blockchain solution for verifying academic credentials and certificates. Built with Solidity, Web3.js, and React.",
      comments: [
        "Smart contract implementation looks secure. Consider adding multi-sig for admin functions.",
        "Have you looked into zero-knowledge proofs for privacy?",
        "Would love to help with the frontend integration.",
        "Great use of ERC721 for certificate tokens!",
      ],
      githubProject: "credential-chain",
    },
    {
      title: "Kubernetes Operator for Academic Resources",
      description:
        "Built a custom Kubernetes operator to manage academic computing resources. Handles auto-scaling of GPU clusters, manages student quotas, and integrates with our LDAP.",
      comments: [
        "The resource allocation logic is impressive! How do you handle priority classes?",
        "Would love to help with the monitoring integration.",
        "Consider adding preemptible instances for cost optimization.",
        "Great use of custom resource definitions!",
      ],
      githubProject: "academic-k8s-operator",
    },
    {
      title: "Event-Driven Architecture for Campus Services",
      description:
        "Implementing an event-driven architecture using Apache Kafka for campus-wide service integration. Includes real-time updates for class schedules, room bookings, and campus events.",
      comments: [
        "The event schema design looks solid. Have you considered using Avro?",
        "Would love to contribute to the dead letter queue handling.",
        "How are you handling event versioning?",
        "Great use of the outbox pattern!",
      ],
      githubProject: "campus-events-backbone",
    },
    {
      title: "Automated Grading Pipeline",
      description:
        "Created a scalable automated grading system for programming assignments. Uses Docker for isolation, supports multiple languages, and includes plagiarism detection.",
      comments: [
        "The container security setup is impressive!",
        "Have you considered adding support for GPU-based assignments?",
        "Would love to help implement more language backends.",
        "Great approach to handling timeouts and resource limits.",
      ],
      githubProject: "auto-grade-pipeline",
    },
    {
      title: "Distributed Cache for Learning Management System",
      description:
        "Implemented a distributed caching layer using Redis Cluster for our LMS. Includes cache invalidation strategies and real-time analytics.",
      comments: [
        "Smart use of cache regions for different content types!",
        "How are you handling cache stampede?",
        "Would love to help with the Prometheus metrics integration.",
        "Consider implementing a circuit breaker for Redis operations.",
      ],
      githubProject: "lms-cache-layer",
    },
  ],
  FEEDBACK: [
    {
      title: "Review My First Browser Extension",
      description:
        "Built a browser extension that helps students track assignment deadlines across different learning platforms. Would love feedback on the UI and feature set.",
      comments: [
        "The UI is clean, but you might want to improve color contrast for accessibility.",
        "Consider adding calendar export functionality - that would be super useful!",
        "Found a sync issue with one of the platforms - happy to help debug.",
      ],
      githubProject: "deadline-tracker-extension",
    },
    {
      title: "Need Input on Database Design",
      description:
        "Working on a research project tracking user engagement patterns. Need feedback on my current MongoDB schema design, especially around handling time-series data.",
      comments: [
        "For time-series data, TimescaleDB might be a better fit than MongoDB.",
        "Your current schema might have scalability issues. Let's discuss denormalization strategies.",
        "Have you considered using a hybrid approach with Redis for real-time analytics?",
      ],
      githubProject: "engagement-tracker",
    },
    {
      title: "Code Review: OAuth Implementation",
      description:
        "Implementing OAuth2 for user authentication. Would appreciate a security review of the current implementation.",
      comments: [
        "Your token handling looks solid, but you might want to add refresh token rotation.",
        "Consider implementing rate limiting on the token endpoint.",
        "Don't forget to sanitize state parameters to prevent CSRF attacks.",
      ],
      githubProject: "oauth-service",
    },
    {
      title: "Code Review: GraphQL API Design",
      description:
        "Building a GraphQL API for a campus events platform. Looking for feedback on schema design and resolver patterns.",
      comments: [
        "Consider using DataLoader to prevent N+1 queries.",
        "The mutation structure looks good, but you might want to add input validation.",
        "Have you considered implementing cursor-based pagination?",
        "Great use of interfaces for shared fields!",
      ],
      githubProject: "campus-events-api",
    },
    {
      title: "Performance Review: Real-time Chat System",
      description:
        "Built a real-time chat system using Socket.io and Redis. Looking for feedback on scaling and performance optimization.",
      comments: [
        "Consider implementing message queuing for better reliability.",
        "The Redis pub/sub implementation looks solid.",
        "Have you load tested with multiple concurrent connections?",
        "You might want to add message persistence for offline users.",
      ],
      githubProject: "campus-chat",
    },
    {
      title: "Security Audit: Authentication System",
      description:
        "Implementing OAuth2 and OIDC for a multi-tenant application. Would appreciate a security review.",
      comments: [
        "Consider implementing refresh token rotation.",
        "The PKCE implementation looks good.",
        "You might want to add rate limiting on token endpoints.",
        "Great job with the state parameter validation!",
      ],
      githubProject: "auth-service",
    },
    {
      title: "Review: Serverless Data Processing Pipeline",
      description:
        "Building a serverless pipeline using AWS Lambda and Step Functions for processing research data. Looking for feedback on architecture and cost optimization.",
      comments: [
        "Consider using Lambda Power Tuning for optimal memory configuration.",
        "The state machine design looks clean. Have you considered using Map states for parallelization?",
        "Would suggest adding DLQ for failed executions.",
        "Great use of S3 lifecycle policies!",
      ],
      githubProject: "research-data-pipeline",
    },
    {
      title: "Code Review: WebAssembly Module",
      description:
        "Developing a WebAssembly module in Rust for complex calculations in our web-based simulation tool. Need feedback on performance and browser compatibility.",
      comments: [
        "The memory management looks solid. Consider using web-workers for heavy computations.",
        "Have you benchmarked against asm.js?",
        "Great use of wasm-bindgen!",
        "Consider adding SIMD support for modern browsers.",
      ],
      githubProject: "wasm-sim-engine",
    },
    {
      title: "Architecture Review: Service Mesh Implementation",
      description:
        "Implementing Istio service mesh in our microservices architecture. Looking for feedback on configuration and observability setup.",
      comments: [
        "The mTLS setup looks good. Consider enabling strict mode.",
        "Have you looked into using WebAssembly filters?",
        "Great approach to circuit breaking configuration.",
        "Consider implementing custom metrics for business KPIs.",
      ],
      githubProject: "campus-service-mesh",
    },
  ],
  DISCUSSION: [
    {
      title: "Best Practices for Year-Long Projects",
      description:
        "Starting a major project next semester. What are some best practices for managing a year-long project? Especially interested in tech stack choices and team collaboration.",
      comments: [
        "Git workflow is crucial. We used trunk-based development with feature flags - worked great!",
        "Regular demos to stakeholders helped us stay on track. Aim for bi-weekly showcases.",
        "Document everything from day one. Tools like Notion or Confluence are great for this.",
      ],
    },
    {
      title: "Modern Web Development Practices",
      description:
        "With new technologies like Web Assembly and Edge Computing gaining traction, how should developers prepare for the changing landscape?",
      comments: [
        "Focus on understanding the fundamentals first - HTTP, browsers, and JavaScript.",
        "Learn about containerization and microservices architecture.",
        "Consider exploring Rust or Go for systems-level programming.",
      ],
    },
    {
      title: "Building an Open Source Community",
      description:
        "Thinking about starting a coding group focused on open source contributions. Would love to hear ideas about format, meeting frequency, and potential projects.",
      comments: [
        "Regular hack sessions work well for maintaining momentum.",
        "Consider organizing around specific technologies or domains.",
        "Documentation sprints are a great way to get new contributors started.",
      ],
    },
    {
      title: "AI/ML Project Collaboration",
      description:
        "Looking for collaborators on a machine learning project focused on natural language processing. Currently working with transformers and BERT models.",
      comments: [
        "I've been working with GPT models - would love to share insights!",
        "Have you looked into the latest developments in few-shot learning?",
        "We could combine this with some computer vision aspects.",
      ],
    },
    {
      title: "Transitioning from Monolith to Microservices",
      description:
        "Planning to break down a large academic management system into microservices. Looking for insights on strategy and potential pitfalls.",
      comments: [
        "Start with bounded contexts to identify service boundaries.",
        "Consider using the strangler fig pattern for gradual migration.",
        "Domain-driven design really helps with service decomposition.",
        "Don't forget to plan for distributed tracing early on.",
      ],
    },
    {
      title: "Edge Computing in Campus Infrastructure",
      description:
        "Exploring edge computing solutions for IoT devices across campus. Interested in real-world implementations and best practices.",
      comments: [
        "Look into AWS Greengrass for edge processing.",
        "Consider MQTT for efficient device communication.",
        "How are you handling device authentication?",
        "Great use case for federated learning!",
      ],
    },
    {
      title: "DevOps Culture in Academic Projects",
      description:
        "Building a DevOps culture in our research lab. Looking for tools, practices, and experiences in academic settings.",
      comments: [
        "GitLab CI/CD works great for academic projects.",
        "Consider implementing infrastructure as code early.",
        "Regular retrospectives helped us a lot.",
        "Automated testing is crucial for research reproducibility.",
      ],
    },
    {
      title: "Implementing Zero-Trust Security Model",
      description:
        "Planning to implement a zero-trust security model for our academic services. Looking for experiences and best practices.",
      comments: [
        "Start with identity-aware proxies for all services.",
        "Consider using service accounts with short-lived credentials.",
        "BeyondCorp architecture might be a good reference.",
        "Don't forget about device trust assessment.",
      ],
    },
    {
      title: "GraphQL Federation Strategy",
      description:
        "Moving towards a federated GraphQL architecture. Looking for insights on schema design and performance optimization.",
      comments: [
        "Entity interfaces are crucial for federation.",
        "Consider implementing automated schema checks in CI.",
        "Persisted queries can help with performance.",
        "Watch out for n+1 queries across services.",
      ],
    },
    {
      title: "Machine Learning Model Deployment Strategies",
      description:
        "Discussing strategies for deploying ML models in production. Looking for insights on versioning, A/B testing, and monitoring.",
      comments: [
        "Consider using feature stores for consistent training and inference.",
        "Model versioning with semantic versioning works well.",
        "Shadow deployments can help validate new models.",
        "Don't forget about monitoring concept drift.",
      ],
    },
    {
      title: "Event Sourcing in Academic Systems",
      description:
        "Considering event sourcing for our student records system. Looking for insights on schema evolution and performance at scale.",
      comments: [
        "Start with clear event schemas and versioning strategy.",
        "CQRS pattern pairs well with event sourcing.",
        "Consider using event store databases.",
        "Snapshots are crucial for performance.",
      ],
    },
  ],
};

// Run the seed
seedDatabase().catch((e) => {
  console.error("Error during seeding:", e);
  process.exit(1);
});
