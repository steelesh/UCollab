import { ProjectService } from './project.service';
import type { Project, User } from '@prisma/client';

export const getProjectTitle = async (projectId: Project['id']) => {
  return ProjectService.getProjectTitle(projectId);
};

export const getRealTimeProject = async (projectId: Project['id'], userId: User['id']) => {
  return ProjectService.getProjectById(projectId, userId);
};
