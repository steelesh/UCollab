import { faker } from '@faker-js/faker';
import { AvatarSource, NotificationType, OnboardingStep, Project, ProjectType, Technology, User } from '@prisma/client';
import { UserService } from '~/features/users/user.service';
import { prisma } from '~/lib/prisma';

export async function seedDatabase() {
  try {
    await clearDatabase();
    const adminAzureId = 'local-dev';
    const admin = await prisma.user.create({
      data: {
        ...generateUCUser(0),
        username: 'admin',
        email: 'admin@ucollab.xyz',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        onboardingStep: OnboardingStep.COMPLETE,
        avatar: await UserService.generateDefaultAvatar(adminAzureId),
        avatarSource: AvatarSource.DEFAULT,
        azureAdId: adminAzureId,
        role: 'ADMIN',
        accounts: { create: fakeAccount() },
        notificationPreferences: { create: {} },
      },
    });

    const technologyConnect = DEFAULT_TECHNOLOGIES.map((technologyName) => ({
      where: { name: technologyName },
      create: { name: technologyName, verified: true },
    }));

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        technologies: {
          connectOrCreate: technologyConnect,
        },
      },
    });

    const allTechnologies = await prisma.technology.findMany();

    await createTestUsers(allTechnologies);
    await createProjectsAndNotifications();

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createTestUsers(initialTechnologies: Technology[]) {
  let allTechnologies = initialTechnologies;

  if (allTechnologies.length === 0) {
    allTechnologies = await prisma.technology.findMany();
  }

  if (allTechnologies.length === 0) {
    console.warn('No technologies available for creating users.');
    return;
  }

  const azureId = faker.string.uuid();
  const initialUserTech = faker.helpers.arrayElement(allTechnologies);

  await prisma.user.create({
    data: {
      ...generateUCUser(0),
      onboardingStep: OnboardingStep.STEP_ONE,
      avatar: await UserService.generateDefaultAvatar(azureId),
      avatarSource: AvatarSource.DEFAULT,
      azureAdId: azureId,
      accounts: { create: fakeAccount() },
      notificationPreferences: { create: {} },
      technologies: {
        connect: [{ id: initialUserTech.id }],
      },
    },
  });

  for (let i = 0; i < 250; i++) {
    const azureId = faker.string.uuid();
    const technologyIds = (await prisma.technology.findMany({ select: { id: true } })).map((tech) => tech.id);
    const userTechConnect: { id: string }[] = [];

    if (technologyIds.length > 0) {
      const guaranteedTechId = faker.helpers.arrayElement(technologyIds);
      userTechConnect.push({ id: guaranteedTechId });
      const numAdditionalTechs = faker.number.int({ min: 0, max: Math.min(3, technologyIds.length - 1) });
      const availableTechIds = faker.helpers.shuffle(technologyIds.filter((id) => id !== guaranteedTechId));
      for (let j = 0; j < numAdditionalTechs; j++) {
        const additionalTechId = availableTechIds[j];
        if (additionalTechId) {
          userTechConnect.push({ id: additionalTechId });
        }
      }
    }

    await prisma.user.create({
      data: {
        ...generateUCUser(i + 1),
        onboardingStep: OnboardingStep.COMPLETE,
        avatar: await UserService.generateDefaultAvatar(azureId),
        avatarSource: AvatarSource.DEFAULT,
        azureAdId: azureId,
        role: faker.number.int({ min: 1, max: 10 }) === 1 ? 'ADMIN' : 'USER',
        technologies: {
          connect: userTechConnect,
        },
        accounts: { create: fakeAccount() },
        notificationPreferences: { create: {} },
        gradYear: faker.number.int({ min: 2025, max: 2030 }),
        mentorship: faker.helpers.arrayElement(['MENTOR', 'MENTEE', 'NONE']),
      },
    });
  }
}

async function createProjectsAndNotifications() {
  const completedUsers = await prisma.user.findMany({
    where: { onboardingStep: OnboardingStep.COMPLETE },
  });

  for (const user of completedUsers) {
    const projectCount = faker.number.int({ min: 2, max: 6 });
    for (let i = 0; i < projectCount; i++) {
      await createProject(user, completedUsers);
    }
    await createSystemNotifications(user);
  }
}

