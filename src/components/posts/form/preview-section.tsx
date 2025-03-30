"use client";

import { NeedType } from "@prisma/client";
import { Github } from "lucide-react";
import { memo } from "react";

import type { CreatePostInput } from "~/features/posts/post.schema";
import type { PostNeed } from "~/features/posts/post.types";

import { PostNeedsBadges } from "~/components/ui/post-badges";
import { Section } from "~/components/ui/section";
import TechBadge from "~/components/ui/tech-badge";

type PreviewSectionProps = {
  data: CreatePostInput;
};

export const PreviewSection = memo(({ data }: PreviewSectionProps) => {
  const canHaveRatings = data.needType === NeedType.FEEDBACK || data.secondaryNeedType === NeedType.FEEDBACK;
  const effectiveAllowRatings = canHaveRatings && data.allowRatings;

  const needs: PostNeed[] = [];
  if (data.needType) {
    needs.push({ id: "preview-primary", needType: data.needType, isPrimary: true });
  }
  if (data.secondaryNeedType) {
    needs.push({ id: "preview-secondary", needType: data.secondaryNeedType, isPrimary: false });
  }

  const isProjectPost = needs.some(need => need.needType === NeedType.FEEDBACK || need.needType === NeedType.CONTRIBUTION);

  // Create a dummy onRemove function that does nothing since this is just a preview
  const dummyOnRemove = () => {};

  return (
    <Section>
      <div className="space-y-6">
        <h3 className="text-base md:text-lg font-medium">Post Summary</h3>

        <div className="space-y-5">
          <div>
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Post Type</h4>
            <div>
              {needs.length > 0 ? <PostNeedsBadges needs={needs} /> : null}
            </div>
          </div>

          <div>
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Title</h4>
            <p className="text-sm md:text-base">{data.title || "-"}</p>
          </div>

          <div>
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Description</h4>
            <p className="text-sm md:text-base">{data.description || "-"}</p>
          </div>

          {isProjectPost && (
            <div>
              <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Technologies</h4>
              {data.technologies && data.technologies.length > 0
                ? (
                    <div className="flex flex-wrap gap-2">
                      {data.technologies.map(tech => (
                        <TechBadge
                          key={tech}
                          tech={tech}
                          onRemove={dummyOnRemove}
                        />
                      ))}
                    </div>
                  )
                : (
                    <p className="text-sm md:text-base">-</p>
                  )}
            </div>
          )}

          {isProjectPost && data.githubRepo && (
            <div>
              <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">GitHub</h4>
              <div className="flex items-center gap-2">
                <Github className="h-3 w-3 md:h-4 md:w-4" />
                <p className="text-sm md:text-base break-all">{data.githubRepo}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Settings</h4>
            <ul className="text-sm md:text-base list-disc pl-5">
              <li>
                Ratings:
                {" "}
                {effectiveAllowRatings ? "Enabled" : "Disabled"}
                {!canHaveRatings && " (Not applicable)"}
              </li>
              <li>
                Comments:
                {" "}
                {data.allowComments ? "Enabled" : "Disabled"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
});
