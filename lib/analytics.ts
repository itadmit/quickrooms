// Google Analytics integration

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: path,
    });
  }
}

export function trackBooking(action: 'created' | 'cancelled' | 'completed', value?: number) {
  trackEvent(action, 'Booking', undefined, value);
}

export function trackPayment(action: 'initiated' | 'completed' | 'failed', value?: number) {
  trackEvent(action, 'Payment', undefined, value);
}

