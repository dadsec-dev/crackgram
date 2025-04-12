"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Use environment variable for Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.gtag && pathname && GA_MEASUREMENT_ID) {
      // Create URL from pathname and searchParams
      let url = pathname;
      if (searchParams?.toString()) {
        url += `?${searchParams.toString()}`;
      }
      
      // Send pageview
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Only render the Scripts if a Measurement ID is available
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Helper function to track events
export function trackEvent(action: string, category: string, label: string, value?: number) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (typeof window !== "undefined" && window.gtag && measurementId) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Add this to global.d.ts or declare it here
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any> | undefined
    ) => void;
  }
} 