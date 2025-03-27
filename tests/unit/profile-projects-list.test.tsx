import { ProjectType } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileProjectsList } from "~/components/profiles/profile-projects-list";

describe("profileProjectsList", () => {
  const mockProjects = [
    {
      id: "1",
      title: "Test Project 1",
      description: "Test description 1",
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      projectType: ProjectType.CONTRIBUTION,
      rating: 0,
      githubRepo: null,
      createdById: "user1",
    },
    {
      id: "2",
      title: "Test Project 2",
      description: "Test description 2",
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      projectType: ProjectType.CONTRIBUTION,
      rating: 0,
      githubRepo: null,
      createdById: "user1",
    },
  ];

  it("renders projects list correctly", () => {
    render(<ProfileProjectsList projects={mockProjects} />);

    expect(screen.getByText("Test Project 1")).toBeInTheDocument();
    expect(screen.getByText("Test Project 2")).toBeInTheDocument();
  });

  it("shows no posts message when projects array is empty", () => {
    render(<ProfileProjectsList projects={[]} />);

    expect(screen.getByText("No posts available.")).toBeInTheDocument();
  });
});
