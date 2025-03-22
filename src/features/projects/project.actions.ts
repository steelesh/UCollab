'use server';

import { projectSchema, projectRatingSchema } from './project.schema';
import { ProjectService } from './project.service';
import { auth } from '~/security/auth';
import { ErrorMessage, handleServerActionError } from '~/lib/utils';
import { Project } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  const rawData = {
    title: formData.get('title'),
    projectType: formData.get('projectType'),
    description: formData.get('description'),
    technologies: JSON.parse(formData.get('technologies') as string),
    githubRepo: formData.get('githubRepo'),
  };

  try {
    const validatedData = projectSchema.parse(rawData);
    const project = await ProjectService.createProject(validatedData, session.user.id);
    redirect(`/p/${project.id}`);
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function deleteProject(projectId: Project['id']) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    await ProjectService.deleteProject(projectId, session.user.id);
    redirect('/');
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function updateProject(projectId: Project['id'], formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const rawData = {
      title: formData.get('title'),
      projectType: formData.get('projectType'),
      description: formData.get('description'),
      technologies: JSON.parse(formData.get('technologies') as string),
      githubRepo: formData.get('githubRepo'),
    };

    const validatedData = projectSchema.parse(rawData);
    await ProjectService.updateProject(projectId, validatedData, session.user.id);
    redirect(`/p/${projectId}`);
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function searchTechnologies(query: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const technologies = await ProjectService.searchTechnologies(query, session.user.id);
    return technologies.map((t) => t.name);
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function rateProject(projectId: Project['id'], rating: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const validatedData = projectRatingSchema.parse({ projectId, rating });

    await ProjectService.rateProject(validatedData.projectId, validatedData.rating, session.user.id);

    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function getBookmarkStatus(projectId: Project['id']) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const watchedProjects = await ProjectService.getUserWatchedProjects(session.user.id, session.user.id);
    const isWatched = watchedProjects.some((proj) => proj.id === projectId);
    return { success: true, bookmarked: isWatched };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function getBookmarkedProjects() {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const bookmarkedProjects = await ProjectService.getUserWatchedProjects(session.user.id, session.user.id);
    return { success: true, projects: bookmarkedProjects };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function toggleBookmark(projectId: Project['id']) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const { success, bookmarked } = (await getBookmarkStatus(projectId)) as {
      success: boolean;
      bookmarked: boolean;
    };

    if (!success) {
      throw new Error(ErrorMessage.OPERATION_FAILED);
    }

    if (bookmarked) {
      await ProjectService.unwatchProject(projectId, session.user.id);
      return { success: true, watched: false };
    } else {
      await ProjectService.watchProject(projectId, session.user.id);
      return { success: true, watched: true };
    }
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function getCreatedProjects() {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const createdProjects = await ProjectService.getProjectsByUser(session.user.id, session.user.id);
    return { success: true, projects: createdProjects };
  } catch (error) {
    return handleServerActionError(error);
  }
}
