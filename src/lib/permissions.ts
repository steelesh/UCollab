import { type Role } from '@prisma/client';
import { isDevEnv, isLocalEnv, isProdEnv, isTestEnv } from './utils';

/**
 * permission enum used throughout the app to define access controls
 */
export enum Permission {
  // User Management
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  UPDATE_ANY_USER = 'UPDATE_ANY_USER',
  UPDATE_OWN_USER = 'UPDATE_OWN_USER',
  DELETE_ANY_USER = 'DELETE_ANY_USER',
  DELETE_OWN_USER = 'DELETE_OWN_USER',

  // Profile
  VIEW_ANY_PROFILE = 'VIEW_ANY_PROFILE',
  VIEW_OWN_PROFILE = 'VIEW_OWN_PROFILE',
  UPDATE_ANY_PROFILE = 'UPDATE_ANY_PROFILE',
  UPDATE_OWN_PROFILE = 'UPDATE_OWN_PROFILE',

  // Posts
  VIEW_POSTS = 'VIEW_POSTS',
  CREATE_POST = 'CREATE_POST',
  UPDATE_ANY_POST = 'UPDATE_ANY_POST',
  UPDATE_OWN_POST = 'UPDATE_OWN_POST',
  DELETE_ANY_POST = 'DELETE_ANY_POST',
  DELETE_OWN_POST = 'DELETE_OWN_POST',
  COMMENT_ON_POST = 'COMMENT_ON_POST',

  // Post Technologies
  VIEW_POST_TECHNOLOGIES = 'VIEW_POST_TECHNOLOGIES',
  UPDATE_ANY_POST_TECHNOLOGIES = 'UPDATE_ANY_POST_TECHNOLOGIES',
  UPDATE_OWN_POST_TECHNOLOGIES = 'UPDATE_OWN_POST_TECHNOLOGIES',

  // Comments
  CREATE_COMMENT = 'CREATE_COMMENT',
  UPDATE_ANY_COMMENT = 'UPDATE_ANY_COMMENT',
  UPDATE_OWN_COMMENT = 'UPDATE_OWN_COMMENT',
  DELETE_ANY_COMMENT = 'DELETE_ANY_COMMENT',
  DELETE_OWN_COMMENT = 'DELETE_OWN_COMMENT',

  // Technologies
  VIEW_TECHNOLOGIES = 'VIEW_TECHNOLOGIES',
  CREATE_TECHNOLOGY = 'CREATE_TECHNOLOGY',
  UPDATE_TECHNOLOGY = 'UPDATE_TECHNOLOGY',
  DELETE_TECHNOLOGY = 'DELETE_TECHNOLOGY',
  SUGGEST_TECHNOLOGY = 'SUGGEST_TECHNOLOGY',

  // Skills
  VIEW_SKILLS = 'VIEW_SKILLS',
  CREATE_SKILL = 'CREATE_SKILL',
  UPDATE_SKILL = 'UPDATE_SKILL',
  DELETE_SKILL = 'DELETE_SKILL',
  SUGGEST_SKILL = 'SUGGEST_SKILL',

  // Admin
  ACCESS_ADMIN = 'ACCESS_ADMIN',
  MANAGE_ROLES = 'MANAGE_ROLES',
  BAN_USERS = 'BAN_USERS',

  // Notifications
  VIEW_ANY_NOTIFICATION = 'VIEW_ANY_NOTIFICATION',
  VIEW_OWN_NOTIFICATION = 'VIEW_OWN_NOTIFICATION',
  UPDATE_ANY_NOTIFICATION = 'UPDATE_ANY_NOTIFICATION',
  UPDATE_OWN_NOTIFICATION = 'UPDATE_OWN_NOTIFICATION',
  DELETE_ANY_NOTIFICATION = 'DELETE_ANY_NOTIFICATION',
  DELETE_OWN_NOTIFICATION = 'DELETE_OWN_NOTIFICATION',
  MANAGE_NOTIFICATION_PREFERENCES = 'MANAGE_NOTIFICATION_PREFERENCES',

  // New permissions
  VIEW_USERS_LIST = 'VIEW_USERS_LIST',
  IMPERSONATE_USERS = 'IMPERSONATE_USERS',
}

