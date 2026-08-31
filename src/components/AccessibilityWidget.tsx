import { useEffect, useState } from "react";
import { Accessibility, Plus, Minus, Contrast, Link2, Type, PauseCircle, RotateCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const STORAGE_KEY = "a11y_prefs";

type Prefs = {
  fontScale: number;
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
};

const defaults: Prefs = {
  fontScale: 1,
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false,
};

const load = (): Prefs => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

const apply = (p: Prefs) => {
  const html = document.documentElement;
  html.style.fontSize = `${p.fontScale * 100}%`;
  html.classList.toggle("a11y-high-contrast", p.highContrast);
  html.classList.toggle("a11y-highlight-links", p.highlightLinks);
  html.classList.toggle("a11y-readable-font", p.readableFont);
  html.classList.toggle("a11y-reduce-motion", p.reduceMotion);
};

const AccessibilityWidget = () => {
  const [prefs, setPrefs] = useState<Prefs>(defaults);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loaded = load();
    setPrefs(loaded);
    apply(loaded);
  }, []);

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    apply(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const reset = () => {
    setPrefs(defaults);
    apply(defaults);
    localStorage.removeItem(STORAGE_KEY);
  };

  const btn = "flex items-center justify-between w-full gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const toggleBtn = (active: boolean) =>
    `${btn} ${active ? "!bg-primary !text-primary-foreground !border-primary" : ""}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="פתיחת תפריט נגישות"
          className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Accessibility className="h-6 w-6" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" dir="rtl" className="w-72 p-3">
        <h3 className="text-sm font-rubik font-bold mb-3 text-foreground">תפריט נגישות</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <span className="text-sm text-foreground">גודל טקסט</span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="הקטן טקסט"
                onClick={() => update({ fontScale: Math.max(0.8, prefs.fontScale - 0.1) })}
                className="rounded p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-xs text-muted-foreground min-w-[2.5rem] text-center self-center">
                {Math.round(prefs.fontScale * 100)}%
              </span>
              <button
                type="button"
                aria-label="הגדל טקסט"
                onClick={() => update({ fontScale: Math.min(1.5, prefs.fontScale + 0.1) })}
                className="rounded p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-pressed={prefs.highContrast}
            onClick={() => update({ highContrast: !prefs.highContrast })}
            className={toggleBtn(prefs.highContrast)}
          >
            <span className="flex items-center gap-2"><Contrast className="h-4 w-4" aria-hidden="true" /> ניגודיות גבוהה</span>
          </button>

          <button
            type="button"
            aria-pressed={prefs.highlightLinks}
            onClick={() => update({ highlightLinks: !prefs.highlightLinks })}
            className={toggleBtn(prefs.highlightLinks)}
          >
            <span className="flex items-center gap-2"><Link2 className="h-4 w-4" aria-hidden="true" /> הדגשת קישורים</span>
          </button>

          <button
            type="button"
            aria-pressed={prefs.readableFont}
            onClick={() => update({ readableFont: !prefs.readableFont })}
            className={toggleBtn(prefs.readableFont)}
          >
            <span className="flex items-center gap-2"><Type className="h-4 w-4" aria-hidden="true" /> גופן קריא</span>
          </button>

          <button
            type="button"
            aria-pressed={prefs.reduceMotion}
            onClick={() => update({ reduceMotion: !prefs.reduceMotion })}
            className={toggleBtn(prefs.reduceMotion)}
          >
            <span className="flex items-center gap-2"><PauseCircle className="h-4 w-4" aria-hidden="true" /> עצירת אנימציות</span>
          </button>

          <button
            type="button"
            onClick={reset}
            className={`${btn} justify-center`}
          >
            <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" aria-hidden="true" /> איפוס הגדרות</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccessibilityWidget;
