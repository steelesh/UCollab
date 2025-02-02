import Link from 'next/link';

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
    <footer className="bg-base-200 py-6">
      <div className="mx-auto overflow-hidden">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-8 text-sm">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-accent hover:text-base-content hover:underline">
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
