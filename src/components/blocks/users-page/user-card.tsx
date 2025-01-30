import { ImpersonateButton } from "@/src/components/blocks/auth/impersonate-button";
import { Avatar } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { UserService } from "@/src/services/user.service";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "../auth/sign-out-button";

type User = Awaited<ReturnType<typeof UserService.getUsers>>[number];

interface UserCardProps {
  user: User;
  isCurrentUser: boolean;
  showImpersonateButton?: boolean;
}

export function UserCard({
  user,
  isCurrentUser,
  showImpersonateButton,
}: UserCardProps) {
  return (
    <div className="group relative">
      <Card className="bg-card relative transition-transform duration-200 hover:scale-[1.02]">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="dark:border-primary group-hover:bg-primary/10 dark:bg-primary/30 dark:group-hover:bg-primary/20 h-16 w-16 rounded-full border border-black group-hover:border-[1.5px]">
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={64}
                  height={64}
                />
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <Badge variant="role">{user.role}</Badge>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/u/${user.username}`}>{user.fullName}</Link>
                {isCurrentUser && <Badge variant="new">Active</Badge>}
              </div>
              <p className="text-muted-foreground text-sm">@{user.username}</p>
            </div>
          </div>
          {showImpersonateButton &&
            (isCurrentUser ? (
              <SignOutButton />
            ) : (
              <ImpersonateButton userId={user.id} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
