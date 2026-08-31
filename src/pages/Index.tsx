import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Calendar, MapPin, Heart, Apple, ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/HeroSection";
import BusinessContactForm from "@/components/BusinessContactForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendEmailNotification } from "@/lib/emailNotification";

import { workshopsData } from "@/data/workshopsData";
import comingSoonImage from "@/assets/pizza-coming-soon.jpg";

const activeWorkshop = workshopsData[0]; // The one with a set date

const Index = () => {
  const navigate = useNavigate();
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyName, setNotifyName] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyName.trim() || !notifyEmail.trim()) {
      toast({ title: "שגיאה", description: "נא למלא שם ואימייל", variant: "destructive" });
      return;
    }
    setNotifyLoading(true);
    const { error } = await supabase.from("workshop_notifications").insert({
      name: notifyName.trim(),
      email: notifyEmail.trim(),
      phone: notifyPhone.trim() || null,
    });
    setNotifyLoading(false);
    if (error) {
      toast({ title: "שגיאה", description: "משהו השתבש, נסו שוב מאוחר יותר", variant: "destructive" });
    } else {
      toast({ title: "תודה! 🎉", description: "נעדכן אותך ברגע שייפתח תאריך חדש" });
      sendEmailNotification({
        name: notifyName.trim(),
        email: notifyEmail.trim(),
        phone: notifyPhone.trim(),
        message: "בקשה לעדכון על סדנה חדשה",
        form_source: "עדכנו אותי - סדנאות",
      });
      setNotifyName("");
      setNotifyEmail("");
      setNotifyPhone("");
      setNotifyOpen(false);
    }
  };

  const availableSpots = activeWorkshop.maxParticipants - activeWorkshop.registeredParticipants;
  const isSoldOut = availableSpots <= 0;

  return (
    <div dir="rtl">
      {/* Hero Section */}
      <HeroSection />

      {/* Workshops */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl text-muted-foreground mb-3">סדנאות קרובות</h2>
              <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Card 1 — Active Workshop */}
            <ScrollReveal>
              <div
                onClick={() => navigate(`/workshops/${activeWorkshop.id}`)}
                className="relative bg-card rounded-xl overflow-hidden border border-muted shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={activeWorkshop.image} alt={activeWorkshop.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center space-y-2">
                  <h3 className="text-xl font-semibold">{activeWorkshop.title}</h3>
                  <p className="text-muted-foreground text-sm">{activeWorkshop.shortDesc}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-1">
                    <Calendar size={14} />
                    <span>{activeWorkshop.date}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{activeWorkshop.location}</span>
                  </div>
                  <Button
                    className="w-full mt-3"
                    disabled={isSoldOut}
                    variant={isSoldOut ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/workshops/${activeWorkshop.id}`);
                    }}
                  >
                    {isSoldOut ? "אזל המלאי" : `נותרו ${availableSpots} מקומות`}
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 — Notify Me */}
            <ScrollReveal delay={150}>
              <div className="relative bg-card rounded-xl overflow-hidden border border-muted shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={comingSoonImage} alt="סדנת פיצה נוספת בקרוב" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 text-center space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">סדנת פיצה נוספת בקרוב</h3>
                    <p className="text-muted-foreground text-sm">התאריך עדיין לא נקבע</p>
                    <p className="text-muted-foreground text-xs">השאירו פרטים ונעדכן אתכם ראשונים!</p>
                  </div>
                  <Button
                    className="w-full mt-3 gap-2"
                    onClick={() => setNotifyOpen(true)}
                  >
                    <Bell size={16} />
                    עדכנו אותי
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Private / Business workshop CTA */}
          <ScrollReveal delay={500}>
            <div className="text-center mt-10 space-y-2">
              <p className="text-sm text-muted-foreground">רוצים לתאם סדנה פרטית או עסקית?</p>
              <Button
                variant="link"
                className="text-primary gap-1"
                onClick={() => {
                  const el = document.querySelector('#business-contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                צרו קשר לפרטים נוספים
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Notify Me Dialog */}
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">עדכנו אותי 🔔</DialogTitle>
            <DialogDescription className="text-center">
              השאירו פרטים ונעדכן אתכם כשייפתח תאריך לסדנה הבאה
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNotifySubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="notify-name">שם מלא *</Label>
              <Input id="notify-name" value={notifyName} onChange={(e) => setNotifyName(e.target.value)} placeholder="השם שלך" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notify-email">אימייל *</Label>
              <Input id="notify-email" type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="your@email.com" dir="ltr" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notify-phone">טלפון (אופציונלי)</Label>
              <Input id="notify-phone" type="tel" value={notifyPhone} onChange={(e) => setNotifyPhone(e.target.value)} placeholder="050-0000000" dir="ltr" />
            </div>
            <Button type="submit" className="w-full" disabled={notifyLoading}>
              {notifyLoading ? "שולח..." : "שלחו לי עדכון"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Coaching */}
      <section className="py-16 bg-section-alt">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl text-center mb-3 text-muted-foreground">ליווי תזונתי אישי</h2>
              <div className="w-16 h-1 bg-coaching rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                לאכול נכון, להרגיש טוב - בלי לוותר על אהבה לאוכל.
                {"\n"}
                הלווי שלי כולל תפריט מקצועי, אוכל טוב ומגוון - כזה שמתאים לסגנון החיים שלכם.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div
              onClick={() => navigate("/coaching")}
              className="relative bg-card rounded-xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 cursor-pointer mb-10 max-w-4xl mx-auto"
            >
              {/* Desktop: horizontal layout */}
              <div className="hidden md:flex items-start justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-10 left-[20%] right-[20%] h-0.5 bg-coaching/30 z-0" />

                {[
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: "ליווי אישי צמוד",
                    desc: "פגישות ממוקדות שמתאימות את התזונה לחיים שלך, עם זמינות מלאה וליווי מלא שלי לאורך כל התהליך.",
                    step: "01"
                  },
                  {
                    icon: <Apple className="w-6 h-6" />,
                    title: "תפריט שכיף לאכול",
                    desc: "תפריט שעובד - אבל גם כזה שכיף לאכול עם גיוון ענק, קל ליישום וכולל ארוחות שמתאימות לחיי היום יום שלך.",
                    step: "02"
                  },
                  {
                    icon: <PieChart className="w-6 h-6" />,
                    title: "אפליקציית FoodyPal",
                    desc: "אפליקציה חכמה שביניתי הכוללת חישוב קלוריות של מאות מוצרי מזון, יומן אכילה וטכנולוגיה שלמה שתעזור לך להגיע למטרה.",
                    step: "03"
                  }
                ].map((c, i) => (
                  <div key={i} className="relative z-10 flex-1 text-center px-4">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="w-20 h-20 rounded-full border-2 border-coaching/40 bg-card flex items-center justify-center text-coaching">
                        {c.icon}
                      </div>
                      <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-coaching text-white flex items-center justify-center font-rubik font-bold text-xs shadow-md">
                        {c.step}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{c.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* Mobile: vertical layout with connecting line */}
              <div className="md:hidden relative">
                <div className="absolute top-10 bottom-10 right-10 w-0.5 bg-coaching/30 z-0" />

                {[
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: "ליווי אישי צמוד",
                    desc: "פגישות ממוקדות שמתאימות את התזונה לחיים שלך, עם זמינות מלאה וליווי מלא שלי לאורך כל התהליך.",
                    step: "01"
                  },
                  {
                    icon: <Apple className="w-6 h-6" />,
                    title: "תפריט שכיף לאכול",
                    desc: "תפריט שעובד - אבל גם כזה שכיף לאכול עם גיוון ענק, קל ליישום וכולל ארוחות שמתאימות לחיי היום יום שלך.",
                    step: "02"
                  },
                  {
                    icon: <PieChart className="w-6 h-6" />,
                    title: "אפליקציית FoodyPal",
                    desc: "אפליקציה חכמה שביניתי הכוללת חישוב קלוריות של מאות מוצרי מזון, יומן אכילה וטכנולוגיה שלמה שתעזור לך להגיע למטרה.",
                    step: "03"
                  }
                ].map((c, i) => (
                  <div key={i} className="relative z-10 flex items-start gap-4 mb-8 last:mb-0">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full border-2 border-coaching/40 bg-card flex items-center justify-center text-coaching">
                        {c.icon}
                      </div>
                      <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-coaching text-white flex items-center justify-center font-rubik font-bold text-xs shadow-md">
                        {c.step}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{c.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={450}>
            <div className="text-center">
              <Button asChild size="lg" className="bg-coaching hover:bg-coaching/90 text-white px-12 py-6 text-lg rounded-xl">
                <Link to="/coaching" className="gap-2">
                  לפרטים על תוכנית הליווי
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Business Contact Form */}
      <section id="business-contact" className="py-16 bg-speckle">
        <div className="container mx-auto px-4 max-w-md text-center">
          <ScrollReveal>
            <h2 className="text-3xl mb-4 text-muted-foreground">פניות עסקיות</h2>
            <p className="mb-8 text-secondary-foreground">מעוניינים בשיתוף פעולה, הרצאה או סדנה? מלאו את הטופס ואחזור אליכם בהקדם.</p>
            <BusinessContactForm />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
