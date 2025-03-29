import type { Project, User } from "@prisma/client";

import type { ExplorePageData, ProjectDetails } from "./project.types";

import { ProjectService } from "./project.service";

export async function getProjectTitle(projectId: Project["id"]) {
  return ProjectService.getProjectTitle(projectId);
}

export async function getRealTimeProject(projectId: Project["id"], userId: User["id"]): Promise<ProjectDetails> {
  return ProjectService.getProjectById(projectId, userId);
}

export async function getProjects(page: number, limit: number, userId: User["id"]): Promise<ExplorePageData> {
  const { projects, totalCount } = await ProjectService.getPaginatedProjects(page, limit, userId);

  return {
    projects,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
  };
}

export async function getUserProjectRating(projectId: Project["id"], userId: User["id"]): Promise<number> {
  return ProjectService.getUserProjectRating(projectId, userId);
}

export async function getTrendingProjects(userId: User["id"], page = 1, limit = 12): Promise<ExplorePageData> {
  return ProjectService.getTrendingProjects(userId, page, limit);
}

export async function isProjectBookmarked(projectId: Project["id"], userId: User["id"]): Promise<boolean> {
  return ProjectService.isProjectBookmarked(projectId, userId);
}
