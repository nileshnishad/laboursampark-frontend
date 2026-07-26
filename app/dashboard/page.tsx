"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { buildUserDashboardPath } from "@/lib/user-route";
import { fetchUserProfile } from "@/store/slices/authSlice";
import { getToken as getStoredToken } from "@/lib/api-service";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const hasToken = Boolean(token || getStoredToken());

    if (!hasToken) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    if (user) {
      router.replace(buildUserDashboardPath(user));
      return;
    }

    dispatch(fetchUserProfile());
  }, [dispatch, router, token, user, pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">Loading your dashboard...</p>
        <p className="mt-2 text-sm text-gray-600">Please wait while we confirm your session.</p>
      </div>
    </div>
  );
}
