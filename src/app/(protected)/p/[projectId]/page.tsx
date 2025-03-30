import type { Project, User } from "@prisma/client";
import type { Metadata } from "next";

import { formatDate } from "date-fns";
import { ArrowUpRight, Github, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProjectActions } from "~/components/projects/project-actions";
import { ProjectBookmark } from "~/components/projects/project-bookmark";
import { ProjectComments } from "~/components/projects/project-comments";
import { ProjectRating } from "~/components/projects/project-rating";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1, H2 } from "~/components/ui/heading";
import { Muted } from "~/components/ui/muted";
import { ProjectTypeBadge } from "~/components/ui/project-badges";
import { Section } from "~/components/ui/section";
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
    <Container className="max-w-3xl">
      <div className="mb-4 md:mb-6">
        <Link
          href="/p"
          className="group flex items-center gap-1 md:gap-1.5 text-sm md:text-base text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 w-fit"
        >
          <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 -rotate-135 mr-0.5" />
          <span>Back</span>
        </Link>
      </div>
      <Header>
        <H1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6">{project.title}</H1>
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          {project.createdBy && (
            <Link
              href={`/u/${project.createdBy.username}`}
              className="group flex items-center gap-1.5 md:gap-2 hover:text-foreground transition-colors duration-200"
            >
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={project.createdBy.avatar} alt={project.createdBy.username} />
              </Avatar>
              <div>
                <div className="font-medium text-sm md:text-base">{project.createdBy.username}</div>
                <Muted className="text-[10px] md:text-xs">
                  {formatDate(project.createdDate, "MMM dd, yyyy")}
                </Muted>
              </div>
            </Link>
          )}
          {project.createdById === userId && (
            <div className="ml-auto">
              <ProjectActions
                projectId={projectId}
                isOwnProject={true}
                isBookmarked={isBookmarked}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 my-4 py-4 border-t border-b border-border/30 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            {isTrending && (
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            )}
            <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 stroke-background stroke-[1.5px]" />
            <span className="text-xs md:text-sm">{project.rating > 0 ? project.rating.toFixed(1) : "Not rated"}</span>
          </div>

          {project.createdById !== userId && (
            <div className="ml-auto">
              <ProjectBookmark
                projectId={projectId}
                initialBookmarked={isBookmarked}
              />
            </div>
          )}
        </div>
      </Header>
      <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden mb-6 md:mb-10">
        <Image
          src="/images/banner-placeholder.png"
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-8 md:space-y-12">
        {project.projectType && (
          <Section>
            <H2>Project Type</H2>
            <ProjectTypeBadge type={project.projectType} className="text-sm md:text-base py-1.5 px-3" />
          </Section>
        )}
        <Section>
          <H2>Description</H2>
          <Muted className="text-base md:text-lg leading-relaxed">
            {project.description}
          </Muted>
          {project.githubRepo && (
            <Link
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-md bg-[#f6f8fa] border border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6] dark:bg-[#21262d] dark:border-[#30363d] dark:text-white dark:hover:bg-[#30363d] transition-colors text-sm md:text-base mt-6 md:mt-8"
            >
              <Github className="w-4 h-4 md:w-5 md:h-5" />
              <span>View on GitHub</span>
            </Link>
          )}
        </Section>
        {project.technologies && project.technologies.length > 0 && (
          <Section>
            <H2>Technologies</H2>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {project.technologies.map(tech => (
                <Badge key={tech.id} variant="glossy" className="py-1 md:py-2 px-2 md:px-3 text-sm md:text-base">
                  <TechnologyIcon name={tech.name} colored />
                  <span className="ml-1">{tech.name}</span>
                </Badge>
              ))}
            </div>
          </Section>
        )}
        {project.createdById !== userId && (
          <Section className="border-t border-border/30 pt-6 md:pt-8">
            <H2>Rate this Project</H2>
            <ProjectRating
              projectId={project.id}
              initialRating={project.rating}
              userRating={userProjectRating}
            />
          </Section>
        )}
        <Section className="border-t border-border/30 pt-6 md:pt-8">
          <H2 className="text-xl md:text-2xl mb-3 md:mb-4 flex items-center gap-2">
            Comments
            <span className="text-sm md:text-base font-normal text-muted-foreground">
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
