import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CalendarIcon, Download, FileText, Search, ChevronDown, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EtapaRelatorio {
  id: string;
  atividade: string;
  numero_junta: string;
  nome_linha: string;
  fluido: string;
  tag_valvula: string;
  horas_totais: number;
  // Campos específicos para etapas de equipamentos MEC_EQUIP
  tipo_equipamento?: string;
  tag_equipamento?: string;
  liberacao_base_civil?: string;
  posicionamento_base?: string;
  montagem_componentes?: string;
  alinhamento_final?: string;
  teste_giro?: string;
  limpeza_final?: string;
}

interface AtividadePrincipalRelatorio {
  id: string;
  nome_atividade: string;
  horas_informadas: number;
  horas_totais: number;
  data_atividade: string;
  total_pessoas: number;
  etapas: EtapaRelatorio[];
}

interface FiltrosRelatorio {
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
  atividadePrincipal: string;
  tipoAtividade: string;
  fluido: string;
  linha: string;
}

const RelatoriosMecanica = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<AtividadePrincipalRelatorio[]>([]);
  const [fluidos, setFluidos] = useState<any[]>([]);
  const [linhas, setLinhas] = useState<any[]>([]);
  const [atividadesPrincipais, setAtividadesPrincipais] = useState<any[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    dataInicio: undefined,
    dataFim: undefined,
    atividadePrincipal: 'all',
    tipoAtividade: 'all',
    fluido: 'all',
    linha: 'all'
  });

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    try {
      const [fluidosData, linhasData, atividadesData] = await Promise.all([
        supabase.from('fluidos').select('*').order('nome'),
        supabase.from('linhas').select('*').order('nome_linha'),
        supabase.from('atividades_principais')
          .select('nome_atividade')
          .order('nome_atividade')
      ]);

      if (fluidosData.data) setFluidos(fluidosData.data);
      if (linhasData.data) setLinhas(linhasData.data);
      if (atividadesData.data) {
        const uniqueActivities = Array.from(new Set(atividadesData.data.map(a => a.nome_atividade)));
        setAtividadesPrincipais(uniqueActivities.map(nome => ({ nome_atividade: nome })));
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados iniciais",
        variant: "destructive",
      });
    }
  };

  const gerarRelatorio = useCallback(async () => {
    console.log('🔍 Iniciando geração de relatório com filtros:', filtros);
    if (!filtros.dataInicio || !filtros.dataFim) {
      toast({
        title: "Filtros obrigatórios",
        description: "Por favor, selecione as datas de início e fim",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Buscar relatórios de mecânica no período
      const dataInicioStr = filtros.dataInicio.toISOString().split('T')[0];
      const dataFimStr = filtros.dataFim.toISOString().split('T')[0];
      
      console.log('🔍 Buscando relatórios com datas:', {
        dataInicio: dataInicioStr,
        dataFim: dataFimStr,
        filtroOriginal: {
          inicio: filtros.dataInicio,
          fim: filtros.dataFim
        }
      });
      
      const { data: relatoriosData, error: relatoriosError } = await supabase
        .from('relatorios_mecanica')
        .select('*')
        .gte('data', dataInicioStr)
        .lte('data', dataFimStr);

      if (relatoriosError) throw relatoriosError;

      console.log('📊 Relatórios encontrados:', relatoriosData?.length || 0);
      console.log('📅 Dados dos relatórios:', relatoriosData?.map(r => ({
        id: r.id,
        data: r.data,
        dataFormatada: format(new Date(r.data + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
      })));
      console.log('📅 Filtros de data aplicados:', {
        inicio: dataInicioStr,
        fim: dataFimStr
      });

      if (!relatoriosData || relatoriosData.length === 0) {
        setDados([]);
        toast({
          title: "Nenhum resultado",
          description: "Nenhum relatório encontrado no período selecionado",
        });
        return;
      }

      // Extrair IDs dos relatórios
      const relatorioIds = relatoriosData.map(r => r.id);

      // Buscar atividades principais relacionadas aos relatórios
      const { data: atividadesPrincipaisData, error: atividadesError } = await supabase
        .from('atividades_principais')
        .select('*')
        .in('relatorio_id', relatorioIds);

      if (atividadesError) throw atividadesError;

      if (!atividadesPrincipaisData || atividadesPrincipaisData.length === 0) {
        setDados([]);
        toast({
          title: "Nenhum resultado",
          description: "Nenhuma atividade principal encontrada no período selecionado",
        });
        return;
      }

      // Buscar relatórios de atividades (etapas) relacionadas aos relatórios
      const { data: relatoriosAtividadesData, error: etapasError } = await supabase
        .from('relatorios_atividades')
        .select(`
          *,
          fluidos(nome),
          linhas(nome_linha)
        `)
        .in('relatorio_id', relatorioIds);

      if (etapasError) throw etapasError;

      // Processar dados para estrutura hierárquica agrupada por tipo de atividade
      const dadosFormatados: AtividadePrincipalRelatorio[] = [];
      
      // Mapa para controlar etapas já processadas e evitar duplicações
      const etapasProcessadas = new Set<string>();
      
      // Primeiro, coletar todas as etapas filtradas sem duplicação
      const todasEtapas: (EtapaRelatorio & { 
        relatorio_id: string, 
        data_relatorio: string,
        atividade_principal_nome: string,
        horas_informadas_atividade: number,
        total_pessoas_atividade: number
      })[] = [];
      
      // Para cada atividade principal, coletar suas etapas
      for (const atividadePrincipal of atividadesPrincipaisData) {
        // Aplicar filtro de atividade principal
        if (filtros.atividadePrincipal && filtros.atividadePrincipal !== 'all' && 
            atividadePrincipal.nome_atividade !== filtros.atividadePrincipal) continue;

        // Buscar etapas relacionadas (relatorios_atividades) para este relatório
        const etapasDoRelatorio = relatoriosAtividadesData?.filter(etapa => 
          etapa.relatorio_id === atividadePrincipal.relatorio_id
        ) || [];

        const relatorio = relatoriosData.find(r => r.id === atividadePrincipal.relatorio_id);
        
        console.log('🔗 Processando atividade principal:', {
          atividadeId: atividadePrincipal.id,
          relatorioId: atividadePrincipal.relatorio_id,
          relatorioEncontrado: relatorio ? 'Sim' : 'Não',
          dataRelatorio: relatorio?.data,
          dataFormatada: relatorio?.data ? format(new Date(relatorio.data + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'
        });

        for (const etapa of etapasDoRelatorio) {
          // Verificar se esta etapa já foi processada (evitar duplicação)
          if (etapasProcessadas.has(etapa.id)) continue;
          etapasProcessadas.add(etapa.id);

          // Aplicar filtros de etapa
          if (filtros.tipoAtividade && filtros.tipoAtividade !== 'all' && etapa.atividade !== filtros.tipoAtividade) continue;
          if (filtros.fluido && filtros.fluido !== 'all' && etapa.fluidos?.nome !== filtros.fluido) continue;
          if (filtros.linha && filtros.linha !== 'all' && etapa.linhas?.nome_linha !== filtros.linha) continue;

          // Se há juntas específicas, criar uma etapa para cada junta
          if (etapa.juntas_ids && etapa.juntas_ids.length > 0) {
            for (const juntaId of etapa.juntas_ids) {
              // Buscar dados da junta
              const { data: juntaData } = await supabase
                .from('juntas')
                .select('"Junta"')
                .eq('id', juntaId)
                .maybeSingle();

              const etapaFormatada = {
                id: `etapa-${etapa.id}-junta-${juntaId}`,
                atividade: etapa.atividade,
                numero_junta: juntaData?.Junta || '',
                nome_linha: etapa.linhas?.nome_linha || '',
                fluido: etapa.fluidos?.nome || '',
                tag_valvula: etapa.tag_valvula || '',
                horas_totais: etapa.horas_totais || 0,
              // Campos específicos para equipamentos MEC_EQUIP
              tipo_equipamento: (etapa.detalhes_equipe as any)?.tipoEquipamento || '',
              tag_equipamento: (etapa.detalhes_equipe as any)?.tagEquipamento || '',
              liberacao_base_civil: (etapa.detalhes_equipe as any)?.liberacaoBaseCivil || '',
              posicionamento_base: (etapa.detalhes_equipe as any)?.posicionamentoBase || '',
              montagem_componentes: (etapa.detalhes_equipe as any)?.montagemComponentes || '',
              alinhamento_final: (etapa.detalhes_equipe as any)?.alinhamentoFinal || '',
              teste_giro: (etapa.detalhes_equipe as any)?.testeGiro || '',
              limpeza_final: (etapa.detalhes_equipe as any)?.limpezaFinal || '',
                relatorio_id: atividadePrincipal.relatorio_id,
                data_relatorio: relatorio?.data || '',
                atividade_principal_nome: atividadePrincipal.nome_atividade,
                horas_informadas_atividade: etapa.horas_informadas || 0,
                total_pessoas_atividade: etapa.total_pessoas_equipe || 0
              };
              
              console.log('📝 Etapa com junta processada:', {
                etapaId: etapa.id,
                atividade: etapa.atividade,
                junta: juntaData?.Junta,
                dataOriginal: relatorio?.data,
                dataAtribuida: etapaFormatada.data_relatorio
              });

              todasEtapas.push(etapaFormatada);
            }
          } else {
            // Se não há juntas específicas, criar uma etapa sem junta
            const etapaFormatada = {
              id: `etapa-${etapa.id}-sem-junta`,
              atividade: etapa.atividade,
              numero_junta: '',
              nome_linha: etapa.linhas?.nome_linha || '',
              fluido: etapa.fluidos?.nome || '',
              tag_valvula: etapa.tag_valvula || '',
              horas_totais: etapa.horas_totais || 0,
              // Campos específicos para equipamentos MEC_EQUIP
              tipo_equipamento: (etapa.detalhes_equipe as any)?.tipoEquipamento || '',
              tag_equipamento: (etapa.detalhes_equipe as any)?.tagEquipamento || '',
              liberacao_base_civil: (etapa.detalhes_equipe as any)?.liberacaoBaseCivil || '',
              posicionamento_base: (etapa.detalhes_equipe as any)?.posicionamentoBase || '',
              montagem_componentes: (etapa.detalhes_equipe as any)?.montagemComponentes || '',
              alinhamento_final: (etapa.detalhes_equipe as any)?.alinhamentoFinal || '',
              teste_giro: (etapa.detalhes_equipe as any)?.testeGiro || '',
              limpeza_final: (etapa.detalhes_equipe as any)?.limpezaFinal || '',
              relatorio_id: atividadePrincipal.relatorio_id,
              data_relatorio: relatorio?.data || '',
              atividade_principal_nome: atividadePrincipal.nome_atividade,
              horas_informadas_atividade: etapa.horas_informadas || 0,
              total_pessoas_atividade: etapa.total_pessoas_equipe || 0
            };

            todasEtapas.push(etapaFormatada);
          }
        }
      }

      // Agrupar por tipo de atividade (campo 'atividade' das etapas)
      const atividadesAgrupadas = new Map<string, typeof todasEtapas>();
      
      for (const etapa of todasEtapas) {
        const tipoAtividade = etapa.atividade;
        
        // Debug para MEC_EQUIP
        if (tipoAtividade === 'MEC_EQUIP') {
          console.log('Debug etapa MEC_EQUIP:', {
            id: etapa.id,
            tipo_equipamento: etapa.tipo_equipamento,
            tag_equipamento: etapa.tag_equipamento,
            liberacao_base_civil: etapa.liberacao_base_civil,
            posicionamento_base: etapa.posicionamento_base,
            montagem_componentes: etapa.montagem_componentes,
            alinhamento_final: etapa.alinhamento_final,
            teste_giro: etapa.teste_giro,
            limpeza_final: etapa.limpeza_final
          });
        }
        
        if (!atividadesAgrupadas.has(tipoAtividade)) {
          atividadesAgrupadas.set(tipoAtividade, []);
        }
        atividadesAgrupadas.get(tipoAtividade)!.push(etapa);
      }

      // Converter para formato final
      for (const [tipoAtividade, etapasDoTipo] of atividadesAgrupadas) {
        // Calcular totais para este tipo de atividade
        const horasTotais = etapasDoTipo.reduce((acc, etapa) => acc + etapa.horas_totais, 0);
        const horasInformadas = etapasDoTipo.reduce((acc, etapa) => acc + etapa.horas_informadas_atividade, 0);
        const totalPessoas = Math.max(...etapasDoTipo.map(etapa => etapa.total_pessoas_atividade));
        
        // Usar a data mais recente
        const datasUnicas = [...new Set(etapasDoTipo.map(etapa => etapa.data_relatorio))];
        const dataAtividade = datasUnicas.sort().reverse()[0];
        
        console.log(`📅 Processando atividade ${tipoAtividade}:`, {
          etapas: etapasDoTipo.length,
          dataProcessada: dataAtividade,
          datasOriginais: datasUnicas
        });

        const atividadePrincipalFormatada: AtividadePrincipalRelatorio = {
          id: `grupo-${tipoAtividade.replace(/\s+/g, '-').toLowerCase()}`,
          nome_atividade: tipoAtividade,
          horas_informadas: horasInformadas,
          horas_totais: horasTotais,
          data_atividade: dataAtividade,
          total_pessoas: totalPessoas,
          etapas: etapasDoTipo.map(etapa => ({
            id: etapa.id,
            atividade: etapa.atividade,
            numero_junta: etapa.numero_junta,
            nome_linha: etapa.nome_linha,
            fluido: etapa.fluido,
            tag_valvula: etapa.tag_valvula,
            horas_totais: etapa.horas_totais
          }))
        };

        dadosFormatados.push(atividadePrincipalFormatada);
      }

      // Ordenar por nome da atividade
      dadosFormatados.sort((a, b) => a.nome_atividade.localeCompare(b.nome_atividade));

      setDados(dadosFormatados);
      
      console.log('✅ Dados finais processados:', dadosFormatados.map(d => ({
        atividade: d.nome_atividade,
        data: d.data_atividade,
        etapas: d.etapas.length
      })));
      
      if (dadosFormatados.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Nenhum dado encontrado com os filtros aplicados",
        });
      } else {
        const totalEtapas = dadosFormatados.reduce((acc, atividade) => acc + atividade.etapas.length, 0);
        toast({
          title: "Relatório gerado",
          description: `${dadosFormatados.length} atividades e ${totalEtapas} etapas encontradas`,
        });
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filtros]);


  const exportarCSV = () => {
    const headers = ['Atividade Principal', 'Horas Informadas', 'Horas Totais', 'Data', 'Etapa', 'Junta', 'Linha', 'Fluido', 'Tag Válvula'];
    const rows: string[] = [];
    
    dados.forEach(atividade => {
      atividade.etapas.forEach(etapa => {
        rows.push([
          atividade.nome_atividade,
          atividade.horas_informadas.toString(),
          atividade.horas_totais.toString(),
          format(new Date(atividade.data_atividade + 'T12:00:00'), 'dd/MM/yyyy'),
          etapa.atividade,
          etapa.numero_junta,
          etapa.nome_linha,
          etapa.fluido,
          etapa.tag_valvula
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_mecanica_hierarquico_${format(new Date(), 'dd-MM-yyyy')}.csv`;
    link.click();
  };

  const exportarExcel = () => {
    // Criar planilha com dados hierárquicos
    const dadosDetalhados: any[] = [];
    dados.forEach(atividade => {
      atividade.etapas.forEach((etapa, index) => {
        dadosDetalhados.push({
          'Atividade Principal': index === 0 ? atividade.nome_atividade : '',
          'Horas Informadas': index === 0 ? Number(atividade.horas_informadas.toFixed(1)) : '',
          'Horas Totais Atividade': index === 0 ? Number(atividade.horas_totais.toFixed(1)) : '',
          'Data': index === 0 ? format(new Date(atividade.data_atividade + 'T12:00:00'), 'dd/MM/yyyy') : '',
          'Etapa': etapa.atividade,
          'Junta': etapa.numero_junta,
          'Linha': etapa.nome_linha,
          'Fluido': etapa.fluido,
          'Tag Válvula': etapa.tag_valvula
        });
      });
    });

    // Criar dados do resumo
    const dadosResumo = [
      ['Métrica', 'Valor'],
      ['Total de Horas Informadas', Number(totais.totalHorasInformadas.toFixed(1))],
      ['Total de Horas Totais', Number(totais.totalHorasTotais.toFixed(1))],
      ['Total de Atividades', totais.totalAtividades],
      ['Total de Etapas', totais.totalEtapas],
      ['Etapas de Solda', totais.etapasSolda],
      ['Etapas de Acoplamento', totais.etapasAcoplamento],
      [''],
      ['Período do Relatório:', ''],
      ['Data Início', filtros.dataInicio ? format(filtros.dataInicio, 'dd/MM/yyyy') : ''],
      ['Data Fim', filtros.dataFim ? format(filtros.dataFim, 'dd/MM/yyyy') : ''],
      ['Gerado em', format(new Date(), 'dd/MM/yyyy HH:mm:ss')]
    ];

    // Criar workbook
    const wb = XLSX.utils.book_new();

    // Adicionar aba de dados detalhados
    const wsDetalhes = XLSX.utils.json_to_sheet(dadosDetalhados);
    
    // Definir larguras das colunas
    wsDetalhes['!cols'] = [
      { width: 20 }, // Atividade Principal
      { width: 15 }, // Horas Informadas
      { width: 18 }, // Horas Totais Atividade
      { width: 12 }, // Data
      { width: 15 }, // Etapa
      { width: 15 }, // Junta
      { width: 20 }, // Linha
      { width: 15 }, // Fluido
      { width: 15 }  // Tag Válvula
    ];

    XLSX.utils.book_append_sheet(wb, wsDetalhes, 'Dados Hierárquicos');

    // Adicionar aba de resumo
    const wsResumo = XLSX.utils.aoa_to_sheet(dadosResumo);
    
    // Definir larguras das colunas para resumo
    wsResumo['!cols'] = [
      { width: 25 }, // Métrica
      { width: 15 }  // Valor
    ];

    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

    // Salvar arquivo
    XLSX.writeFile(wb, `relatorio_mecanica_hierarquico_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
  };

  const totais = useMemo(() => {
    const totalHorasInformadas = dados.reduce((acc, atividade) => acc + atividade.horas_informadas, 0);
    const totalHorasTotais = dados.reduce((acc, atividade) => acc + atividade.horas_totais, 0);
    const totalAtividades = dados.length;
    const totalEtapas = dados.reduce((acc, atividade) => acc + atividade.etapas.length, 0);
    const etapasSolda = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.atividade.toLowerCase().includes('solda')).length, 0
    );
    const etapasAcoplamento = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.atividade.toLowerCase().includes('acoplamento')).length, 0
    );

    return { 
      totalHorasInformadas, 
      totalHorasTotais, 
      totalAtividades, 
      totalEtapas, 
      etapasSolda, 
      etapasAcoplamento 
    };
  }, [dados]);

  const toggleActivity = useCallback((activityId: string) => {
    setExpandedActivities(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(activityId)) {
        newExpanded.delete(activityId);
      } else {
        newExpanded.add(activityId);
      }
      return newExpanded;
    });
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios - Mecânica/Tubulação</h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados das atividades de mecânica e tubulação
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros do Relatório
            </CardTitle>
            <CardDescription>
              Configure os filtros para gerar seu relatório personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Data Início *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filtros.dataInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filtros.dataInicio ? format(filtros.dataInicio, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filtros.dataInicio}
                      onSelect={(date) => setFiltros(prev => ({ ...prev, dataInicio: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data Fim *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filtros.dataFim && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filtros.dataFim ? format(filtros.dataFim, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filtros.dataFim}
                      onSelect={(date) => setFiltros(prev => ({ ...prev, dataFim: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Atividade Principal</Label>
                <Select
                  value={filtros.atividadePrincipal}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, atividadePrincipal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as atividades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as atividades</SelectItem>
                    {atividadesPrincipais.map((atividade) => (
                      <SelectItem key={atividade.nome_atividade} value={atividade.nome_atividade}>
                        {atividade.nome_atividade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Etapa</Label>
                <Select
                  value={filtros.tipoAtividade}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, tipoAtividade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="Solda">Solda</SelectItem>
                    <SelectItem value="Acoplamento">Acoplamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fluido</Label>
                <Select
                  value={filtros.fluido}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, fluido: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os fluidos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os fluidos</SelectItem>
                    {fluidos.map((fluido) => (
                      <SelectItem key={fluido.id} value={fluido.nome}>
                        {fluido.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Linha</Label>
                <Select
                  value={filtros.linha}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, linha: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as linhas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as linhas</SelectItem>
                    {linhas.map((linha) => (
                      <SelectItem key={linha.id} value={linha.nome_linha}>
                        {linha.nome_linha}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={gerarRelatorio} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {dados.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{totais.totalHorasInformadas.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Horas Informadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{totais.totalHorasTotais.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Horas Totais</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{totais.totalAtividades}</div>
                  <p className="text-xs text-muted-foreground">Atividades</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{totais.totalEtapas}</div>
                  <p className="text-xs text-muted-foreground">Etapas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{totais.etapasSolda}</div>
                  <p className="text-xs text-muted-foreground">Etapas de Solda</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{totais.etapasAcoplamento}</div>
                  <p className="text-xs text-muted-foreground">Etapas de Acoplamento</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resultados do Relatório
                    </CardTitle>
                    <CardDescription>
                      {dados.length} atividades com {totais.totalEtapas} etapas encontradas
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportarCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportarExcel}>
                      <Download className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dados.map((atividade) => (
                  <Collapsible
                    key={atividade.id}
                    open={expandedActivities.has(atividade.id)}
                    onOpenChange={() => toggleActivity(atividade.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full p-4 h-auto flex justify-between items-center hover:bg-accent"
                      >
                        <div className="flex items-center gap-4">
                          {expandedActivities.has(atividade.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <div className="text-left">
                            <h4 className="font-semibold text-lg">{atividade.nome_atividade}</h4>
                            <p className="text-sm text-muted-foreground">
                              {atividade.data_atividade ? format(new Date(atividade.data_atividade + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : 'Data não disponível'} • 
                              {atividade.etapas.length} etapas executadas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2">
                            <Badge variant="secondary">{atividade.horas_informadas}h informadas</Badge>
                            <Badge variant="outline">{atividade.horas_totais}h totais</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {atividade.total_pessoas} pessoas na equipe
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <Card>
                        <CardContent className="p-4">
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {atividade.nome_atividade === 'MEC_EQUIP' ? (
                                    // Cabeçalho específico para MEC_EQUIP
                                    <>
                                      <TableHead>Atividade</TableHead>
                                      <TableHead>Tipo de Equipamento</TableHead>
                                      <TableHead>TAG</TableHead>
                                      <TableHead>Liberação Base Civil</TableHead>
                                      <TableHead>Posicionamento na Base</TableHead>
                                      <TableHead>Montagem dos Componentes</TableHead>
                                      <TableHead>Alinhamento Final do Acoplamento</TableHead>
                                      <TableHead>Teste de Giro</TableHead>
                                      <TableHead>Limpeza Final</TableHead>
                                      <TableHead className="text-right">Horas</TableHead>
                                    </>
                                  ) : (
                                    // Cabeçalho padrão para outras atividades
                                    <>
                                      <TableHead>Etapa</TableHead>
                                      <TableHead>Junta</TableHead>
                                      <TableHead>Linha</TableHead>
                                      <TableHead>Fluido</TableHead>
                                      <TableHead>TAG Válvula</TableHead>
                                      <TableHead className="text-right">Horas</TableHead>
                                    </>
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {atividade.nome_atividade === 'MEC_EQUIP' ? (
                                  // Layout especial para MEC_EQUIP com dados de equipamentos
                                  <>
                                    {atividade.etapas?.map((etapa, index) => {
                                      // Debug: vamos ver os dados da etapa
                                      console.log('Dados da etapa MEC_EQUIP:', etapa);
                                      return (
                                        <TableRow key={`equip-${index}`}>
                                          <TableCell>
                                            <Badge variant="outline">{etapa.atividade}</Badge>
                                          </TableCell>
                                          <TableCell>{etapa.tipo_equipamento || 'Não informado'}</TableCell>
                                          <TableCell>{etapa.tag_equipamento || etapa.tag_valvula || '-'}</TableCell>
                                          <TableCell className="text-center">
                                            {etapa.liberacao_base_civil ? `${etapa.liberacao_base_civil}%` : '-'}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {etapa.posicionamento_base ? `${etapa.posicionamento_base}%` : '-'}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {etapa.montagem_componentes ? `${etapa.montagem_componentes}%` : '-'}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {etapa.alinhamento_final ? `${etapa.alinhamento_final}%` : '-'}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {etapa.teste_giro ? `${etapa.teste_giro}%` : '-'}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {etapa.limpeza_final ? `${etapa.limpeza_final}%` : '-'}
                                          </TableCell>
                                          <TableCell className="text-right">{etapa.horas_totais.toFixed(1)}h</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </>
                                ) : (
                                  // Layout padrão para outras atividades
                                  atividade.etapas.map((etapa) => (
                                    <TableRow key={etapa.id}>
                                      <TableCell>
                                        <Badge variant="outline">{etapa.atividade}</Badge>
                                      </TableCell>
                                      <TableCell>{etapa.numero_junta}</TableCell>
                                      <TableCell>{etapa.nome_linha}</TableCell>
                                      <TableCell>{etapa.fluido}</TableCell>
                                      <TableCell>{etapa.tag_valvula}</TableCell>
                                      <TableCell className="text-right">{etapa.horas_totais.toFixed(1)}h</TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default React.memo(RelatoriosMecanica);