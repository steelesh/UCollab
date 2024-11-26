import { db } from "~/server/db";
import { type Prisma } from "@prisma/client";
import { type UpdateProfileInput } from "~/types/profile.types";

const privateInclude = {
  user: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      email: true,
      allowNotifications: true,
    },
  },
};

export const ProfileService = {
  async getPrivateProfile(userId: string) {
    return db.profile.findUnique({
      where: { userId },
      include: privateInclude,
    });
  },

  async getPublicProfile(username: string) {
    return db.user.findUnique({
      where: { username },
      select: {
        username: true,
        name: true,
        image: true,
        profile: {
          select: {
            bio: true,
            skills: true,
            interests: true,
            gradYear: true,
          },
        },
        posts: {
          include: {
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });
  },

  async updateProfile(userId: string, data: UpdateProfileInput) {
    return db.profile.update({
      where: { userId },
      data: {
        ...data,
        skills: data.skills ? (data.skills as Prisma.JsonArray) : undefined,
        interests: data.interests ? (data.interests as Prisma.JsonArray) : undefined,
      },
      include: privateInclude,
    });
  },
};
