import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "terms" | "privacy" | "accessibility";
}

const AccessibilityContent = () => (
  <div className="space-y-4 text-sm leading-relaxed" dir="rtl">
    <p>אתר זה רואה חשיבות רבה במתן שירות שוויוני ונגיש לכלל המשתמשים, לרבות אנשים עם מוגבלות, ופועל להנגשת האתר.</p>

    <h3 className="font-semibold text-base mt-6">רמת הנגישות:</h3>
    <p>האתר נבנה בהתאם להנחיות תקן ישראלי 5568 המבוסס על הנחיות WCAG 2.0 ברמה AA, ככל הניתן.</p>

    <h3 className="font-semibold text-base mt-6">מה נעשה באתר לצורך הנגשה:</h3>
    <ul className="list-disc pr-6 space-y-1">
      <li>התאמת האתר לגלישה באמצעות קורא מסך</li>
      <li>אפשרות ניווט מלא באמצעות המקלדת</li>
      <li>טקסט חלופי (alt) לתמונות</li>
      <li>שמירה על ניגודיות צבעים תקינה</li>
      <li>רכיב נגישות המאפשר התאמות תצוגה: הגדלת טקסט, ניגודיות, הדגשת קישורים, עצירת אנימציות ועוד</li>
    </ul>

    <h3 className="font-semibold text-base mt-6">הסתייגות:</h3>
    <p>למרות מאמצינו להנגיש את כל חלקי האתר, ייתכן שחלקים מסוימים טרם הונגשו במלואם. אנו ממשיכים לפעול לשיפור הנגישות באופן שוטף.</p>

    <h3 className="font-semibold text-base mt-6">פרטי רכז/ת הנגישות:</h3>
    <p>נתקלת בקושי או בבעיית נגישות? נשמח שתפנה/י אלינו ונטפל בכך בהקדם:</p>
    <p>שם: עדי כהן</p>
    <p>דוא"ל: <a href="mailto:Adi.cohen0205@gmail.com" className="text-primary hover:underline">Adi.cohen0205@gmail.com</a></p>

    <p className="text-muted-foreground mt-6">תאריך עדכון ההצהרה: 14.07.2026</p>
  </div>
);

const TermsContent = () => (
  <div className="space-y-4 text-sm leading-relaxed" dir="rtl">
    <h3 className="font-semibold text-base mt-2">פרטי העסק:</h3>
    <p>שם: עדי כהן</p>
    <p>עוסק מורשה מס': 205648041</p>
    <p>דוא"ל ליצירת קשר: <a href="mailto:Adi.cohen0205@gmail.com" className="text-primary hover:underline">Adi.cohen0205@gmail.com</a></p>

    <h3 className="font-semibold text-base mt-6">כללי:</h3>
    <p>תנאים אלה חלים על השימוש באתר זה. עצם השימוש באתר מהווה הסכמה לתנאים.</p>

    <h3 className="font-semibold text-base mt-6">אופי האתר:</h3>
    <p>אתר זה הוא אתר מידע ויצירת קשר עבור סדנאות בישול וליווי תזונתי. ההרשמה והתשלום לשירותים מתבצעים ישירות מול העסק ולא דרך האתר.</p>

    <h3 className="font-semibold text-base mt-6">הבהרה רפואית חשובה:</h3>
    <p>התכנים, ההמלצות והליווי התזונתי הם בעלי אופי כללי ואינם מהווים ייעוץ רפואי או תחליף לו. בכל מצב רפואי, מגבלה בריאותית או צורך תזונתי מיוחד, יש להיוועץ ברופא/ה או באיש/ת מקצוע מוסמך/ת לפני יישום.</p>

    <h3 className="font-semibold text-base mt-6">קניין רוחני:</h3>
    <p>כל התכנים, התמונות והחומרים באתר הם קניינו של העסק. אין להעתיק, להפיץ או לעשות בהם שימוש ללא אישור.</p>

    <p className="text-muted-foreground mt-6">עדכון אחרון: 14.07.2026</p>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-4 text-sm leading-relaxed" dir="rtl">
    <h3 className="font-semibold text-base mt-2">כללי:</h3>
    <p>אתר זה מכבד את פרטיותך. מדיניות זו מסבירה איזה מידע נאסף, לשם מה, וכיצד אנו שומרים עליו.</p>

    <h3 className="font-semibold text-base mt-6">איזה מידע נאסף:</h3>
    <ul className="list-disc pr-6 space-y-1">
      <li>פרטים שאתה מוסר ביוזמתך בטופס "פניות עסקיות": שם, כתובת דוא"ל, מספר טלפון והודעה חופשית.</li>
      <li>מידע על השימוש באתר הנאסף באופן אוטומטי באמצעות כלי ניתוח (אם מותקן), כגון עמודים שנצפו וזמני גלישה.</li>
    </ul>
    <p>שים/י לב: שדה ההודעה הוא טקסט חופשי. נא להימנע מהזנת מידע רפואי רגיש. המידע שתמסור/י משמש אך ורק למענה לפנייתך.</p>

    <h3 className="font-semibold text-base mt-6">לשם מה המידע נאסף:</h3>
    <ul className="list-disc pr-6 space-y-1">
      <li>מענה לפניות ויצירת קשר</li>
      <li>תיאום והרשמה לסדנאות בישול וללווי תזונתי</li>
      <li>שיפור האתר והשירות</li>
    </ul>

    <h3 className="font-semibold text-base mt-6">עם מי המידע משותף:</h3>
    <p>המידע נמסר לספקי שירות המסייעים בהפעלת האתר בלבד, כגון שירות אחסון האתר וכלי ניתוח (אם קיים). איננו מוכרים ואיננו מעבירים את המידע לצדדים שלישיים לצרכים שיווקיים.</p>

    <h3 className="font-semibold text-base mt-6">אבטחת מידע:</h3>
    <p>אנו נוקטים באמצעים מקובלים לשמירה על המידע ולמניעת גישה לא מורשית אליו.</p>

    <h3 className="font-semibold text-base mt-6">זכויותיך:</h3>
    <p>באפשרותך לפנות אלינו בכל עת בבקשה לעיין במידע שנאסף עליך, לתקנו או למחקו, בהתאם לחוק הגנת הפרטיות.</p>

    <h3 className="font-semibold text-base mt-6">יצירת קשר בנושא פרטיות:</h3>
    <p>דוא"ל: <a href="mailto:Adi.cohen0205@gmail.com" className="text-primary hover:underline">Adi.cohen0205@gmail.com</a></p>

    <p className="text-muted-foreground mt-6">עדכון אחרון: 14.07.2026</p>
  </div>
);

const titles: Record<string, string> = {
  terms: "תקנון ותנאי שימוש",
  privacy: "מדיניות פרטיות",
  accessibility: "הצהרת נגישות",
};

const LegalModal = ({ open, onOpenChange, type }: LegalModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl max-h-[85vh] p-0" dir="rtl">
      <DialogHeader className="p-6 pb-0">
        <DialogTitle className="text-xl">{titles[type]}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[calc(85vh-100px)] px-6 pb-6">
        {type === "accessibility" && <AccessibilityContent />}
        {type === "terms" && <TermsContent />}
        {type === "privacy" && <PrivacyContent />}
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

export default LegalModal;
