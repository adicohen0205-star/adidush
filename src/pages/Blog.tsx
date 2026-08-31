import { Link } from "react-router-dom";
import pizzaImg from "@/assets/recipe-pizza.jpg";
import saladImg from "@/assets/recipe-salad.jpg";
import breadImg from "@/assets/recipe-bread.jpg";

const posts = [
  {
    img: saladImg,
    title: "5 טיפים לתזונה בריאה בלי לוותר על טעם",
    category: "תזונה ואורח חיים",
    date: "10.03.2026",
    excerpt: "לא חייבים לוותר על אוכל טעים כדי לחיות בריא. הנה חמישה טיפים שיעזרו לכם לשלב.",
  },
  {
    img: breadImg,
    title: "המדריך המלא ללחם מחמצת",
    category: "טיפים לאפייה",
    date: "05.03.2026",
    excerpt: "כל מה שצריך לדעת כדי להתחיל להכין לחם מחמצת בבית – צעד אחר צעד.",
  },
  {
    img: pizzaImg,
    title: "איך להכין בצק פיצה מושלם",
    category: "מדריכים",
    date: "28.02.2026",
    excerpt: "הסודות מאחורי בצק פיצה אוורירי ופריך – טכניקות שתוכלו ליישם מיד.",
  },
];

const Blog = () => (
  <div dir="rtl" className="py-16">
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-4">בלוג</h1>
      <p className="text-center text-muted-foreground mb-12">מאמרים, טיפים ומדריכים מעולם האוכל והתזונה</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {posts.map((post, i) => (
          <article key={i} className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5">
              <span className="text-xs text-primary font-medium">{post.category}</span>
              <h2 className="text-lg font-semibold mt-1 mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
