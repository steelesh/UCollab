'use client';

import Link from 'next/link';
import { P } from '../../ui/p';
import { LogoSvg } from '../../ui/logo-svg';

export function FooterLogo() {
  return (
    <div>
      <Link href="/" className="inline-block">
        <LogoSvg className="text-inverse h-24 w-20" />
      </Link>
      <P className="text-inverse-muted-foreground text-sm">Where Students Come Together To Innovate.</P>
    </div>
  );
}
