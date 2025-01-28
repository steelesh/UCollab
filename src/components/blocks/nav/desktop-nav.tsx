import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/components/ui/navigation-menu";
import { NavLink, NavLinkProps } from "./nav-link";
import { NavSection } from "./navbar";

export function DesktopNav({ items }: { items: NavSection[] }) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {items.map((section) => (
          <NavigationMenuItem key={section.title}>
            <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
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
