import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Building, Bus, Car } from "lucide-react";

interface ModalSummaryCardsProps {
  resumo: {
    totalGeral: number;
    aereo: number;
    hotel: number;
    automovel: number;
    onibus: number;
  };
}

export const ModalSummaryCards = ({ resumo }: ModalSummaryCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cards = [
    { 
      title: "Total Geral", 
      value: resumo.totalGeral, 
      icon: null,
      color: "text-primary"
    },
    { 
      title: "Aéreo", 
      value: resumo.aereo, 
      icon: Plane,
      color: "text-blue-600"
    },
    { 
      title: "Hotel", 
      value: resumo.hotel, 
      icon: Building,
      color: "text-green-600"
    },
    { 
      title: "Rodoviário", 
      value: resumo.onibus, 
      icon: Bus,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {Icon && <Icon className={`h-4 w-4 ${card.color}`} />}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.value)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Período selecionado
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
