
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

export const PageLoader = ({ 
  className, 
  text = "Carregando...", 
  size = "md" 
}: PageLoaderProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] space-y-4",
      className
    )}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <p className="text-sm sm:text-base text-muted-foreground">{text}</p>
    </div>
  );
};

export const InlineLoader = ({ 
  text = "Carregando...",
  size = "sm" 
}: Omit<PageLoaderProps, "className">) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <span className="text-xs sm:text-sm text-muted-foreground">{text}</span>
    </div>
  );
};
