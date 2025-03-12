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
    <NavigationMenu className="mr-4 hidden md:flex">
      <NavigationMenuList className="gap-12">
        {items.map((section) => (
          <NavigationMenuItem key={section.title} className="relative">
            <NavigationMenuTrigger className="h-9">{section.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              {/* Spacer to capture hover while transitioning from trigger to dropdown */}
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
