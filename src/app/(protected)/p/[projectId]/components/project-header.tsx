'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Project } from '~/features/projects/project.types';
import { deleteProject } from '~/features/projects/project.actions';
import { useRouter } from 'next/navigation';

interface ProjectHeaderProps {
  title: Project['title'];
  projectId: Project['id'];
  isOwnProject: boolean;
}

export function ProjectHeader({ title, projectId, isOwnProject }: ProjectHeaderProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProject(projectId);
      router.push('/');
      router.refresh();
    } catch {
      // TODO: handle error, show toast or something
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative h-48">
      <Image src="/banner-placeholder.png" alt="Banner" fill className="rounded-t object-cover" />
      <div className="absolute -bottom-12 left-8">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {isOwnProject && (
        <div className="absolute right-1 -bottom-12 flex space-x-2">
          <Link href={`/p/${projectId}/edit` as Route}>
            <button className="btn btn-accent-content" aria-label="Edit Project">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1l1-4l9.5-9.5z"
                />
              </svg>
            </button>
          </Link>
          <button
            className="btn btn-accent-content"
            aria-label="Delete Project"
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
