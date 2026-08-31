import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendEmailNotification } from "@/lib/emailNotification";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger } from
"@/components/ui/accordion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Star,
  Wallet,
  UserCheck,
  BookOpen,
  Flame,
  UtensilsCrossed,
  Package,
  ChefHat,
  Leaf,
  ClipboardList,
  Lightbulb,
  type LucideIcon } from
"lucide-react";
import { workshopsData, type WorkshopData } from "@/data/workshopsData";
import WorkshopRegistrationDialog from "@/components/WorkshopRegistrationDialog";


/* ── Icon map for features ── */
const featureIconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "flame": Flame,
  "utensils-crossed": UtensilsCrossed,
  "package": Package,
  "chef-hat": ChefHat,
  "leaf": Leaf,
  "clipboard-list": ClipboardList,
  "lightbulb": Lightbulb
};

/* ── Show only the first workshop (with a set date) ── */
const sortedWorkshops = [workshopsData[0]];

/* ── Draggable Scroll Hook ───────────────────────── */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  const onEnd = () => setIsDragging(false);

  return { ref, onMouseDown, onMouseMove, onMouseUp: onEnd, onMouseLeave: onEnd };
}

/* ── Testimonial Card ────────────────────────────── */
const TestimonialCard = ({
  name,
  stars,
  text




}: {name: string;stars: number;text: string;}) =>
<div className="flex-shrink-0 w-72 md:w-80 bg-card rounded-xl border border-border p-5 space-y-3">
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) =>
    <Star
      key={i}
      size={14}
      className={i < stars ? "fill-primary text-primary" : "text-muted"} />

    )}
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
    <p className="text-sm font-rubik font-bold">{name}</p>
  </div>;


/* ── Workshop Thumbnail (sidebar slider) ─────────── */
const WorkshopThumb = ({
  workshop,
  isActive,
  onClick




}: {workshop: WorkshopData;isActive: boolean;onClick: () => void;}) => {
  const spots = workshop.maxParticipants - workshop.registeredParticipants;
  const soldOut = spots <= 0;

  const img = workshop.image;

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-xl border overflow-hidden text-right transition-all duration-300 cursor-pointer w-48 md:w-64 bg-card ${
      isActive ?
      "shadow-lg border-primary ring-2 ring-primary/30" :
      "shadow-sm border-border opacity-70 hover:opacity-100"}`
      }>
      
      <div className="relative overflow-hidden h-28 md:h-40">
        {img ?
        <img src={img} alt={workshop.title} className="w-full h-full object-cover" /> :

        <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
            <span className="text-4xl">{workshop.emoji}</span>
          </div>
        }
        {soldOut &&
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
            <span className="bg-destructive text-destructive-foreground font-rubik font-bold text-xs px-3 py-0.5 rotate-[-15deg]">
              SOLD OUT
            </span>
          </div>
        }
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="font-rubik font-bold text-sm">{workshop.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} />
          <span>{workshop.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-rubik font-bold text-primary text-xs">{workshop.price}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-rubik ${
          soldOut ?
          "bg-destructive/10 text-destructive" :
          "bg-primary/10 text-primary"}`
          }>
            {soldOut ? "אזל" : `${spots} מקומות`}
          </span>
        </div>
      </div>
    </button>);

};

/* ── Info Bar Item ────────────────────────────────── */
const InfoItem = ({ icon: Icon, label, value }: {icon: any;label: string;value: string;}) =>
<div className="flex-1 flex flex-col items-center justify-center gap-1 px-3 py-4 min-w-0 overflow-hidden">
    <span className="text-xs text-muted-foreground font-rubik">{label}</span>
    <div className="flex items-center gap-1.5 max-w-full">
      <Icon size={15} className="text-primary flex-shrink-0" />
      <span className="font-rubik font-medium text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">{value}</span>
    </div>
  </div>;


