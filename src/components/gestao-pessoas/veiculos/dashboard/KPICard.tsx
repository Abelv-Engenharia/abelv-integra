import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  titulo: string;
  valor: string | number;
  Icon: LucideIcon;
  variacao?: number;
  cor?: "azul" | "verde" | "amarelo" | "vermelho" | "roxo" | "cinza";
}

export function KPICard({ titulo, valor, Icon, variacao, cor = "azul" }: KPICardProps) {
  const corClasses = {
    azul: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    verde: "from-green-500/20 to-green-600/20 border-green-500/30",
    amarelo: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
    vermelho: "from-red-500/20 to-red-600/20 border-red-500/30",
    roxo: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    cinza: "from-gray-500/20 to-gray-600/20 border-gray-500/30"
  };

  const iconCorClasses = {
    azul: "text-blue-500",
    verde: "text-green-500",
    amarelo: "text-yellow-500",
    vermelho: "text-red-500",
    roxo: "text-purple-500",
    cinza: "text-gray-500"
  };

  return (
    <Card className={cn("bg-gradient-to-br border", corClasses[cor])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{titulo}</p>
            <p className="text-3xl font-bold">{valor}</p>
            {variacao !== undefined && (
              <p className={cn(
                "text-sm font-medium",
                variacao >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {variacao >= 0 ? "+" : ""}{variacao}% vs mês anterior
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg bg-background/50", iconCorClasses[cor])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
