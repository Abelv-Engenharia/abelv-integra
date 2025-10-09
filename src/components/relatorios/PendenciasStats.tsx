import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface PendenciasStat {
  label: string;
  value: number;
  variant?: 'default' | 'warning' | 'danger';
}

interface PendenciasStatsProps {
  stats: PendenciasStat[];
}

export function PendenciasStats({ stats }: PendenciasStatsProps) {
  const getVariantColor = (variant?: string) => {
    switch (variant) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'danger':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`${getVariantColor(stat.variant)} border-2`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
