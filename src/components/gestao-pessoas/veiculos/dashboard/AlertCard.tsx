import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface AlertItem {
  nome: string;
  detalhes: string;
  severidade?: "critico" | "alerta" | "info";
}

interface AlertCardProps {
  titulo: string;
  itens: AlertItem[];
  tipo: "critico" | "alerta" | "info";
}

export function AlertCard({ titulo, itens, tipo }: AlertCardProps) {
  const Icon = tipo === "critico" ? AlertTriangle : tipo === "alerta" ? AlertCircle : Info;
  
  const corCard = {
    critico: "border-red-500/50 bg-red-500/5",
    alerta: "border-yellow-500/50 bg-yellow-500/5",
    info: "border-blue-500/50 bg-blue-500/5"
  };

  const corBadge = {
    critico: "destructive",
    alerta: "default",
    info: "secondary"
  } as const;

  if (itens.length === 0) return null;

  return (
    <Card className={corCard[tipo]}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {itens.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background/50">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.nome}</p>
                <p className="text-xs text-muted-foreground">{item.detalhes}</p>
              </div>
              <Badge variant={corBadge[item.severidade || tipo]} className="shrink-0">
                {item.severidade === "critico" ? "Crítico" : item.severidade === "alerta" ? "Alerta" : "Info"}
              </Badge>
            </div>
          ))}
          {itens.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{itens.length - 5} itens adicionais
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
