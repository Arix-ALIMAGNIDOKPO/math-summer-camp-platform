
import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'outline';
}

export const Chip = ({ 
  children, 
  className, 
  variant = 'default' 
}: ChipProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all",
        variant === 'default' && "bg-secondary text-foreground",
        variant === 'primary' && "bg-primary/10 text-primary",
        variant === 'outline' && "border border-border bg-transparent",
        className
      )}
    >
      {children}
    </span>
  );
};
