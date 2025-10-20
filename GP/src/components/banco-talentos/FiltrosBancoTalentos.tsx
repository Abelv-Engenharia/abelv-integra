import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrigemCandidato, EtapaProcesso, StatusCandidato } from "@/types/candidato";
import { Search, X, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export interface FiltrosCandidato {
  busca: string;
  origem?: OrigemCandidato;
  etapa?: EtapaProcesso;
  status?: StatusCandidato;
  unidadeObra?: string;
  possibilidadeReaproveitamento?: boolean;
}

interface FiltrosBancoTalentosProps {
  filtros: FiltrosCandidato;
  onFiltrosChange: (filtros: FiltrosCandidato) => void;
  onLimparFiltros: () => void;
}

export const FiltrosBancoTalentos = ({ 
  filtros, 
  onFiltrosChange, 
  onLimparFiltros 
}: FiltrosBancoTalentosProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, cargo ou origem..."
            value={filtros.busca}
            onChange={(e) => onFiltrosChange({ ...filtros, busca: e.target.value })}
            className="pl-9"
          />
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-4 border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select
                value={filtros.origem}
                onValueChange={(value) => 
                  onFiltrosChange({ ...filtros, origem: value as OrigemCandidato })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as origens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as origens</SelectItem>
                  {Object.values(OrigemCandidato).map((origem) => (
                    <SelectItem key={origem} value={origem}>
                      {origem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Etapa do Processo</Label>
              <Select
                value={filtros.etapa}
                onValueChange={(value) => 
                  onFiltrosChange({ ...filtros, etapa: value as EtapaProcesso })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as etapas</SelectItem>
                  {Object.values(EtapaProcesso).map((etapa) => (
                    <SelectItem key={etapa} value={etapa}>
                      {etapa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filtros.status}
                onValueChange={(value) => 
                  onFiltrosChange({ ...filtros, status: value as StatusCandidato })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.values(StatusCandidato).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reaproveitamento</Label>
              <Select
                value={filtros.possibilidadeReaproveitamento?.toString()}
                onValueChange={(value) => 
                  onFiltrosChange({ 
                    ...filtros, 
                    possibilidadeReaproveitamento: value === "true" ? true : value === "false" ? false : undefined 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onLimparFiltros}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
