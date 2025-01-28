"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { LogoSvg } from "./logo-svg";

export function NavLogo() {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex gap-2 font-mono text-lg font-medium">
        <LogoSvg className="text-uc-red-dark dark:text-uc-grey-silver w-4 translate-y-[-1px]" />
        <div>
          <span className="font-fancy text-uc-red-dark dark:text-uc-grey-silver text-2xl font-bold">
            UC
          </span>
          <span>ollab</span>
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.3 }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="relative top-[-2px] ml-[2.5px]"
          >
            ▊
          </motion.span>
        </div>
      </Link>
    </div>
  );
}
