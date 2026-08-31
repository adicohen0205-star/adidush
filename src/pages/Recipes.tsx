import { useState } from "react";
import { Button } from "@/components/ui/button";
import pizzaImg from "@/assets/recipe-pizza.jpg";
import breadImg from "@/assets/recipe-bread.jpg";
import saladImg from "@/assets/recipe-salad.jpg";
import cheeseImg from "@/assets/recipe-cheese.jpg";

const categories = ["הכל", "פיצה", "לחמים", "בריא", "מאפים"];

const allRecipes = [
  { img: pizzaImg, title: "פיצה ביתית מושלמת", cat: "פיצה", time: "60 דק׳", desc: "בצק אוורירי, רוטב עגבניות תוצרת בית ומוצרלה נמשכת." },
  { img: breadImg, title: "לחם מחמצת", cat: "לחמים", time: "24 שעות", desc: "לחם מחמצת קלאסי עם קראסט מושלם ופנים רך." },
  { img: saladImg, title: "סלט בריא ומהיר", cat: "בריא", time: "15 דק׳", desc: "קינואה, אבוקדו, חומוס וירקות טריים ברוטב לימון." },
  { img: cheeseImg, title: "מאפה גבינות", cat: "מאפים", time: "45 דק׳", desc: "בורקס גבינות ביתי עם בצק פריך ומילוי עשיר." },
  { img: pizzaImg, title: "פיצה טורטייה מהירה", cat: "פיצה", time: "20 דק׳", desc: "פיצה על בסיס טורטייה – מהירה, פריכה וטעימה." },
  { img: breadImg, title: "פוקאצ׳ה זיתים", cat: "לחמים", time: "3 שעות", desc: "פוקאצ׳ה רכה עם שמן זית, זיתים ורוזמרין." },
];

const Recipes = () => {
  const [active, setActive] = useState("הכל");

  const filtered = active === "הכל" ? allRecipes : allRecipes.filter((r) => r.cat === active);

  return (
    <div dir="rtl" className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">מתכונים</h1>
        <p className="text-center text-muted-foreground mb-10">מתכונים ביתיים, בריאים וטעימים – מהמטבח של עדי</p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={active === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActive(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={r.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{r.title}</h3>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{r.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{r.desc}</p>
                <span className="text-xs text-primary font-medium">{r.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
