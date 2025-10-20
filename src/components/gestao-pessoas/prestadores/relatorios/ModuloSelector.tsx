import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ModuloPrestador } from "@/types/relatorio-prestadores";
import { MODULOS_CONFIG } from "@/config/colunas-prestadores";
import * as Icons from "lucide-react";

interface ModuloSelectorProps {
  modulosSelecionados: ModuloPrestador[];
  onChange: (modulos: ModuloPrestador[]) => void;
}

export function ModuloSelector({ modulosSelecionados, onChange }: ModuloSelectorProps) {
  const toggleModulo = (modulo: ModuloPrestador) => {
    if (modulosSelecionados.includes(modulo)) {
      onChange(modulosSelecionados.filter(m => m !== modulo));
    } else {
      onChange([...modulosSelecionados, modulo]);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Etapa 1: Seleção de módulos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {MODULOS_CONFIG.map((config) => {
          const IconComponent = (Icons as any)[config.icone] || Icons.FileText;
          
          return (
            <div
              key={config.id}
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              onClick={() => toggleModulo(config.id)}
            >
              <Checkbox
                checked={modulosSelecionados.includes(config.id)}
                onCheckedChange={() => toggleModulo(config.id)}
              />
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{config.titulo}</span>
            </div>
          );
        })}
      </div>
      {modulosSelecionados.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          {modulosSelecionados.length} módulo(s) selecionado(s)
        </p>
      )}
    </Card>
  );
}
