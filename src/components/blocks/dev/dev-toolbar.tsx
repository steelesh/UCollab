"use client";

import { Button } from "@/src/components/ui/button";
import { isLocalEnv } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import Link from "next/link";

export function DevToolbar() {
  if (!isLocalEnv()) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className="fixed right-4 bottom-4 z-50"
    >
      <Link href="/localdev">
        <Button variant="default" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Dev Tools</span>
        </Button>
      </Link>
    </motion.div>
  );
}
