import { User } from '@prisma/client';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '~/lib/env';
import { NotificationService } from '~/features/notifications/notification.service';
import { CreateBatchNotificationData } from '~/features/notifications/notification.types';
import { CreateNotificationData } from '~/features/notifications/notification.types';

const queueConfig = {
  connection: new IORedis({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  }),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
};

const notificationQueue = new Queue('notification', queueConfig);

const notificationWorker = new Worker(
  'notification',
  async (job) => {
    await NotificationService.createNotification(job.data);
  },
  queueConfig,
);

notificationWorker.on('completed', (job, result) => {
  console.log(`Notification job ${job.id} completed`, `Type: ${job.data.type}`, `User: ${job.data.userId}`, result);
});

notificationWorker.on('failed', (job, error) => {
  console.error(`Notification job ${job?.id} failed:`, `User: ${job?.data.userId}`, error);
});

export const mq = {
  async addNotification(data: CreateNotificationData) {
    const jobId = `notification:${data.userId}:${Date.now()}`;
    return notificationQueue.add(jobId, data);
  },

  async addBatchNotifications(data: CreateBatchNotificationData) {
    const jobs = data.userIds.map((userId: User['id']) => ({
      name: `notification:${userId}:${Date.now()}`,
      data: {
        ...data,
        userId,
      },
    }));

    return notificationQueue.addBulk(jobs);
  },
};
