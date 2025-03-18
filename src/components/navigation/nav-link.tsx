import { cn } from '~/lib/utils';
import { Route } from 'next';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';

export interface NavLinkProps {
  title: string;
  href: Route;
  description?: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
  requiresAuth: boolean;
}

export function NavLink({ title, href, description, badge, className, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('group hover:bg-accent flex flex-col gap-1 rounded-md p-3 font-medium', className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{title}</span>
        {badge && <Badge>{badge}</Badge>}
      </div>
      {description && <span className="text-muted-foreground line-clamp-2 text-xs">{description}</span>}
    </Link>
  );
}
