'use client';

import { useEffect } from 'react';
import { initGoogleAnalytics, initGTM, initPlausible } from '@/lib/analytics';

export default function AnalyticsProvider() {
  useEffect(() => {
    initGoogleAnalytics();
    initGTM();
    initPlausible();
  }, []);

  return (
    <>
      {/* GTM noscript fallback */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
    </>
  );
}