import { useState, useEffect } from "react";
import LegalModal from "./LegalModal";
import { getCookieConsent, setCookieConsent } from "@/lib/analyticsConsent";

const CONSENT_DAYS = 180;

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    const stored = getCookieConsent();
    if (stored) {
      const daysPassed = (Date.now() - stored.timestamp) / (1000 * 60 * 60 * 24);
      if (daysPassed < CONSENT_DAYS) return;
    }
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setVisible(false);
  };

  const handleReject = () => {
    setCookieConsent(false);
    setVisible(false);
  };

  return (
    <>
      <LegalModal open={privacyOpen} onOpenChange={setPrivacyOpen} type="privacy" />
      {visible && (
        <div
          dir="rtl"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50 rounded-2xl border border-border bg-card p-5 shadow-xl"
          style={{ animation: "slide-up 0.4s ease-out forwards" }}
        >
          <h3 id="cookie-consent-title" className="text-base font-rubik font-bold text-foreground mb-2">
            עוגיות, אבל לא בתנור! 🍪
          </h3>
          <p id="cookie-consent-desc" className="text-sm font-assistant text-muted-foreground leading-relaxed mb-4">
            "גם אצלנו יש עוגיות" (cookies) כדי לשפר את חוויית הגלישה שלכם ולהפוך אותה לנעימה יותר.
            תוכלו לאשר את ההגדרות, לדחות אותן, או לקרוא עוד.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAccept}
              className="flex-1 min-w-[90px] rounded-lg bg-primary px-3 py-2 text-sm font-rubik font-medium text-primary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              מאשר/ת
            </button>
            <button
              onClick={handleReject}
              className="flex-1 min-w-[90px] rounded-lg border border-border bg-background px-3 py-2 text-sm font-rubik font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              דחייה
            </button>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="flex-1 min-w-[90px] rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-rubik font-medium text-secondary-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              מידע נוסף
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
