
import { cn } from "@/lib/utils";

interface MscLogoProps {
  className?: string;
  variant?: "full" | "compact";
}

export const MscLogo = ({ className, variant = "full" }: MscLogoProps) => {
  return (
    <div className={cn("flex items-center font-display", className)}>
      <div className="relative h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2 overflow-hidden">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
        >
          <path
            d="M6 6L26 26M6 26L26 6"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/30"
          />
          <circle
            cx="16"
            cy="16"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            fill="none"
          />
          <path
            d="M16 6C13.3478 6 10.8043 7.05357 8.92893 8.92893C7.05357 10.8043 6 13.3478 6 16"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/70"
          />
        </svg>
      </div>
      {variant === "full" && (
        <div className="font-bold text-xl">
          <span className="text-primary">Summer</span>
          <span className="ml-1">Maths Camp</span>
        </div>
      )}
    </div>
  );
};
