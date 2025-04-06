
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MscLogo } from "./ui-custom/MscLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { href: "#about", label: "about", isHash: true },
  { href: "#program", label: "program", isHash: true },
  { href: "#gallery", label: "gallery", isHash: true },
  { href: "#budget", label: "budget", isHash: true },
  { href: "#contact", label: "contact", isHash: true },
  { href: "/inscription", label: "register", isHash: false },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  const isActive = (href: string, isHash: boolean) => {
    if (isHash) {
      return location.hash === href;
    }
    return location.pathname === href;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
        scrolled
          ? "bg-white/90 backdrop-blur shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <MscLogo variant={isMobile ? "compact" : "full"} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.isHash ? link.href : undefined}
              className={cn(
                "py-2 px-3 text-sm rounded-md transition-colors",
                isActive(link.href, link.isHash)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-secondary hover:text-foreground"
              )}
              {...(link.isHash
                ? {}
                : { to: link.href, as: Link })}
            >
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageChange}
            className="rounded-full text-xs font-medium border-primary/20 hover:bg-primary/10 hover:text-primary min-w-[40px]"
          >
            {language === "en" ? "FR" : "EN"}
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <MscLogo />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.isHash ? link.href : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "p-3 rounded-md transition-colors",
                        isActive(link.href, link.isHash)
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-secondary"
                      )}
                      {...(link.isHash
                        ? {}
                        : { to: link.href, as: Link })}
                    >
                      {t(link.label)}
                    </a>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
