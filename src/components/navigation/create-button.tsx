'use client';

import { Button } from '~/components/ui/button';
import Link from 'next/link';

export function CreateButton() {
  return (
    <Button variant="ghost" className="w-full cursor-pointer sm:w-auto">
      <Link href="/p/new">Create</Link>
    </Button>
  );
}
