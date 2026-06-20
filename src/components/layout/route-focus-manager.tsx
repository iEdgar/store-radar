"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MAIN_CONTENT_ID = "main-content";

/**
 * Moves keyboard/screen-reader focus to the main content region on route
 * changes (skipping the initial load), so navigating Dashboard → Store Detail
 * lands focus on the page content (the heading is the first element inside).
 */
export function RouteFocusManager() {
  const pathname = usePathname();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    document.getElementById(MAIN_CONTENT_ID)?.focus();
  }, [pathname]);

  return null;
}
