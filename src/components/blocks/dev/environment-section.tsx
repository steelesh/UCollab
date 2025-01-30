"use client";

import { cn } from "@/src/lib/utils";
import { H2 } from "../../ui/h2";
import { environments } from "./config/environments";

export function EnvironmentSection() {
  const currentEnv = process.env.NEXT_PUBLIC_DEPLOY_ENV || "local";
  const envInfo = environments[currentEnv];

  return (
    <section className="space-y-6">
      <H2>Current Environment</H2>

      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div>
          <span className={cn("text-xl font-medium", envInfo.color)}>
            {envInfo.name}
          </span>
          <p className="text-muted-foreground mt-2">
            Started with:{" "}
            <code className="bg-secondary rounded px-2 py-0.5">
              {envInfo.command}
            </code>
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <h4 className="mb-3 text-sm font-medium">Configuration</h4>
            <ul className="text-muted-foreground space-y-3">
              <li className="flex items-center gap-2">
                <span>•</span>
                Environment file:{" "}
                <code className="bg-secondary rounded px-2 py-0.5">
                  {envInfo.envFile}
                </code>
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                Services command:{" "}
                <code className="bg-secondary rounded px-2 py-0.5">
                  npm run services:up
                </code>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium">Active Services</h4>
            <ul className="text-muted-foreground grid gap-2">
              {envInfo.services.map((service) => (
                <li key={service} className="flex items-center gap-2">
                  <span>•</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
