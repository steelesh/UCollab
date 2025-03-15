import { ProjectService } from './project.service';
import type { Project, User } from '@prisma/client';
import type { ExplorePageData, ProjectDetails } from './project.types';

export const getProjectTitle = async (projectId: Project['id']) => {
  return ProjectService.getProjectTitle(projectId);
};

export const getRealTimeProject = async (projectId: Project['id'], userId: User['id']): Promise<ProjectDetails> => {
  return ProjectService.getProjectById(projectId, userId);
};

export const getProjects = async (page = 1, limit = 12, userId: User['id']): Promise<ExplorePageData> => {
  const [projects, totalCount] = await Promise.all([
    ProjectService.getPaginatedProjects(page, limit, userId),
    ProjectService.getProjectCount(userId),
  ]);

  return {
    projects,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
  };
};
