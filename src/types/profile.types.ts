import { type Prisma } from "@prisma/client";

export type PrivateProfileResponse = Prisma.ProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
        email: true;
        allowNotifications: true;
      };
    };
  };
}>;

export type PublicProfileResponse = Prisma.UserGetPayload<{
  select: {
    username: true;
    name: true;
    image: true;
    profile: {
      select: {
        bio: true;
        skills: true;
        interests: true;
        gradYear: true;
      };
    };
    posts: {
      include: {
        _count: {
          select: {
            comments: true;
          };
        };
      };
      orderBy: {
        createdDate: "desc";
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
