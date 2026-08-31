import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendEmailNotification } from "@/lib/emailNotification";
import instagramLogo from "@/assets/instagram-logo.png";
import LegalModal from "@/components/LegalModal";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Contact = () => {
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
      sendEmailNotification({ name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim(), form_source: "דף צור קשר" });
      setName(""); setEmail(""); setPhone(""); setMessage("");
      setPrivacyAccepted(false); setMarketingOptIn(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right";

  return (
    <div dir="rtl" className="py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-4">צרו קשר</h1>
        <p className="text-center text-muted-foreground mb-12">שאלות, הצעות או סתם רוצים לומר שלום? אשמח לשמוע!</p>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <a
            href="https://www.instagram.com/adi.cohen.fit?igsh=NmVlZjQzdG82Ymlt&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <img src={instagramLogo} alt="Instagram" width={20} height={20} className="rounded-sm" /> adi.cohen.fit
          </a>
          <a href="mailto:adi.cohen0205@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Mail size={20} /> adi.cohen0205@gmail.com
          </a>
          <a
            href="https://wa.me/972529535592"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <WhatsAppIcon size={20} /> WhatsApp
          </a>
        </div>

        <div className="bg-card rounded-xl border border-border p-8">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} aria-label="שם" />
            <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} aria-label="אימייל" />
            <input type="tel" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="rtl" aria-label="טלפון" />
            <textarea placeholder="הודעה" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} resize-none`} aria-label="הודעה" />

            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
                required
                aria-required="true"
              />
              <span>
                קראתי ואני מאשר/ת את{" "}
                <button type="button" onClick={() => setPrivacyOpen(true)} className="underline text-primary hover:text-accent">
                  מדיניות הפרטיות
                </button>
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span>אני מעוניין/ת לקבל עדכונים על סדנאות ותכנים</span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={loading || !privacyAccepted}>
              {loading ? "שולח..." : "שליחה"}
            </Button>
          </form>
        </div>
      </div>
      <LegalModal open={privacyOpen} onOpenChange={setPrivacyOpen} type="privacy" />
    </div>
  );
};

export default Contact;