/**
 * defines what permissions each role has access to
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: Object.values(Permission),
  USER: [
    // User
    Permission.VIEW_USERS,
    Permission.UPDATE_OWN_USER,
    Permission.DELETE_OWN_USER,

    // Profile
    Permission.VIEW_ANY_PROFILE,
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,

    // Posts
    Permission.VIEW_POSTS,
    Permission.CREATE_POST,
    Permission.UPDATE_OWN_POST,
    Permission.DELETE_OWN_POST,
    Permission.COMMENT_ON_POST,

    // Skills
    Permission.VIEW_SKILLS,
    Permission.SUGGEST_SKILL,

    // Technologies
    Permission.VIEW_TECHNOLOGIES,
    Permission.SUGGEST_TECHNOLOGY,

    // Notifications
    Permission.VIEW_OWN_NOTIFICATION,
    Permission.UPDATE_OWN_NOTIFICATION,
    Permission.DELETE_OWN_NOTIFICATION,
    Permission.MANAGE_NOTIFICATION_PREFERENCES,
  ],
};

/**
 * routes that require specific permissions
 */
export const PROTECTED_ROUTES: Record<string, Permission | Permission[]> = {
  '/onboarding': Permission.UPDATE_OWN_USER,
  '/admin': Permission.ACCESS_ADMIN,
  '/posts': Permission.VIEW_POSTS,
  '/collaborations': Permission.VIEW_POSTS,
  '/discussions': Permission.VIEW_POSTS,
  '/feedback': Permission.VIEW_POSTS,
  '/mentorship': Permission.VIEW_POSTS,
  '/post/create': Permission.CREATE_POST,
  '/questions': Permission.VIEW_POSTS,
  '/tags': Permission.VIEW_POSTS,
  '/trending': Permission.VIEW_POSTS,
};

/**
 * routes available per environment
 */
export const ENVIRONMENT_ROUTES = {
  LOCAL_ROUTES: [] as const,

  DEV_ROUTES: [] as const,

  TEST_ROUTES: [] as const,

  PROD_ROUTES: [] as const,
} as const;

/**
 * checks if a route is available in the current environment
 * @param path - the route path to check
 * @returns boolean
 */
export const isEnvironmentRoute = (path: string): boolean => {
  if (isLocalEnv()) {
    return ENVIRONMENT_ROUTES.LOCAL_ROUTES.some((route) =>
      path.startsWith(route),
    );
  }

  if (isDevEnv()) {
    return ENVIRONMENT_ROUTES.DEV_ROUTES.some((route) =>
      path.startsWith(route),
    );
  }

  if (isTestEnv()) {
    return ENVIRONMENT_ROUTES.TEST_ROUTES.some((route) =>
      path.startsWith(route),
    );
  }

  if (isProdEnv()) {
    return ENVIRONMENT_ROUTES.PROD_ROUTES.some((route) =>
      path.startsWith(route),
    );
  }

  return false;
};

/**
 * routes accessible without authentication (public routes)
 */
type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/accessibility',
  '/team',
  '/code-of-conduct',
  '/community-guide',
  '/contributing',
  '/privacy-policy',
  '/terms',
  '/contact',
  '/faq',
] as const;

/**
 * checks if a route is public
 * @param path - the route path to check
 * @returns boolean
 * @example
 * isPublicRoute('/about') // returns true
 * isPublicRoute('/admin') // returns false
 */
export const isPublicRoute = (path: string): boolean => {
  return (
    PUBLIC_ROUTES.includes(path as PublicRoute) ||
    PUBLIC_ROUTES.some((route) => path.startsWith(route))
  );
};

/**
 * gets required permissions for a given route path
 * @param path - the route path to check
 * @returns Permission | Permission[] | null
 * @example
 * getRequiredPermission('/admin/users') // returns Permission.ACCESS_ADMIN
 */
export const getRequiredPermission = (
  path: string,
): Permission | Permission[] | null => {
  if (isPublicRoute(path) || isEnvironmentRoute(path)) {
    return null;
  }

  const route = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    path.startsWith(route),
  );
  return route ? route[1] : null;
};

/**
 * checks if a user has the specified permission(s)
 * @param userRole - the user's role
 * @param permission - single permission or array of permissions to check
 * @returns boolean
 * @example
 * hasPermission('ADMIN', Permission.CREATE_POST) // returns true
 * hasPermission('USER', [Permission.DELETE_ANY_POST]) // returns false
 */
export const hasPermission = (
  userRole: Role | undefined,
  permission: Permission | Permission[],
) => {
  if (!userRole) return false;

  if (Array.isArray(permission)) {
    return permission.every((p) => ROLE_PERMISSIONS[userRole].includes(p));
  }

  return ROLE_PERMISSIONS[userRole].includes(permission);
};

/**
 * checks if a user has one of the allowed roles
 * @param userRole - the user's role
 * @param allowedRoles - array of roles to check against
 * @returns boolean
 * @example
 * hasRole('ADMIN', ['ADMIN', 'MODERATOR']) // returns true
 */
export const hasRole = (userRole: Role | undefined, allowedRoles: Role[]) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
