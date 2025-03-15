import { User } from '@prisma/client';
import { MENTORSHIP_CONFIG } from './profile-mentorship-config';
import type { Technology } from '~/features/projects/project.types';

interface ProfileUserInfoProps {
  createdDate: User['createdDate'];
  gradYear: User['gradYear'];
  mentorship: User['mentorship'];
  technologies: Technology[];
  bio: User['bio'];
}

export function ProfileUserInfo({ createdDate, gradYear, mentorship, bio, technologies }: ProfileUserInfoProps) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">Joined {new Date(createdDate).toDateString()}</p>
      <p className="text-muted-foreground text-sm">Class of {gradYear}</p>
      <p className="text-muted-foreground flex items-center gap-1 text-sm">
        {MENTORSHIP_CONFIG[mentorship].icon}
        <span>{MENTORSHIP_CONFIG[mentorship].label}</span>
      </p>
      <div className="mt-4 border-t pt-4">
        <p className="text-sm font-semibold">Technologies:</p>
        <p className="text-sm">
          {(() => {
            const techNames = technologies.map((tech) => tech.name);
            if (techNames.length === 0) return '';
            if (techNames.length === 1) return `${techNames[0]}.`;
            return `${techNames.slice(0, -1).join(', ')}, & ${techNames[techNames.length - 1]}.`;
          })()}
        </p>
      </div>
      <p className="mt-4 text-sm whitespace-pre-wrap">{bio}</p>
    </div>
  );
}
