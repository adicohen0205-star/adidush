import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroWorkshopImg from "@/assets/hero-workshop.jpg";

const HeroSlideWorkshops = () => {
  return (
    <div className="absolute inset-0">
      {/* Background image */}
      <img
        src={heroWorkshopImg}
        alt="סדנאות אוכל"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Darker overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#8b7b6f]/90 via-[#8b7b6f]/70 to-[#8b7b6f]/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full min-h-[450px] md:min-h-[600px] flex items-center">
        <div className="w-full max-w-2xl mr-0 md:mr-8 lg:mr-16 text-center md:text-right">
          <h1 className="text-5xl md:text-7xl leading-tight mb-4">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] font-bold">עדי כהן</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-3 font-rubik font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            התזונאית שהיא גם פודית
          </p>
          <p className="text-lg md:text-xl text-white/95 max-w-xl mb-10 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]">
            סדנאות אוכל, ליווי תזונתי ומתכונים – במקום אחד.
            <br />
            לא צריך לבחור בין אהבה לאוכל לאורח חיים בריא. אפשר גם וגם.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#8b7b6f] hover:bg-white/90 font-semibold shadow-lg text-lg px-10 py-6"
            >
              <Link to="/workshops">סדנאות אוכל</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold shadow-lg text-lg px-10 py-6"
            >
              <Link to="/coaching">ליווי תזונתי</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlideWorkshops;
