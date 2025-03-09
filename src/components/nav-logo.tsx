'use client';

import Link from 'next/link';

export function NavLogo() {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex gap-2 font-mono text-lg font-medium">
        <div>
          <img src="images/logo-dark.svg" alt="Logo" className="h-8 w-8" />
        </div>
      </Link>
    </div>
  );
}
