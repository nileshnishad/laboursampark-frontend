"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

const APP_DEEP_LINK = "laboursampark://";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.laboursampark.app&hl=en_IN&pli=1";

interface AppJobActionProps {
  className: string;
  children?: ReactNode;
}

export default function AppJobAction({
  className,
  children = "Know more or apply in app",
}: AppJobActionProps) {
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFallback = useCallback(() => {
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", clearFallback);
    window.addEventListener("pagehide", clearFallback);
    return () => {
      document.removeEventListener("visibilitychange", clearFallback);
      window.removeEventListener("pagehide", clearFallback);
      clearFallback();
    };
  }, [clearFallback]);

  const openApp = () => {
    clearFallback();
    fallbackTimer.current = setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.assign(PLAY_STORE_URL);
      }
    }, 1600);
    window.location.assign(APP_DEEP_LINK);
  };

  return (
    <button
      type="button"
      onClick={openApp}
      className={className}
    >
      {children}
      <ChevronRight size={17} aria-hidden="true" />
    </button>
  );
}
