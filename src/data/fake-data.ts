import { AvatarSource, PostType, NotificationType, OnboardingStep, Role, MentorshipStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeAccount() {
  return {
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    providerAccountId: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
  };
}
export function fakeAccountComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    providerAccountId: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
  };
}
export function fakeUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    fullName: faker.datatype.boolean(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatarGitHub(),
    azureAdId: faker.string.uuid(),
    gradYear: undefined,
    githubProfile: undefined,
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdDate: faker.date.past({ years: 1 }),
    lastLogin: faker.date.recent({ days: 7 }),
    fullName: faker.datatype.boolean(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatarGitHub(),
    avatarSource: AvatarSource.DEFAULT,
    azureAdId: faker.string.uuid(),
    onboardingStep: OnboardingStep.STEP_ONE,
    role: Role.USER,
    gradYear: undefined,
    githubProfile: undefined,
    mentorship: MentorshipStatus.NONE,
  };
}
export function fakeProfile() {
  return {
    lastModifiedDate: faker.date.recent(),
    gradYear: faker.number.int({ min: 2023, max: 2030 }),
    bio: faker.person.bio(),
    githubProfile: undefined,
  };
}
export function fakeProfileComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    lastModifiedDate: faker.date.recent(),
    gradYear: faker.number.int({ min: 2023, max: 2030 }),
    bio: faker.person.bio(),
    githubProfile: undefined,
  };
}
export function fakePost() {
  return {
    lastModifiedDate: faker.date.recent(),
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    postType: faker.helpers.arrayElement([PostType.CONTRIBUTION, PostType.FEEDBACK, PostType.DISCUSSION] as const),
    githubRepo: undefined,
  };
}
export function fakePostComplete() {
  return {
    id: faker.string.uuid(),
    createdDate: faker.date.past({ years: 1 }),
    lastModifiedDate: faker.date.recent(),
    title: faker.lorem.words(5),
    description: faker.lorem.words(5),
    postType: faker.helpers.arrayElement([PostType.CONTRIBUTION, PostType.FEEDBACK, PostType.DISCUSSION] as const),
    githubRepo: undefined,
    createdById: faker.string.uuid(),
  };
}
export function fakeSkill() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeSkillComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    verified: false,
    createdDate: new Date(),
    profileId: undefined,
    createdById: faker.string.uuid(),
  };
}
export function fakeTechnology() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeTechnologyComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    verified: false,
    createdDate: new Date(),
    postId: undefined,
    createdById: faker.string.uuid(),
  };
}
export function fakeComment() {
  return {
    lastModifiedDate: faker.date.recent(),
    content: faker.lorem.words(5),
  };
}
export function fakeCommentComplete() {
  return {
    id: faker.string.uuid(),
    postId: faker.string.uuid(),
    createdById: faker.string.uuid(),
    createdDate: faker.date.recent({ days: 30 }),
    lastModifiedDate: faker.date.recent(),
    content: faker.lorem.words(5),
  };
}
export function fakeNotificationPreferencesComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    enabled: faker.datatype.boolean(),
    allowComments: faker.datatype.boolean(),
    allowMentions: faker.datatype.boolean(),
    allowPostUpdates: faker.datatype.boolean(),
    allowSystem: faker.datatype.boolean(),
  };
}
export function fakeNotification() {
  return {
    message: faker.lorem.words(5),
    type: faker.helpers.arrayElement([NotificationType.COMMENT, NotificationType.MENTION, NotificationType.POST_UPDATE, NotificationType.SYSTEM] as const),
  };
}
export function fakeNotificationComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    message: faker.lorem.words(5),
    createdDate: new Date(),
    isRead: false,
    type: faker.helpers.arrayElement([NotificationType.COMMENT, NotificationType.MENTION, NotificationType.POST_UPDATE, NotificationType.SYSTEM] as const),
    postId: undefined,
    commentId: undefined,
    triggeredById: undefined,
  };
}
export function fakeSession() {
  return {
    sessionToken: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeSessionComplete() {
  return {
    id: faker.string.uuid(),
    sessionToken: faker.lorem.words(5),
    userId: faker.string.uuid(),
    expires: faker.date.anytime(),
  };
}
