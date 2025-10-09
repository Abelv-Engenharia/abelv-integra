import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  fetchHSASemRelatorio,
  fetchHSAPendentesPorStatus,
  HSAPendente,
  HSAPendenteFilters
} from "@/services/relatorios/hsaPendentesService";
import { PendenciasStats } from "@/components/relatorios/PendenciasStats";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export default function RelatoriosHSAPendentes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [inspecoes, setInspecoes] = useState<HSAPendente[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsByStatus, setStatsByStatus] = useState<any[]>([]);
  const [ccas, setCcas] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<HSAPendenteFilters>({
    dataInicio: undefined,
    dataFim: undefined,
    ccaId: undefined,
    status: undefined,
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
        fetchHSASemRelatorio(filters),
        fetchHSAPendentesPorStatus()
      ]);
      
      setInspecoes(data);
      setStatsByStatus(stats);
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
    const dataForExport = inspecoes.map(i => ({
      'Data': format(new Date(i.data), 'dd/MM/yyyy'),
      'CCA': i.ccas ? `${i.ccas.codigo} - ${i.ccas.nome}` : '',
      'Responsável': i.responsavel_inspecao,
      'Função': i.funcao,
      'Status': i.status,
      'Desvios': i.desvios_identificados,
      'Observações': i.observacao || '',
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HSA Pendentes");
    XLSX.writeFile(wb, `hsa_sem_relatorio_${format(new Date(), 'yyyyMMdd')}.xlsx`);

    toast({
      title: "Exportação concluída",
      description: "Arquivo Excel gerado com sucesso",
    });
  };

  const stats = [
    { label: "Total de Pendências", value: inspecoes.length, variant: 'danger' as const },
    ...statsByStatus.slice(0, 3).map(s => ({
      label: s.status,
      value: s.count,
      variant: 'warning' as const
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inspeções HSA Sem Anexo</h2>
          <p className="text-muted-foreground">Listagem de inspeções da Hora da Segurança sem relatório</p>
        </div>
        <Button onClick={handleExportExcel} disabled={inspecoes.length === 0}>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Realizada">Realizada</SelectItem>
                  <SelectItem value="Não Realizada">Não Realizada</SelectItem>
                  <SelectItem value="Não Programada">Não Programada</SelectItem>
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
          <CardTitle>Inspeções Pendentes ({inspecoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : inspecoes.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma inspeção sem relatório encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">CCA</th>
                    <th className="text-left p-2">Responsável</th>
                    <th className="text-left p-2">Função</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-right p-2">Desvios</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inspecoes.map((inspecao) => (
                    <tr key={inspecao.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{format(new Date(inspecao.data), 'dd/MM/yyyy')}</td>
                      <td className="p-2">{inspecao.ccas ? `${inspecao.ccas.codigo} - ${inspecao.ccas.nome}` : ''}</td>
                      <td className="p-2">{inspecao.responsavel_inspecao}</td>
                      <td className="p-2">{inspecao.funcao}</td>
                      <td className="p-2">{inspecao.status}</td>
                      <td className="p-2 text-right">{inspecao.desvios_identificados}</td>
                      <td className="p-2 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/hora-seguranca/painel-execucao-hsa`)}
                        >
                          <Eye className="h-4 w-4" />
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
