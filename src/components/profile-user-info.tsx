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
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Joined {new Date(createdDate).toDateString()}</p>
      <p className="text-sm text-gray-500">Class of {gradYear}</p>
      <p className="flex items-center gap-1 text-sm text-gray-500">
        {MENTORSHIP_CONFIG[mentorship].icon}
        <span>{MENTORSHIP_CONFIG[mentorship].label}</span>
      </p>
      <p className="mt-4 text-sm whitespace-pre-wrap">{bio}</p>
    </div>
  );
}
