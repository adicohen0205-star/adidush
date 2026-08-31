import { useState, useRef } from "react";
import { ArrowLeft, HeartPulse, Apple, BrainCircuit, ChevronLeft, ChevronRight, Star, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";
import coachingHeroImg from "@/assets/coaching-hero.jpg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendEmailNotification } from "@/lib/emailNotification";

const WHATSAPP_NUMBER = "972529535592";
const WHATSAPP_COACHING_MSG = encodeURIComponent("היי עדי! אשמח לקבל פרטים נוספים על תהליך הליווי התזונתי 🙂");

const processSteps = [
{
  icon: <HeartPulse className="w-7 h-7" />,
  title: "ליווי אישי אחד על אחד",
  desc: "פגישות אישיות והתאמה מלאה לאורח החיים שלך, עם ליווי מקצועי לאורך כל הדרך.",
  step: "01",
  color: "bg-[hsl(var(--coaching)/0.1)] text-[hsl(var(--coaching))]"
},
{
  icon: <Apple className="w-7 h-7" />,
  title: "תפריט מותאם עם מתכונים",
  desc: "תפריט בריא, מגוון ופשוט ליישום, כולל מתכונים אמיתיים שמתאימים לחיי היומיום.",
  step: "02",
  color: "bg-[hsl(var(--coaching)/0.1)] text-[hsl(var(--coaching))]"
},
{
  icon: <BrainCircuit className="w-7 h-7" />,
  title: "מערכת ליווי חכמה",
  desc: "מערכת מבוססת AI שתומכת בתהליך, עוזרת לעקוב אחרי ההתקדמות ומספקת דיוק בתוצאות.",
  step: "03",
  color: "bg-[hsl(var(--coaching)/0.1)] text-[hsl(var(--coaching))]"
}];


const testimonials = [
{ name: "נועה מ.", text: "עדי שינתה לי את החיים. לראשונה אני מרגישה שאני אוכלת טוב בלי להרגיש שאני בדיאטה." },
{ name: "יוסי כ.", text: "תהליך מדהים. ירדתי 12 קילו בלי להרגיש שום ויתור, אלא ההפך – גיליתי אוכל טעים שלא הכרתי." },
{ name: "מיכל ד.", text: "הגישה של עדי ייחודית – היא מבינה שאוכל הוא לא רק קלוריות, אלא גם רגש והנאה. ממליצה בחום!" },
{ name: "אורי ש.", text: "אחרי שנים של דיאטות יו-יו, סוף סוף מצאתי גישה שעובדת. התפריטים פשוט מדהימים." },
{ name: "רוני ל.", text: "הליווי האישי עם עדי נתן לי כלים שאני משתמשת בהם כל יום. התוצאות מדברות בעד עצמן." },
{ name: "שירה ב.", text: "כתזונאית שהיא גם פודית, עדי יודעת לחבר בין עולמות. המתכונים שלה פשוט גאוניים." },
{ name: "דניאל ג.", text: "לא האמנתי שאפשר להרזות ועדיין ליהנות מפיצות ולחמים. עדי הוכיחה לי שאפשר." },
{ name: "תמר א.", text: "העבודה עם עדי היא חוויה. היא קשובה, מקצועית ותמיד מגיעה עם רעיונות חדשים ומפתיעים." }];


const faqs = [
{ q: "כמה זמן נמשך תהליך הליווי?", a: "זה תלוי מקרה! תהליך הליווי נמשך בין 3–10 מפגשים. מדובר על פגישה בחודש בממוצע." },
{ q: "מה הליווי כולל?", a: "הליווי שלי כולל פגישות חודשיות, מענה וזמינות מלאה בוואטסאפ להתלבטויות, שאלות והרבה תמיכה!" },
{ q: "איך מתבצע המעקב?", a: "המעקב מתבצע דרך מדידות של משקל, היקפים ואחוזי שומן אצלי בקליניקה — בנוסף בניתי עבורך מערכת נוחה שתעזור לך לנהל ולעקוב אחרי ההתקדמות." },
{ q: "האם הליווי מתאים גם לשמירה על משקל ולא רק להרזיה?", a: "בהחלט. אני עובדת עם לקוחות במגוון מטרות — הרזיה, עלייה במסה, שיפור אנרגיה, ויסות סוכר וכולסטרול, ועוד." },
{ q: "האם יש סבסוד דרך ביטוח בריאות?", a: "ייתכן שכן. מומלץ לבדוק מול קופת החולים או חברת הביטוח הפרטית שלכם — חלק מהמבוטחים זכאים להחזר חלקי או מלא." },
{ q: "האם הפגישות מתקיימות פנים אל פנים או בזום?", a: "שתי האפשרויות זמינות — פגישות פרונטליות באזור מודיעין, או פגישות זום לנוחות מלאה מהבית." }];


const WhatsAppIcon = ({ size = 20 }: {size?: number;}) =>
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>;


const Coaching = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 320;
    carouselRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast({ title: "שגיאה", description: "נא למלא שם וטלפון", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("business_inquiries").insert({
      name: name.trim(),
      email: email.trim() || "לא צוין",
      phone: phone.trim(),
      message: message.trim() || "פנייה מדף ליווי תזונתי"
    });
    setLoading(false);
    if (error) {
      toast({ title: "שגיאה", description: "משהו השתבש, נסו שוב מאוחר יותר", variant: "destructive" });
    } else {
      toast({ title: "תודה!", description: "הפנייה התקבלה, אחזור אליכם תוך 24 שעות" });
      sendEmailNotification({ name: name.trim(), email: email.trim() || "לא צוין", phone: phone.trim(), message: message.trim() || "פנייה מדף ליווי תזונתי", form_source: "ליווי תזונתי" });
      setName("");setPhone("");setEmail("");setMessage("");
    }
  };

  return (
    <div dir="rtl">
      {/* ===== Section 1 — Hero / About ===== */}
      <section className="bg-section-alt" dir="rtl">
        <div className="container mx-auto px-4 py-8 md:py-0">
          <div className="flex flex-col md:flex-row items-center md:items-stretch min-h-[400px] md:min-h-[65vh] gap-0 md:gap-14 lg:gap-20">
            {/* Image side - RIGHT on desktop (first in RTL flow) */}
            <div className="w-full md:w-[42%] flex items-center justify-center relative md:py-20">
              <div className="relative w-full max-w-[400px] md:max-w-none h-full">
                <img
                  src={coachingHeroImg}
                  alt="עדי כהן"
                  className="w-full h-[350px] md:h-full object-cover object-top rounded-2xl md:rounded-3xl" />
                
                {/* Bottom gradient fade - mobile only */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--section-alt))] to-transparent rounded-b-2xl" />
              </div>
            </div>

            {/* Text side - LEFT on desktop */}
            <div className="w-full md:w-[55%] flex flex-col justify-center items-center md:items-start text-center md:text-right py-8 md:py-16">
                <span className="hidden md:block text-sm text-muted-foreground tracking-wide mb-4">ליווי תזונתי</span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl leading-tight mb-3 text-foreground w-full md:text-right">עדי כהן</h1>
                <p className="text-xl md:text-2xl mb-6 font-rubik font-medium w-full md:text-right text-[hsl(var(--coaching))]">התזונאית שהיא גם פודית</p>

                <div className="text-base md:text-lg text-muted-foreground max-w-xl mb-2 leading-relaxed md:text-right space-y-3">
                  <p>דיאטנית קלינית, יוצרת תוכן קולינרי ובוגרת בית ספר לבישולים. בעיני השילוב בין קולינריה לבריאות הוא חלק בלתי נפרד מאורח חיים בריא ומאושר.</p>
                  <p>אני מאמינה שלא צריך לבחור בין אהבה לאוכל לבין חיים בריאים.</p>
                </div>

                <Separator className="bg-border/60 mb-6 max-w-xl" />

                <p className="text-sm font-medium text-foreground mb-4 md:text-right">האני מאמין שלי:</p>
                <div className="space-y-3 mb-8 max-w-xl text-right text-muted-foreground text-sm leading-relaxed">
                  <p>אני מאמינה שהצלחה אמיתית בתהליך תזונתי מגיעה מתוך חופש, יצירתיות, הנאה ואיזון - ודווקא כך נוצרת התמדה שמחזיקה לאורך זמן.</p>
                  <p>תהליך תזונתי לא צריך להרגיש קשה או מתסכל - אלא פשוט, נעים ומותאם לחיים האמיתיים, כזה שאפשר להתמיד בו לאורך זמן ולהרגיש בו בבית.</p>
                  <p>איזון אמיתי לא מגיע מקיצוניות - אלא מהיכולת לתת מקום גם לבריא וגם למה שאנחנו אוהבים, בלי רגשות אשם ובלי מאבק מתמיד.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto md:justify-start">
                  <Button asChild size="lg" className="bg-[hsl(var(--coaching))] hover:bg-[hsl(var(--coaching)/0.85)] text-white font-semibold text-lg px-10 py-6 rounded-full">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_COACHING_MSG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2">
                      
                      לתיאום שיחת היכרות ללא עלות
                      <ArrowLeft className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 3 — Process Steps ===== */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl text-center mb-4 text-muted-foreground">ליווי תזונתי אישי</h2>
              <p className="text-muted-foreground leading-relaxed">
                תהליך אישי המשלב תזונה נכונה, הרגלים בריאים וליווי מקצועי כדי להגיע לתוצאות אמיתיות ולשינוי שנשאר לאורך זמן.
              </p>
            </div>
          </ScrollReveal>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="hidden md:block absolute top-[88px] left-[18%] right-[18%] border-t-2 border-dashed border-coaching/40 z-0" />
            {processSteps.map((c, i) =>
            <ScrollReveal key={i} delay={i * 150}>
                {i < 2 && (
                  <div className="md:hidden w-0 border-r-2 border-dashed border-coaching/40 h-6 mx-auto" />
                )}
                <div className="relative z-10 bg-card rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-center">
                  {/* Icon circle with step badge */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full border-2 border-coaching/40 flex items-center justify-center text-coaching">
                      {c.icon}
                    </div>
                    <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-coaching text-white flex items-center justify-center font-rubik font-bold text-xs shadow-md">
                      {c.step}
                    </div>
                  </div>

                  <span className="text-xs font-rubik font-medium text-coaching">שלב {c.step}</span>
                  <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">{c.title}</h3>
                  <Separator className="bg-border/60 mb-2" />
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ===== Insurance Info Banner ===== */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div
              className="rounded-xl p-5 border flex items-start gap-3"
              style={{
                backgroundColor: "#eef0e7",
                borderColor: "hsl(var(--coaching))"
              }}>
              
              <Lightbulb className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--coaching))" }} />
              <p className="text-foreground text-sm leading-relaxed">
                <strong>יש לך ביטוח בריאות פרטי?</strong> ייתכן שמגיע לך סבסוד משמעותי על תהליך הליווי התזונתי. בדקו מול קופת החולים או חברת הביטוח שלכם.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Section 7 — FAQ Accordion ===== */}
      <section className="py-16 bg-section-alt">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl text-center mb-10 text-muted-foreground">שאלות נפוצות</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) =>
                <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-right text-foreground font-medium">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Section 8 — Contact Form ===== */}
      <section id="contact-form" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-lg">
          <ScrollReveal>
            <h2 className="text-3xl text-center mb-10 text-muted-foreground">השאירו פרטים ואחזור אליכם</h2>
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="שם מלא *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right"
                    required />
                  
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="מספר טלפון *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right"
                    dir="rtl"
                    required />
                  
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="אימייל (אופציונלי)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right" />
                  
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="ספרו לי במה תרצו עזרה (אופציונלי)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-right resize-none" />
                  
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 bg-[hsl(var(--coaching))] hover:bg-[hsl(var(--coaching)/0.85)] text-white" disabled={loading}>
                  {loading ? "שולח..." :
                  <>
                      שליחה
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  }
                </Button>
                <p className="text-center text-xs text-muted-foreground">אחזור אליכם תוך 24 שעות 🕐</p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>);

};

export default Coaching;