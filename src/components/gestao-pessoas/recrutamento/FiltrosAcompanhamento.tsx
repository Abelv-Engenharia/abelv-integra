import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { EtapaProcesso } from "@/types/vaga";

interface FiltrosAcompanhamentoProps {
  filtros: {
    busca: string;
    status: string;
    unidade: string;
    etapa: string;
  };
  onFiltrosChange: (filtros: any) => void;
  onLimparFiltros: () => void;
  unidades: string[];
}

export function FiltrosAcompanhamento({
  filtros,
  onFiltrosChange,
  onLimparFiltros,
  unidades
}: FiltrosAcompanhamentoProps) {
  const etapas = [
    { value: EtapaProcesso.TRIAGEM_CURRICULOS, label: "Triagem de Currículos" },
    { value: EtapaProcesso.ENTREVISTA_RH, label: "Entrevista RH" },
    { value: EtapaProcesso.ENVIO_GESTOR, label: "Envio ao Gestor" },
    { value: EtapaProcesso.DEVOLUTIVA_GESTOR, label: "Devolutiva do Gestor" },
    { value: EtapaProcesso.AGENDAMENTO, label: "Agendamento" },
    { value: EtapaProcesso.TESTES_PROFILE, label: "Testes / Profile" },
    { value: EtapaProcesso.ENTREVISTAS_FINAIS, label: "Entrevistas Finais" },
  ];

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="busca">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="busca"
              placeholder="Vaga, cargo, unidade..."
              value={filtros.busca}
              onChange={(e) =>
                onFiltrosChange({ ...filtros, busca: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filtros.status}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, status: value })
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="no_prazo">No Prazo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade / Obra</Label>
          <Select
            value={filtros.unidade}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, unidade: value })
            }
          >
            <SelectTrigger id="unidade">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {unidades.map((unidade) => (
                <SelectItem key={unidade} value={unidade}>
                  {unidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="etapa">Etapa Atual</Label>
          <Select
            value={filtros.etapa}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, etapa: value })
            }
          >
            <SelectTrigger id="etapa">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {etapas.map((etapa) => (
                <SelectItem key={etapa.value} value={etapa.value}>
                  {etapa.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onLimparFiltros}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
