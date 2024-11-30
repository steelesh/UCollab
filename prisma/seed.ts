import { PostType, Status, type User } from "@prisma/client";
import { db } from "~/server/db";

async function main() {
  try {
    const user = await db.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        email: "test@example.com",
        username: "testuser",
        name: "Test User",
        verifiedEmail: true,
        profile: {
          create: {
            bio: "This is a test user profile",
            gradYear: 2024,
            skills: ["JavaScript", "React", "Node.js"],
            interests: ["Web Development", "Open Source"],
          },
        },
      },
    });

    console.log("✅ created test user");

    const post1 = await db.post.create({
      data: {
        title: "looking for contributors on a Next.js project",
        description:
          "building a developer collaboration platform and need help with API development.",
        postType: PostType.CONTRIBUTION,
        status: Status.OPEN,
        technologies: ["Next.js", "Prisma", "TypeScript"],
        githubRepo: "https://github.com/example/project",
        createdById: user.id,
        comments: {
          create: {
            content: "nice! would to contribute",
            createdById: user.id,
          },
        },
      },
    });

    console.log("✅ created first post with comment");

    const post2 = await db.post.create({
      data: {
        title: "Feedback needed on database schema",
        description:
          "Working on a new project and would appreciate feedback on the current database design.",
        postType: PostType.FEEDBACK,
        status: Status.OPEN,
        technologies: ["MySQL", "Prisma"],
        createdById: user.id,
      },
    });

    console.log("✅ Created second post");

    const notification = await db.notification.create({
      data: {
        userId: user.id,
        message:
          "Welcome to the platform! Complete your profile to get started.",
      },
    });

    console.log("✅ Created welcome notification");

    const additionalUsers = await Promise.all([
      db.user.upsert({
        where: { email: "developer@example.com" },
        update: {},
        create: {
          email: "developer@example.com",
          username: "devuser",
          name: "Developer User",
          verifiedEmail: true,
          profile: {
            create: {
              bio: "Full-stack developer looking to collaborate",
              gradYear: 2023,
              skills: ["TypeScript", "Python", "AWS"],
              interests: ["Cloud Computing", "Machine Learning"],
            },
          },
        },
      }),
      db.user.upsert({
        where: { email: "designer@example.com" },
        update: {},
        create: {
          email: "designer@example.com",
          username: "designpro",
          name: "Designer Pro",
          verifiedEmail: true,
          profile: {
            create: {
              bio: "ui/ux designer with 3 years of experience",
              gradYear: 2022,
              skills: ["Figma", "UI Design", "User Research"],
              interests: ["Design Systems", "Accessibility"],
            },
          },
        },
      }),
    ]);

    console.log("✅ Created additional sample users");

    console.log({
      message: "Database seeded successfully!",
      users: {
        main: user.email,
        additional: additionalUsers.map((u: User) => u.email),
      },
      posts: {
        post1: post1.title,
        post2: post2.title,
      },
      notification: notification.message,
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
