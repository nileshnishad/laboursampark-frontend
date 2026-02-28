type UserLike = {
  username?: string;
  fullName?: string;
  name?: string;
  email?: string;
  userType?: string;
  type?: string;
};

const toSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getSafeUsername = (user?: UserLike | null): string => {
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

const getSafeUserType = (user?: UserLike | null, fallback?: 'labour' | 'contractor'): 'labour' | 'contractor' => {
  const rawType = (user?.userType || user?.type || fallback || 'labour').toString().toLowerCase();
  return rawType === 'contractor' ? 'contractor' : 'labour';
};

export const buildUserDashboardPath = (
  user?: UserLike | null,
  fallbackType?: 'labour' | 'contractor'
): string => {
  const username = getSafeUsername(user);
  const userType = getSafeUserType(user, fallbackType);
  return `/user/${username}/${userType}`;
};
