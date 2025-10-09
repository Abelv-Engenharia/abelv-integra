import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  fetchTreinamentosSemAnexo,
  fetchTreinamentosPendentesPorCCA,
  TreinamentoPendente,
  TreinamentoPendenteFilters
} from "@/services/relatorios/treinamentosPendentesService";
import { PendenciasStats } from "@/components/relatorios/PendenciasStats";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export default function RelatoriosTreinamentosPendentes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [treinamentos, setTreinamentos] = useState<TreinamentoPendente[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsByCCA, setStatsByCCA] = useState<any[]>([]);
  const [ccas, setCcas] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<TreinamentoPendenteFilters>({
    dataInicio: undefined,
    dataFim: undefined,
    ccaId: undefined,
  });

  useEffect(() => {
    loadCCAs();
    loadData();
  }, []);

  const loadCCAs = async () => {
    const { data } = await supabase
      .from('ccas')
      .select('id, codigo, nome')
      .eq('ativo', true)
      .order('codigo');
    
    if (data) setCcas(data);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, stats] = await Promise.all([
        fetchTreinamentosSemAnexo(filters),
        fetchTreinamentosPendentesPorCCA()
      ]);
      
      setTreinamentos(data);
      setStatsByCCA(stats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const dataForExport = treinamentos.map(t => ({
      'Data': format(new Date(t.data), 'dd/MM/yyyy'),
      'CCA': t.cca,
      'Processo': t.processo_treinamento,
      'Tipo': t.tipo_treinamento,
      'Treinamento': t.treinamento_nome,
      'Carga Horária': t.carga_horaria,
      'Efetivo MOD': t.efetivo_mod,
      'Efetivo MOI': t.efetivo_moi,
      'Observações': t.observacoes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Treinamentos Pendentes");
    XLSX.writeFile(wb, `treinamentos_sem_anexo_${format(new Date(), 'yyyyMMdd')}.xlsx`);

    toast({
      title: "Exportação concluída",
      description: "Arquivo Excel gerado com sucesso",
    });
  };

  const stats = [
    { label: "Total de Pendências", value: treinamentos.length, variant: 'danger' as const },
    ...statsByCCA.slice(0, 3).map(s => ({
      label: s.cca,
      value: s.count,
      variant: 'warning' as const
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Treinamentos Sem Anexo</h2>
          <p className="text-muted-foreground">Listagem de treinamentos executados sem lista de presença</p>
        </div>
        <Button onClick={handleExportExcel} disabled={treinamentos.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      <PendenciasStats stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Data Início</label>
              <DatePickerWithManualInput
                value={filters.dataInicio}
                onChange={(date) => setFilters(prev => ({ ...prev, dataInicio: date }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Data Fim</label>
              <DatePickerWithManualInput
                value={filters.dataFim}
                onChange={(date) => setFilters(prev => ({ ...prev, dataFim: date }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">CCA</label>
              <Select value={filters.ccaId} onValueChange={(value) => setFilters(prev => ({ ...prev, ccaId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {ccas.map(cca => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={loadData}>Aplicar Filtros</Button>
            <Button variant="outline" onClick={() => {
              setFilters({});
              loadData();
            }}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Treinamentos Pendentes ({treinamentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : treinamentos.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum treinamento sem anexo encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">CCA</th>
                    <th className="text-left p-2">Processo</th>
                    <th className="text-left p-2">Tipo</th>
                    <th className="text-left p-2">Treinamento</th>
                    <th className="text-right p-2">CH</th>
                    <th className="text-right p-2">MOD</th>
                    <th className="text-right p-2">MOI</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {treinamentos.map((treinamento) => (
                    <tr key={treinamento.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{format(new Date(treinamento.data), 'dd/MM/yyyy')}</td>
                      <td className="p-2">{treinamento.cca}</td>
                      <td className="p-2">{treinamento.processo_treinamento}</td>
                      <td className="p-2">{treinamento.tipo_treinamento}</td>
                      <td className="p-2">{treinamento.treinamento_nome}</td>
                      <td className="p-2 text-right">{treinamento.carga_horaria}</td>
                      <td className="p-2 text-right">{treinamento.efetivo_mod}</td>
                      <td className="p-2 text-right">{treinamento.efetivo_moi}</td>
                      <td className="p-2 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/treinamentos/execucao/${treinamento.id}/editar`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
