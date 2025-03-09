import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../../src/components/profile-header';

describe('ProfileHeader', () => {
  const mockProps = {
    username: 'testuser',
    avatar: 'data:image/svg+xml;base64,mockedAvatar',
    isOwnProfile: false,
  };

  it('renders avatar in profile header', () => {
    render(<ProfileHeader {...mockProps} />);

    const avatarImg = screen.getByAltText(mockProps.username);
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', mockProps.avatar);

    const bannerImg = screen.getByAltText('Banner');
    expect(bannerImg).toBeInTheDocument();
  });

  it('doesnt show settings and sign out buttons for other users profiles', () => {
    render(<ProfileHeader {...mockProps} />);

    expect(screen.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
  });

  it('shows settings and sign out buttons for own profile', () => {
    render(<ProfileHeader {...mockProps} isOwnProfile={true} />);

    const settingsLink = screen.getByRole('link');
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/u/testuser/settings');

    const settingsButton = screen.getByRole('button', { name: 'Settings' });
    expect(settingsButton).toHaveClass('btn-accent-content');

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });
});
