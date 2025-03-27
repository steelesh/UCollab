import { useSession } from "next-auth/react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

import type { NavLinkProps } from "../navigation/nav-link";
import type { NavSection } from "../navigation/navbar";

import { NavLink } from "../navigation/nav-link";
import { CreateButton } from "./create-button";

export function DesktopNav({ items }: { items: NavSection[] }) {
  const { data: session } = useSession();
  return (
    <NavigationMenu className="mr-4 hidden md:flex">
      <NavigationMenuList className="gap-12">
        {session && <CreateButton />}
        {items.map(section => (
          <NavigationMenuItem key={section.title} className="relative">
            <NavigationMenuTrigger className="h-9">{section.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="absolute -top-2 left-0 h-2 w-full" />
              <ul className="w-[300px] p-4">
                {section.items.map((item: NavLinkProps) => (
                  <li key={item.href}>
                    <NavLink {...item} />
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
