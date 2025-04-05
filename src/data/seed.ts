/* eslint-disable ts/no-use-before-define */
/* eslint-disable no-console */
import type { Post, Technology, User } from "@prisma/client";

import { faker } from "@faker-js/faker";
import { AvatarSource, NeedType, NotificationType, OnboardingStep } from "@prisma/client";

import { UserService } from "~/features/users/user.service";
import { prisma } from "~/lib/prisma";

const BANNER_BASE_URL = "https://ucollab.blob.core.windows.net/ucollab-files/post-banners/";
const BANNER_IMAGES = [
  "sample-banner-1.jpg",
  "sample-banner-2.jpg",
  "sample-banner-3.jpg",
  "sample-banner-4.jpg",
  "sample-banner-5.jpg",
  "sample-banner-6.jpg",
  "sample-banner-7.jpg",
  "sample-banner-8.jpg",
];
const DEFAULT_BANNER = "default-banner.jpg";

function generateBannerImageUrl(): string {
  if (faker.datatype.boolean({ probability: 0.2 })) {
    return `${BANNER_BASE_URL}${DEFAULT_BANNER}`;
  }

  const randomImage = faker.helpers.arrayElement(BANNER_IMAGES);
  return `${BANNER_BASE_URL}${randomImage}`;
}

export async function seedDatabase() {
  try {
    await clearDatabase();
    const adminAzureId = "local-dev";
    const admin = await prisma.user.create({
      data: {
        ...generateUCUser(0),
        username: "admin",
        email: "admin@ucollab.xyz",
        firstName: "Admin",
        lastName: "User",
        fullName: "Admin User",
        onboardingStep: OnboardingStep.COMPLETE,
        avatar: await UserService.generateDefaultAvatar(adminAzureId),
        avatarSource: AvatarSource.DEFAULT,
        azureAdId: adminAzureId,
        accounts: { create: fakeAccount() },
        notificationPreferences: { create: {} },
      },
    });

    const technologyConnect = DEFAULT_TECHNOLOGIES.map(tech => ({
      where: { name: tech.name },
      create: { name: tech.name, verified: true },
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
    await createPostsAndNotifications();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
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
    console.warn("No technologies available for creating users.");
    return;
  }

  for (let i = 0; i < 60; i++) {
    const azureId = faker.string.uuid();
    const technologyIds = (await prisma.technology.findMany({ select: { id: true } })).map(tech => tech.id);
    const userTechConnect: { id: string }[] = [];

    if (technologyIds.length > 0) {
      const guaranteedTechId = faker.helpers.arrayElement(technologyIds);
      userTechConnect.push({ id: guaranteedTechId });
      const numAdditionalTechs = faker.number.int({ min: 2, max: 8 });
      const availableTechIds = faker.helpers.shuffle(technologyIds.filter(id => id !== guaranteedTechId));
      for (let j = 0; j < numAdditionalTechs && j < availableTechIds.length; j++) {
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
        technologies: {
          connect: userTechConnect,
        },
        accounts: { create: fakeAccount() },
        notificationPreferences: { create: {} },
        gradYear: faker.number.int({ min: 2025, max: 2030 }),
        mentorship: faker.helpers.arrayElement(["MENTOR", "MENTEE", "NONE"]),
      },
    });
  }
}

async function createPostsAndNotifications() {
  const completedUsers = await prisma.user.findMany({
    where: { onboardingStep: OnboardingStep.COMPLETE },
  });

  const CHUNK_SIZE = 10;
  for (let i = 0; i < completedUsers.length; i += CHUNK_SIZE) {
    const userChunk = completedUsers.slice(i, i + CHUNK_SIZE);

    for (const user of userChunk) {
      const postCount = faker.number.int({ min: 2, max: 8 });
      for (let j = 0; j < postCount; j++) {
        await createPost(user, completedUsers);
      }
    }
  }
}

async function createPost(user: User, allUsers: User[]) {
  const needType = faker.helpers.arrayElement(Object.values(NeedType));
  const needCombinations = {
    [NeedType.FEEDBACK]: faker.helpers.maybe(() => NeedType.CONTRIBUTION, { probability: 0.3 }),
    [NeedType.CONTRIBUTION]: faker.helpers.maybe(() => NeedType.FEEDBACK, { probability: 0.3 }),
    [NeedType.DEVELOPER_AVAILABLE]: null,
    [NeedType.SEEKING_MENTOR]: null,
    [NeedType.MENTOR_AVAILABLE]: null,
    [NeedType.TEAM_FORMATION]: null,
  };
  const secondaryNeedType = needCombinations[needType];

  const conversation = POST_CONTENT[needType] && POST_CONTENT[needType].length > 0
    ? faker.helpers.arrayElement(POST_CONTENT[needType])
    : { title: `Sample ${getNeedTypeLabel(needType)} Post`, description: `A sample post for ${getNeedTypeLabel(needType)}.`, comments: [], githubProject: undefined };

  const isProjectPost = needType === NeedType.FEEDBACK || needType === NeedType.CONTRIBUTION
    || secondaryNeedType === NeedType.FEEDBACK || secondaryNeedType === NeedType.CONTRIBUTION;

  const shouldAllowRatings = needType === NeedType.FEEDBACK || secondaryNeedType === NeedType.FEEDBACK;

  const postTechConnect: { id: string }[] = [];
  if (isProjectPost) {
    const technologyIds = (await prisma.technology.findMany({ select: { id: true } })).map(tech => tech.id);
    if (technologyIds.length > 0) {
      const guaranteedTechId = faker.helpers.arrayElement(technologyIds);
      postTechConnect.push({ id: guaranteedTechId });
      const numAdditionalTechs = faker.number.int({ min: 0, max: Math.min(2, technologyIds.length - 1) });
      const availableTechIds = faker.helpers.shuffle(technologyIds.filter(id => id !== guaranteedTechId));
      for (let j = 0; j < numAdditionalTechs; j++) {
        const additionalTechId = availableTechIds[j];
        if (additionalTechId) {
          postTechConnect.push({ id: additionalTechId });
        }
      }
    } else {
      console.warn("No technologies available for project post.");
    }
  }

  const githubRepo = (isProjectPost && conversation?.githubProject)
    ? `https://www.github.com/${user.username}/${conversation.githubProject}`
    : null;

  const primaryNeed = await prisma.postNeed.create({
    data: {
      needType,
      isPrimary: true,
    },
  });

  let secondaryNeed = null;
  if (secondaryNeedType) {
    secondaryNeed = await prisma.postNeed.create({
      data: {
        needType: secondaryNeedType,
        isPrimary: false,
      },
    });
  }

  const post = await prisma.post.create({
    data: {
      title: conversation?.title || "Sample Post",
      description: conversation?.description || "A sample post description.",
      createdById: user.id,
      githubRepo,
      rating: 0,
      allowRatings: shouldAllowRatings,
      allowComments: faker.datatype.boolean({ probability: 0.9 }),
      bannerImage: generateBannerImageUrl(),
      technologies: {
        connect: postTechConnect,
      },
      postNeeds: {
        connect: [
          { id: primaryNeed.id },
          ...(secondaryNeed ? [{ id: secondaryNeed.id }] : []),
        ],
      },
      createdDate: generateRandomDate(),
    },
  });

  if (post) {
    await prisma.postWatcher.create({
      data: {
        postId: post.id,
        userId: user.id,
      },
    });

    const potentialWatchers = allUsers.filter(u => u.id !== user.id);
    const numberOfWatchers = faker.number.int({ min: 0, max: Math.min(5, potentialWatchers.length) });
    const watchers = faker.helpers.shuffle(potentialWatchers).slice(0, numberOfWatchers);

    for (const watcher of watchers) {
      await prisma.postWatcher.create({
        data: {
          postId: post.id,
          userId: watcher.id,
        },
      });
    }

    await createPostRatings(post, allUsers, user);
    await createCommentsAndNotifications(
      post,
      conversation || { title: "", description: "", comments: [], githubProject: undefined },
      allUsers,
      user,
      needType,
    );
  }
}

async function createPostRatings(post: Post, allUsers: User[], postCreator: User) {
  if (!post.allowRatings) {
    return;
  }

  const potentialRaters = allUsers.filter(u => u.id !== postCreator.id);
  const numberOfRaters = faker.number.int({ min: 0, max: Math.min(10, potentialRaters.length) });

  const raters = faker.helpers.shuffle(potentialRaters).slice(0, numberOfRaters);

  if (raters.length === 0) {
    return;
  }

  const ratings = [];
  for (const rater of raters) {
    const rating = faker.number.int({ min: 1, max: 5 });
    await prisma.postRating.create({
      data: {
        postId: post.id,
        userId: rater.id,
        rating,
      },
    });

    ratings.push(rating);
  }

  if (ratings.length > 0) {
    const averageRating = Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1));

    await prisma.post.update({
      where: { id: post.id },
      data: { rating: averageRating },
    });
  }
}

