import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSlideWorkshops from "./HeroSlideWorkshops";
import HeroSlideCoaching from "./HeroSlideCoaching";

const slides = [
  { id: "workshops" as const },
  { id: "coaching" as const },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 300);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden min-h-[450px] md:min-h-[600px]">
      {/* Slide content */}
      <div className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"} absolute inset-0`}>
        {current === 0 ? <HeroSlideWorkshops /> : <HeroSlideCoaching />}
      </div>

      {/* Navigation arrows — at extreme edges */}
      <button
        onClick={prev}
        aria-label="הקודם"
        className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 shadow-md transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        aria-label="הבא"
        className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 shadow-md transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`שקופית ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
