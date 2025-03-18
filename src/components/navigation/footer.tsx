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
    <footer className="mt-6 py-10">
      <hr className="via-accent mx-auto mb-8 h-0.25 w-1/3 border-0 bg-gradient-to-r from-transparent to-transparent" />
      <nav aria-label="Footer" className="flex justify-center gap-8 text-sm">
        {navigation.main.map((item) => (
          <Link key={item.name} href={item.href as Route} className="text-primary-foreground hover:underline">
            {item.name}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
