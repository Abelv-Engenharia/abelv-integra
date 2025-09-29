import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ColoredBadgeProps {
  children: React.ReactNode;
  color: "green" | "orange" | "red";
  className?: string;
}

const ColoredBadge = ({ children, color, className }: ColoredBadgeProps) => {
  const colorClasses = {
    green: "bg-green-500 text-white hover:bg-green-600",
    orange: "bg-orange-500 text-white hover:bg-orange-600",
    red: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <Badge 
      className={cn(
        colorClasses[color], 
        "print-color-adjust",
        className
      )}
    >
      {children}
    </Badge>
  );
};

export default ColoredBadge;
