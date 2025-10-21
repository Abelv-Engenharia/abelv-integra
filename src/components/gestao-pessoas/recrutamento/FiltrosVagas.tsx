import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusVaga, PrioridadeVaga } from "@/types/gestao-pessoas/vaga";
import { Filter, X } from "lucide-react";

// Dados temporários até integração completa
const mockAreas = ["Engenharia", "Segurança", "Administrativo", "RH"];
const mockSetores = ["Obras", "Escritório", "Manutenção"];
const mockGestores = [{ id: "1", nome: "Gestor 1" }, { id: "2", nome: "Gestor 2" }];

export interface FiltrosState {
  busca: string;
  status: StatusVaga | '' | 'all';
  prioridade: PrioridadeVaga | '' | 'all';
  area: string;
  setor: string;
  gestor: string;
  localTrabalho: string;
}

interface FiltrosVagasProps {
  filtros: FiltrosState;
  onFiltrosChange: (filtros: FiltrosState) => void;
  onLimparFiltros: () => void;
}

export function FiltrosVagas({ filtros, onFiltrosChange, onLimparFiltros }: FiltrosVagasProps) {
  const handleChange = (field: keyof FiltrosState, value: string) => {
    onFiltrosChange({
      ...filtros,
      [field]: value
    });
  };

  const hasActiveFilters = Object.values(filtros).some(value => value !== '' && value !== 'all');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Label className="text-base font-medium">Filtros</Label>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLimparFiltros}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="busca">Buscar</Label>
            <Input
              id="busca"
              placeholder="Cargo, área, gestor..."
              value={filtros.busca}
              onChange={(e) => handleChange('busca', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filtros.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value={StatusVaga.SOLICITACAO_ABERTA}>Solicitação Aberta</SelectItem>
                <SelectItem value={StatusVaga.APROVADA}>Aprovada</SelectItem>
                <SelectItem value={StatusVaga.DIVULGACAO_FEITA}>Divulgação Feita</SelectItem>
                <SelectItem value={StatusVaga.EM_SELECAO}>Em Seleção</SelectItem>
                <SelectItem value={StatusVaga.FINALIZADA}>Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={filtros.prioridade} onValueChange={(value) => handleChange('prioridade', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value={PrioridadeVaga.ALTA}>Alta</SelectItem>
                <SelectItem value={PrioridadeVaga.MEDIA}>Média</SelectItem>
                <SelectItem value={PrioridadeVaga.BAIXA}>Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Select value={filtros.area} onValueChange={(value) => handleChange('area', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as áreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {mockAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setor">Setor</Label>
            <Select value={filtros.setor} onValueChange={(value) => handleChange('setor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os setores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {mockSetores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gestor">Gestor</Label>
            <Select value={filtros.gestor} onValueChange={(value) => handleChange('gestor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os gestores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gestores</SelectItem>
                {mockGestores.map((gestor) => (
                  <SelectItem key={gestor.id} value={gestor.nome}>
                    {gestor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localTrabalho">Local de Trabalho</Label>
            <Input
              id="localTrabalho"
              placeholder="Cidade, estado..."
              value={filtros.localTrabalho}
              onChange={(e) => handleChange('localTrabalho', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}