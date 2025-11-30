// app/AnalyticsTracker.tsx
"use client";

import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import { pageview } from "./lib/googleAnalitic/gtag";


const AnalyticsTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    pageview(url);
  }, [pathname, searchParams]);

  return null;
};

export default AnalyticsTracker;
