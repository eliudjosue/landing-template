declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    plausible?: (...args: any[]) => void;
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Google Analytics 4
export function trackGA4Event(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
}

// Google Tag Manager
export function trackGTMEvent(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'custom_event',
      event_action: event.action,
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
}

// Plausible
export function trackPlausibleEvent(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event.action, {
      props: {
        category: event.category,
        label: event.label,
        value: event.value,
      },
    });
  }
}

// Unified tracking function
export function trackEvent(event: AnalyticsEvent) {
  // Track in all configured platforms
  trackGA4Event(event);
  trackGTMEvent(event);
  trackPlausibleEvent(event);
}

// Specific event for lead submission
export function trackLeadSubmitted() {
  trackEvent({
    action: 'lead_submitted',
    category: 'engagement',
    label: 'contact_form',
  });
}