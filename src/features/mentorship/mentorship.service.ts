import { prisma } from "~/lib/prisma";
import { ErrorMessage } from "~/lib/utils";

type GraphNode = {
  id: string;
  value: number;
  color: string;
  label: string;
  avatar: string;
};

type GraphLink = {
  source: string;
  target: string;
  color: string;
};

function computeTechnologySimilarity(currentTechs: string[], otherTechs: string[]): number {
  const otherSet = new Set(otherTechs);
  const common = currentTechs.filter(tech => otherSet.has(tech));
  const union = new Set([...currentTechs, ...otherTechs]);
  return union.size === 0 ? 0 : common.length / union.size;
}

function computeRatingSimilarity(
  currentUserRatings: Map<string, number>,
  otherUserRatings: Map<string, number>,
): number {
  for (const [postId, currRating] of currentUserRatings.entries()) {
    const otherRating = otherUserRatings.get(postId);
    if (otherRating !== undefined && Math.abs(currRating - otherRating) <= 2) {
      return 1;
    }
  }
  return 0;
}

function computeMatchScore(
  currentUser: { gradYear?: number | null; technologies: string[] },
  otherUser: { gradYear?: number | null; technologies: string[] },
  currentUserCommentCount: number,
  otherUserCommentCount: number,
  currentUserRatings: Map<string, number>,
  otherUserRatings: Map<string, number>,
): number {
  const techSim = computeTechnologySimilarity(currentUser.technologies, otherUser.technologies);

  const ratingSim = computeRatingSimilarity(currentUserRatings, otherUserRatings);

  let gradScore = 0.0;
  if (currentUser.gradYear && otherUser.gradYear) {
    const diff = Math.abs(currentUser.gradYear - otherUser.gradYear);
    gradScore = 1 - Math.min(diff / 5, 1);
  }

  const commentDiff = Math.abs(currentUserCommentCount - otherUserCommentCount);
  const maxComments = Math.max(currentUserCommentCount, otherUserCommentCount, 1);
  const commentScore = 1 - commentDiff / maxComments;

  return (techSim + ratingSim + gradScore + commentScore) / 4;
}

function getColorFromScore(score: number): string {
  const hue = 0;
  const saturation = Math.round(200 * score);
  const lightness = 40 + 40 * score;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const MentorshipService = {
  async getMentorshipGraphData(currentUserId: string): Promise<{
    nodes: GraphNode[];
    links: GraphLink[];
  }> {
    try {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          id: true,
          username: true,
          gradYear: true,
          technologies: { select: { name: true } },
          avatar: true,
          mentorship: true,
        },
      });
      if (!currentUser)
        throw new Error(ErrorMessage.OPERATION_FAILED);

      const users = await prisma.user.findMany({
        where: {
          id: { not: currentUserId },
          ...(currentUser.mentorship === "MENTOR"
            ? { mentorship: "MENTEE" }
            : currentUser.mentorship === "MENTEE"
              ? { mentorship: "MENTOR" }
              : {}),
        },
        select: {
          id: true,
          username: true,
          gradYear: true,
          technologies: { select: { name: true } },
          avatar: true,
          mentorship: true,
        },
      });

      const commentCounts = await prisma.comment.groupBy({
        by: ["createdById"],
        _count: { id: true },
      });
      const countsMap = new Map<string, number>(commentCounts.map(item => [item.createdById, item._count.id]));
      const currentUserCommentCount = countsMap.get(currentUserId) ?? 0;
      const currentUserTechs = currentUser.technologies.map(tech => tech.name);

      const userIds = [currentUserId, ...users.map(u => u.id)];
      const ratings = await prisma.postRating.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, postId: true, rating: true },
      });
      const ratingsMap = new Map<string, Map<string, number>>();
      for (const rating of ratings) {
        let userMap = ratingsMap.get(rating.userId);
        if (!userMap) {
          userMap = new Map<string, number>();
          ratingsMap.set(rating.userId, userMap);
        }
        userMap.set(rating.postId, rating.rating);
      }
      const currentUserRatings = ratingsMap.get(currentUserId) || new Map();

      const userPrimaryTech: Record<string, string> = {};
      await Promise.all(
        users.map(async (user) => {
          const posts = await prisma.post.findMany({
            where: { createdById: user.id },
            select: {
              technologies: { select: { name: true } },
            },
          });
          const techCounts: Record<string, number> = {};
          for (const post of posts) {
            for (const tech of post.technologies) {
              techCounts[tech.name] = (techCounts[tech.name] ?? 0) + 1;
            }
          }
          let primaryTech = "";
          let maxCount = 0;
          for (const tech of currentUserTechs) {
            const count = techCounts[tech] ?? 0;
            if (count > maxCount) {
              primaryTech = tech;
              maxCount = count;
            }
          }
          if (primaryTech) {
            userPrimaryTech[user.id] = primaryTech;
          }
        }),
      );

      const techBranches: Record<string, { user: (typeof users)[number]; matchScore: number }[]> = {};
      for (const tech of currentUserTechs) {
        techBranches[tech] = [];
      }

      for (const user of users) {
        const userTechs = user.technologies.map(tech => tech.name);
        const commonTechs = currentUserTechs.filter(tech => userTechs.includes(tech));
        if (commonTechs.length === 0)
          continue;
        const otherCommentCount = countsMap.get(user.id) ?? 0;
        const otherUserRatings = ratingsMap.get(user.id) || new Map();
        const matchScore = computeMatchScore(
          { gradYear: currentUser.gradYear, technologies: currentUserTechs },
          { gradYear: user.gradYear, technologies: userTechs },
          currentUserCommentCount,
          otherCommentCount,
          currentUserRatings,
          otherUserRatings,
        );
        const primaryTech = userPrimaryTech[user.id] ?? commonTechs[0];
        if (primaryTech) {
          if (!techBranches[primaryTech]) {
            techBranches[primaryTech] ??= [];
          }
          techBranches[primaryTech].push({ user, matchScore });
        }
      }

      const nodes: GraphNode[] = [];
      const links: GraphLink[] = [];
      // Add the central current user node.
      nodes.push({
        id: currentUser.id,
        value: 20,
        color: "#ffffff",
        label: currentUser.username,
        avatar: currentUser.avatar,
      });

      for (const tech of Object.keys(techBranches)) {
        const branch = techBranches[tech];
        if (!branch || branch.length === 0)
          continue;
        branch.sort((a, b) => b.matchScore - a.matchScore);
        const primary = branch[0];
        if (!primary)
          continue;
        const primaryNodeId = `${primary.user.id}-${tech}`;
        nodes.push({
          id: primaryNodeId,
          value: primary.matchScore * 100,
          color: getColorFromScore(primary.matchScore),
          label: `${primary.user.username} (${tech})`,
          avatar: primary.user.avatar,
        });
        links.push({
          source: currentUser.id,
          target: primaryNodeId,
          color: getColorFromScore(primary.matchScore),
        });
        for (let i = 1; i < branch.length; i++) {
          const secondary = branch[i];
          if (!secondary)
            continue;
          const secondaryNodeId = `${secondary.user.id}-${tech}`;
          nodes.push({
            id: secondaryNodeId,
            value: secondary.matchScore * 100,
            color: getColorFromScore(secondary.matchScore),
            label: `${secondary.user.username} (${tech})`,
            avatar: secondary.user.avatar,
          });
          links.push({
            source: primaryNodeId,
            target: secondaryNodeId,
            color: getColorFromScore(secondary.matchScore),
          });
        }
      }

      return { nodes, links };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Operation failed");
    }
  },
};
