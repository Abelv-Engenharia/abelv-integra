import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  fetchOcorrenciasDocumentosIncompletos,
  fetchOcorrenciasPendentesPorTipo,
  OcorrenciaPendente,
  OcorrenciaPendenteFilters
} from "@/services/relatorios/ocorrenciasPendentesService";
import { PendenciasStats } from "@/components/relatorios/PendenciasStats";
import { DocumentosPendentesCell } from "@/components/relatorios/DocumentosPendentesCell";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export default function RelatoriosOcorrenciasPendentes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaPendente[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsByTipo, setStatsByTipo] = useState<any[]>([]);
  const [ccas, setCcas] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<OcorrenciaPendenteFilters>({
    dataInicio: undefined,
    dataFim: undefined,
    ccaId: undefined,
    empresaId: undefined,
    tipoDocumento: undefined,
  });

  useEffect(() => {
    loadCCAs();
    loadEmpresas();
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

  const loadEmpresas = async () => {
    const { data } = await supabase
      .from('empresas')
      .select('id, nome')
      .eq('ativo', true)
      .order('nome');
    
    if (data) setEmpresas(data);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, stats] = await Promise.all([
        fetchOcorrenciasDocumentosIncompletos(filters),
        fetchOcorrenciasPendentesPorTipo()
      ]);
      
      setOcorrencias(data);
      setStatsByTipo(stats);
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
    const dataForExport = ocorrencias.map(o => ({
      'Data': format(new Date(o.data), 'dd/MM/yyyy'),
      'Empresa': o.empresa,
      'CCA': o.cca,
      'Tipo': o.tipo_evento,
      'Risco': o.classificacao_risco,
      'Descrição': o.descricao_ocorrencia.substring(0, 100),
      'Status': o.status_ocorrencia,
      'Documentos Pendentes': o.documentos_pendentes.map(d => d.tipo).join(', '),
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ocorrências Pendentes");
    XLSX.writeFile(wb, `ocorrencias_documentos_incompletos_${format(new Date(), 'yyyyMMdd')}.xlsx`);

    toast({
      title: "Exportação concluída",
      description: "Arquivo Excel gerado com sucesso",
    });
  };

  const stats = [
    { label: "Total de Ocorrências", value: ocorrencias.length, variant: 'danger' as const },
    ...statsByTipo.slice(0, 3).map(s => ({
      label: s.tipo,
      value: s.count,
      variant: 'warning' as const
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ocorrências com Documentos Incompletos</h2>
          <p className="text-muted-foreground">Listagem de ocorrências sem todos os documentos obrigatórios</p>
        </div>
        <Button onClick={handleExportExcel} disabled={ocorrencias.length === 0}>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-sm font-medium">Empresa</label>
              <Select value={filters.empresaId} onValueChange={(value) => setFilters(prev => ({ ...prev, empresaId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {empresas.map(emp => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Documento</label>
              <Select value={filters.tipoDocumento} onValueChange={(value) => setFilters(prev => ({ ...prev, tipoDocumento: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="CAT">CAT</SelectItem>
                  <SelectItem value="Informe Preliminar">Informe Preliminar</SelectItem>
                  <SelectItem value="Relatório de Análise">Relatório de Análise</SelectItem>
                  <SelectItem value="Lições Aprendidas">Lições Aprendidas</SelectItem>
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
          <CardTitle>Ocorrências Pendentes ({ocorrencias.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : ocorrencias.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma ocorrência com documentos pendentes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Empresa</th>
                    <th className="text-left p-2">CCA</th>
                    <th className="text-left p-2">Tipo</th>
                    <th className="text-left p-2">Risco</th>
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-left p-2">Documentos Pendentes</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ocorrencias.map((ocorrencia) => (
                    <tr key={ocorrencia.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{format(new Date(ocorrencia.data), 'dd/MM/yyyy')}</td>
                      <td className="p-2">{ocorrencia.empresa}</td>
                      <td className="p-2">{ocorrencia.cca}</td>
                      <td className="p-2">{ocorrencia.tipo_evento}</td>
                      <td className="p-2">{ocorrencia.classificacao_risco}</td>
                      <td className="p-2 max-w-xs truncate">{ocorrencia.descricao_ocorrencia}</td>
                      <td className="p-2">
                        <DocumentosPendentesCell documentos={ocorrencia.documentos_pendentes} />
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/ocorrencias/${ocorrencia.id}/editar`)}
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
