
import { Button } from "@/components/ui/button";
import { MscLogo } from "./ui-custom/MscLogo";
import { Phone, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="section-container px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="mb-4">
              <MscLogo />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10" asChild>
                <a href="https://web.facebook.com/profile.php?id=100083107484012" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10" asChild>
                <a href="https://www.linkedin.com/company/benin-maths-camp/" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">{t("contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-muted-foreground gap-2">
                <Phone size={18} />
                <span>+2290140642494</span>
              </li>
              <li className="flex items-center text-muted-foreground gap-2">
                <Mail size={18} />
                <span>info.imacbenin@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex justify-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Summer Maths Camp. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
