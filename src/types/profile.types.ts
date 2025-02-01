import { type Prisma } from "@prisma/client";

export type PrivateProfileResponse = Prisma.ProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        username: true;
        avatar: true;
        email: true;
        allowNotifications: true;
      };
    };
  };
}>;

export type PublicProfileResponse = Prisma.ProfileGetPayload<{
  select: {
    id: true;
    userId: true;
    lastModifiedDate: true;
    gradYear: true;
    bio: true;
    skills: {
      select: {
        id: true;
        name: true;
      };
    };
    user: {
      select: {
        username: true;
        avatar: true;
      };
    };
  };
}>;

export type UpdateProfileInput = {
  bio?: string;
  skills?: string[];
  interests?: string[];
  gradYear?: number;
};
