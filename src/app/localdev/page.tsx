import { EnvironmentSection } from "@/src/components/blocks/dev/environment-section";
import { ServicesSection } from "@/src/components/blocks/dev/services-section";
import { UserSection } from "@/src/components/blocks/dev/user-section";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { H2 } from "@/src/components/ui/h2";
import { H3 } from "@/src/components/ui/h3";
import { List } from "@/src/components/ui/list";
import { P } from "@/src/components/ui/p";
import { isLocalEnv } from "@/src/lib/utils";
import { AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default function LocalDevPage() {
  if (!isLocalEnv()) {
    redirect("/");
  }

  return (
    <div className="container space-y-8 py-8">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Development Environment Only</AlertTitle>
        <AlertDescription>
          This page is only accessible when running locally in development mode
          (NODE_ENV=development)
        </AlertDescription>
      </Alert>

      <div>
        <H2>Local Development Tools</H2>
        <P className="text-muted-foreground">
          Overview of development environments, available services, and
          configuration options.
        </P>
      </div>

      <EnvironmentSection />
      <div className="space-y-4">
        <H3>Running other environments</H3>
        <div className="space-y-2">
          <P>Available environment commands and their purposes:</P>
          <List className="list-disc space-y-2 pl-6">
            <li>
              <code className="bg-muted rounded px-1.5 py-0.5">
                npm run dev
              </code>
              <span className="ml-2">
                - Standard local development environment with local services
              </span>
            </li>
            <li>
              <code className="bg-muted rounded px-1.5 py-0.5">
                npm run dev:dev
              </code>
              <span className="ml-2">
                - Local server connected to development environment services
              </span>
            </li>
            <li>
              <code className="bg-muted rounded px-1.5 py-0.5">
                npm run dev:staging
              </code>
              <span className="ml-2">
                - Local server connected to staging environment services
              </span>
            </li>
            <li>
              <code className="bg-muted rounded px-1.5 py-0.5">
                npm run dev:prod
              </code>
              <span className="ml-2">
                - Local server connected to production environment services
              </span>
            </li>
          </List>
          <P className="text-muted-foreground mt-4 text-sm">
            Note: Ensure all required services are running before starting the
            application. See the Services section below for status and access
            details.
          </P>
        </div>
      </div>
      <ServicesSection />
      <UserSection />
    </div>
  );
}
