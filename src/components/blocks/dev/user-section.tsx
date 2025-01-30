"use client";

import { Button } from "@/src/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

export function UserSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">Test User Access</h2>
        <p className="text-muted-foreground">
          Manage test users and permissions
        </p>
      </div>

      <div className="bg-card space-y-4 rounded-lg border p-6">
        <div className="space-y-3">
          <p className="text-sm">Available actions:</p>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>•</span>
              Create and manage test users
            </li>
            <li className="flex items-center gap-2">
              <span>•</span>
              Test different user permissions
            </li>
            <li className="flex items-center gap-2">
              <span>•</span>
              Configure user settings
            </li>
          </ul>
        </div>

        <Link href="/u">
          <Button variant="secondary" className="gap-2">
            <Users className="h-4 w-4" />
            Open User Management
          </Button>
        </Link>
      </div>
    </section>
  );
}
