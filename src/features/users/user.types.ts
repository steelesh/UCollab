import { User, Project as PrismaProject, Comment as PrismaComment, Skill as PrismaSkill } from '@prisma/client';

export type Project = Pick<PrismaProject, 'id' | 'title'>;

export type Comment = Pick<PrismaComment, 'id' | 'content' | 'projectId'>;

export type Skill = Pick<PrismaSkill, 'name'>;

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
  skills: Skill[];
  projects: Project[];
  comments: Comment[];
}
