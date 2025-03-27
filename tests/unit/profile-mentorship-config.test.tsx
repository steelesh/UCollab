import { MentorshipStatus } from "@prisma/client";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MENTORSHIP_CONFIG } from "~/components/profiles/profile-mentorship-config";

describe("MENTORSHIP_CONFIG", () => {
  it("has correct configuration for MENTOR status", () => {
    const config = MENTORSHIP_CONFIG[MentorshipStatus.MENTOR];

    expect(config.label).toBe("Mentor");
    expect(config.icon).toBeDefined();

    const { container } = render(<>{config.icon}</>);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has correct configuration for MENTEE status", () => {
    const config = MENTORSHIP_CONFIG[MentorshipStatus.MENTEE];

    expect(config.label).toBe("Currently mentored");
    expect(config.icon).toBeDefined();

    const { container } = render(<>{config.icon}</>);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has correct configuration for NONE status", () => {
    const config = MENTORSHIP_CONFIG[MentorshipStatus.NONE];

    expect(config.label).toBe("Looking for mentorship");
    expect(config.icon).toBeDefined();

    const { container } = render(<>{config.icon}</>);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
