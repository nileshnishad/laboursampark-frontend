"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUserProfile, setToken } from "@/store/slices/authSlice";
import { getToken as getStoredToken } from "@/lib/api-service";
import {
  getSafeUserType,
  getSafeUsername,
  isUserDashboardPath,
  normalizeUserRole,
} from "@/lib/user-route";

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (token) {
      setIsCheckingAuth(false);
      return;
    }

    const persistedToken = getStoredToken();
    if (persistedToken) {
      dispatch(setToken(persistedToken));
    } else {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }

    setIsCheckingAuth(false);
  }, [token, dispatch, router, pathname]);

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchUserProfile());
  }, [token, dispatch]);

  // Strict role guard: ensure URL userType and username match authentic logged-in user
  useEffect(() => {
    if (!user) return;
    const actualRole = getSafeUserType(user);
    if (!actualRole) return;

    if (isUserDashboardPath(pathname)) {
      const segments = pathname.split('/');
      // Path format: ['', 'user', username, userType, ...rest]
      if (segments.length >= 4 && segments[1] === 'user') {
        const routeRole = segments[3];
        const normalizedRouteRole = normalizeUserRole(routeRole);
        const safeUsername = getSafeUsername(user);

        let needsCorrection = false;

        if (normalizedRouteRole !== actualRole) {
          segments[3] = actualRole;
          needsCorrection = true;
        }

        if (segments[2] && segments[2] !== safeUsername && segments[2] !== 'profile') {
          segments[2] = safeUsername;
          needsCorrection = true;
        }

        if (needsCorrection) {
          router.replace(segments.join('/'));
        }
      }
    }
  }, [user, pathname, router]);

  if (isCheckingAuth) {
    return null;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
