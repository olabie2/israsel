// app/i18n/settings.ts

export const fallbackLng = 'en';
export const locales = [fallbackLng, 'he', 'ar', 'ru'];
export const defaultNS = 'common';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: locales,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}