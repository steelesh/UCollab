import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileProjectsList } from '../profile-projects-list';

describe('ProfileProjectsList', () => {
  const mockProjects = [
    {
      id: '1',
      title: 'Test Project 1',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      createdById: 'user1',
    },
    {
      id: '2',
      title: 'Test Project 2',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      createdById: 'user1',
    },
  ];

  it('renders projects list correctly', () => {
    render(<ProfileProjectsList projects={mockProjects} />);

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
  });

  it('shows no posts message when projects array is empty', () => {
    render(<ProfileProjectsList projects={[]} />);
    expect(screen.getByText('No posts available.')).toBeInTheDocument();
  });
});
