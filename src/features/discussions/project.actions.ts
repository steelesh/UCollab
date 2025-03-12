'use server';

import { projectSchema } from './project.schema';
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
