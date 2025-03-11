import { cn } from '~/lib/utils';

export function SmallText({ children, className, ...props }: React.ComponentProps<'small'>) {
  return (
    <small className={cn('text-sm leading-none font-medium', className)} {...props}>
      {children}
    </small>
  );
}
