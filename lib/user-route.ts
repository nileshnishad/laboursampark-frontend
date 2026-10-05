export type CanonicalUserType = 'labour' | 'contractor' | 'sub_contractor';

export type UserLike = {
  username?: string;
  fullName?: string;
  name?: string;
  email?: string;
  userType?: string;
  type?: string;
  role?: string;
};

export const toSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getSafeUsername = (user?: UserLike | null): string => {
  if (!user) {
    return 'profile';
  }

  const source =
    user.username ||
    user.fullName ||
    user.name ||
    user.email?.split('@')[0] ||
    'profile';

  const slug = toSlug(source);
  return slug || 'profile';
};

/**
 * Normalizes any role representation into one of the 3 canonical roles:
 * - 'labour'
 * - 'contractor'
 * - 'sub_contractor'
 * Returns null if the role cannot be recognized.
 */
export const normalizeUserRole = (type?: any): CanonicalUserType | null => {
  if (!type) return null;
  const raw = String(type).trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (raw === 'subcontractor' || raw === 'subcontract') {
    return 'sub_contractor';
  }
  if (raw === 'contractor' || raw === 'contractors') {
    return 'contractor';
  }
  if (raw === 'labour' || raw === 'labor' || raw === 'worker' || raw === 'labours' || raw === 'labourer') {
    return 'labour';
  }
  return null;
};

export const getSafeUserType = (
  user?: UserLike | null,
  fallback?: CanonicalUserType
): CanonicalUserType => {
  const fromUserType = normalizeUserRole(user?.userType);
  if (fromUserType) return fromUserType;

  const fromType = normalizeUserRole(user?.type);
  if (fromType) return fromType;

  const fromRole = normalizeUserRole(user?.role);
  if (fromRole) return fromRole;

  const fromFallback = normalizeUserRole(fallback);
  if (fromFallback) return fromFallback;

  return 'labour';
};

export const buildUserDashboardPath = (
  user?: UserLike | null,
  fallbackType?: CanonicalUserType
): string => {
  const username = getSafeUsername(user);
  const userType = getSafeUserType(user, fallbackType);
  return `/user/${username}/${userType}`;
};

/**
 * Checks whether a given path is an internal dashboard path (/user/...)
 */
export const isUserDashboardPath = (path?: string | null): boolean => {
  if (!path) return false;
  return path.startsWith('/user/');
};

/**
 * Extracts and normalizes the userType from a dashboard path like /user/:username/:userType/*
 */
export const extractUserTypeFromPath = (path?: string | null): CanonicalUserType | null => {
  if (!path) return null;
  const match = path.match(/^\/user\/[^/]+\/([^/?#]+)/);
  if (match && match[1]) {
    return normalizeUserRole(match[1]);
  }
  return null;
};
