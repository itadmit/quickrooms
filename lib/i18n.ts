// Internationalization (i18n) support

export type Language = 'he' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  he: {
    // Keep Hebrew as default - all existing text
    'app.name': 'Quick Rooms',
    'dashboard.title': 'דשבורד',
    'bookings.title': 'הזמנות',
    'rooms.title': 'חדרים',
    'members.title': 'חברי קהילה',
    'settings.title': 'הגדרות',
  },
  en: {
    'app.name': 'Quick Rooms',
    'dashboard.title': 'Dashboard',
    'bookings.title': 'Bookings',
    'rooms.title': 'Rooms',
    'members.title': 'Members',
    'settings.title': 'Settings',
  },
};

let currentLanguage: Language = 'he';

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }
}

export function getLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language') as Language;
    if (saved) return saved;
  }
  return currentLanguage;
}

export function t(key: string): string {
  const lang = getLanguage();
  return translations[lang][key] || translations['he'][key] || key;
}

// Initialize on client side
if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang) {
    setLanguage(savedLang);
  }
}

