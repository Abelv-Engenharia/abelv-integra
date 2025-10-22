import { useState, useEffect, useCallback, useMemo } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CalendarIcon, Search, FileText, Download, ChevronDown, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import * as XLSX from "xlsx"

// Interfaces
interface EtapaRelatorioEletrica {
  id: string;
  tipo_atividade: string;
  desenho_nome?: string;
  tipo_infraestrutura_nome?: string;
  dimensao_infra?: string;
  quantidade?: string;
  cabo_info?: string;
  ponto_origem?: string;
  ponto_destino?: string;
  metragem?: string;
  tipo_equipamento?: string;
  equipamento_tag?: string;
  fluido_nome?: string;
  tipo_instrumento?: string;
  instrumento_tag?: string;
  tipo_luminaria?: string;
  quantidade_montada?: string;
  detalhamento_atividade?: string;
  observacoes?: string;
}

interface AtividadePrincipalRelatorioEletrica {
  id: string;
  nome_atividade: string;
  horas_informadas: number;
  horas_totais: number;
  data_atividade: string;
  total_pessoas: number;
  etapas: EtapaRelatorioEletrica[];
}

interface FiltrosRelatorioEletrica {
  dataInicio: Date | undefined;
  dataFim: Date | undefined;
  projeto: string;
  encarregado: string;
  atividade: string;
}

