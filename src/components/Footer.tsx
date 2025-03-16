
import { Button } from "@/components/ui/button";
import { MscLogo } from "./ui-custom/MscLogo";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="section-container px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <MscLogo />
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">{t("contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-muted-foreground gap-2">
                <Phone size={18} />
                <span>+33 (0)1 23 45 67 89</span>
              </li>
              <li className="flex items-center text-muted-foreground gap-2">
                <Mail size={18} />
                <span>contact@mathssummercamp.fr</span>
              </li>
              <li className="flex items-start text-muted-foreground gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  123 Avenue des Sciences<br />
                  75000 Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex justify-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Maths Summer Camp. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
