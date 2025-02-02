import { type NextApiResponse, type NextApiRequest } from 'next';
import { auth } from '~/lib/auth';
import { ProfileService } from '~/services/profile.service';
import { type ApiResponse } from '~/types/api.types';
import { type PublicProfileResponse } from '~/types/profile.types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PublicProfileResponse>>,
) {
  // auth check
  const session = await auth();
  if (!session?.user?.id) {
    return res.status(401).json({ data: null, error: 'Unauthorized' });
  }

  // extract username from query params
  const { username } = req.query;
  if (typeof username !== 'string') {
    return res.status(400).json({ data: null, error: 'Invalid username' });
  }

  // only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      data: null,
      error: `Method ${req.method} Not Allowed`,
    });
  }

  // handle GET req
  try {
    const profile = await ProfileService.getPublicProfile(username);
    if (!profile) {
      return res.status(404).json({ data: null, error: 'User not found' });
    }
    return res.status(200).json({ data: profile, error: null });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      data: null,
      error: 'Failed to fetch user profile',
    });
  }
}
