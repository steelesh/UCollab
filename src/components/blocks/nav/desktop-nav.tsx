import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { NavLink, NavLinkProps } from './nav-link';
import { NavSection } from './navbar';

export function DesktopNav({ items }: { items: NavSection[] }) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {items.map((section) => (
          <NavigationMenuItem key={section.title}>
            <NavigationMenuTrigger className="h-9">{section.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
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
