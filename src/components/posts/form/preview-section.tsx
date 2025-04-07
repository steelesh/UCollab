"use client";

import { NeedType } from "@prisma/client";
import { Github } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useState } from "react";

import type { CreatePostInput } from "~/features/posts/post.schema";
import type { PostNeed } from "~/features/posts/post.types";

import { PostNeedsBadges } from "~/components/posts/post-badges";
import { Section } from "~/components/ui/section";
import TechBadge from "~/components/ui/tech-badge";

type PreviewSectionProps = {
  data: CreatePostInput;
};

export const PreviewSection = memo(({ data }: PreviewSectionProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  useEffect(() => {
    if (data.bannerImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(data.bannerImage);

      return () => {
        setPreviewUrl(null);
      };
    } else if (typeof data.bannerImage === "string") {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPreviewUrl(data.bannerImage);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPreviewUrl(null);
    }
  }, [data.bannerImage]);

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

          {data.bannerImage && (
            <div>
              <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Banner Image</h4>
              {previewUrl && (
                <div className="relative aspect-video rounded-md overflow-hidden max-h-48 bg-muted flex items-center justify-center">
                  <Image
                    src={previewUrl}
                    fill
                    alt="Banner preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              {data.bannerImage instanceof File && (
                <p className="text-xs text-muted-foreground mt-1">
                  {data.bannerImage.name}
                  {" "}
                  (
                  {(data.bannerImage.size / 1024 / 1024).toFixed(2)}
                  {" "}
                  MB)
                </p>
              )}
            </div>
          )}

          <div>
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Title</h4>
            <p className="text-sm md:text-base">{data.title ?? "-"}</p>
          </div>

          <div>
            <h4 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Description</h4>
            <p className="text-sm md:text-base">{data.description ?? "-"}</p>
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
