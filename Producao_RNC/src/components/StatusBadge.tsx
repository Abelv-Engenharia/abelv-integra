import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'aberta' | 'fechada';
  className?: string;
}

interface PriorityBadgeProps {
  priority: 'critica' | 'moderada' | 'leve';
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    aberta: "bg-warning text-warning-foreground",
    fechada: "bg-success text-success-foreground"
  };

  return (
    <Badge className={cn(variants[status], className)}>
      {status === 'aberta' ? 'Aberta' : 'Fechada'}
    </Badge>
  );
};

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  const variants = {
    critica: "bg-critical text-critical-foreground",
    moderada: "bg-warning text-warning-foreground",
    leve: "bg-success text-success-foreground"
  };

  const labels = {
    critica: 'Crítica',
    moderada: 'Moderada',
    leve: 'Leve'
  };

  return (
    <Badge className={cn(variants[priority], className)}>
      {labels[priority]}
    </Badge>
  );
};