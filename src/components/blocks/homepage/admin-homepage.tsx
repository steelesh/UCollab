import { UserService } from "@/src/services/user.service";
import Image from "next/image";
import { H3 } from "../../ui/h3";
import { P } from "../../ui/p";
import { SignOutButton } from "../auth/sign-out-button";

type HomePageUser = NonNullable<
  Awaited<ReturnType<typeof UserService.getHomePageUser>>
>;

interface AdminHomePageProps {
  user: HomePageUser;
}

export function AdminHomePage({ user }: AdminHomePageProps) {
  return (
    <div className="p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <H3>Admin Dashboard</H3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={user.avatar}
                alt="Admin Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <P>{user.fullName}</P>
            </div>
            <P>-- show admin dashboard here --</P>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
