import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Minus, Plus } from "lucide-react";
import type { WorkshopData } from "@/data/workshopsData";
import { sendEmailNotification } from "@/lib/emailNotification";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopData;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const WorkshopRegistrationDialog = ({ open, onOpenChange, workshop }: Props) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [participants, setParticipants] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalRendered = useRef(false);

  const totalPrice = workshop.priceNumber * participants;

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("form");
        setFullName("");
        setEmail("");
        setPhone("");
        setParticipants(1);
        paypalRendered.current = false;
      }, 300);
    }
  }, [open]);

  // Load PayPal SDK
  useEffect(() => {
    if (typeof window.paypal !== "undefined") return;
    const existing = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existing) return;

    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=BAAvxG_94As2wz2jKvy5WQuFHAuIXCmvzdFA4xpyLfdzxN_zNU_ZZUjWJDewBi-8sfFFqTl-J86zYdkTl0&components=hosted-buttons&disable-funding=venmo&currency=ILS";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Render PayPal button when on payment step
  useEffect(() => {
    if (step !== "payment") return;
    if (paypalRendered.current) return;

    const renderPayPal = () => {
      if (!window.paypal || !paypalContainerRef.current) {
        setTimeout(renderPayPal, 500);
        return;
      }
      paypalContainerRef.current.innerHTML = "";
      paypalRendered.current = true;
      window.paypal
        .HostedButtons({
          hostedButtonId: "CVPNLQZDV8JL4",
          onApprove: () => {
            handlePaymentSuccess();
          },
        })
        .render(paypalContainerRef.current);
    };

    renderPayPal();
  }, [step]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }
    paypalRendered.current = false;
    setStep("payment");
  };

  const handlePaymentSuccess = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("workshop_registrations").insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        workshop_id: workshop.id,
        workshop_title: workshop.title,
        workshop_date: workshop.date,
        participants_count: participants,
        total_price: totalPrice,
        payment_status: "completed",
      });

      if (error) throw error;
      sendEmailNotification({ name: fullName.trim(), email: email.trim(), phone: phone.trim(), message: `סדנה: ${workshop.title} | ${workshop.date} | ${participants} משתתפים | ₪${totalPrice}`, form_source: "הרשמה לסדנה" });
      setStep("success");
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת ההרשמה. אנא צרו קשר.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-rubik text-xl text-center">
                הרשמה ל{workshop.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground text-center">
                {workshop.date} | {workshop.location}
              </p>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-rubik">שם מלא</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="הכניסו שם מלא"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-rubik">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-rubik">טלפון</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-0000000"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-rubik">מספר משתתפים</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setParticipants((p) => Math.max(1, p - 1))}
                    disabled={participants <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="font-rubik font-bold text-lg w-8 text-center">
                    {participants}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setParticipants((p) => Math.min(10, p + 1))}
                    disabled={participants >= 10}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="bg-secondary/60 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">סה״כ לתשלום</p>
                <p className="text-2xl font-rubik font-bold text-primary">
                  ₪{totalPrice}
                </p>
                <p className="text-xs text-muted-foreground">
                  {participants} משתתפים × ₪{workshop.priceNumber}
                </p>
              </div>

              <Button type="submit" className="w-full text-base py-5 h-auto">
                המשך לתשלום
              </Button>
            </form>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-rubik text-xl text-center">
                תשלום מאובטח
              </DialogTitle>
              <p className="text-sm text-muted-foreground text-center">
                {workshop.title} — {participants} משתתפים — ₪{totalPrice}
              </p>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="bg-secondary/40 rounded-lg p-3 text-sm text-muted-foreground text-center">
                <p>השלימו את התשלום דרך PayPal כדי לאשר את ההרשמה</p>
              </div>

              <div
                ref={paypalContainerRef}
                id="paypal-container-CVPNLQZDV8JL4"
                className="min-h-[150px] flex items-center justify-center"
              />

              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  paypalRendered.current = false;
                  setStep("form");
                }}
              >
                חזרה לטופס
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="mx-auto text-primary" size={64} />
            <h3 className="text-2xl font-rubik font-bold">
              ההרשמה בוצעה בהצלחה!
            </h3>
            <p className="text-muted-foreground">
              פרטי הסדנה נשלחו אליך למייל.
            </p>
            <Button
              className="mt-4"
              onClick={() => onOpenChange(false)}
            >
              סגירה
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopRegistrationDialog;
