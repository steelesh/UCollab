import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MENTORSHIP_CONFIG } from '../../src/components/profile-mentorship-config';
import { MentorshipStatus } from '@prisma/client';

describe('MENTORSHIP_CONFIG', () => {
  it('has correct configuration for MENTOR status', () => {
    const config = MENTORSHIP_CONFIG[MentorshipStatus.MENTOR];
    expect(config.label).toBe('Mentor');
    expect(config.icon).toBeDefined();

    const { container } = render(<>{config.icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has correct configuration for MENTEE status', () => {
    const config = MENTORSHIP_CONFIG[MentorshipStatus.MENTEE];
    expect(config.label).toBe('Currently mentored');
    expect(config.icon).toBeDefined();

    const { container } = render(<>{config.icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has correct configuration for NONE status', () => {
    const config = MENTORSHIP_CONFIG[MentorshipStatus.NONE];
    expect(config.label).toBe('Looking for mentorship');
    expect(config.icon).toBeDefined();

    const { container } = render(<>{config.icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
