import type { Project, User } from "@prisma/client";
import type { Metadata } from "next";

import { formatDate } from "date-fns";
import { ArrowUpRight, Calendar, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProjectActions } from "~/components/projects/project-actions";
import { ProjectComments } from "~/components/projects/project-comments";
import { ProjectRating } from "~/components/projects/project-rating";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1, H2 } from "~/components/ui/heading";
import { Lead } from "~/components/ui/lead";
import { ProjectTypeBadge, RatingBadge, TrendingBadge } from "~/components/ui/project-badges";
import { Section } from "~/components/ui/section";
import { Small } from "~/components/ui/small";
import { TechnologyIcon } from "~/components/ui/technology-icon";
import { getProjectTitle, getRealTimeProject, getUserProjectRating, isProjectBookmarked } from "~/features/projects/project.queries";
import { withAuth } from "~/security/protected";

type PageProps = {
  params: Promise<{ projectId: Project["id"] }>;
  userId: User["id"];
};

export async function generateMetadata({ params }: { params: Promise<{ projectId: Project["id"] }> }): Promise<Metadata> {
  const { projectId } = await params;
  try {
    const projectTitle = await getProjectTitle(projectId);
    return {
      title: `${projectTitle} | UCollab`,
    };
  } catch {
    return {
      title: "Project not found | UCollab",
    };
  }
}

async function Page({ params, userId }: PageProps) {
  const { projectId } = await params;
  const project = await getRealTimeProject(projectId, userId);
  const userProjectRating = await getUserProjectRating(projectId, userId);
  const isBookmarked = await isProjectBookmarked(projectId, userId);
  const isTrending = project.trendingScore > 0.5;

  return (
    <Container className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/p"
          className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 w-fit"
        >
          <ArrowUpRight className="w-4 h-4 -rotate-135 mr-0.5" />
          <span>Back</span>
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <RatingBadge
          value={project.rating > 0 ? project.rating.toFixed(1) : "Not yet rated"}
          className="py-2 px-4 text-base"
        />
        <ProjectTypeBadge
          type={project.projectType}
          className="py-2 px-4 text-base"
        />
        {isTrending && (
          <TrendingBadge className="py-2 px-4 text-base" />
        )}
      </div>
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
        <Image
          src="/images/banner-placeholder.png"
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex justify-between items-center text-muted-foreground mb-12">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <Small noMargin>
            {formatDate(project.createdDate, "MM/dd/yy")}
          </Small>
        </div>
        <ProjectActions
          projectId={projectId}
          isOwnProject={project.createdById === userId}
          isBookmarked={isBookmarked}
        />
      </div>
      <Header className="mb-12">
        <div className="space-y-4">
          <H1 className="mt-2">{project.title}</H1>
          <div className="flex flex-wrap items-center gap-6">
            {project.createdBy && (
              <Link
                href={`/u/${project.createdBy.username}`}
                className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.createdBy.avatar} alt={project.createdBy.username} />
                </Avatar>
                <span>{project.createdBy.username}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200" />
              </Link>
            )}
          </div>
        </div>
      </Header>
      <div className="space-y-12">
        <Section>
          <H2 className="mb-4">Description</H2>
          <Lead className="text-muted-foreground">
            {project.description}
          </Lead>
          {project.githubRepo && (
            <Link
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#f6f8fa] border border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6] dark:bg-[#21262d] dark:border-[#30363d] dark:text-white dark:hover:bg-[#30363d] transition-colors mt-4"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </Link>
          )}
        </Section>
        {project.technologies && project.technologies.length > 0 && (
          <Section>
            <H2 className="mb-4">Technologies</H2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <Badge key={tech.id} variant="glossy" className="py-2 px-3 text-base">
                  <TechnologyIcon name={tech.name} colored />
                  <span className="ml-1">{tech.name}</span>
                </Badge>
              ))}
            </div>
          </Section>
        )}
        {project.createdById !== userId && (
          <Section className="border-t border-border/30 pt-8">
            <H2 className="mb-4">Rate this Project</H2>
            <ProjectRating
              projectId={project.id}
              initialRating={project.rating}
              userRating={userProjectRating}
            />
          </Section>
        )}
        <Section className="border-t border-border/30 pt-8">
          <H2 className="mb-4 flex items-center gap-2">
            Comments
            <span className="text-base font-normal text-muted-foreground">
              (
              {project.comments.length}
              )
            </span>
          </H2>
          <ProjectComments comments={project.comments} currentUserId={userId} projectId={projectId} />
        </Section>
      </div>
    </Container>
  );
}

export default withAuth(Page);