async function createCommentsAndNotifications(
  post: Post,
  conversation: PostConversation,
  allUsers: User[],
  postCreator: User,
  needType: NeedType,
) {
  if (!post.allowComments) {
    return;
  }

  const defaultCommentCount = faker.number.int({ min: 5, max: 15 });
  const commentsToCreate = conversation.comments.length > 0
    ? [...conversation.comments, ...generateDefaultComments(needType, post.title, 3)]
    : generateDefaultComments(needType, post.title, defaultCommentCount);

  const potentialCommenters = faker.helpers
    .shuffle([...allUsers])
    .filter(u => u.id !== postCreator.id);

  const commentCount = Math.min(commentsToCreate.length, potentialCommenters.length);

  for (let i = 0; i < commentCount; i++) {
    const commenter = potentialCommenters[i];
    if (!commenter)
      continue;

    const comment = await prisma.comment.create({
      data: {
        content: commentsToCreate[i] || "",
        createdById: commenter.id,
        postId: post.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: post.createdById,
        message: `${commenter.username} commented on your post "${post.title}"`,
        type: NotificationType.COMMENT,
        commentId: comment.id,
        postId: post.id,
        triggeredById: commenter.id,
        isRead: faker.datatype.boolean(),
      },
    });
  }
}

function generateDefaultComments(needType: NeedType, postTitle: string, count = 3): string[] {
  const comments: string[] = [];

  for (let i = 0; i < count; i++) {
    let comment = "";

    switch (needType) {
      case NeedType.FEEDBACK:
        comment = faker.helpers.arrayElement([
          "Have you considered testing this with a different approach?",
          "The UI looks great, but the UX flow could be improved.",
          "I like what you've done here. Maybe add some error handling?",
          "Great project! What testing framework are you using?",
          "Have you considered making this accessible for screen readers?",
          "The architecture looks solid! Have you thought about scalability?",
          "This is a really innovative approach. I'm impressed!",
          "The code quality is high, but you might want to add more tests.",
          "How does this perform with large datasets?",
          "Have you considered adding a caching layer?",
          "Really clean implementation. Documentation could be more detailed though.",
          "The API design is elegant. Have you considered versioning?",
        ]);
        break;
      case NeedType.CONTRIBUTION:
        comment = faker.helpers.arrayElement([
          "I'd be interested in contributing to this project. What areas need help?",
          "Could I help with the documentation for this project?",
          "I have experience with this technology stack. How can I join?",
          "What's the development environment setup like?",
          "Is there a contribution guide or coding standards document?",
          "I'd like to contribute to the frontend. Are there any specific UI guidelines?",
          "Could I help with tests? That's my specialty.",
          "I'm interested in helping with performance optimization.",
          "Do you have a roadmap for future features?",
          "I'd like to contribute to the internationalization efforts.",
          "Are you open to architecture suggestions? I have some ideas.",
          "Is there a backlog of issues I can look at?",
        ]);
        break;
      case NeedType.DEVELOPER_AVAILABLE:
        comment = faker.helpers.arrayElement([
          "What kind of projects are you most interested in working on?",
          "Do you have a portfolio or GitHub profile to share?",
          "I might have a project that matches your skills. Can we connect?",
          "How much time can you commit to a project weekly?",
          "What's your preferred communication method for project collaboration?",
        ]);
        break;
      case NeedType.SEEKING_MENTOR:
        comment = faker.helpers.arrayElement([
          "I could help mentor you. What specific areas do you want to focus on?",
          "Have you tried working through any tutorials on this topic yet?",
          "I mentor in this area. Let's set up a time to talk more.",
          "What's your learning style? I'd adjust my mentoring approach accordingly.",
          "Do you have any specific goals or projects you want to work on?",
        ]);
        break;
      case NeedType.MENTOR_AVAILABLE:
        comment = faker.helpers.arrayElement([
          "I'd appreciate your mentorship. How do we get started?",
          "What areas do you specialize in mentoring?",
          "How often would you be available for mentoring sessions?",
          "Do you prefer to mentor through pair programming or code reviews?",
          "I'm looking to grow in this field. Would you be open to regular check-ins?",
        ]);
        break;
      case NeedType.TEAM_FORMATION:
        comment = faker.helpers.arrayElement([
          "I'd be interested in joining. What roles are you still looking to fill?",
          "What's the expected time commitment for this team?",
          "Do you have a project timeline or roadmap already?",
          "I have experience in this area and would like to join your team.",
          "How will the team be collaborating? Regular meetings?",
        ]);
        break;
      default:
        comment = `Interesting post about "${postTitle}"! ${faker.lorem.sentence()}`;
    }

    comments.push(comment);
  }

  return comments;
}

