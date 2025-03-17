import { AvatarSource, PrismaClient, ProjectType, Role, User } from '@prisma/client';
import { CommentService } from '../features/comments/comment.service';
import { ProjectService } from '../features/projects/project.service';
import { UserService } from '~/features/users/user.service';

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const usernameIndex = args.findIndex((arg) => arg === '--username');
const username = usernameIndex !== -1 && args.length > usernameIndex + 1 ? args[usernameIndex + 1] : null;

if (!username) {
  console.error('provide a username with --username flag');
  console.error('example: npm run test-notifications -- --username {username}');
  process.exit(1);
}

const targetUsername = username as string;

async function createTestUser(username: string): Promise<User> {
  return prisma.user.upsert({
    where: { username: username },
    update: {},
    create: {
      username,
      avatar: await UserService.generateDefaultAvatar(username),
      email: `${username}@test.com`,
      fullName: username,
      firstName: username,
      lastName: 'Test',
      avatarSource: AvatarSource.DEFAULT,
      role: Role.USER,
      azureAdId: `test-${username}`,
      notificationPreferences: {
        create: {
          enabled: true,
          allowComments: true,
          allowMentions: true,
          allowProjectUpdates: true,
          allowSystem: true,
        },
      },
    },
  });
}

async function testNotificationSystem() {
  let targetUser: User | null = null;
  let testUsers: User[] = [];
  const projectIds: string[] = [];

  try {
    console.log(`starting notification tests for user: ${targetUsername}`);

    targetUser = await prisma.user.findUnique({
      where: { username: targetUsername },
    });

    if (!targetUser) {
      console.error(`user "${targetUsername}" not found. please make sure this user exists in the database.`);
      return;
    }

    console.log(`found target user: ${targetUser.username} (${targetUser.id})`);

    const testUser1 = await createTestUser('test-user1');
    const testUser2 = await createTestUser('test-user2');
    testUsers = [testUser1, testUser2];

    console.log('test users created');

    const targetUserProject = await ProjectService.createProject(
      {
        title: `${targetUser.username}'s test project`,
        description: 'project created by the target user',
        projectType: ProjectType.CONTRIBUTION,
        technologies: ['typescript', 'react'],
        githubRepo: null,
      },
      targetUser.id,
    );
    projectIds.push(targetUserProject.id);
    console.log(`project created by target user: ${targetUserProject.id}`);

    await ProjectService.watchProject(targetUserProject.id, testUser1.id);
    await ProjectService.watchProject(targetUserProject.id, testUser2.id);
    console.log(`test users are now watching target user's project`);

    await ProjectService.updateProject(
      targetUserProject.id,
      {
        title: `${targetUser.username}'s updated project`,
        description: 'this project has been updated',
        projectType: ProjectType.FEEDBACK,
        technologies: ['typescript', 'react', 'nextjs'],
        githubRepo: null,
      },
      targetUser.id,
    );
    console.log(`target user's project updated`);

    const testUserProject = await ProjectService.createProject(
      {
        title: 'project for target user to watch',
        description: 'project created by test user',
        projectType: ProjectType.CONTRIBUTION,
        technologies: ['typescript', 'node'],
        githubRepo: null,
      },
      testUser1.id,
    );
    projectIds.push(testUserProject.id);
    console.log(`project created by test user: ${testUserProject.id}`);

    await ProjectService.watchProject(testUserProject.id, targetUser.id);
    console.log(`target user is now watching test user's project`);

    await ProjectService.updateProject(
      testUserProject.id,
      {
        title: 'updated project for target user',
        description: 'this project has been updated by test user',
        projectType: ProjectType.FEEDBACK,
        technologies: ['typescript', 'node', 'express'],
        githubRepo: null,
      },
      testUser1.id,
    );
    console.log(`test user's project updated`);

    const targetUserComment = await CommentService.createComment(
      {
        content: 'this is a comment from the target user on the test project',
        projectId: testUserProject.id,
      },
      targetUser.id,
    );
    console.log(`target user commented on test user's project`);

    await CommentService.createReply(
      {
        content: 'this is a reply to your comment',
        projectId: testUserProject.id,
        parentId: targetUserComment.id,
      },
      testUser2.id,
    );
    console.log(`test user replied to target user's comment`);

    await CommentService.createComment(
      {
        content: 'this is a comment on your project',
        projectId: targetUserProject.id,
      },
      testUser1.id,
    );
    console.log(`comment added to target user's project`);

    await CommentService.createComment(
      {
        content: `hey @${targetUser.username} what do you think about this project?`,
        projectId: testUserProject.id,
      },
      testUser2.id,
    );
    console.log(`comment with mention created`);

    console.log('waiting for notification processing...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const notifications = await prisma.notification.findMany({
      where: {
        userId: targetUser.id,
      },
      orderBy: {
        createdDate: 'desc',
      },
      include: {
        triggeredBy: true,
        project: true,
      },
      take: 20,
    });

    console.log('notifications created for target user:');
    if (notifications.length === 0) {
      console.log('no notifications found. something went wrong.');
    } else {
      notifications.forEach((notification, index) => {
        console.log(`notification #${index + 1}:`);
        console.log(`- id: ${notification.id}`);
        console.log(`- type: ${notification.type}`);
        console.log(`- message: ${notification.message}`);
        console.log(`- created: ${notification.createdDate}`);
        console.log(`- project: ${notification.project?.title || 'n/a'}`);
        console.log(`- triggered by: ${notification.triggeredBy?.username}`);
        console.log(`- read: ${notification.isRead ? 'yes' : 'no'}`);
      });
    }

    console.log('all tests completed successfully');
    console.log(`to view notifications, log in as ${targetUser.username} and visit /notifications`);
    console.log(`to view the test projects, visit:`);
    projectIds.forEach((id) => {
      console.log(`- /p/${id}`);
    });
  } catch (error) {
    console.error('tests failed:', error);
  } finally {
    console.log('do you want to clean up test data? (y/n)');
    process.stdin.once('data', async (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (answer === 'y' || answer === 'yes') {
        console.log('cleaning up test data...');

        await prisma.notification.deleteMany({
          where: {
            OR: [{ userId: { in: testUsers.map((u) => u.id) } }, { triggeredById: { in: testUsers.map((u) => u.id) } }],
          },
        });

        await prisma.comment.deleteMany({
          where: {
            OR: [{ createdById: { in: testUsers.map((u) => u.id) } }, { projectId: { in: projectIds } }],
          },
        });

        await prisma.projectWatcher.deleteMany({
          where: {
            OR: [{ userId: { in: testUsers.map((u) => u.id) } }, { projectId: { in: projectIds } }],
          },
        });

        await prisma.project.deleteMany({
          where: {
            id: { in: projectIds },
          },
        });

        await prisma.user.deleteMany({
          where: {
            id: { in: testUsers.map((u) => u.id) },
          },
        });

        console.log('test data cleaned up successfully');
      } else {
        console.log('test data was not cleaned up');
      }

      await prisma.$disconnect();
      process.exit(0);
    });
  }
}

testNotificationSystem();
