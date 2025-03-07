import { render, screen } from '@testing-library/react';
import { ProfileCommentsList } from '../profile-comments-list';

describe('ProfileCommentsList', () => {
  const mockComments = [
    {
      id: '1',
      content: 'Test comment 1',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      projectId: '1',
      createdById: 'user1',
    },
    {
      id: '2',
      content: 'Test comment 2',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      projectId: '1',
      createdById: 'user1',
    },
  ];

  it('renders comments list correctly', () => {
    render(<ProfileCommentsList comments={mockComments} />);

    expect(screen.getByText('Test comment 1')).toBeInTheDocument();
    expect(screen.getByText('Test comment 2')).toBeInTheDocument();
  });

  it('shows no comments message when list is empty', () => {
    render(<ProfileCommentsList comments={[]} />);
    expect(screen.getByText('No comments available.')).toBeInTheDocument();
  });
});
