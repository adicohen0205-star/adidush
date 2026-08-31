const COOKIE_KEY = "cookie_consent";

export type CookieConsentValue = {
  accepted: boolean;
  timestamp: number;
};

export const getCookieConsent = (): CookieConsentValue | null => {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentValue;
  } catch {
    return null;
  }
};

export const hasAnalyticsConsent = (): boolean => {
  const value = getCookieConsent();
  return value?.accepted === true;
};

export const setCookieConsent = (accepted: boolean) => {
  const value: CookieConsentValue = { accepted, timestamp: Date.now() };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
  // Notify listeners in same tab (storage event only fires cross-tab)
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
};