async function createProject(user: User, allUsers: User[]) {
  const projectType = faker.helpers.arrayElement(Object.values(ProjectType));
  const conversation = faker.helpers.arrayElement(POST_CONTENT?.[projectType] || []);
  const technologyIds = (await prisma.technology.findMany({ select: { id: true } })).map((tech) => tech.id);
  if (technologyIds.length === 0) {
    console.warn('No technologies available, skipping project creation with technologies.');
    return;
  }
  const projectTechConnect: { id: string }[] = [];
  const guaranteedTechId = faker.helpers.arrayElement(technologyIds);
  projectTechConnect.push({ id: guaranteedTechId });
  const numAdditionalTechs = faker.number.int({ min: 0, max: Math.min(2, technologyIds.length - 1) });
  const availableTechIds = faker.helpers.shuffle(technologyIds.filter((id) => id !== guaranteedTechId));
  for (let j = 0; j < numAdditionalTechs; j++) {
    const additionalTechId = availableTechIds[j];
    if (additionalTechId) {
      projectTechConnect.push({ id: additionalTechId });
    }
  }

  const project = await prisma.project.create({
    data: {
      title: conversation?.title || 'Sample Project',
      description: conversation?.description || 'A sample project description.',
      projectType,
      createdById: user.id,
      githubRepo: conversation?.githubProject
        ? `https://www.github.com/${user.username}/${conversation.githubProject}`
        : null,
      rating: 0,
      technologies: {
        connect: projectTechConnect,
      },
    },
  });

  if (project) {
    await createProjectRatings(project, allUsers, user);

    await createCommentsAndNotifications(
      project,
      conversation || { title: '', description: '', comments: [] },
      allUsers,
      user,
    );
  }
}

async function createProjectRatings(project: Project, allUsers: User[], projectCreator: User) {
  const potentialRaters = allUsers.filter((u) => u.id !== projectCreator.id);
  const numberOfRaters = faker.number.int({ min: 0, max: Math.min(10, potentialRaters.length) });

  const raters = faker.helpers.shuffle(potentialRaters).slice(0, numberOfRaters);

  if (raters.length === 0) {
    return;
  }

  const ratings = [];
  for (const rater of raters) {
    const rating = faker.number.int({ min: 1, max: 5 });
    await prisma.projectRating.create({
      data: {
        projectId: project.id,
        userId: rater.id,
        rating: rating,
      },
    });

    ratings.push(rating);
  }

  if (ratings.length > 0) {
    const averageRating = Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1));

    await prisma.project.update({
      where: { id: project.id },
      data: { rating: averageRating },
    });
  }
}

async function createCommentsAndNotifications(
  project: Project,
  conversation: ProjectConversation,
  allUsers: User[],
  projectCreator: User,
) {
  const commenters = faker.helpers
    .shuffle([...allUsers])
    .filter((u) => u.id !== projectCreator.id)
    .slice(0, conversation.comments.length);

  for (let i = 0; i < commenters.length; i++) {
    const commenter = commenters[i];
    if (!commenter) continue;

    const comment = await prisma.comment.create({
      data: {
        content: conversation.comments[i] || '',
        createdById: commenter.id,
        projectId: project.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: project.createdById,
        message: `${commenter.username} commented on your post "${project.title}"`,
        type: NotificationType.COMMENT,
        commentId: comment.id,
        triggeredById: commenter.id,
        isRead: faker.datatype.boolean(),
      },
    });
  }
}

