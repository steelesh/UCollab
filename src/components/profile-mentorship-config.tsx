import { MentorshipStatus } from '@prisma/client';

export const MENTORSHIP_CONFIG = {
  [MentorshipStatus.MENTOR]: {
    label: 'Mentor',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3m9-9V7a2 2 0 0 0-2-2h-2m-2 12v-1a1 1 0 0 1 1-1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1-1 1h-1m-3 0h-1a1 1 0 0 1-1-1v-1" />
          <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2" />
        </g>
      </svg>
    ),
  },
  [MentorshipStatus.MENTEE]: {
    label: 'Currently mentored',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 9l2 2l4-4" />
        </g>
      </svg>
    ),
  },
  [MentorshipStatus.NONE]: {
    label: 'Looking for mentorship',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4.5M19 11V7a2 2 0 0 0-2-2h-2" />
          <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m6 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22" />
        </g>
      </svg>
    ),
  },
} as const;
