import { User, Project, Comment as PrismaComment, Technology as PrismaTechnology } from '@prisma/client';

export interface Comment extends Pick<PrismaComment, 'id' | 'content' | 'projectId' | 'createdDate'> {
  project: {
    title: string;
  };
}

export type Technology = Pick<PrismaTechnology, 'id' | 'name'>;

export interface UserProfile {
  id: User['id'];
  avatar: User['avatar'];
  username: User['username'];
  email: User['email'];
  fullName: User['fullName'];
  createdDate: User['createdDate'];
  lastLogin: User['lastLogin'];
  gradYear: User['gradYear'];
  bio: User['bio'];
  mentorship: User['mentorship'];
  technologies: Technology[];
  projects: Project[];
  comments: Comment[];
}