export default function EletricaRelatorios() {
  // Estados - serão implementados na próxima etapa
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState<AtividadePrincipalRelatorioEletrica[]>([])
  const [ccas, setCcas] = useState<any[]>([])
  const [encarregados, setEncarregados] = useState<any[]>([])
  const [encarregadosFiltrados, setEncarregadosFiltrados] = useState<any[]>([])
  const [atividadesCadastradas, setAtividadesCadastradas] = useState<any[]>([])
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set())
  const [filtros, setFiltros] = useState<FiltrosRelatorioEletrica>({
    dataInicio: undefined,
    dataFim: undefined,
    projeto: 'all',
    encarregado: 'all',
    atividade: 'all'
  })

  // Função de carregamento de dados iniciais
  const carregarDadosIniciais = async () => {
    try {
      const [ccasData, encarregadosData, atividadesData] = await Promise.all([
        supabase.from('ccas').select('*').eq('ativo', true).order('codigo'),
        supabase.from('encarregados_eletrica').select('*').eq('ativo', true).order('nome'),
        supabase.from('atividades_cadastradas')
          .select('*')
          .eq('modulo', 'eletrica')
          .eq('ativo', true)
          .order('nome')
      ])

      if (ccasData.data) setCcas(ccasData.data)
      if (encarregadosData.data) setEncarregados(encarregadosData.data)
      if (atividadesData.data) setAtividadesCadastradas(atividadesData.data)

      console.log('Dados iniciais carregados:', {
        ccas: ccasData.data?.length || 0,
        encarregados: encarregadosData.data?.length || 0,
        atividades: atividadesData.data?.length || 0
      })
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
      toast.error('Erro ao carregar dados iniciais')
    }
  }

  const gerarRelatorio = useCallback(async () => {
    if (!filtros.dataInicio || !filtros.dataFim) {
      toast.error("Por favor, selecione as datas de início e fim")
      return
    }

    setLoading(true)
    try {
      // 1. Buscar relatórios de elétrica no período
      const dataInicioStr = format(filtros.dataInicio, 'yyyy-MM-dd')
      const dataFimStr = format(filtros.dataFim, 'yyyy-MM-dd')
      
      let query = supabase
        .from('relatorios_eletrica')
        .select('*')
        .gte('data', dataInicioStr)
        .lte('data', dataFimStr)
      
      // Aplicar filtro de projeto (CCA)
      if (filtros.projeto && filtros.projeto !== 'all') {
        query = query.eq('cca_id', filtros.projeto)
      }
      
      // Aplicar filtro de encarregado
      if (filtros.encarregado && filtros.encarregado !== 'all') {
        query = query.eq('encarregado_id', filtros.encarregado)
      }

      const { data: relatoriosData, error: relatoriosError } = await query

      if (relatoriosError) throw relatoriosError

      if (!relatoriosData || relatoriosData.length === 0) {
        setDados([])
        toast.info("Nenhum relatório encontrado no período selecionado")
        return
      }

      // 2. Extrair IDs dos relatórios
      const relatorioIds = relatoriosData.map(r => r.id)

      // 3. Buscar atividades principais relacionadas
      let atividadesQuery = supabase
        .from('atividades_principais_eletrica')
        .select('*')
        .in('relatorio_id', relatorioIds)
      
      // Aplicar filtro de atividade
      if (filtros.atividade && filtros.atividade !== 'all') {
        atividadesQuery = atividadesQuery.eq('nome_atividade', filtros.atividade)
      }

      const { data: atividadesPrincipaisData, error: atividadesError } = await atividadesQuery

      if (atividadesError) throw atividadesError

      if (!atividadesPrincipaisData || atividadesPrincipaisData.length === 0) {
        setDados([])
        toast.info("Nenhuma atividade encontrada com os filtros aplicados")
        return
      }

      // 4. Buscar registros de atividades (etapas) com JOINs
      const atividadeIds = atividadesPrincipaisData.map(a => a.id)
      
      const { data: registrosAtividadesData, error: registrosError } = await supabase
        .from('registro_atividades_eletrica')
        .select(`
          *,
          desenhos_eletrica(codigo),
          tipos_infraestrutura_eletrica(nome),
          fluidos(nome),
          instrumentos_eletrica(tag),
          equipamentos_eletricos(tag),
          luminarias_eletrica(tag)
        `)
        .in('atividade_principal_id', atividadeIds)

      if (registrosError) throw registrosError

      // 5. Processar dados para estrutura hierárquica
      const dadosFormatados: AtividadePrincipalRelatorioEletrica[] = []
      const etapasProcessadas = new Set<string>()

      for (const atividadePrincipal of atividadesPrincipaisData) {
        const etapasDoRelatorio = registrosAtividadesData?.filter(etapa => 
          etapa.atividade_principal_id === atividadePrincipal.id
        ) || []

        const relatorio = relatoriosData.find(r => r.id === atividadePrincipal.relatorio_id)

        const etapasFormatadas: EtapaRelatorioEletrica[] = []

        for (const etapa of etapasDoRelatorio) {
          if (etapasProcessadas.has(etapa.id)) continue
          etapasProcessadas.add(etapa.id)

          const etapaFormatada: EtapaRelatorioEletrica = {
            id: etapa.id,
            tipo_atividade: etapa.tipo_atividade,
            desenho_nome: etapa.desenhos_eletrica?.codigo,
            tipo_infraestrutura_nome: etapa.tipos_infraestrutura_eletrica?.nome,
            dimensao_infra: etapa.dimensao_infra,
            quantidade: etapa.quantidade,
            ponto_origem: etapa.ponto_origem,
            ponto_destino: etapa.ponto_destino,
            metragem: etapa.metragem,
            tipo_equipamento: etapa.tipo_equipamento,
            equipamento_tag: etapa.equipamentos_eletricos?.tag,
            fluido_nome: etapa.fluidos?.nome,
            tipo_instrumento: etapa.tipo_instrumento,
            instrumento_tag: etapa.instrumentos_eletrica?.tag,
            tipo_luminaria: etapa.tipo_luminaria,
            quantidade_montada: etapa.quantidade_montada,
            detalhamento_atividade: etapa.detalhamento_atividade,
            observacoes: etapa.observacoes
          }

          etapasFormatadas.push(etapaFormatada)
        }

        const atividadeFormatada: AtividadePrincipalRelatorioEletrica = {
          id: atividadePrincipal.id,
          nome_atividade: atividadePrincipal.nome_atividade,
          horas_informadas: atividadePrincipal.horas_informadas,
          horas_totais: atividadePrincipal.horas_totais,
          data_atividade: relatorio?.data || '',
          total_pessoas: atividadePrincipal.total_pessoas,
          etapas: etapasFormatadas
        }

        dadosFormatados.push(atividadeFormatada)
      }

      // Ordenar por nome da atividade
      dadosFormatados.sort((a, b) => a.nome_atividade.localeCompare(b.nome_atividade))

      setDados(dadosFormatados)
      
      if (dadosFormatados.length === 0) {
        toast.info("Nenhum dado encontrado com os filtros aplicados")
      } else {
        const totalEtapas = dadosFormatados.reduce((acc, atividade) => acc + atividade.etapas.length, 0)
        toast.success(`Relatório gerado: ${dadosFormatados.length} atividades e ${totalEtapas} etapas encontradas`)
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error("Erro ao gerar relatório")
    } finally {
      setLoading(false)
    }
  }, [filtros])

  const toggleActivity = (id: string) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Calcular estatísticas
  const totais = useMemo(() => {
    const totalHorasInformadas = dados.reduce((acc, atividade) => acc + atividade.horas_informadas, 0)
    const totalHorasTotais = dados.reduce((acc, atividade) => acc + atividade.horas_totais, 0)
    const totalAtividades = dados.length
    const totalEtapas = dados.reduce((acc, atividade) => acc + atividade.etapas.length, 0)
    
    const etapasInfra = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.tipo_atividade === 'ELE-INFRA').length, 0
    )
    const etapasCabos = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.tipo_atividade === 'ELE-CABOS').length, 0
    )
    const etapasEquipamentos = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.tipo_atividade === 'ELE-EQUIP').length, 0
    )
    const etapasInstrumentos = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.tipo_atividade === 'INS-INST').length, 0
    )
    const etapasLuminarias = dados.reduce((acc, atividade) => 
      acc + atividade.etapas.filter(etapa => etapa.tipo_atividade === 'ELE-LUMI').length, 0
    )

    return { 
      totalHorasInformadas, 
      totalHorasTotais, 
      totalAtividades, 
      totalEtapas,
      etapasInfra,
      etapasCabos,
      etapasEquipamentos,
      etapasInstrumentos,
      etapasLuminarias
    }
  }, [dados])

  const exportarCSV = () => {
    if (dados.length === 0) {
      toast.error("Não há dados para exportar")
      return
    }

    try {
      // Cabeçalhos do CSV
      const headers = [
        'Data',
        'Atividade',
        'Horas Informadas',
        'Horas Totais',
        'Total Pessoas',
        'Tipo Etapa',
        'Desenho',
        'Tipo Infraestrutura',
        'Dimensão',
        'Quantidade',
        'Origem',
        'Destino',
        'Metragem',
        'Tipo Equipamento',
        'Tag Equipamento',
        'Fluido',
        'Tipo Instrumento',
        'Tag Instrumento',
        'Tipo Luminária',
        'Qtd Montada',
        'Detalhamento',
        'Observações'
      ]

      // Construir linhas do CSV
      const rows: string[][] = []
      
      dados.forEach(atividade => {
        if (atividade.etapas.length === 0) {
          // Atividade sem etapas
          rows.push([
            format(new Date(atividade.data_atividade), "dd/MM/yyyy", { locale: ptBR }),
            atividade.nome_atividade,
            atividade.horas_informadas.toString(),
            atividade.horas_totais.toString(),
            atividade.total_pessoas.toString(),
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
          ])
        } else {
          // Atividade com etapas
          atividade.etapas.forEach((etapa, index) => {
            rows.push([
              index === 0 ? format(new Date(atividade.data_atividade), "dd/MM/yyyy", { locale: ptBR }) : '',
              index === 0 ? atividade.nome_atividade : '',
              index === 0 ? atividade.horas_informadas.toString() : '',
              index === 0 ? atividade.horas_totais.toString() : '',
              index === 0 ? atividade.total_pessoas.toString() : '',
              etapa.tipo_atividade || '',
              etapa.desenho_nome || '',
              etapa.tipo_infraestrutura_nome || '',
              etapa.dimensao_infra || '',
              etapa.quantidade || '',
              etapa.ponto_origem || '',
              etapa.ponto_destino || '',
              etapa.metragem || '',
              etapa.tipo_equipamento || '',
              etapa.equipamento_tag || '',
              etapa.fluido_nome || '',
              etapa.tipo_instrumento || '',
              etapa.instrumento_tag || '',
              etapa.tipo_luminaria || '',
              etapa.quantidade_montada || '',
              etapa.detalhamento_atividade || '',
              etapa.observacoes || ''
            ])
          })
        }
      })

      // Converter para CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      const dataInicio = filtros.dataInicio ? format(filtros.dataInicio, 'yyyyMMdd') : 'inicio'
      const dataFim = filtros.dataFim ? format(filtros.dataFim, 'yyyyMMdd') : 'fim'
      const fileName = `relatorio_eletrica_${dataInicio}_${dataFim}.csv`
      
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("CSV exportado com sucesso")
    } catch (error) {
      console.error('Erro ao exportar CSV:', error)
      toast.error("Erro ao exportar CSV")
    }
  }

  const exportarExcel = () => {
    if (dados.length === 0) {
      toast.error("Não há dados para exportar")
      return
    }

    try {
      // Preparar dados para o Excel
      const worksheetData: any[] = []
      
      // Cabeçalhos
      worksheetData.push([
        'Data',
        'Atividade',
        'Horas Informadas',
        'Horas Totais',
        'Total Pessoas',
        'Tipo Etapa',
        'Desenho',
        'Tipo Infraestrutura',
        'Dimensão',
        'Quantidade',
        'Origem',
        'Destino',
        'Metragem',
        'Tipo Equipamento',
        'Tag Equipamento',
        'Fluido',
        'Tipo Instrumento',
        'Tag Instrumento',
        'Tipo Luminária',
        'Qtd Montada',
        'Detalhamento',
        'Observações'
      ])

      // Dados
      dados.forEach(atividade => {
        if (atividade.etapas.length === 0) {
          worksheetData.push([
            format(new Date(atividade.data_atividade), "dd/MM/yyyy", { locale: ptBR }),
            atividade.nome_atividade,
            atividade.horas_informadas,
            atividade.horas_totais,
            atividade.total_pessoas,
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
          ])
        } else {
          atividade.etapas.forEach((etapa, index) => {
            worksheetData.push([
              index === 0 ? format(new Date(atividade.data_atividade), "dd/MM/yyyy", { locale: ptBR }) : '',
              index === 0 ? atividade.nome_atividade : '',
              index === 0 ? atividade.horas_informadas : '',
              index === 0 ? atividade.horas_totais : '',
              index === 0 ? atividade.total_pessoas : '',
              etapa.tipo_atividade || '',
              etapa.desenho_nome || '',
              etapa.tipo_infraestrutura_nome || '',
              etapa.dimensao_infra || '',
              etapa.quantidade || '',
              etapa.ponto_origem || '',
              etapa.ponto_destino || '',
              etapa.metragem || '',
              etapa.tipo_equipamento || '',
              etapa.equipamento_tag || '',
              etapa.fluido_nome || '',
              etapa.tipo_instrumento || '',
              etapa.instrumento_tag || '',
              etapa.tipo_luminaria || '',
              etapa.quantidade_montada || '',
              etapa.detalhamento_atividade || '',
              etapa.observacoes || ''
            ])
          })
        }
      })

      // Criar workbook e worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Elétrica')

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 12 }, // Data
        { wch: 30 }, // Atividade
        { wch: 12 }, // Horas Informadas
        { wch: 12 }, // Horas Totais
        { wch: 12 }, // Total Pessoas
        { wch: 15 }, // Tipo Etapa
        { wch: 20 }, // Desenho
        { wch: 20 }, // Tipo Infraestrutura
        { wch: 12 }, // Dimensão
        { wch: 12 }, // Quantidade
        { wch: 15 }, // Origem
        { wch: 15 }, // Destino
        { wch: 12 }, // Metragem
        { wch: 20 }, // Tipo Equipamento
        { wch: 15 }, // Tag Equipamento
        { wch: 15 }, // Fluido
        { wch: 20 }, // Tipo Instrumento
        { wch: 15 }, // Tag Instrumento
        { wch: 20 }, // Tipo Luminária
        { wch: 12 }, // Qtd Montada
        { wch: 30 }, // Detalhamento
        { wch: 30 }  // Observações
      ]
      worksheet['!cols'] = colWidths

      // Gerar arquivo
      const dataInicio = filtros.dataInicio ? format(filtros.dataInicio, 'yyyyMMdd') : 'inicio'
      const dataFim = filtros.dataFim ? format(filtros.dataFim, 'yyyyMMdd') : 'fim'
      const fileName = `relatorio_eletrica_${dataInicio}_${dataFim}.xlsx`
      
      XLSX.writeFile(workbook, fileName)

      toast.success("Excel exportado com sucesso")
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      toast.error("Erro ao exportar Excel")
    }
  }

  useEffect(() => {
    carregarDadosIniciais()
  }, [])

  // Filtro em cascata: atualizar encarregados quando projeto mudar
  useEffect(() => {
    if (filtros.projeto === 'all') {
      // Mostrar todos os encarregados
      setEncarregadosFiltrados(encarregados)
    } else {
      // Filtrar encarregados pelo projeto selecionado
      const encarregadosDoProjeto = encarregados.filter(
        enc => enc.cca_id === filtros.projeto
      )
      setEncarregadosFiltrados(encarregadosDoProjeto)
      
      // Resetar seleção de encarregado
      setFiltros(prev => ({ ...prev, encarregado: 'all' }))
    }
  }, [filtros.projeto, encarregados])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Card de Filtros */}
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Search className="h-5 w-5" />
              Filtros do Relatório
            </CardTitle>
            <CardDescription>
              Configure os filtros para gerar seu relatório personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Data Início */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span className="text-destructive">*</span>
                  Data Início
                </Label>
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
                      {filtros.dataInicio ? format(filtros.dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
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

              {/* Data Fim */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span className="text-destructive">*</span>
                  Data Fim
                </Label>
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
                      {filtros.dataFim ? format(filtros.dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
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

              {/* Projeto (CCA) */}
              <div className="space-y-2">
                <Label>Projeto</Label>
                <Select 
                  value={filtros.projeto} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, projeto: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os projetos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os projetos</SelectItem>
                    {ccas.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Encarregado */}
              <div className="space-y-2">
                <Label>
                  Encarregado
                  {filtros.projeto !== 'all' && encarregadosFiltrados.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({encarregadosFiltrados.length} disponível{encarregadosFiltrados.length !== 1 ? 'eis' : ''})
                    </span>
                  )}
                </Label>
                <Select 
                  value={filtros.encarregado} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, encarregado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os encarregados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os encarregados</SelectItem>
                    {encarregadosFiltrados.length === 0 && filtros.projeto !== 'all' ? (
                      <SelectItem value="none" disabled>
                        Nenhum encarregado disponível para este projeto
                      </SelectItem>
                    ) : (
                      encarregadosFiltrados.map((enc) => (
                        <SelectItem key={enc.id} value={enc.id}>
                          {enc.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Atividades */}
              <div className="space-y-2">
                <Label>Atividades</Label>
                <Select 
                  value={filtros.atividade} 
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, atividade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as atividades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as atividades</SelectItem>
                    {atividadesCadastradas.map((atv) => (
                      <SelectItem key={atv.id} value={atv.nome}>
                        {atv.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Botões Gerar e Exportar */}
            <div className="flex gap-2 mt-4">
              <Button onClick={gerarRelatorio} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
              
              {dados.length > 0 && (
                <>
                  <Button onClick={exportarExcel} variant="outline" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                  <Button onClick={exportarCSV} variant="outline" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cards de Estatísticas */}
        {dados.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.totalHorasInformadas.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Horas Informadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.totalHorasTotais.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Horas Totais</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.totalAtividades}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Atividades</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.totalEtapas}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total Etapas</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.etapasInfra}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Infraestrutura</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.etapasCabos}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Cabos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.etapasEquipamentos}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Equipamentos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.etapasInstrumentos}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Instrumentos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totais.etapasLuminarias}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Luminárias</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Tabela de Resultados */}
        {dados.length > 0 && (
          <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <FileText className="h-5 w-5" />
                Resultados do Relatório
              </CardTitle>
              <CardDescription>
                {dados.length} atividade{dados.length !== 1 ? 's' : ''} encontrada{dados.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {dados.map((atividade) => {
                  const isExpanded = expandedActivities.has(atividade.id)
                  
                  return (
                    <Collapsible
                      key={atividade.id}
                      open={isExpanded}
                      onOpenChange={() => toggleActivity(atividade.id)}
                    >
                      <Card className="overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 flex-1">
                                <div className="md:col-span-2">
                                  <p className="font-semibold text-sm">{atividade.nome_atividade}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(atividade.data_atividade), "dd/MM/yyyy", { locale: ptBR })}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">H. Informadas</p>
                                  <p className="font-medium text-sm">{atividade.horas_informadas.toFixed(1)}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">H. Totais</p>
                                  <p className="font-medium text-sm">{atividade.horas_totais.toFixed(1)}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Pessoas</p>
                                  <p className="font-medium text-sm">{atividade.total_pessoas}</p>
                                </div>
                                <div className="text-center">
                                  <Badge variant="secondary">{atividade.etapas.length} etapa{atividade.etapas.length !== 1 ? 's' : ''}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="border-t">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[120px]">Tipo</TableHead>
                                  <TableHead>Detalhes</TableHead>
                                  <TableHead className="w-[200px]">Observações</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {atividade.etapas.map((etapa) => (
                                  <TableRow key={etapa.id}>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">
                                        {etapa.tipo_atividade === 'ELE-INFRA' && 'Infraestrutura'}
                                        {etapa.tipo_atividade === 'ELE-CABOS' && 'Cabos'}
                                        {etapa.tipo_atividade === 'ELE-EQUIP' && 'Equipamento'}
                                        {etapa.tipo_atividade === 'INS-INST' && 'Instrumento'}
                                        {etapa.tipo_atividade === 'ELE-LUMI' && 'Luminária'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1 text-sm">
                                        {/* Infraestrutura */}
                                        {etapa.tipo_atividade === 'ELE-INFRA' && (
                                          <>
                                            {etapa.desenho_nome && <p><strong>Desenho:</strong> {etapa.desenho_nome}</p>}
                                            {etapa.tipo_infraestrutura_nome && <p><strong>Tipo:</strong> {etapa.tipo_infraestrutura_nome}</p>}
                                            {etapa.dimensao_infra && <p><strong>Dimensão:</strong> {etapa.dimensao_infra}</p>}
                                            {etapa.quantidade && <p><strong>Quantidade:</strong> {etapa.quantidade}</p>}
                                          </>
                                        )}
                                        
                                        {/* Cabos */}
                                        {etapa.tipo_atividade === 'ELE-CABOS' && (
                                          <>
                                            {etapa.ponto_origem && <p><strong>Origem:</strong> {etapa.ponto_origem}</p>}
                                            {etapa.ponto_destino && <p><strong>Destino:</strong> {etapa.ponto_destino}</p>}
                                            {etapa.metragem && <p><strong>Metragem:</strong> {etapa.metragem}m</p>}
                                          </>
                                        )}
                                        
                                        {/* Equipamento */}
                                        {etapa.tipo_atividade === 'ELE-EQUIP' && (
                                          <>
                                            {etapa.tipo_equipamento && <p><strong>Tipo:</strong> {etapa.tipo_equipamento}</p>}
                                            {etapa.equipamento_tag && <p><strong>Tag:</strong> {etapa.equipamento_tag}</p>}
                                            {etapa.fluido_nome && <p><strong>Fluido:</strong> {etapa.fluido_nome}</p>}
                                          </>
                                        )}
                                        
                                        {/* Instrumento */}
                                        {etapa.tipo_atividade === 'INS-INST' && (
                                          <>
                                            {etapa.tipo_instrumento && <p><strong>Tipo:</strong> {etapa.tipo_instrumento}</p>}
                                            {etapa.instrumento_tag && <p><strong>Tag:</strong> {etapa.instrumento_tag}</p>}
                                            {etapa.fluido_nome && <p><strong>Fluido:</strong> {etapa.fluido_nome}</p>}
                                          </>
                                        )}
                                        
                                        {/* Luminária */}
                                        {etapa.tipo_atividade === 'ELE-LUMI' && (
                                          <>
                                            {etapa.tipo_luminaria && <p><strong>Tipo:</strong> {etapa.tipo_luminaria}</p>}
                                            {etapa.quantidade_montada && <p><strong>Qtd Montada:</strong> {etapa.quantidade_montada}</p>}
                                          </>
                                        )}
                                        
                                        {etapa.detalhamento_atividade && (
                                          <p className="text-muted-foreground italic">{etapa.detalhamento_atividade}</p>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <p className="text-xs text-muted-foreground">
                                        {etapa.observacoes || '-'}
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </Layout>
  )
}
