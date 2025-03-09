
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MscLogo } from "@/components/ui-custom/MscLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mb-8 mx-auto">
          <MscLogo className="mx-auto" />
        </div>
        
        <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground/80 mb-8">
          Oups! La page que vous recherchez semble avoir disparu dans l'univers des mathématiques.
        </p>
        
        <div className="relative h-32 w-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 30L70 70M30 70L70 30"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary/40"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary"
              fill="none"
            />
          </svg>
        </div>
        
        <Button asChild className="rounded-full">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
