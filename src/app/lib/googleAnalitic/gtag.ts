export const GA_MEASUREMENT_ID = "G-EBP2HDV362";

export const pageview = (url: string) => {
  if (typeof window !== "undefined") {
    window.gtag?.("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
