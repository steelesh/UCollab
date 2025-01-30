"use client";

import { Button } from "@/src/components/ui/button";
import { fetcher } from "@/src/lib/utils";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import useSWR from "swr";
import { H2 } from "../../ui/h2";
import { P } from "../../ui/p";
import { services } from "./config/services";

export function ServicesSection() {
  const { data: ports, isLoading } = useSWR("/api/dev/ports", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    refreshWhenHidden: false,
  });

  return (
    <section className="space-y-6">
      <div>
        <H2 className="mb-2">Available Services</H2>
        <P className="text-muted-foreground">
          Services running in your Docker environment:
        </P>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const url = ports ? service.getUrl(ports) : null;
          const isRunning = !isLoading && url;

          return (
            <div
              key={service.name}
              className="bg-card space-y-4 rounded-lg border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <div className="bg-muted h-4 w-4 animate-pulse rounded-full" />
                    ) : isRunning ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-yellow-600" />
                    )}
                    <h3 className="font-medium">{service.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!url || isLoading}
                  onClick={() => url && window.open(url, "_blank")}
                  className="gap-2"
                >
                  Open
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{service.purpose}</p>
                {url && (
                  <p className="text-muted-foreground">
                    Port:{" "}
                    <code className="bg-secondary rounded px-2 py-0.5">
                      {url.split(":").pop()}
                    </code>
                  </p>
                )}
                <a
                  href={service.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1.5 hover:underline"
                >
                  Documentation <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
