import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import aboutHeroImg from "@/assets/about-hero.jpg";

const About = () => (
  <div dir="rtl">
    <section className="bg-section-alt">
      <div className="container mx-auto px-4 py-8 md:py-0">
        <div className="flex flex-col md:flex-row items-center md:items-stretch min-h-[400px] md:min-h-[75vh] gap-0 md:gap-14 lg:gap-20">
          {/* Image side */}
          <div className="w-full md:w-[42%] flex items-center justify-center relative md:py-20">
            <div className="relative w-full max-w-[400px] md:max-w-none h-full">
              <img
                src={aboutHeroImg}
                alt="עדי כהן"
                className="w-full h-[350px] md:h-full object-cover object-top rounded-2xl md:rounded-3xl" />
              <div className="md:hidden absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--section-alt))] to-transparent rounded-b-2xl" />
            </div>
          </div>

          {/* Text side */}
          <div className="w-full md:w-[55%] flex flex-col justify-center items-center md:items-start text-center md:text-right py-8 md:py-20">
            <span className="hidden md:block text-sm text-muted-foreground tracking-wide mb-4">קצת עליי</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-tight mb-3 text-foreground w-full md:text-right">עדי כהן</h1>
            <p className="text-xl md:text-2xl mb-8 font-rubik font-medium w-full md:text-right text-primary">התזונאית שהיא גם פודית</p>

            <div className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed md:text-right space-y-3">
              <p>דיאטנית קלינית, יוצרת תוכן קולינרי ובוגרת בית ספר לבישולים.</p>
              <p>אני מאמינה שלא צריך לבחור בין אהבה לאוכל לבין חיים בריאים.</p>
              <p>בעיני השילוב בין קולינריה לבריאות הוא חלק בלתי נפרד מאורח חיים בריא ומאושר.</p>
            </div>

            <Separator className="bg-border/60 mb-8 max-w-xl" />

            <p className="text-sm font-medium text-foreground mb-5 md:text-right">בעולם שלי תמצאו:</p>
            <ul className="space-y-3 mb-10 max-w-xl text-right">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground"><strong className="text-foreground">ליווי תזונתי רגשי</strong> – איך להגיע לתוצאות שרצינו בלי לוותר על מי שאנחנו בדרך</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground"><strong className="text-foreground">סדנאות פיצות ובצקים</strong> – התשוקה שלי במטבח</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground"><strong className="text-foreground">בלוג האוכל שלי</strong> – שמשלב בין שני העולמות</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto md:justify-start">
              <Button asChild size="lg" className="font-semibold text-lg px-10 py-6 rounded-full">
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
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
