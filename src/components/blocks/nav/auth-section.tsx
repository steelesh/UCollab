import { auth } from "@/auth";
import { isDevelopment } from "@/src/lib/utils";
import Image from "next/image";
import { Avatar } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { SignOutButton } from "../auth/sign-out-button";
import { NavLink } from "./nav-link";

export async function AuthSection() {
  const session = await auth();

  // if user is authenticated, show dropdown menu
  if (session) {
    const { user } = session;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="dark:border-primary hover:bg-primary/10 dark:bg-primary/30 dark:hover:bg-primary/20 data-[state=open]:bg-primary/10 dark:data-[state=open]:bg-primary/20 h-8 w-8 rounded-full border border-black hover:border-[1.5px] data-[state=open]:border-[1.5px]">
            <Image
              src={user.avatar}
              alt="avatar image"
              width={32}
              height={32}
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <NavLink
      href={isDevelopment() ? "/u" : "/signin"}
      title="Sign in"
      className="hover:bg-transparent"
    />
  );
}
