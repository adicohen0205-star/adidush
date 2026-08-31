import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendEmailNotification } from "@/lib/emailNotification";
import LegalModal from "@/components/LegalModal";

const BusinessContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "שגיאה", description: "נא למלא שם, אימייל והודעה", variant: "destructive" });
      return;
    }
    if (!privacyAccepted) {
      toast({ title: "שגיאה", description: "יש לאשר את מדיניות הפרטיות", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("business_inquiries").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim(),
      marketing_opt_in: marketingOptIn,
    });
    setLoading(false);
    if (error) {
      toast({ title: "שגיאה", description: "משהו השתבש, נסו שוב מאוחר יותר", variant: "destructive" });
    } else {
      toast({ title: "תודה!", description: "הפנייה התקבלה, אחזור אליכם בהקדם" });
      sendEmailNotification({ name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim(), form_source: "פניות עסקיות" });
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setPrivacyAccepted(false);
      setMarketingOptIn(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border-0 bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold text-right";

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} aria-label="שם" />
        <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} aria-label="אימייל" />
        <input type="tel" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="rtl" aria-label="טלפון" />
        <textarea placeholder="הודעה" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} resize-none`} aria-label="הודעה" />

        <label className="flex items-start gap-2 text-xs text-primary-foreground/90 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold focus-visible:ring-2 focus-visible:ring-gold"
            required
            aria-required="true"
          />
          <span>
            קראתי ואני מאשר/ת את{" "}
            <button type="button" onClick={() => setPrivacyOpen(true)} className="underline hover:text-gold">
              מדיניות הפרטיות
            </button>
          </span>
        </label>

        <label className="flex items-start gap-2 text-xs text-primary-foreground/90 cursor-pointer">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold focus-visible:ring-2 focus-visible:ring-gold"
          />
          <span>אני מעוניין/ת לקבל עדכונים על סדנאות ותכנים</span>
        </label>

        <Button type="submit" size="lg" className="bg-foreground text-primary-foreground hover:bg-foreground/90" disabled={loading || !privacyAccepted}>
          {loading ? "שולח..." : "שליחה"}
        </Button>
      </form>
      <LegalModal open={privacyOpen} onOpenChange={setPrivacyOpen} type="privacy" />
    </>
  );
};

export default BusinessContactForm;