async function createSystemNotifications(user: User) {
  const notificationCount = faker.number.int({ min: 1, max: 3 });
  for (let i = 0; i < notificationCount; i++) {
    await prisma.notification.create({
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
  await prisma.$transaction([
    prisma.technology.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.project.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

function generateUCUser(index: number) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const usernameBase = lastName.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '');
  const username = `${usernameBase}${firstName[0]?.toLowerCase()}${index}`;
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
    type: 'oauth',
    provider: 'microsoft-entra-id',
    providerAccountId: faker.string.uuid(),
    access_token: faker.string.alphanumeric({ length: 64 }),
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: faker.string.alphanumeric({ length: 64 }),
    token_type: 'Bearer',
    scope: 'openid profile email User.Read User.ReadBasic.All',
  };
}

const UC_DOMAINS = [
  'mail.uc.edu',
  'law.uc.edu',
  'cs.uc.edu',
  'math.uc.edu',
  'ucmail.uc.edu',
  'alumni.uc.edu',
  'uc.edu',
  'mailuc.onmicrosoft.com',
  'email.uc.edu',
  'mailuc.mail.onmicrosoft.com',
  'innovation.uc.edu',
];

export const DEFAULT_TECHNOLOGIES = [
  'React',
  'JavaScript',
  'TypeScript',
  'Next.js',
  'Vue.js',
  'Nuxt.js',
  'Angular',
  'Svelte',
  'SvelteKit',
  'Remix',
  'Gatsby',
  'Astro',
  'React Native',
  'Flutter',
  'Electron',
  'Three.js',
  'D3.js',
  'Node.js',
  'Express',
  'NestJS',
  'Django',
  'FastAPI',
  'Spring Boot',
  'Laravel',
  'Ruby on Rails',
  'ASP.NET Core',
  'Phoenix',
  'Fiber',
  'Echo',
  'Gin',
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Redis',
  'Elasticsearch',
  'Cassandra',
  'CockroachDB',
  'TimescaleDB',
  'Dgraph',
  'Memcached',
  'Apache Druid',
  'ClickHouse',
  'Apache Kafka',
  'RabbitMQ',
  'Redis Streams',
  'Apache Pulsar',
  'NATS',
  'Amazon SQS',
  'Azure Service Bus',
  'Docker',
  'Kubernetes',
  'Istio',
  'Linkerd',
  'Prometheus',
  'Grafana',
  'Jaeger',
  'Terraform',
  'Pulumi',
  'Ansible',
  'Chef',
  'Puppet',
  'GitHub Actions',
  'Jenkins',
  'GitLab CI',
  'CircleCI',
  'ArgoCD',
  'Tekton',
  'Spinnaker',
  'Harness',
  'AWS Lambda',
  'Azure Functions',
  'Google Cloud Functions',
  'AWS ECS',
  'AWS EKS',
  'Azure AKS',
  'GCP GKE',
  'Vercel',
  'Netlify',
  'Heroku',
  'DigitalOcean',
  'GraphQL',
  'REST',
  'gRPC',
  'WebSockets',
  'WebRTC',
  'Apollo',
  'tRPC',
  'OpenAPI',
  'Swagger',
  'Jest',
  'Cypress',
  'Playwright',
  'Selenium',
  'JUnit',
  'PyTest',
  'SonarQube',
  'ESLint',
  'Prettier',
  'Datadog',
  'New Relic',
  'Sentry',
  'ELK Stack',
  'OpenTelemetry',
  'Splunk',
  'Dynatrace',
  'Auth0',
  'Keycloak',
  'Vault',
  'Cert-Manager',
  "Let's Encrypt",
  'OpenID Connect',
  'OAuth2',
  'TensorFlow',
  'PyTorch',
  'Scikit-learn',
  'Hugging Face',
  'MLflow',
  'Kubeflow',
  'Ray',
  'VS Code',
  'Git',
  'Docker Desktop',
  'Postman',
  'Insomnia',
  'DBeaver',
  'pgAdmin',
  'Python',
  'Java',
  'C',
  'C++',
  'C#',
  'PHP',
  'Swift',
  'Kotlin',
  'Ruby',
  'Go',
  'Rust',
  'Scala',
  'Haskell',
  'Elixir',
  'R',
  'Objective-C',
  'Perl',
  'Lua',
  'Clojure',
  'F#',
  'jQuery',
  'Bootstrap',
  'TailwindCSS',
  'Material-UI',
  'Redux',
  'MobX',
  'RxJS',
  'Deno',
  'HTML',
  'CSS',
  'Prisma',
  'shadCN',
];

const SYSTEM_MESSAGES = [
  'Welcome to UCollab! Complete your profile to get started.',
  'New feature alert: You can now follow other users!',
  "Don't forget to check out the trending projects.",
  'Your profile is gaining attention! Consider adding more skills.',
  'Weekly digest: Check out the most active discussions.',
];

interface ProjectConversation {
  title: string;
  description: string;
  comments: string[];
  githubProject?: string;
}

const POST_CONTENT: Record<ProjectType, ProjectConversation[]> = {
  CONTRIBUTION: [
    {
      title: 'Built a React Component Library',
      description:
        "I've created a collection of React components following modern design patterns. Includes buttons, forms, navigation, and data display components. All components are fully accessible and TypeScript-ready. Looking for collaborators!",
      comments: [
        'This is exactly what I needed for my current project! The TypeScript support is a huge plus.',
        'Great work! Have you considered adding Storybook for component documentation?',
        'I can help with testing. Just finished a project using React Testing Library.',
      ],
      githubProject: 'react-component-lib',
    },
    {
      title: 'Created a Course Registration API',
      description:
        'Developed a RESTful API that simplifies course registration. Features include real-time seat availability, prerequisite checking, and waitlist management. Built with Node.js and Express.',
      comments: [
        'The architecture looks really clean. How are you handling concurrent registrations?',
        'The waitlist feature is brilliant. Would love to see the implementation details.',
        'Have you considered adding GraphQL support for more flexible queries?',
      ],
      githubProject: 'course-registration-api',
    },
    {
      title: 'Machine Learning Model for Academic Planning',
      description:
        'Built a predictive model using historical enrollment data to forecast course demand. Uses Python, scikit-learn, and handles features like major requirements and course prerequisites.',
      comments: [
        "Interesting approach! What's your current prediction accuracy?",
        'Have you tried using LSTM networks for the time-series aspects?',
        'The feature engineering looks solid. Would love to collaborate on expanding this.',
      ],
      githubProject: 'academic-planning-ml',
    },
    {
      title: 'Microservices Architecture for Student Services',
      description:
        'Building a scalable microservices architecture for handling student registration, course management, and academic records. Using Spring Boot, Kafka, and MongoDB.',
      comments: [
        'Have you considered using service mesh for better observability?',
        'Great architecture! How are you handling data consistency across services?',
        'The Kafka implementation looks solid. Would love to contribute to the event streaming part.',
        'Consider adding circuit breakers for better resilience.',
      ],
      githubProject: 'student-services-ms',
    },
    {
      title: 'AI-Powered Study Group Matcher',
      description:
        'Developing an ML model that matches students into study groups based on learning styles, schedules, and academic goals. Uses Python, scikit-learn, and FastAPI.',
      comments: [
        'The matching algorithm is impressive! Have you considered adding personality traits?',
        'Would love to help implement the recommendation engine.',
        'Great use of collaborative filtering!',
        'How are you handling cold start problems?',
      ],
      githubProject: 'study-group-matcher',
    },
    {
      title: 'Blockchain-Based Academic Credentials',
      description:
        'Implementing a blockchain solution for verifying academic credentials and certificates. Built with Solidity, Web3.js, and React.',
      comments: [
        'Smart contract implementation looks secure. Consider adding multi-sig for admin functions.',
        'Have you looked into zero-knowledge proofs for privacy?',
        'Would love to help with the frontend integration.',
        'Great use of ERC721 for certificate tokens!',
      ],
      githubProject: 'credential-chain',
    },
    {
      title: 'Kubernetes Operator for Academic Resources',
      description:
        'Built a custom Kubernetes operator to manage academic computing resources. Handles auto-scaling of GPU clusters, manages student quotas, and integrates with our LDAP.',
      comments: [
        'The resource allocation logic is impressive! How do you handle priority classes?',
        'Would love to help with the monitoring integration.',
        'Consider adding preemptible instances for cost optimization.',
        'Great use of custom resource definitions!',
      ],
      githubProject: 'academic-k8s-operator',
    },
    {
      title: 'Event-Driven Architecture for Campus Services',
      description:
        'Implementing an event-driven architecture using Apache Kafka for campus-wide service integration. Includes real-time updates for class schedules, room bookings, and campus events.',
      comments: [
        'The event schema design looks solid. Have you considered using Avro?',
        'Would love to contribute to the dead letter queue handling.',
        'How are you handling event versioning?',
        'Great use of the outbox pattern!',
      ],
      githubProject: 'campus-events-backbone',
    },
    {
      title: 'Automated Grading Pipeline',
      description:
        'Created a scalable automated grading system for programming assignments. Uses Docker for isolation, supports multiple languages, and includes plagiarism detection.',
      comments: [
        'The container security setup is impressive!',
        'Have you considered adding support for GPU-based assignments?',
        'Would love to help implement more language backends.',
        'Great approach to handling timeouts and resource limits.',
      ],
      githubProject: 'auto-grade-pipeline',
    },
    {
      title: 'Distributed Cache for Learning Management System',
      description:
        'Implemented a distributed caching layer using Redis Cluster for our LMS. Includes cache invalidation strategies and real-time analytics.',
      comments: [
        'Smart use of cache regions for different content types!',
        'How are you handling cache stampede?',
        'Would love to help with the Prometheus metrics integration.',
        'Consider implementing a circuit breaker for Redis operations.',
      ],
      githubProject: 'lms-cache-layer',
    },
  ],
  FEEDBACK: [
    {
      title: 'Review My First Browser Extension',
      description:
        'Built a browser extension that helps students track assignment deadlines across different learning platforms. Would love feedback on the UI and feature set.',
      comments: [
        'The UI is clean, but you might want to improve color contrast for accessibility.',
        'Consider adding calendar export functionality - that would be super useful!',
        'Found a sync issue with one of the platforms - happy to help debug.',
      ],
      githubProject: 'deadline-tracker-extension',
    },
    {
      title: 'Need Input on Database Design',
      description:
        'Working on a research project tracking user engagement patterns. Need feedback on my current MongoDB schema design, especially around handling time-series data.',
      comments: [
        'For time-series data, TimescaleDB might be a better fit than MongoDB.',
        "Your current schema might have scalability issues. Let's discuss denormalization strategies.",
        'Have you considered using a hybrid approach with Redis for real-time analytics?',
      ],
      githubProject: 'engagement-tracker',
    },
    {
      title: 'Code Review: OAuth Implementation',
      description:
        'Implementing OAuth2 for user authentication. Would appreciate a security review of the current implementation.',
      comments: [
        'Your token handling looks solid, but you might want to add refresh token rotation.',
        'Consider implementing rate limiting on the token endpoint.',
        "Don't forget to sanitize state parameters to prevent CSRF attacks.",
      ],
      githubProject: 'oauth-service',
    },
    {
      title: 'Code Review: GraphQL API Design',
      description:
        'Building a GraphQL API for a campus events platform. Looking for feedback on schema design and resolver patterns.',
      comments: [
        'Consider using DataLoader to prevent N+1 queries.',
        'The mutation structure looks good, but you might want to add input validation.',
        'Have you considered implementing cursor-based pagination?',
        'Great use of interfaces for shared fields!',
      ],
      githubProject: 'campus-events-api',
    },
    {
      title: 'Performance Review: Real-time Chat System',
      description:
        'Built a real-time chat system using Socket.io and Redis. Looking for feedback on scaling and performance optimization.',
      comments: [
        'Consider implementing message queuing for better reliability.',
        'The Redis pub/sub implementation looks solid.',
        'Have you load tested with multiple concurrent connections?',
        'You might want to add message persistence for offline users.',
      ],
      githubProject: 'campus-chat',
    },
    {
      title: 'Security Audit: Authentication System',
      description: 'Implementing OAuth2 and OIDC for a multi-tenant application. Would appreciate a security review.',
      comments: [
        'Consider implementing refresh token rotation.',
        'The PKCE implementation looks good.',
        'You might want to add rate limiting on token endpoints.',
        'Great job with the state parameter validation!',
      ],
      githubProject: 'auth-service',
    },
    {
      title: 'Review: Serverless Data Processing Pipeline',
      description:
        'Building a serverless pipeline using AWS Lambda and Step Functions for processing research data. Looking for feedback on architecture and cost optimization.',
      comments: [
        'Consider using Lambda Power Tuning for optimal memory configuration.',
        'The state machine design looks clean. Have you considered using Map states for parallelization?',
        'Would suggest adding DLQ for failed executions.',
        'Great use of S3 lifecycle policies!',
      ],
      githubProject: 'research-data-pipeline',
    },
    {
      title: 'Code Review: WebAssembly Module',
      description:
        'Developing a WebAssembly module in Rust for complex calculations in our web-based simulation tool. Need feedback on performance and browser compatibility.',
      comments: [
        'The memory management looks solid. Consider using web-workers for heavy computations.',
        'Have you benchmarked against asm.js?',
        'Great use of wasm-bindgen!',
        'Consider adding SIMD support for modern browsers.',
      ],
      githubProject: 'wasm-sim-engine',
    },
    {
      title: 'Architecture Review: Service Mesh Implementation',
      description:
        'Implementing Istio service mesh in our microservices architecture. Looking for feedback on configuration and observability setup.',
      comments: [
        'The mTLS setup looks good. Consider enabling strict mode.',
        'Have you looked into using WebAssembly filters?',
        'Great approach to circuit breaking configuration.',
        'Consider implementing custom metrics for business KPIs.',
      ],
      githubProject: 'campus-service-mesh',
    },
  ],
};

// Run the seed
seedDatabase().catch((e) => {
  console.error('Error during seeding:', e);
  process.exit(1);
});
