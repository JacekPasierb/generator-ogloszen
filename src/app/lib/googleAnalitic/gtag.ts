export const GA_MEASUREMENT_ID = "G-EBP2HDV362";
type GtagFn = (...args: unknown[]) => void;

export const pageview = (url: string) => {
  if (typeof window !== "undefined") {
    (window as unknown as { gtag?: GtagFn }).gtag?.("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
