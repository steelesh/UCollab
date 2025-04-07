import { NeedType } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfilePostsList } from "~/components/profiles/profile-posts-list";

describe("profilePostsList", () => {
  const _mockPosts = [
    {
      id: "1",
      title: "Test Post 1",
      description: "Test description 1",
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      postType: NeedType.FEEDBACK,
      rating: 0,
      githubRepo: null,
      allowRatings: true,
      allowComments: true,
      createdById: "user1",
    },
    {
      id: "2",
      title: "Test Post 2",
      description: "Test description 2",
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      postType: NeedType.CONTRIBUTION,
      rating: 0,
      githubRepo: null,
      allowRatings: true,
      allowComments: true,
      createdById: "user1",
    },
  ];

  it("shows no posts message when posts array is empty", () => {
    render(<ProfilePostsList posts={[]} />);

    expect(screen.getByText("No posts available.")).toBeInTheDocument();
  });
});
