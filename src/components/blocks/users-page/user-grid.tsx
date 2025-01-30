import { User } from "@prisma/client";
import { UserCard } from "./user-card";

interface UserGridProps {
  users: User[];
  currentUserId?: string;
  showImpersonateButton?: boolean;
}

export function UserGrid({
  users,
  currentUserId,
  showImpersonateButton,
}: UserGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isCurrentUser={user.id === currentUserId}
          showImpersonateButton={showImpersonateButton}
        />
      ))}
    </div>
  );
}
