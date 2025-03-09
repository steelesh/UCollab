import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';
import { revalidatePath } from 'next/cache';
import { createComment, deleteComment } from '~/features/comments/comment.actions';
import DeleteCommentButton from '~/components/delete-comment-button';

interface ProjectRouteProps {
  params: { id: string };
}

type Props = ProjectRouteProps & { userId: string };

async function ProjectPage({ params, userId: _userId }: Props) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      createdDate: true,
      lastModifiedDate: true,
      title: true,
      description: true,
      githubRepo: true,
      postType: true,
      technologies: {
        select: { name: true },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdDate: true,
          createdById: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdDate: 'desc' },
      },
    },
  });

  if (!project) {
    return (
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <p>Project not found.</p>
      </div>
    );
  }

  const createdDate = project.createdDate.toISOString().split('T')[0];
  const lastModifiedDate = project.lastModifiedDate.toISOString().split('T')[0];

  async function handleAddComment(formData: FormData) {
    'use server';

    const content = formData.get('content') as string;
    if (!content?.trim()) return;

    try {
      await createComment({
        content,
        projectId: id,
      });

      revalidatePath(`/projects/${id}`);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  async function handleDeleteComment(commentId: string) {
    'use server';

    try {
      await deleteComment(commentId);
      revalidatePath(`/projects/${id}`);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  }

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-8">
      <div className="w-full max-w-3xl rounded shadow">
        <div className="relative h-48">
          <Image src="/images/banner-placeholder.png" alt="Banner" fill className="rounded-t object-cover" />
          <div className="absolute inset-x-0 -bottom-12 flex justify-center">
            <h1 className="px-4 text-2xl font-bold">{project.title}</h1>
          </div>
        </div>
        <div className="px-8 pt-16 pb-8">
          <div>
            <p className="text-accent-content flex items-center gap-1 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <g fill="currentColor">
                  <path d="M16 2c.183 0 .355.05.502.135l.033.02c.28.177.465.49.465.845v1h1a3 3 0 0 1 2.995 2.824L21 7v12a3 3 0 0 1-2.824 2.995L18 22H6a3 3 0 0 1-2.995-2.824L3 19V7a3 3 0 0 1 2.824-2.995L6 4h1V3a1 1 0 0 1 .514-.874l.093-.046l.066-.025l.1-.029l.107-.019L8 2q.083 0 .161.013l.122.029l.04.012l.06.023c.328.135.568.44.61.806L9 3v1h6V3a1 1 0 0 1 1-1" />
                  <path d="M9.015 13a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m4 0a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m4.005 0a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m-5 2a1 1 0 0 1 0 2 1.001 1.001 0 1 1-.005-2zm-3.005 1a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1" />
                </g>
              </svg>
              Created: {createdDate}
            </p>
            <p className="text-accent-content flex items-center gap-1 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                  <path d="M14 8a2 2 0 0 0-2-2" />
                  <path d="M6 8a6 6 0 1 1 12 0c0 4.97-2.686 9-6 9s-6-4.03-6-9m6 9v1a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2" />
                </g>
              </svg>
              Last updated: {lastModifiedDate}
            </p>
            {project.githubRepo && (
              <p className="text-accent-content flex items-center gap-1 text-sm">
                <Link
                  href={`${project.githubRepo}` as Route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline">
                  {project.githubRepo}
                </Link>
              </p>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm">{project.description}</p>
          </div>
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-semibold">Technologies:</p>
              <ul className="list-disc pl-5">
                {project.technologies.map((tech, idx) => (
                  <li key={idx} className="text-sm">
                    {tech.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 border-t pt-4">
            <h2 className="mb-4 text-xl font-semibold">Comments</h2>
            <form action={handleAddComment} className="mb-6">
              <div className="form-control mb-4">
                <label className="label" htmlFor="content">
                  <span className="label-text">Add a comment</span>
                </label>
                <textarea
                  id="content"
                  name="content"
                  className="textarea textarea-bordered w-full"
                  placeholder="Share your thoughts..."
                  rows={3}
                  required
                />
              </div>
              <div className="text-right">
                <button type="submit" className="btn btn-primary-content">
                  Post Comment
                </button>
              </div>
            </form>
            {project.comments && project.comments.length > 0 ? (
              <div className="space-y-4">
                {project.comments.map((comment) => {
                  return (
                    <div key={comment.id} className="rounded border p-4">
                      <div className="flex items-center gap-2">
                        {comment.createdBy.avatar && (
                          <Image
                            src={comment.createdBy.avatar}
                            alt={comment.createdBy.username || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{comment.createdBy.username || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">{new Date(comment.createdDate).toLocaleDateString()}</p>
                        </div>
                        {comment.createdById === _userId && (
                          <DeleteCommentButton commentId={comment.id} deleteAction={handleDeleteComment} />
                        )}
                      </div>
                      <p className="mt-2 text-sm">{comment.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProjectPage);
