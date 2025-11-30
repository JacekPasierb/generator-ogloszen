// app/AnalyticsTracker.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pageview } from "./lib/googleAnalitic/gtag";


const AnalyticsTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Wysyłamy pageview do GA4
    pageview(pathname);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
