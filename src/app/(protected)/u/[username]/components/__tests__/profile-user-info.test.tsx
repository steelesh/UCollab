import { render, screen } from '@testing-library/react';
import { ProfileUserInfo } from '../profile-user-info';
import { describe, expect, it } from 'vitest';
import { MentorshipStatus } from '@prisma/client';

describe('ProfileUserInfo', () => {
  const mockProps = {
    createdDate: new Date('2024-01-01'),
    gradYear: 2024,
    mentorship: MentorshipStatus.MENTEE,
    bio: 'Test bio',
  };

  it('renders user information correctly', () => {
    render(<ProfileUserInfo {...mockProps} />);

    expect(screen.getByText(/^Joined/)).toBeInTheDocument();
    expect(screen.getByText('Class of 2024')).toBeInTheDocument();
    expect(screen.getByText('Currently mentored')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });
});
