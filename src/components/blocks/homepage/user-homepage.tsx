import { UserService } from "@/src/services/user.service";
import Image from "next/image";
import { H3 } from "../../ui/h3";
import { P } from "../../ui/p";
import { SignOutButton } from "../auth/sign-out-button";

type HomePageUser = NonNullable<
  Awaited<ReturnType<typeof UserService.getHomePageUser>>
>;

interface UserHomePageProps {
  user: HomePageUser;
}

export function UserHomePage({ user }: UserHomePageProps) {
  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <H3>Welcome back, {user.firstName}!</H3>
          <SignOutButton />
        </div>

        <div className="mb-8 flex items-center gap-6">
          <Image
            src={user.avatar}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="space-y-2">
            <P className="text-lg font-medium">{user.fullName}</P>
            <P className="text-secondary-foreground">@{user.username}</P>
            <P className="text-secondary-foreground">{user.email}</P>
          </div>
        </div>
      </div>
    </div>
  );
}
