
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface DesviosDashboardFiltersProps {
  year: string;
  month: string;
  ccaId: string;
  disciplinaId: string;
  empresaId: string;
  setYear: (year: string) => void;
  setMonth: (month: string) => void;
  setCcaId: (ccaId: string) => void;
  setDisciplinaId: (disciplinaId: string) => void;
  setEmpresaId: (empresaId: string) => void;
  onClearFilters: () => void;
}

interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
}

interface Empresa {
  id: number;
  nome: string;
}

const DesviosDashboardFilters = ({
  year,
  month,
  ccaId,
  disciplinaId,
  empresaId,
  setYear,
  setMonth,
  setCcaId,
  setDisciplinaId,
  setEmpresaId,
  onClearFilters
}: DesviosDashboardFiltersProps) => {
  const { toast } = useToast();
  const { data: userCCAs = [] } = useUserCCAs();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  // Sort CCAs from smallest to largest by codigo
  const sortedCCAs = [...userCCAs].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  );

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Buscar Disciplinas
        const { data: disciplinasData } = await supabase
          .from('disciplinas')
          .select('id, codigo, nome')
          .eq('ativo', true)
          .order('codigo');

        // Buscar Empresas
        const { data: empresasData } = await supabase
          .from('empresas')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');

        if (disciplinasData) setDisciplinas(disciplinasData);
        if (empresasData) setEmpresas(empresasData);
      } catch (error) {
        console.error('Erro ao buscar opções de filtros:', error);
        toast({
          title: "Erro ao carregar filtros",
          description: "Ocorreu um erro ao buscar as opções de filtros.",
          variant: "destructive"
        });
      }
    };

    fetchFilterOptions();
  }, [toast]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Filtros</CardTitle>
        <CardDescription>
          Selecione os filtros para visualizar os dados (atualizados automaticamente)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="grid gap-1">
            <label htmlFor="year" className="text-sm font-medium">
              Ano
            </label>
            <Select
              value={year}
              onValueChange={setYear}
            >
              <SelectTrigger id="year">
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

          <div className="grid gap-1">
            <label htmlFor="month" className="text-sm font-medium">
              Mês
            </label>
            <Select
              value={month}
              onValueChange={setMonth}
            >
              <SelectTrigger id="month">
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="01">Janeiro</SelectItem>
                <SelectItem value="02">Fevereiro</SelectItem>
                <SelectItem value="03">Março</SelectItem>
                <SelectItem value="04">Abril</SelectItem>
                <SelectItem value="05">Maio</SelectItem>
                <SelectItem value="06">Junho</SelectItem>
                <SelectItem value="07">Julho</SelectItem>
                <SelectItem value="08">Agosto</SelectItem>
                <SelectItem value="09">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="cca" className="text-sm font-medium">
              CCA
            </label>
            <Select
              value={ccaId}
              onValueChange={setCcaId}
            >
              <SelectTrigger id="cca">
                <SelectValue placeholder="Todos os CCAs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {sortedCCAs.map((cca) => (
                  <SelectItem key={cca.id} value={cca.id.toString()}>
                    {cca.codigo} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="disciplina" className="text-sm font-medium">
              Disciplina
            </label>
            <Select
              value={disciplinaId}
              onValueChange={setDisciplinaId}
            >
              <SelectTrigger id="disciplina">
                <SelectValue placeholder="Todas as disciplinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {disciplinas.map((disciplina) => (
                  <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                    {disciplina.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="empresa" className="text-sm font-medium">
              Empresa
            </label>
            <Select
              value={empresaId}
              onValueChange={setEmpresaId}
            >
              <SelectTrigger id="empresa">
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id.toString()}>
                    {empresa.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onClearFilters}
            variant="outline"
          >
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesviosDashboardFilters;
