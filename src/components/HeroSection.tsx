import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import iconBread from "@/assets/icon-bread.png";
import iconInstagram from "@/assets/icon-instagram.png";
import iconInstagramOutline from "@/assets/icon-instagram-outline.png";

const HeroSection = () => {
  return (
    <section className="bg-section-alt" dir="rtl">
      <div className="container mx-auto px-4 py-8 md:py-0">
        <div className="flex flex-col md:flex-row items-center md:items-stretch min-h-[400px] md:min-h-[65vh] gap-0 md:gap-14 lg:gap-20">
          
          {/* Image side - RIGHT on desktop (first in RTL flow) */}
          <div className="w-full md:w-[42%] flex items-center justify-center relative md:py-20">
            <div className="relative w-full max-w-[400px] md:max-w-none h-full">
              <img
                src="/uploads/90ffe7f7-c58f-4005-830b-55c55629b1e7.jpg"
                alt="עדי כהן"
                className="w-full h-[350px] md:h-full object-cover object-top rounded-2xl md:rounded-3xl" />
              
              {/* Bottom gradient fade - mobile only */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--section-alt))] to-transparent rounded-b-2xl" />
            </div>
          </div>

          {/* Text side - LEFT on desktop */}
          <div className="w-full md:w-[55%] flex flex-col justify-center items-center md:items-start text-center md:text-right py-8 md:py-16">
            <span className="hidden md:block text-sm text-muted-foreground tracking-wide mb-4">קצת עליי</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-tight mb-3 text-foreground w-full md:text-right">
              עדי כהן
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-rubik font-medium w-full md:text-right text-[#a5ad8a]">
              התזונאית שהיא גם פודית
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed md:text-right whitespace-pre-line">
              דיאטנית קלינית, יוצרת תוכן קולינרי ומנחת סדנאות בישול. אני מאמינה שאורח חיים בריא לא דורש לוותר על אוכל שאוהבים. הגישה שלי משלבת בין תזונה מקצועית לעולם הקולינרי והרבה אהבה לאוכל.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto md:justify-start">
              <Button
                asChild
                size="lg"
                className="font-semibold text-lg px-10 py-6 rounded-full">
                
                <Link to="/workshops">סדנאות אוכל</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-coaching text-coaching hover:bg-coaching/10 font-semibold text-lg px-10 py-6 rounded-full">
                
                <Link to="/coaching">ליווי תזונתי</Link>
              </Button>
            </div>
            {/* Stats row */}
            <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8 mt-10 w-full">
              {[{ icon: <Users className="w-5 h-5 text-muted-foreground" />, number: "+500", label: "לקוחות לליווי תזונתי" }, { icon: <img alt="סדנאות" className="w-5 h-5 object-contain" src="/uploads/7738a504-6f38-4137-a8f5-748103d98c86.png" />, number: "+100", label: "סדנאות בישול" }, { icon: <img alt="אינסטגרם" className="w-5 h-5 object-contain" src={iconInstagramOutline} />, number: "+1,200", label: "מתכונים באינסטגרם" }].map((stat, i) => <div key={i} className="flex items-center gap-3 w-[200px] md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center shrink-0">
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-bold font-rubik text-foreground">{stat.number}</span>
                    <span className="block text-xs text-muted-foreground font-rubik">{stat.label}</span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>);
};

export default HeroSection;