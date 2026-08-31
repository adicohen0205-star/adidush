import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import instagramLogo from "@/assets/instagram-logo.png";
import logoAvatar from "@/assets/logo-avatar.png";
import LegalModal from "@/components/LegalModal";

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <img src={instagramLogo} alt="Instagram" width={size} height={size} className="rounded-sm" />
);

const Footer = () => {
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | "accessibility" | null>(null);

  return (
    <>
      <footer className="border-t border-border pt-8 pb-12 bg-primary-foreground" dir="rtl">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center md:-mt-16">
              <img src={logoAvatar} alt="Adidush - The Foody Nutritionist" className="h-[240px] w-auto object-contain mb-3" />
              <h3 className="text-xl font-bold font-rubik">עדי כהן</h3>
              <p className="text-muted-foreground text-base font-rubik">התזונאית שהיא גם פודית</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">ניווט מהיר</h4>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <Link to="/workshops" className="hover:text-foreground transition-colors">סדנאות אוכל</Link>
                <Link to="/coaching" className="hover:text-foreground transition-colors">ליווי תזונתי</Link>
                
                <a href="https://www.instagram.com/adi.cohen.fit/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">בלוג</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">דברו איתי</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="https://www.instagram.com/adi.cohen.fit?igsh=NmVlZjQzdG82Ymlt&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <InstagramIcon size={16} /> adi.cohen.fit
                </a>
                <a href="mailto:adi.cohen0205@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail size={16} /> adi.cohen0205@gmail.com
                </a>
                <a href="https://wa.me/972529535592" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <WhatsAppIcon size={16} /> WhatsApp
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">מידע משפטי</h4>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <button onClick={() => setLegalModal("terms")} className="text-right hover:text-foreground transition-colors">תקנון</button>
                <button onClick={() => setLegalModal("privacy")} className="text-right hover:text-foreground transition-colors">מדיניות פרטיות</button>
                <button onClick={() => setLegalModal("accessibility")} className="text-right hover:text-foreground transition-colors">הצהרת נגישות</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Adi Cohen. כל הזכויות שמורות.
        </div>
      </footer>
      <LegalModal open={legalModal !== null} onOpenChange={(open) => !open && setLegalModal(null)} type={legalModal ?? "terms"} />
    </>
  );
};

export default Footer;
