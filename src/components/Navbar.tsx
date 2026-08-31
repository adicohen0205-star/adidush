import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "דף הבית" },
  { to: "/workshops", label: "סדנאות אוכל" },
  { to: "/coaching", label: "ליווי תזונתי" },
  
  
  { to: "/contact", label: "צרו קשר" },
];

const getLinkStyle = (pathname: string, linkTo: string) => {
  const isActive = pathname === linkTo;
  const isCoaching = linkTo === "/coaching";
  const activeColor = isCoaching ? "text-coaching border-coaching" : "text-primary border-primary";

  if (isActive) {
    return `${activeColor} font-semibold border-b-2 rounded-none`;
  }
  return "text-muted-foreground border-b-2 border-transparent";
};


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border bg-white">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/">
            <img src={logo} alt="Adidush - The Foody Nutritionist" className="h-52" />
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1" dir="rtl">
          {navLinks.map((link) =>
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 text-sm font-medium transition-all hover:text-primary hover:border-primary ${link.to === "/coaching" ? "hover:text-coaching hover:border-coaching" : ""} ${getLinkStyle(location.pathname, link.to)}`}
            >
              {link.label}
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4" dir="rtl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-sm font-medium transition-all ${link.to === "/coaching" ? "hover:text-coaching" : "hover:text-primary"} ${getLinkStyle(location.pathname, link.to)}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>);

};

export default Navbar;