import Link from 'next/link';
import type { Route } from 'next';

export default function Footer() {
  const navigation = {
    main: [
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'License', href: '/license' },
      { name: 'About Us', href: '/about' },
    ],
  };

  return (
    <footer className="bg-primary py-6">
      <div className="mx-auto overflow-hidden">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-8 text-sm">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href as Route}
              className="text-accent hover:text-base-content hover:underline">
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
