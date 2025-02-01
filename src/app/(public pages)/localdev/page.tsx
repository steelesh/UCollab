import { ServicesSection } from "@/src/components/blocks/dev/services-section";
import { Button } from "@/src/components/ui/button";
import { H2 } from "@/src/components/ui/h2";
import { H3 } from "@/src/components/ui/h3";
import { List } from "@/src/components/ui/list";
import { P } from "@/src/components/ui/p";
import { isDevelopment } from "@/src/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LocalDevPage() {
  if (!isDevelopment()) {
    redirect("/");
  }

  return (
    <div className="container space-y-8 py-8">
      <div>
        <H2>DevTools</H2>
        <P className="text-muted-foreground">
          Overview of development environments and available services.
        </P>
      </div>

      <ServicesSection />

      <div className="space-y-4">
        <H3>Environment Guide</H3>
        <div className="space-y-6">
          <div>
            <P className="font-medium">Runtime Environment (NODE_ENV)</P>
            <P className="text-muted-foreground mb-3 text-sm">
              Automatically set by Next.js based on how you start the
              application. You <b>don&apos;t</b> set this directly.
            </P>
            <List className="list-disc space-y-2 pl-6">
              <li>
                <code className="bg-muted rounded px-1.5 py-0.5">
                  NODE_ENV=development
                </code>
                <span className="ml-2">
                  - automatically set when running{" "}
                  <code className="bg-muted rounded px-1.5 py-0.5">
                    npm run dev
                  </code>
                </span>
              </li>
              <li>
                <code className="bg-muted rounded px-1.5 py-0.5">
                  NODE_ENV=production
                </code>
                <span className="ml-2">
                  - automatically set when running{" "}
                  <code className="bg-muted rounded px-1.5 py-0.5">
                    npm run start
                  </code>{" "}
                  or deployed
                </span>
              </li>
            </List>
            <div className="mt-3 text-sm">
              <P className="font-medium">Helper Functions:</P>
              <List className="list-disc space-y-2 pl-6">
                <li>
                  <code>isDevelopment()</code> - Check if{" "}
                  <code>NODE_ENV=development</code>
                </li>
                <li>
                  <code>isProduction()</code> - Check if{" "}
                  <code>NODE_ENV=production</code>
                </li>
                <li>
                  <code>isTest()</code> - Check if <code>NODE_ENV=test</code>
                </li>
              </List>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <H3>Test User Access</H3>
        <P className="text-muted-foreground">
          Access the User Directory to manage test users and permissions
        </P>
        <List className="list-disc space-y-2 pl-6">
          <li>Sign in with Microsoft Entra ID (UC credentials)</li>
          <li>Impersonate seeded test users with different roles</li>
        </List>
      </div>

      <Link href="/u">
        <Button variant="secondary" className="gap-2">
          <Users className="h-4 w-4" />
          Open User Directory
        </Button>
      </Link>
    </div>
  );
}
