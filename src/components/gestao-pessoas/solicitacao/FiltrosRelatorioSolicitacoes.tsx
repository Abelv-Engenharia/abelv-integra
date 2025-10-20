import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { StatusSolicitacao, TipoServico, SolicitacaoServico } from "@/types/gestao-pessoas/solicitacao";

interface FiltrosRelatorioSolicitacoesProps {
  filtros: any;
  onFiltrosChange: (filtros: any) => void;
  solicitacoes: SolicitacaoServico[];
}

export function FiltrosRelatorioSolicitacoes({
  filtros,
  onFiltrosChange,
  solicitacoes,
}: FiltrosRelatorioSolicitacoesProps) {
  const statusOptions = [
    { value: StatusSolicitacao.PENDENTE, label: "Pendente" },
    { value: StatusSolicitacao.EM_ANDAMENTO, label: "Em Andamento" },
    { value: StatusSolicitacao.AGUARDANDO_APROVACAO, label: "Aguardando Aprovação" },
    { value: StatusSolicitacao.APROVADO, label: "Aprovado" },
    { value: StatusSolicitacao.CONCLUIDO, label: "Concluído" },
    { value: StatusSolicitacao.REJEITADO, label: "Rejeitado" },
  ];

  const tipoServicoOptions = [
    { value: TipoServico.VOUCHER_UBER, label: "Voucher Uber" },
    { value: TipoServico.LOCACAO_VEICULO, label: "Locação de Veículo" },
    { value: TipoServico.CARTAO_ABASTECIMENTO, label: "Cartão Abastecimento" },
    { value: TipoServico.VELOE_GO, label: "Veloe Go" },
    { value: TipoServico.PASSAGENS, label: "Passagens" },
    { value: TipoServico.HOSPEDAGEM, label: "Hospedagem" },
    { value: TipoServico.LOGISTICA, label: "Logística" },
    { value: TipoServico.CORREIOS_LOGGI, label: "Correios/Loggi" },
  ];

  // Extrair CCAs únicos das solicitações
  const ccasUnicos = Array.from(
    new Set(
      solicitacoes
        .map((s) => ('cca' in s ? (s as any).cca : ''))
        .filter((cca) => cca !== '')
    )
  ).sort();

  const handleStatusChange = (value: StatusSolicitacao, checked: boolean) => {
    const newStatus = checked
      ? [...(filtros.status || []), value]
      : (filtros.status || []).filter((s: StatusSolicitacao) => s !== value);
    onFiltrosChange({ ...filtros, status: newStatus });
  };

  const handleTipoServicoChange = (value: string, checked: boolean) => {
    const newTipos = checked
      ? [...(filtros.tiposervico || []), value]
      : (filtros.tiposervico || []).filter((t: string) => t !== value);
    onFiltrosChange({ ...filtros, tiposervico: newTipos });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros Avançados</CardTitle>
        <CardDescription>Refine sua pesquisa aplicando os filtros abaixo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Período */}
          <div className="space-y-2">
            <Label htmlFor="periodo">Período</Label>
            <Select
              value={filtros.periodo}
              onValueChange={(value) => onFiltrosChange({ ...filtros, periodo: value })}
            >
              <SelectTrigger id="periodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="semana">Última Semana</SelectItem>
                <SelectItem value="mes">Último Mês</SelectItem>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Inicial */}
          {filtros.periodo === 'personalizado' && (
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filtros.datainicial && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtros.datainicial ? (
                      format(filtros.datainicial, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filtros.datainicial}
                    onSelect={(date) => onFiltrosChange({ ...filtros, datainicial: date })}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Data Final */}
          {filtros.periodo === 'personalizado' && (
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filtros.datafinal && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtros.datafinal ? (
                      format(filtros.datafinal, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filtros.datafinal}
                    onSelect={(date) => onFiltrosChange({ ...filtros, datafinal: date })}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* CCA */}
          <div className="space-y-2">
            <Label htmlFor="cca">CCA</Label>
            <Select
              value={filtros.cca || "todos"}
              onValueChange={(value) =>
                onFiltrosChange({ ...filtros, cca: value === "todos" ? "" : value })
              }
            >
              <SelectTrigger id="cca">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {ccasUnicos.map((cca) => (
                  <SelectItem key={cca} value={cca}>
                    {cca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Solicitante */}
          <div className="space-y-2">
            <Label htmlFor="solicitante">Solicitante</Label>
            <Input
              id="solicitante"
              placeholder="Nome do solicitante"
              value={filtros.solicitante || ""}
              onChange={(e) => onFiltrosChange({ ...filtros, solicitante: e.target.value })}
            />
          </div>

          {/* Valor Mínimo */}
          <div className="space-y-2">
            <Label htmlFor="valorminimo">Valor Mínimo</Label>
            <Input
              id="valorminimo"
              type="number"
              placeholder="R$ 0,00"
              value={filtros.valorminimo || ""}
              onChange={(e) =>
                onFiltrosChange({
                  ...filtros,
                  valorminimo: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          </div>

          {/* Valor Máximo */}
          <div className="space-y-2">
            <Label htmlFor="valormaximo">Valor Máximo</Label>
            <Input
              id="valormaximo"
              type="number"
              placeholder="R$ 0,00"
              value={filtros.valormaximo || ""}
              onChange={(e) =>
                onFiltrosChange({
                  ...filtros,
                  valormaximo: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Status - Checkboxes */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex flex-wrap gap-4">
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={(filtros.status || []).includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleStatusChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`status-${option.value}`} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tipo de Serviço - Checkboxes */}
        <div className="space-y-2">
          <Label>Tipo de Serviço</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tipoServicoOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo-${option.value}`}
                  checked={(filtros.tiposervico || []).includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleTipoServicoChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`tipo-${option.value}`} className="font-normal cursor-pointer text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Limpar */}
        {(filtros.status?.length > 0 ||
          filtros.tiposervico?.length > 0 ||
          filtros.cca ||
          filtros.solicitante ||
          filtros.valorminimo ||
          filtros.valormaximo) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFiltrosChange({
                periodo: filtros.periodo,
                datainicial: filtros.datainicial,
                datafinal: filtros.datafinal,
                status: [],
                tiposervico: [],
                cca: "",
                solicitante: "",
                valorminimo: undefined,
                valormaximo: undefined,
              })
            }
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Seleção
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
