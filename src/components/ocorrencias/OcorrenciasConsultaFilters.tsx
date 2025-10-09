import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useOcorrenciasBasicData } from "@/hooks/ocorrencias/useOcorrenciasBasicData";
import { RefreshCw } from "lucide-react";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";

interface OcorrenciasConsultaFiltersProps {
  ano: string;
  mes: string;
  cca: string;
  empresa: string;
  tipo: string;
  status: string;
  risco: string;
  dataInicio?: Date;
  dataFim?: Date;
  setAno: (ano: string) => void;
  setMes: (mes: string) => void;
  setCca: (cca: string) => void;
  setEmpresa: (empresa: string) => void;
  setTipo: (tipo: string) => void;
  setStatus: (status: string) => void;
  setRisco: (risco: string) => void;
  setDataInicio: (date?: Date) => void;
  setDataFim: (date?: Date) => void;
  onClearFilters: () => void;
  empresas: Array<{ id: string; nome: string }>;
}

const OcorrenciasConsultaFilters = ({
  ano,
  mes,
  cca,
  empresa,
  tipo,
  status,
  risco,
  dataInicio,
  dataFim,
  setAno,
  setMes,
  setCca,
  setEmpresa,
  setTipo,
  setStatus,
  setRisco,
  setDataInicio,
  setDataFim,
  onClearFilters,
  empresas
}: OcorrenciasConsultaFiltersProps) => {
  const { data: userCCAs = [] } = useUserCCAs();
  const { classificacoesOcorrencia } = useOcorrenciasBasicData();

  // CCAs ordenados por código
  const sortedCCAs = [...userCCAs].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  );

  // Empresas ordenadas por nome
  const sortedEmpresas = [...empresas].sort((a, b) => 
    a.nome.localeCompare(b.nome)
  );

  // Status possíveis
  const statusOptions = [
    { value: "Pendente", label: "Pendente" },
    { value: "Em execução", label: "Em execução" },
    { value: "Concluído", label: "Concluído" },
    { value: "Em tratativa", label: "Em tratativa" }
  ];

  // Classificações de risco
  const riscoOptions = [
    { value: "TRIVIAL", label: "Trivial" },
    { value: "TOLERÁVEL", label: "Tolerável" },
    { value: "MODERADO", label: "Moderado" },
    { value: "SUBSTANCIAL", label: "Substancial" },
    { value: "INTOLERÁVEL", label: "Intolerável" }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Filtros de Consulta</CardTitle>
            <CardDescription>
              Selecione os filtros para refinar sua busca
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            title="Limpar todos os filtros"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Data Início
            </label>
            <DatePickerWithManualInput
              value={dataInicio}
              onChange={setDataInicio}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Data Fim
            </label>
            <DatePickerWithManualInput
              value={dataFim}
              onChange={setDataFim}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="ano" className="text-sm font-medium">
              Ano
            </label>
            <Select value={ano} onValueChange={setAno}>
              <SelectTrigger id="ano">
                <SelectValue placeholder="Todos os anos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 2).toString()}>{new Date().getFullYear() - 2}</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</SelectItem>
                <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="mes" className="text-sm font-medium">
              Mês
            </label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger id="mes">
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Maio</SelectItem>
                <SelectItem value="6">Junho</SelectItem>
                <SelectItem value="7">Julho</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="cca" className="text-sm font-medium">
              CCA
            </label>
            <Select value={cca} onValueChange={setCca}>
              <SelectTrigger id="cca">
                <SelectValue placeholder="Todos os CCAs" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="todos">Todos</SelectItem>
                {sortedCCAs.map((ccaItem) => (
                  <SelectItem key={ccaItem.id} value={ccaItem.id.toString()}>
                    {ccaItem.codigo} - {ccaItem.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="empresa" className="text-sm font-medium">
              Empresa
            </label>
            <Select value={empresa} onValueChange={setEmpresa}>
              <SelectTrigger id="empresa">
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="todos">Todas</SelectItem>
                {sortedEmpresas.map((empresaItem) => (
                  <SelectItem key={empresaItem.id} value={empresaItem.nome}>
                    {empresaItem.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="tipo" className="text-sm font-medium">
              Tipo
            </label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="todos">Todos</SelectItem>
                {classificacoesOcorrencia.map((classificacao) => (
                  <SelectItem key={classificacao.id} value={classificacao.nome}>
                    {classificacao.codigo} - {classificacao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="todos">Todos</SelectItem>
                {statusOptions.map((statusOption) => (
                  <SelectItem key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="risco" className="text-sm font-medium">
              Risco
            </label>
            <Select value={risco} onValueChange={setRisco}>
              <SelectTrigger id="risco">
                <SelectValue placeholder="Todos os riscos" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="todos">Todos</SelectItem>
                {riscoOptions.map((riscoOption) => (
                  <SelectItem key={riscoOption.value} value={riscoOption.value}>
                    {riscoOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OcorrenciasConsultaFilters;