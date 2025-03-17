'use client';

import { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { Project, User } from '@prisma/client';
import { rateProject } from '~/features/projects/project.actions';
import { useRouter } from 'next/navigation';
import { StarRating } from '~/components/ui/star-rating';

interface ProjectRatingProps {
  projectId: Project['id'];
  userId: User['id'];
  createdById: User['id'];
  initialRating: number;
}

export function ProjectRating({ projectId, userId, createdById, initialRating }: ProjectRatingProps) {
  const [userRating, setUserRating] = useState<number>(initialRating);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isCreator = userId === createdById;

  const handleRating = async (rating: number) => {
    if (isCreator) return;

    setIsLoading(true);
    try {
      await rateProject(projectId, rating);
      setUserRating(rating);
      router.refresh();
    } catch {
      // handle err, show toast or something
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      {!isCreator && (
        <>
          <div className="mb-2">
            <h3 className="text-sm font-medium">Rate this project</h3>
          </div>
          <StarRating rating={userRating} onChange={handleRating} size="md" disabled={isLoading} />
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <UserIcon className="h-4 w-4" />
            {userRating > 0 ? (
              <span>
                You rated this project {userRating} {userRating === 1 ? 'star' : 'stars'}
              </span>
            ) : (
              <span>You haven't rated this project yet</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
