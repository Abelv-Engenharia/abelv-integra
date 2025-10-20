import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModuloPrestador } from "@/types/gestao-pessoas/relatorio-prestadores";
import { MODULOS_CONFIG } from "@/config/gestao-pessoas/colunas-prestadores";
import { Badge } from "@/components/ui/badge";

interface ColunasSelectorPorModuloProps {
  modulosSelecionados: ModuloPrestador[];
  colunasPorModulo: Record<ModuloPrestador, string[]>;
  onChange: (colunas: Record<ModuloPrestador, string[]>) => void;
}

export function ColunasSelectorPorModulo({
  modulosSelecionados,
  colunasPorModulo,
  onChange,
}: ColunasSelectorPorModuloProps) {
  const toggleColuna = (modulo: ModuloPrestador, colunaKey: string) => {
    const colunas = colunasPorModulo[modulo] || [];
    const novasColunas = colunas.includes(colunaKey)
      ? colunas.filter(c => c !== colunaKey)
      : [...colunas, colunaKey];
    
    onChange({ ...colunasPorModulo, [modulo]: novasColunas });
  };

  const selecionarTodas = (modulo: ModuloPrestador) => {
    const config = MODULOS_CONFIG.find(m => m.id === modulo);
    if (config) {
      onChange({
        ...colunasPorModulo,
        [modulo]: config.colunas.map(c => c.key)
      });
    }
  };

  const limparTodas = (modulo: ModuloPrestador) => {
    onChange({ ...colunasPorModulo, [modulo]: [] });
  };

  if (modulosSelecionados.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Etapa 2: Seleção de colunas por módulo</h3>
      <div className="space-y-6">
        {modulosSelecionados.map((modulo) => {
          const config = MODULOS_CONFIG.find(m => m.id === modulo);
          if (!config) return null;

          const colunasModulo = colunasPorModulo[modulo] || [];

          return (
            <div key={modulo} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{config.titulo}</h4>
                  <Badge variant="secondary">{colunasModulo.length} selecionadas</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selecionarTodas(modulo)}
                  >
                    Selecionar todas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => limparTodas(modulo)}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {config.colunas.map((coluna) => (
                  <div
                    key={coluna.key}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                    onClick={() => toggleColuna(modulo, coluna.key)}
                  >
                    <Checkbox
                      checked={colunasModulo.includes(coluna.key)}
                      onCheckedChange={() => toggleColuna(modulo, coluna.key)}
                    />
                    <span className="text-sm">{coluna.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
