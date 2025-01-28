"use client";

import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLink, NavLinkProps } from "./nav-link";
import { NavSection } from "./navbar";

export function MobileNav({ items }: { items: NavSection[] }) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative order-first md:hidden"
        >
          <Menu
            className={cn(
              "absolute h-5 w-5 transition-all",
              open ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute h-5 w-5 transition-all",
              open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
            )}
          />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-80 flex-col p-0"
        aria-describedby="nav-menu-description"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Site navigation menu with collapsible sections
        </SheetDescription>
        <div id="nav-menu-description" className="sr-only">
          Site navigation menu with collapsible sections
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-6 pt-20">
            {items.map((section) => (
              <Collapsible
                key={section.title}
                open={openSections[section.title]}
                onOpenChange={() =>
                  setOpenSections((prev) => ({
                    ...prev,
                    [section.title]: !prev[section.title],
                  }))
                }
              >
                <CollapsibleTrigger className="hover:bg-accent flex w-full items-center justify-between rounded-md p-2">
                  {section.title}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      openSections[section.title] && "rotate-180",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-2">
                  <div className="flex flex-col space-y-2 pt-2">
                    {section.items?.map((item: NavLinkProps) => (
                      <NavLink
                        key={item.href}
                        {...item}
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
        <div className="border-t p-6">
          <Link href="/u">
            <Button onClick={() => setOpen(false)} className="w-full">
              Sign in
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}