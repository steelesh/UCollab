import { MentorshipStatus } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileUserInfo } from "~/components/profiles/profile-user-info";

describe("profileUserInfo", () => {
  const mockProps = {
    createdDate: new Date("2024-01-01"),
    gradYear: 2024,
    mentorship: MentorshipStatus.MENTEE,
    bio: "Test bio",
    technologies: [],
  };

  it("renders user information correctly", () => {
    render(<ProfileUserInfo {...mockProps} />);

    expect(screen.getByText(/^Joined/)).toBeInTheDocument();
    expect(screen.getByText(/^Class of/)).toBeInTheDocument();
    expect(screen.getByText(/^Class of 2024$/)).toBeInTheDocument();
    expect(screen.getByText("Currently mentored")).toBeInTheDocument();
    expect(screen.getByText("Test bio")).toBeInTheDocument();
  });
});
