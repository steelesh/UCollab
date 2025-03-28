import Link from "next/link";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export type BreadcrumbItemType = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

export type PageBreadcrumbProps = {
  items: BreadcrumbItemType[];
  className?: string;
};

export function PageBreadcrumb({ items, className = "mb-10" }: PageBreadcrumbProps) {
  const breadcrumbItems = items[0]?.label.toLowerCase() === "home"
    ? items
    : [{ label: "Home", href: "/" }, ...items];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`${item.label}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isCurrent || index === breadcrumbItems.length - 1
                ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )
                : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href || "#"}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