/* ── Private Workshops Contact Section ────────── */
const PrivateWorkshopsSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({ title: "שגיאה", description: "נא למלא שם, אימייל וטלפון", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("business_inquiries").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim() || "פנייה לסדנה פרטית",
    });
    setLoading(false);
    if (error) {
      toast({ title: "שגיאה", description: "משהו השתבש, נסו שוב מאוחר יותר", variant: "destructive" });
    } else {
      toast({ title: "תודה!", description: "הפנייה התקבלה, אחזור אליכם בהקדם" });
      sendEmailNotification({ name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim() || "פנייה לסדנה פרטית", form_source: "סדנאות פרטיות" });
      setName(""); setEmail(""); setPhone(""); setMessage("");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-right font-rubik";

  return (
    <div className="bg-secondary/40 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h3 className="text-2xl font-rubik font-bold mb-1 text-center">לסדנאות פרטיות</h3>
        <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed text-center">
          לסדנאות פרטיות לחברות, ימי גיבוש עובדים, ימי הולדת ועוד, השאירו פרטים ואחזור אליכם בהקדם
        </p>
        <div className="bg-card rounded-xl border border-border p-6 md:p-8">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            <input type="tel" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="rtl" />
            <textarea placeholder="הודעה (אופציונלי)" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} resize-none`} />
            <Button type="submit" className="w-full py-4 h-auto text-sm font-rubik font-bold mt-1" disabled={loading}>
              {loading ? "שולח..." : "שליחה"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────── */
const Workshops = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const testimonialsDrag = useDragScroll();

  const active: WorkshopData = sortedWorkshops[activeIdx];
  const spots = active.maxParticipants - active.registeredParticipants;
  const soldOut = spots <= 0;

  const goPrev = () => setActiveIdx((p) => p > 0 ? p - 1 : sortedWorkshops.length - 1);
  const goNext = () => setActiveIdx((p) => p < sortedWorkshops.length - 1 ? p + 1 : 0);

  const scrollTestimonials = (dir: "left" | "right") => {
    const el = testimonialsDrag.ref.current;
    if (!el) return;
    const amount = dir === "left" ? -300 : 300;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div dir="rtl">
      {/* ─── Section 1: Full-Width Hero with Floating Card ───── */}
      <div className="relative w-full min-h-[420px] md:min-h-[520px]">
        {/* Background image */}
        {active.heroImage ?
        <img
          src={active.heroImage}
          alt={active.title}
          className="absolute inset-0 w-full h-full object-cover" /> :


        <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
            <span className="text-[120px]">{active.emoji}</span>
          </div>
        }
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-foreground/20" />

        {/* Bottom gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/65 via-black/30 to-transparent z-[5]" />

        {/* Title + description at bottom */}
        <div className="absolute inset-x-0 bottom-12 z-10 text-center px-4">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4">
            <h1 className="text-3xl md:text-5xl font-rubik font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] mb-1">
              {active.title}
            </h1>
            <p className="text-base md:text-lg text-white/90 font-rubik drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              {active.shortDesc}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goNext}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-foreground/40 hover:bg-foreground/60 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg">
          
          <ChevronLeft size={22} className="text-white" />
        </button>
        <button
          onClick={goPrev}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-foreground/40 hover:bg-foreground/60 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg">
          
          <ChevronRight size={22} className="text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {sortedWorkshops.map((_, i) =>
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i === activeIdx ? "bg-white" : "bg-white/40"}`
            } />

          )}
        </div>
      </div>

      {/* ─── Info Bar ───────────────────────────────── */}
      <div className="bg-background">
        <div className="container mx-auto px-4 -mt-6 md:-mt-8 relative z-20">
          {/* Desktop: horizontal bar */}
          <div className="hidden md:flex bg-card rounded-2xl shadow-lg border border-border overflow-hidden divide-x divide-x-reverse divide-border items-center">
            <InfoItem icon={Wallet} label="עלות" value={`${active.priceNumber.toFixed(2)} ₪`} />
            <InfoItem icon={MapPin} label="מיקום" value={active.location} />
            <InfoItem icon={Clock} label="שעה" value={active.time} />
            <InfoItem icon={Calendar} label="תאריך" value={active.date} />
            <div className="flex items-center justify-center px-6 py-4">
              <Button
                disabled={soldOut}
                className="whitespace-nowrap px-8 py-5 h-auto text-base font-rubik font-bold"
                onClick={() => setRegistrationOpen(true)}>
                
                {soldOut ? "המלאי אזל" : `הרשמה — נותרו ${spots} מקומות`}
              </Button>
            </div>
          </div>

          {/* Mobile: compact layout */}
          <div className="md:hidden bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="grid grid-cols-2 divide-x-reverse divide-x divide-y divide-border">
              {[
              { icon: Calendar, label: "תאריך", value: active.date },
              { icon: Clock, label: "שעה", value: active.time },
              { icon: MapPin, label: "מיקום", value: active.location },
              { icon: Wallet, label: "עלות", value: `${active.priceNumber.toFixed(2)} ₪` }].
              map((item) =>
              <div key={item.label} className="flex flex-col items-center justify-center py-3 min-h-[70px]">
                  <span className="text-xs text-muted-foreground font-rubik">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-rubik font-bold text-sm">{item.value}</span>
                    <item.icon size={16} className="text-primary flex-shrink-0" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border">
              <Button
                disabled={soldOut}
                className="w-full py-5 h-auto text-base font-rubik font-bold"
                onClick={() => setRegistrationOpen(true)}>
                
                {soldOut ? "המלאי אזל" : `הרשמה — נותרו ${spots} מקומות`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── About (white bg) ─────────────────────── */}
      <div className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-2xl font-rubik font-bold mb-1 text-center">אודות הסדנה</h3>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg text-center">
            {active.fullDesc}
          </p>
        </div>
      </div>

      {/* ─── Features (cream bg) ──────────────────── */}
      <div className="bg-secondary/40 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-2xl font-rubik font-bold mb-6">מה הסדנה כוללת</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.features.map((f) => {
              const FeatureIcon = featureIconMap[f.icon] || BookOpen;
              return (
                <div
                  key={f.number}
                  className="flex gap-4 bg-card rounded-xl border border-border p-5">
                  
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <FeatureIcon size={20} />
                </span>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed pt-1.5">
                  {f.text}
                </p>
              </div>);

            })}
          </div>
        </div>
      </div>

      {/* ─── Menu (white bg) — image cards ────────── */}
      <div className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-2xl font-rubik font-bold mb-6">מה אוכלים</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {active.menu.map((item, i) =>
            <div
              key={i}
              className="relative rounded-xl overflow-hidden aspect-square bg-secondary/50 group">
              
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-3">
                  <p className="font-rubik font-medium text-primary-foreground text-sm leading-tight md:text-sm">
                    {item.name}
                  </p>
                  {item.description &&
                <p className="text-primary-foreground/70 text-xs mt-0.5">{item.description}</p>
                }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── FAQ + CTA (white bg) ─────────────────── */}
      <div className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-2xl font-rubik font-bold mb-6">שאלות ותשובות</h3>
          <Accordion type="single" collapsible className="space-y-2">
            {active.faqs.map((faq, i) =>
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl border border-border px-5">
              
                <AccordionTrigger className="text-right font-rubik font-medium text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* Inline CTA after FAQ */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <Button
              disabled={soldOut}
              className="px-10 py-5 h-auto text-base font-rubik font-bold"
              onClick={() => setRegistrationOpen(true)}>
              {soldOut ? "הסדנה מלאה" : "הרשמה לסדנה"}
            </Button>
            {!soldOut &&
              <p className="text-xs text-muted-foreground">
                נותרו {spots} מקומות
              </p>
            }
          </div>
        </div>
      </div>

      {/* ─── Private Workshops Contact (cream bg) ──── */}
      <PrivateWorkshopsSection />

      <WorkshopRegistrationDialog
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
        workshop={active} />
      
    </div>);

};

export default Workshops;