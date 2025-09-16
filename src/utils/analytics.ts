// Google Analytics utility functions

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found');
    return;
  }

  // Create script tags for Google Analytics
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_TRACKING_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `;
  document.head.appendChild(script2);
};

// Track page views
export const trackPageView = (page_path: string, page_title?: string) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path,
    page_title: page_title || document.title,
  });
};

// Track custom events
export const trackEvent = (action: string, category?: string, label?: string, value?: number) => {
  if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track specific portfolio events
export const trackPortfolioEvent = {
  // Navigation tracking
  navigation: (section: string) => {
    trackEvent('navigate', 'navigation', section);
  },

  // Contact form submission
  contactFormSubmit: () => {
    trackEvent('submit', 'contact_form', 'portfolio_contact');
  },

  // Project view
  projectView: (projectName: string) => {
    trackEvent('view', 'project', projectName);
  },

  // Language change
  languageChange: (language: string) => {
    trackEvent('change', 'language', language);
  },

  // Theme toggle
  themeToggle: (theme: string) => {
    trackEvent('toggle', 'theme', theme);
  },

  // CV download (if you add this feature)
  cvDownload: () => {
    trackEvent('download', 'cv', 'portfolio_cv');
  },

  // CV download with specific version
  cvDownloadSpecific: (filename: string) => {
    trackEvent('download', 'cv', filename);
  },

  // Social link clicks
  socialClick: (platform: string) => {
    trackEvent('click', 'social', platform);
  },
};
