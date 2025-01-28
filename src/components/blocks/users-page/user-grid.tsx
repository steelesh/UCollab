import { UserService } from "@/src/services/user.service";
import { UserCard } from "./user-card";

type DirectoryUser = Awaited<
  ReturnType<typeof UserService.getDirectoryUsers>
>[number];

interface UserGridProps {
  users: DirectoryUser[];
  currentUserId?: string;
}

export function UserGrid({ users, currentUserId }: UserGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isCurrentUser={user.id === currentUserId}
        />
      ))}
    </div>
  );
}
