import { User } from '@prisma/client';
import { MENTORSHIP_CONFIG } from './profile-mentorship-config';

interface ProfileUserInfoProps {
  createdDate: User['createdDate'];
  gradYear: User['gradYear'];
  mentorship: User['mentorship'];
  bio: User['bio'];
}

export function ProfileUserInfo({ createdDate, gradYear, mentorship, bio }: ProfileUserInfoProps) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">Joined {new Date(createdDate).toDateString()}</p>
      <p className="text-muted-foreground text-sm">Class of {gradYear}</p>
      <p className="text-muted-foreground flex items-center gap-1 text-sm">
        {MENTORSHIP_CONFIG[mentorship].icon}
        <span>{MENTORSHIP_CONFIG[mentorship].label}</span>
      </p>
      <p className="mt-4 text-sm whitespace-pre-wrap">{bio}</p>
    </div>
  );
}