async function clearDatabase() {
  await prisma.$transaction([
    prisma.technology.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.postNeed.deleteMany(),
    prisma.postWatcher.deleteMany(),
    prisma.postRating.deleteMany(),
    prisma.post.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

function generateUCUser(index: number) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const usernameBase = lastName.toLowerCase().replace(/[^\w.-]/g, "");
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

function getNeedTypeLabel(type: NeedType): string {
  switch (type) {
    case NeedType.FEEDBACK:
      return "Project Feedback";
    case NeedType.CONTRIBUTION:
      return "Project Contribution";
    case NeedType.DEVELOPER_AVAILABLE:
      return "Developer Available";
    case NeedType.SEEKING_MENTOR:
      return "Seeking Mentor";
    case NeedType.MENTOR_AVAILABLE:
      return "Mentor Available";
    case NeedType.TEAM_FORMATION:
      return "Team Formation";
    default:
      return "Unknown";
  }
}

export const DEFAULT_TECHNOLOGIES = [
  { name: "c" },
  { name: "cplusplus" },
  { name: "csharp" },
  { name: "css3" },
  { name: "dart" },
  { name: "elixir" },
  { name: "erlang" },
  { name: "go" },
  { name: "haskell" },
  { name: "html5" },
  { name: "java" },
  { name: "javascript" },
  { name: "julia" },
  { name: "kotlin" },
  { name: "lua" },
  { name: "matlab" },
  { name: "objectivec" },
  { name: "perl" },
  { name: "php" },
  { name: "python" },
  { name: "r" },
  { name: "ruby" },
  { name: "rust" },
  { name: "scala" },
  { name: "swift" },
  { name: "typescript" },
  { name: "angular" },
  { name: "angularjs" },
  { name: "astro" },
  { name: "backbonejs" },
  { name: "bootstrap" },
  { name: "bulma" },
  { name: "d3js" },
  { name: "ember" },
  { name: "gatsby" },
  { name: "jquery" },
  { name: "materialui" },
  { name: "nextjs" },
  { name: "nuxtjs" },
  { name: "react" },
  { name: "sass" },
  { name: "svelte" },
  { name: "tailwindcss" },
  { name: "threejs" },
  { name: "vuejs" },
  { name: "adonisjs" },
  { name: "django" },
  { name: "express" },
  { name: "fastapi" },
  { name: "flask" },
  { name: "laravel" },
  { name: "nestjs" },
  { name: "nodejs" },
  { name: "phoenix" },
  { name: "rails" },
  { name: "spring" },
  { name: "symfony" },
  { name: "cassandra" },
  { name: "couchdb" },
  { name: "elasticsearch" },
  { name: "firebase" },
  { name: "influxdb" },
  { name: "mariadb" },
  { name: "mongodb" },
  { name: "microsoftsqlserver" },
  { name: "mysql" },
  { name: "neo4j" },
  { name: "postgresql" },
  { name: "redis" },
  { name: "sqlite" },
  { name: "supabase" },
  { name: "amazonwebservices" },
  { name: "azure" },
  { name: "circleci" },
  { name: "cloudflare" },
  { name: "docker" },
  { name: "githubactions" },
  { name: "googlecloud" },
  { name: "heroku" },
  { name: "jenkins" },
  { name: "kubernetes" },
  { name: "netlify" },
  { name: "terraform" },
  { name: "vercel" },
  { name: "apache" },
  { name: "apachekafka" },
  { name: "apachespark" },
  { name: "argocd" },
  { name: "axios" },
  { name: "babel" },
  { name: "bash" },
  { name: "cmake" },
  { name: "codeigniter" },
  { name: "confluence" },
  { name: "consul" },
  { name: "cypressio" },
  { name: "dbeaver" },
  { name: "denojs" },
  { name: "electron" },
  { name: "eslint" },
  { name: "fastify" },
  { name: "figma" },
  { name: "firefox" },
  { name: "flutter" },
  { name: "gcc" },
  { name: "git" },
  { name: "github" },
  { name: "gitlab" },
  { name: "gradle" },
  { name: "graphql" },
  { name: "grpc" },
  { name: "gulp" },
  { name: "hadoop" },
  { name: "helm" },
  { name: "insomnia" },
  { name: "intellij" },
  { name: "ionic" },
  { name: "jasmine" },
  { name: "jest" },
  { name: "jira" },
  { name: "jupyter" },
  { name: "knexjs" },
  { name: "latex" },
  { name: "less" },
  { name: "linux" },
  { name: "lodash" },
  { name: "markdown" },
  { name: "maven" },
  { name: "meteor" },
  { name: "mobx" },
  { name: "nginx" },
  { name: "nodemon" },
  { name: "npm" },
  { name: "numpy" },
  { name: "opentelemetry" },
  { name: "oracle" },
  { name: "pandas" },
  { name: "playwright" },
  { name: "postman" },
  { name: "powershell" },
  { name: "prisma" },
  { name: "prometheus" },
  { name: "puppeteer" },
  { name: "purescript" },
  { name: "pycharm" },
  { name: "pytest" },
  { name: "pytorch" },
  { name: "rabbitmq" },
  { name: "redux" },
  { name: "rxjs" },
  { name: "selenium" },
  { name: "sonarqube" },
  { name: "sourcetree" },
  { name: "splunk" },
  { name: "stylus" },
  { name: "swagger" },
  { name: "tensorflow" },
  { name: "travis" },
  { name: "vscode" },
  { name: "webpack" },
  { name: "webstorm" },
  { name: "yarn" },
];

type PostConversation = {
  title: string;
  description: string;
  comments: string[];
  githubProject?: string;
};

const POST_CONTENT: Record<NeedType, PostConversation[]> = {
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
      description: "Implementing OAuth2 and OIDC for a multi-tenant application. Would appreciate a security review.",
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
    {
      title: "Review My Mobile App UI Design",
      description:
        "I've designed a mobile app for campus navigation with accessibility features. Looking for feedback on the UI/UX design and accessibility compliance.",
      comments: [
        "Your color contrast is excellent for accessibility!",
        "Consider adding voice guidance for visually impaired users.",
        "The navigation flow could be simplified in a few places.",
        "Have you user-tested with actual accessibility users?",
      ],
      githubProject: "campus-navigator",
    },
    {
      title: "Feedback on AI Recommendation Engine",
      description:
        "Built a recommendation engine for student resources using collaborative filtering and content-based approaches. Looking for feedback on the algorithm and performance.",
      comments: [
        "Your cold start strategy is interesting! Have you thought about using knowledge graphs?",
        "Consider adding explainability features to show why recommendations are made.",
        "The latency seems high - have you profiled the bottlenecks?",
        "Great approach to the hybrid model!",
      ],
      githubProject: "student-recommender",
    },
    {
      title: "Review My Progressive Web App",
      description:
        "Created a PWA for student event management with offline capabilities. Looking for feedback on the service worker implementation and caching strategies.",
      comments: [
        "Your cache-first strategy works well, but consider network-first for dynamic content.",
        "The offline experience is seamless - great job!",
        "Consider implementing background sync for submissions made offline.",
        "Have you tested with slow network connections?",
      ],
      githubProject: "events-pwa",
    },
    {
      title: "Seeking Feedback on Data Visualization Dashboard",
      description:
        "Designed a dashboard for visualizing research data with interactive charts and filters. Looking for feedback on UX and performance with large datasets.",
      comments: [
        "The visualizations are beautiful, but consider adding export options.",
        "For large datasets, virtualized rendering would improve performance.",
        "Your filtering UI is intuitive, but could use keyboard shortcuts.",
        "Consider adding annotation capabilities for researchers.",
      ],
      githubProject: "research-dashboard",
    },
    {
      title: "Review My AR Campus Tour App",
      description:
        "Developed an AR app for campus tours using ARKit/ARCore. Looking for feedback on performance, battery usage, and UX.",
      comments: [
        "The AR markers are well-placed, but consider adding geolocation fallback.",
        "Battery consumption is high - consider lowering the camera resolution.",
        "The historical information overlays are fantastic!",
        "Have you considered adding audio narration options?",
      ],
      githubProject: "ar-campus-tour",
    },
    {
      title: "Feedback on Distributed System Design",
      description:
        "Designing a distributed system for processing student submission data. Looking for feedback on the architecture, data consistency approach, and failure handling.",
      comments: [
        "Your eventual consistency model makes sense, but critical operations might need stronger guarantees.",
        "Consider using a saga pattern for the multi-step workflows.",
        "The failure recovery looks solid, but add more telemetry for debugging.",
        "Have you load tested the coordination service?",
      ],
      githubProject: "distributed-submissions",
    },
  ],
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
    {
      title: "Open Source Library for Academic Scheduling",
      description:
        "Building a Python library for optimizing academic course scheduling using constraint satisfaction algorithms. Handles room assignments, instructor preferences, and student needs.",
      comments: [
        "Your constraint model is elegant! Would love to help expand the preference types.",
        "Have you considered using genetic algorithms for optimization?",
        "I'd like to contribute visualization tools for the schedules.",
        "The conflict resolution strategy is impressive!",
      ],
      githubProject: "academic-scheduler",
    },
    {
      title: "Accessibility Toolkit for Educational Websites",
      description:
        "Created a JavaScript toolkit for improving accessibility in educational web applications. Includes screen reader support, keyboard navigation, and automated WCAG compliance checking.",
      comments: [
        "This is fantastic! I'd love to help add support for more complex interactions.",
        "Have you considered adding dyslexia-friendly font options?",
        "I can contribute to the documentation and examples section.",
        "The automated testing tools are incredibly useful!",
      ],
      githubProject: "edu-a11y-toolkit",
    },
    {
      title: "Real-time Collaborative Note Taking App",
      description:
        "Building a collaborative note-taking application with real-time synchronization using CRDTs. Supports rich text, code blocks, and embedded media.",
      comments: [
        "The CRDT implementation is impressive! I'd like to contribute conflict resolution improvements.",
        "Have you considered adding LaTeX support for math notes?",
        "I can help implement the offline synchronization features.",
        "The performance with large documents is surprising - what optimizations are you using?",
      ],
      githubProject: "collab-notes",
    },
    {
      title: "Campus IoT Platform",
      description:
        "Developing an IoT platform for campus environmental monitoring and smart building controls. Uses MQTT, time-series databases, and provides a dashboard for visualization.",
      comments: [
        "The MQTT topic structure is well-designed! I can help with the edge computing layer.",
        "Have you considered adding anomaly detection for the sensor data?",
        "I'd like to contribute to the energy optimization algorithms.",
        "The dashboard looks great - would love to help add more interactive visualizations.",
      ],
      githubProject: "campus-iot",
    },
    {
      title: "Federated Learning Framework for Research Collaboration",
      description:
        "Building a framework for privacy-preserving machine learning across multiple research institutions. Allows model training without sharing sensitive data.",
      comments: [
        "The differential privacy implementation is solid! I can help with the secure aggregation protocol.",
        "Have you evaluated the accuracy impact of the privacy mechanisms?",
        "I'd like to contribute adapters for more ML frameworks.",
        "The attack mitigation strategies are well thought out!",
      ],
      githubProject: "federated-research",
    },
  ],
  DEVELOPER_AVAILABLE: [
    {
      title: "Frontend Developer Available for Projects",
      description:
        "I'm a frontend developer with experience in React, TypeScript, and modern CSS frameworks. Looking to join innovative projects to contribute my skills. Proficient in responsive design and accessibility.",
      comments: [
        "I'm working on a campus events app that could use your frontend skills. Would you be interested?",
        "Your experience with TypeScript would be perfect for our project. Can we connect?",
        "How much time can you commit weekly to a project?",
      ],
      githubProject: "portfolio-showcase",
    },
    {
      title: "Backend Developer Looking for Collaborations",
      description:
        "Backend developer specializing in Node.js, Express, and MongoDB. Interested in joining projects that need API development, database optimization, or server architecture.",
      comments: [
        "We're building a research data platform and could use your backend expertise.",
        "Do you have experience with real-time applications?",
        "Would you be interested in helping optimize our API performance?",
      ],
      githubProject: "api-portfolio",
    },
    {
      title: "Full-Stack Developer Available for Collaboration",
      description:
        "Full-stack developer proficient in React, Node.js, and PostgreSQL. Experienced in building complete web applications from database design to frontend implementation. Looking for interesting projects to contribute to.",
      comments: [
        "We're working on a student collaboration platform and could use your full-stack skills.",
        "Do you have experience with authentication systems?",
        "How comfortable are you with real-time features?",
      ],
      githubProject: "fullstack-portfolio",
    },
    {
      title: "Mobile Developer Available (React Native)",
      description:
        "Mobile developer with expertise in React Native and TypeScript. Have published multiple apps on both App Store and Play Store. Looking for challenging mobile projects.",
      comments: [
        "We're building a campus navigation app and need your React Native expertise.",
        "Have you worked with offline-first mobile applications?",
        "What's your approach to cross-platform UI consistency?",
      ],
      githubProject: "mobile-portfolio",
    },
    {
      title: "Data Engineer Available for Projects",
      description:
        "Data engineer with experience in ETL pipelines, data warehousing, and analytics. Skilled in Python, SQL, and cloud data solutions. Looking for data-intensive projects.",
      comments: [
        "Our research lab needs help setting up data pipelines for our experiments.",
        "Have you worked with real-time streaming data?",
        "What experience do you have with data visualization?",
      ],
      githubProject: "data-engineering-samples",
    },
    {
      title: "DevOps Engineer Seeking Collaboration",
      description:
        "DevOps engineer with expertise in CI/CD, containerization, and cloud infrastructure (AWS/Azure). Looking to help projects improve their deployment practices and infrastructure.",
      comments: [
        "We need help setting up a proper CI/CD pipeline for our student project.",
        "Have you worked with Kubernetes in production?",
        "What monitoring solutions do you typically implement?",
      ],
      githubProject: "devops-toolkit",
    },
  ],
  SEEKING_MENTOR: [
    {
      title: "Looking for Machine Learning Mentor",
      description:
        "Computer science junior seeking guidance in machine learning and AI. I have basic experience with Python and TensorFlow but need mentorship to develop more advanced skills.",
      comments: [
        "I'd be happy to mentor you! I work in ML at a research lab. Let's connect.",
        "Have you tried any specific ML projects yet?",
        "I recommend starting with some Kaggle competitions. Would be glad to guide you through them.",
      ],
    },
    {
      title: "Need Web Development Mentorship",
      description:
        "First-year CS student looking for a mentor in web development. I understand HTML/CSS basics but want to learn modern frameworks and best practices.",
      comments: [
        "I can help you with React and modern frontend practices. DM me to set up a time.",
        "Do you have any specific areas of web dev you're most interested in?",
        "I recommend building a simple project first. Would be happy to review your code.",
      ],
    },
    {
      title: "Seeking Mentor for Cloud Architecture",
      description:
        "Computing student interested in cloud technologies and distributed systems. Looking for a mentor to guide me through building scalable applications on AWS or Azure.",
      comments: [
        "I work as a cloud architect and would be happy to mentor you. Let's connect!",
        "Have you built anything on cloud platforms yet?",
        "I recommend starting with a simple serverless project. Would be glad to guide you.",
      ],
    },
    {
      title: "Looking for Mobile Development Mentor",
      description:
        "CS sophomore interested in mobile app development. Have basic knowledge of Java but want guidance on building professional-quality Android apps.",
      comments: [
        "I've been developing Android apps for 5 years and would be happy to mentor you.",
        "Have you tried building any simple apps yet?",
        "Let's start with a small project to get you familiar with the Android lifecycle.",
      ],
    },
    {
      title: "Seeking Data Science Mentor",
      description:
        "Statistics major interested in transitioning to data science. Familiar with R and statistics but need guidance on applying these skills to real-world data problems.",
      comments: [
        "I work as a data scientist and would be happy to mentor you in applying statistical knowledge.",
        "Have you worked on any data analysis projects yet?",
        "Let's connect and discuss how to build your first predictive model.",
      ],
    },
    {
      title: "Need Cybersecurity Mentorship",
      description:
        "IT student passionate about cybersecurity. Looking for a mentor to guide me through security concepts, ethical hacking practices, and security certifications.",
      comments: [
        "I work in cybersecurity and would be happy to mentor you. What specific area interests you most?",
        "Have you set up any home labs for security practice?",
        "Let's start with some CTF challenges to build your skills.",
      ],
    },
  ],
  MENTOR_AVAILABLE: [
    {
      title: "Offering Mobile Development Mentorship",
      description:
        "Senior mobile developer with 5+ years of experience in iOS and Android development. Available to mentor students interested in mobile app development. Can help with Swift, Kotlin, or React Native.",
      comments: [
        "I'm working on my first iOS app and could really use your guidance!",
        "Do you have any recommended resources for getting started with Swift?",
        "Would you be available for weekly code reviews?",
      ],
    },
    {
      title: "DevOps Engineer Available as Mentor",
      description:
        "Experienced DevOps engineer offering mentorship in CI/CD pipelines, containerization, and cloud infrastructure. Can guide you through AWS, Docker, Kubernetes, and modern deployment strategies.",
      comments: [
        "I'm trying to set up my first CI/CD pipeline and getting stuck. Would appreciate your help!",
        "Do you have experience with GitHub Actions specifically?",
        "Would love to learn more about Kubernetes networking from you.",
      ],
    },
    {
      title: "Frontend Development Mentor Available",
      description:
        "Senior frontend developer with expertise in React, Vue, and modern JavaScript. Offering mentorship for students looking to level up their frontend skills, focusing on performance, accessibility, and clean code.",
      comments: [
        "I'd love to learn more about state management patterns in React!",
        "Could you help me understand frontend testing best practices?",
        "I'm struggling with CSS layout techniques. Would appreciate your guidance.",
      ],
    },
    {
      title: "Database Design Mentor Available",
      description:
        "Database architect with experience in SQL and NoSQL systems. Offering mentorship in database design, optimization, and scaling strategies. Can help with projects involving complex data relationships.",
      comments: [
        "I'm designing my first normalized database and could use some guidance.",
        "Could you help me understand when to use NoSQL vs SQL databases?",
        "I'd appreciate advice on optimizing queries for my project.",
      ],
    },
    {
      title: "ML/AI Mentor Offering Guidance",
      description:
        "Machine learning researcher offering mentorship in AI/ML concepts and applications. Can help with deep learning, natural language processing, and computer vision projects. Python/PyTorch expertise.",
      comments: [
        "I'm trying to implement my first neural network and getting confused about architecture choices.",
        "Could you recommend resources for understanding transformer models?",
        "Would love your guidance on my computer vision project for class.",
      ],
    },
    {
      title: "Backend Systems Mentor Available",
      description:
        "Backend engineer specializing in distributed systems and high-performance APIs. Offering mentorship in designing robust backend architectures, scaling strategies, and API design patterns.",
      comments: [
        "I'm building my first microservice system and need guidance on service boundaries.",
        "Could you help me understand caching strategies for my API?",
        "Would appreciate advice on handling concurrency in my backend application.",
      ],
    },
  ],
  TEAM_FORMATION: [
    {
      title: "Forming Team for Hackathon Project",
      description:
        "Looking for teammates for the upcoming campus hackathon. Interested in building a sustainability-focused application. Need frontend and backend developers, and someone with data visualization skills.",
      comments: [
        "I'm a backend developer with Express/Node experience. Would love to join!",
        "I can handle the data visualization part. Have experience with D3.js.",
        "When are you planning to meet for planning sessions?",
      ],
    },
    {
      title: "Seeking Members for Research Project Team",
      description:
        "Forming a team for a semester-long research project on campus accessibility mapping. Need developers, designers, and someone with accessibility expertise.",
      comments: [
        "I've worked on accessibility projects before and would like to contribute.",
        "I can help with frontend development and UX design.",
        "Is this going to be open source? I'd love to contribute.",
      ],
    },
    {
      title: "Building a Team for AR Campus Tour App",
      description:
        "Assembling a team to build an augmented reality campus tour application. Looking for developers with AR experience (ARKit/ARCore), 3D modelers, and UX designers.",
      comments: [
        "I have experience with ARKit and would love to join this project!",
        "I can help with the 3D modeling aspect. What kind of assets are you thinking?",
        "This sounds fascinating. What's your timeline for the project?",
      ],
    },
    {
      title: "Team Needed for Educational Game Development",
      description:
        "Forming a team to create an educational game for teaching programming concepts. Need game developers, artists, educational content writers, and sound designers.",
      comments: [
        "I'm a game developer with Unity experience and would love to join!",
        "I'm studying education and can help design the learning progression.",
        "What programming concepts are you planning to teach through the game?",
      ],
    },
    {
      title: "Seeking Teammates for AI Research Project",
      description:
        "Looking for team members to work on a research project exploring AI applications in personalized learning. Need ML engineers, data scientists, and education specialists.",
      comments: [
        "I have experience with recommendation systems and would like to join.",
        "I'm an education major with experience in personalized curriculum design.",
        "This sounds like an impactful project! What datasets are you planning to use?",
      ],
    },
    {
      title: "Building Team for Campus Marketplace App",
      description:
        "Assembling a team to build a marketplace app for campus communities. Looking for full-stack developers, UI/UX designers, and mobile developers.",
      comments: [
        "I'm a full-stack developer and would love to help build this!",
        "I can handle the UI/UX design. Do you have any specific design direction in mind?",
        "Have you considered the payment processing aspects of the marketplace?",
      ],
    },
    {
      title: "Forming Robotics Competition Team",
      description:
        "Building a team for the upcoming robotics competition. Need members with experience in embedded systems, mechanical design, computer vision, and control systems.",
      comments: [
        "I have experience with ROS and computer vision. Would love to join!",
        "I can help with the mechanical design aspects. What kind of robot are you planning?",
        "What's the competition challenge this year?",
      ],
    },
    {
      title: "Team for Open Source Library Development",
      description:
        "Forming a team to create an open source library for scientific data visualization. Looking for developers with experience in D3.js, WebGL, and scientific computing.",
      comments: [
        "I've worked extensively with D3 and would love to contribute!",
        "I have experience with scientific visualization in my research lab.",
        "Have you established the scope of features for the initial release?",
      ],
    },
  ],
};

function generateRandomDate() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return faker.date.between({ from: oneYearAgo, to: new Date() });
}

seedDatabase().catch((e) => {
  console.error("Error during seeding:", e);
  process.exit(1);
});
