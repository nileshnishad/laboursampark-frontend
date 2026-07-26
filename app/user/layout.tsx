"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUserProfile, setToken } from "@/store/slices/authSlice";
import { getToken as getStoredToken } from "@/lib/api-service";

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
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

  if (isCheckingAuth) {
    return null;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
