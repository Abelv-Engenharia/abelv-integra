import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, CreditCard, Key } from "lucide-react";

export type TransportSubcategory = 'voucher_uber' | 'locacao_veiculo' | 'cartao_abastecimento';

interface TransportSubcategorySelectorProps {
  onSelect: (subcategory: TransportSubcategory) => void;
  selectedSubcategory?: TransportSubcategory;
}

const subcategories = [
  {
    id: 'voucher_uber' as TransportSubcategory,
    title: "Voucher Uber",
    description: "Solicitação de voucher para transporte",
    icon: Car,
    fields: ["CCA", "Valor", "Data de uso", "Local partida", "Local destino", "Motivo"]
  },
  {
    id: 'locacao_veiculo' as TransportSubcategory,
    title: "Locação de Veículo",
    description: "Solicitação de locação de veículo",
    icon: Key,
    fields: ["CCA", "Nome condutor", "Motivo", "Data retirada", "Período", "Local retirada"]
  },
  {
    id: 'cartao_abastecimento' as TransportSubcategory,
    title: "Cartão de Abastecimento",
    description: "Solicitação relacionada ao cartão de combustível",
    icon: CreditCard,
    fields: ["CCA", "Nome solicitante", "Tipo solicitação", "Motivo", "Data", "Placa"]
  }
];

export function TransportSubcategorySelector({ onSelect, selectedSubcategory }: TransportSubcategorySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Selecione o Tipo de Transporte</h3>
        <p className="text-sm text-muted-foreground">Escolha uma das opções abaixo para continuar</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => {
          const Icon = subcategory.icon;
          const isSelected = selectedSubcategory === subcategory.id;
          
          return (
            <Card
              key={subcategory.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-elegant hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
              onClick={() => onSelect(subcategory.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-card-foreground">
                    {subcategory.title}
                  </h4>
                  <p className="text-xs text-muted-foreground text-center">
                    {subcategory.description}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {subcategory.fields.slice(0, 2).map((field, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                    {subcategory.fields.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{subcategory.fields.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}