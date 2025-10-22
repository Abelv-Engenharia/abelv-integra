import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Trash2, Settings, Users } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { EquipeSeletorEletrica, type FuncaoEquipeEletrica } from "@/components/EquipeSeletorEletrica"
import { AtividadeSelector } from "@/components/AtividadeSelector"
import RelatorioPreviewEletrica from "@/components/RelatorioPreviewEletrica"
import { supabase } from "@/integrations/supabase/client"
import Layout from "@/components/Layout"

type AtividadeEletrica = {
  id: string
  atividadeId: string
  nomeAtividade: string
  codigo: string
  descricao?: string
  equipe: FuncaoEquipeEletrica[]
  horas: string
  registrosEtapas: RegistroEtapaEletrica[]
}

type RegistroEtapaEletrica = {
  id: string
  tipo_atividade: string
  // ELE-INFRA
  area_id?: string
  disciplina?: string
  desenho_id?: string
  tipo_infraestrutura_id?: string
  dimensao_infra?: string
  quantidade?: string
  // ELE-CABOS
  cabo_id?: string
  ponto_origem?: string
  ponto_destino?: string
  tipo_condutor?: string
  dimensao?: string
  sub_area?: string
  circuito?: string
  tipo_cabo?: string
  etapa_cabos?: string[]
  metragem?: string
  // ELE-EQUIP
  tipo_equipamento?: string
  equipamento_tag?: string
  equipamento_id?: string
  // INS-INST
  fluido_id?: string
  tipo_instrumento?: string
  instrumento_tag?: string
  instrumento_id?: string
  // ELE-LUMI
  tipo_luminaria?: string
  luminaria_id?: string
  etapa_luminaria?: string[]
  quantidade_montada?: string
  // Campos originais
  detalhamentoAtividade?: string
  etapaProducao?: string
  observacoes?: string
}

export default function EletricaRegistros() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [ccaSelecionado, setCcaSelecionado] = useState("")
  const [encarregadoSelecionado, setEncarregadoSelecionado] = useState("")
  const [localizacao, setLocalizacao] = useState("")
  const [periodosDia, setPeriodosDia] = useState<string[]>([])
  const [condicaoClimatica, setCondicaoClimatica] = useState("")
  const [anotacoesGerais, setAnotacoesGerais] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<Record<string, string>>({})
  const [areaSelecionada, setAreaSelecionada] = useState<Record<string, string>>({})
  
  // Estados para dados do Supabase
  const [ccas, setCcas] = useState<{id: string, codigo: string, nome: string, localizacao?: string}[]>([])
  const [encarregados, setEncarregados] = useState<{id: string, nome: string, equipe?: FuncaoEquipeEletrica[]}[]>([])
  const [atividadesCadastradas, setAtividadesCadastradas] = useState<{id: string, nome: string, descricao: string | null}[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para dados da página EletricaRelatorioCampo
  const [areas, setAreas] = useState<{id: string, nome: string}[]>([])
  const [desenhos, setDesenhos] = useState<{id: string, codigo: string, disciplina: string, descricao: string, area_id: string}[]>([])
  const [fluidos, setFluidos] = useState<{id: string, nome: string}[]>([])
  const [tiposInfraestrutura, setTiposInfraestrutura] = useState<{id: string, nome: string, dimensoes_padrao: any}[]>([])
  const [equipamentos, setEquipamentos] = useState<{id: string, tag: string, tipo_equipamento: string, area_id?: string, disciplina?: string, descricao?: string}[]>([])
  const [instrumentos, setInstrumentos] = useState<{id: string, tag: string, tipo_instrumento: string, area_id?: string, fluido_id?: string, descricao?: string}[]>([])
  const [luminarias, setLuminarias] = useState<{id: string, tag: string, tipo_luminaria: string, desenho_id?: string, descricao?: string}[]>([])
  const [cabos, setCabos] = useState<{id: string, disciplina: string, circuito: string, tipo_cabo: string, ponto_origem: string, ponto_destino: string, tipo_condutor: string, dimensao: string, sub_area: string, area_id: string}[]>([])
  const [infraestruturas, setInfraestruturas] = useState<{id: string, area_id: string, disciplina: string, desenho_id: string, tipo_infraestrutura_id: string, dimensao: string}[]>([])

  
  // Estado para atividades de elétrica
  const [atividadesEletricas, setAtividadesEletricas] = useState<AtividadeEletrica[]>([])
  const [atividadeSelecionada, setAtividadeSelecionada] = useState("")
  
  // Disciplinas disponíveis (extraídas dos cabos cadastrados)
  const disciplinasDisponiveis = React.useMemo(() => {
    const disciplinasUnicas = new Set(cabos.map(c => c.disciplina?.trim()).filter(Boolean))
    return Array.from(disciplinasUnicas).sort()
  }, [cabos])
  
  // Estados para funcionalidades de preview e salvamento
  const [showPreview, setShowPreview] = useState(false)
  const [relatorioPreview, setRelatorioPreview] = useState<any>(null)
  const [salvandoRelatorio, setSalvandoRelatorio] = useState(false)

  // Carregar dados do Supabase
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar CCAs
    const { data: ccasData, error: ccasError } = await supabase
      .from('ccas')
      .select('id, codigo, nome, localizacao')
      .eq('ativo', true)
      .order('codigo', { ascending: true })

        if (!ccasError) {
          setCcas(ccasData || [])
        }

        // Carregar Encarregados (filtrados por CCA se selecionado)
        await carregarEncarregados()

        // Carregar atividades cadastradas (apenas do módulo elétrica)
        const { data: atividadesData, error: atividadesError } = await supabase
          .from('atividades_cadastradas')
          .select('id, nome, descricao')
          .eq('ativo', true)
          .eq('modulo', 'eletrica')
          .order('nome', { ascending: true })

        if (!atividadesError) {
          // Extrair código da atividade do nome (ex: "ELE-CABOS - Lançamento" ou "ELE_CABOS - Lançamento")
          const atividadesComCodigo = (atividadesData || []).map(atv => {
            const codigoMatch = atv.nome.match(/^(ELE[-_]INFRA|ELE[-_]CABOS|ELE[-_]EQUIP|INS[-_]INST|ELE[-_]LUMI)/)
            const codigo = codigoMatch ? codigoMatch[1].replace('_', '-') : ''
            return {
              ...atv,
              codigo
            }
          })
          setAtividadesCadastradas(atividadesComCodigo as any)
        }
        
        // Carregar dados adicionais
        await carregarDadosAdicionais()
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        toast({
          title: "Erro",
          description: "Erro ao carregar dados",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [toast])
  
  // Carregar dados adicionais para o formulário dinâmico
  const carregarDadosAdicionais = async () => {
    try {
      // Áreas
      const { data: areasData } = await supabase
        .from("areas_projeto")
        .select("*")
        .eq("ativo", true)
        .order("nome")
      setAreas(areasData || [])
      
      // Desenhos
      const { data: desenhosData } = await supabase
        .from("desenhos_eletrica")
        .select("id, codigo, disciplina, descricao, area_id")
        .eq("ativo", true)
        .order("codigo")
      setDesenhos(desenhosData || [])
      
      // Fluidos
      const { data: fluidosData } = await supabase
        .from("fluidos")
        .select("*")
        .order("nome")
      setFluidos(fluidosData || [])
      
      // Tipos de Infraestrutura
      const { data: tiposInfraData } = await supabase
        .from("tipos_infraestrutura_eletrica")
        .select("*")
        .eq("ativo", true)
        .order("nome")
      setTiposInfraestrutura(tiposInfraData || [])
      
      // Equipamentos
      const { data: equipamentosData } = await supabase
        .from("equipamentos_eletricos")
        .select("id, tag, tipo_equipamento, area_id, disciplina, descricao")
        .eq("ativo", true)
        .order("tag")
      setEquipamentos(equipamentosData || [])
      
      // Instrumentos
      const { data: instrumentosData } = await supabase
        .from("instrumentos_eletrica")
        .select("id, tag, tipo_instrumento, area_id, fluido_id, descricao")
        .eq("ativo", true)
        .order("tag")
      setInstrumentos(instrumentosData || [])
      
      // Luminárias
      const { data: luminariasData } = await supabase
        .from("luminarias_eletrica")
        .select("id, tag, tipo_luminaria, desenho_id, descricao")
        .eq("ativo", true)
        .order("tag")
      setLuminarias(luminariasData || [])
      
      // Cabos
      const { data: cabosData } = await supabase
        .from("cabos_eletrica")
        .select("id, disciplina, circuito, tipo_cabo, ponto_origem, ponto_destino, tipo_condutor, dimensao, sub_area, area_id")
        .eq("ativo", true)
        .order("circuito")
      setCabos(cabosData || [])
      
      // Infraestruturas Elétricas (para filtros em cascata)
      const { data: infraestruturasData } = await supabase
        .from("infraestrutura_eletrica")
        .select("id, area_id, disciplina, desenho_id, tipo_infraestrutura_id, dimensao")
        .eq("ativo", true)
      setInfraestruturas(infraestruturasData || [])
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error)
    }
  }

  // Função para carregar encarregados com filtro por CCA
  const carregarEncarregados = async () => {
    try {
      const query = ccaSelecionado
        ? supabase
            .from('encarregados_eletrica')
            .select('id, nome, equipe')
            .eq('ativo', true)
            .eq('cca_id', ccaSelecionado)
            .order('nome', { ascending: true })
        : supabase
            .from('encarregados_eletrica')
            .select('id, nome, equipe')
            .eq('ativo', true)
            .order('nome', { ascending: true })

      const { data, error } = await query
      if (error) throw error
      
      // Mapear dados para garantir tipo correto
      const encarregadosFormatados = (data || []).map((enc: any) => ({
        id: enc.id,
        nome: enc.nome,
        equipe: Array.isArray(enc.equipe) ? enc.equipe as FuncaoEquipeEletrica[] : []
      }))
      setEncarregados(encarregadosFormatados)
    } catch (error) {
      console.error('Erro ao carregar encarregados:', error)
    }
  }

  // Recarregar encarregados quando CCA for alterado
  useEffect(() => {
    carregarEncarregados()
  }, [ccaSelecionado])

  // Atualizar localização automaticamente quando CCA for selecionado
  useEffect(() => {
    const ccaSelecionadoObj = ccas.find(c => c.id === ccaSelecionado)
    if (ccaSelecionadoObj && ccaSelecionadoObj.localizacao) {
      setLocalizacao(ccaSelecionadoObj.localizacao)
    }
  }, [ccaSelecionado, ccas])

  const handlePeriodoChange = (periodo: string, checked: boolean) => {
    if (checked) {
      setPeriodosDia([...periodosDia, periodo])
    } else {
      setPeriodosDia(periodosDia.filter(p => p !== periodo))
    }
  }

  const adicionarAtividadeEletrica = (atividadeId: string) => {
    if (!atividadeId) return

    const atividade = atividadesCadastradas.find(a => a.id === atividadeId)
    if (!atividade) return

    const novaAtividade: AtividadeEletrica = {
      id: Date.now().toString(),
      atividadeId: atividadeId,
      nomeAtividade: atividade.nome,
      codigo: (atividade as any).codigo || '',
      descricao: atividade.descricao || undefined,
      equipe: [],
      horas: "0",
      registrosEtapas: []
    }

    setAtividadesEletricas([...atividadesEletricas, novaAtividade])

    toast({
      title: "Atividade adicionada",
      description: `"${atividade.nome}" foi adicionada à lista`
    })
  }

  const removerAtividadeEletrica = (id: string) => {
    setAtividadesEletricas(atividadesEletricas.filter(a => a.id !== id))
  }

  const atualizarAtividadeEletrica = (id: string, campo: keyof AtividadeEletrica, valor: any) => {
    setAtividadesEletricas(atividadesEletricas.map(a => 
      a.id === id ? { ...a, [campo]: valor } : a
    ))
  }

  const adicionarRegistroEtapa = (atividadeId: string) => {
    const atividade = atividadesEletricas.find(a => a.id === atividadeId)
    if (!atividade) return

    // Usar o código da atividade diretamente
    const tipoAtividadeInicial = atividade.codigo || ""

    const novoRegistro: RegistroEtapaEletrica = {
      id: Date.now().toString(),
      tipo_atividade: tipoAtividadeInicial,
      detalhamentoAtividade: "",
      etapaProducao: "",
      observacoes: "",
      etapa_cabos: [],
      etapa_luminaria: []
    }

    setAtividadesEletricas(atividadesEletricas.map(a => {
      if (a.id === atividadeId) {
        return { ...a, registrosEtapas: [...a.registrosEtapas, novoRegistro] }
      }
      return a
    }))
  }

  const removerRegistroEtapa = (atividadeId: string, registroId: string) => {
    setAtividadesEletricas(atividadesEletricas.map(a => {
      if (a.id === atividadeId) {
        return { ...a, registrosEtapas: a.registrosEtapas.filter(r => r.id !== registroId) }
      }
      return a
    }))
  }

  const atualizarRegistroEtapa = (atividadeId: string, registroId: string, campo: keyof RegistroEtapaEletrica, valor: any) => {
    setAtividadesEletricas((prev) => prev.map((a) => {
      if (a.id === atividadeId) {
        const registrosAtualizados = a.registrosEtapas.map((r) => {
          if (r.id === registroId) {
            return { ...r, [campo]: valor }
          }
          return r
        })
        return { ...a, registrosEtapas: registrosAtualizados }
      }
      return a
    }))
  }

  const calcularHorasTotais = (horas: string, equipe: FuncaoEquipeEletrica[]) => {
    const horasNumero = parseFloat(horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    const totalPessoas = equipe.reduce((total, funcao) => total + funcao.quantidade, 0)
    return horasNumero * totalPessoas
  }

  const calcularTotalPessoas = (equipe: FuncaoEquipeEletrica[]) => {
    return equipe.reduce((total, funcao) => total + funcao.quantidade, 0)
  }

  const salvarRelatorio = async () => {
    setSalvandoRelatorio(true)
    try {
      // Aqui implementaria a lógica de salvamento do relatório elétrico
      toast({
        title: "Relatório salvo",
        description: "O relatório de elétrica foi salvo com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o relatório",
        variant: "destructive"
      })
    } finally {
      setSalvandoRelatorio(false)
    }
  }

  const abrirPrevisualizacao = () => {
    // Buscar dados da equipe do encarregado
    const encarregadoData = encarregados.find(e => e.id === encarregadoSelecionado)
    
    // Resolver IDs para nomes antes de mostrar preview
    const atividadesResolvidas = atividadesEletricas.map(atividade => {
      const registrosResolvidos = atividade.registrosEtapas.map(etapa => {
        const etapaResolvida: any = { ...etapa }
        
        // Resolver desenho
        if (etapa.desenho_id) {
          const desenho = desenhos.find(d => d.id === etapa.desenho_id)
          etapaResolvida.desenho_nome = desenho ? `${desenho.codigo} - ${desenho.descricao || ''}` : ''
        }
        
        // Resolver tipo infraestrutura
        if (etapa.tipo_infraestrutura_id) {
          const tipo = tiposInfraestrutura.find(t => t.id === etapa.tipo_infraestrutura_id)
          etapaResolvida.tipo_infraestrutura_nome = tipo?.nome || ''
        }
        
        // Resolver área
        if (etapa.area_id) {
          const area = areas.find(a => a.id === etapa.area_id)
          etapaResolvida.area_nome = area?.nome || ''
        }
        
        // Resolver cabo
        if (etapa.cabo_id) {
          const cabo = cabos.find(c => c.id === etapa.cabo_id)
          etapaResolvida.cabo_info = cabo ? `${cabo.circuito} - ${cabo.tipo_cabo}` : ''
        }
        
        // Resolver fluido
        if (etapa.fluido_id) {
          const fluido = fluidos.find(f => f.id === etapa.fluido_id)
          etapaResolvida.fluido_nome = fluido?.nome || ''
        }
        
        return etapaResolvida
      })
      
      return {
        ...atividade,
        registrosEtapas: registrosResolvidos
      }
    })
    
    const preview = {
      id: "preview",
      data: format(date, "yyyy-MM-dd"),
      data_registro: date,
      projeto: "Elétrica/Instrumentação",
      responsavel: encarregadoData?.nome || null,
      localizacao: localizacao || null,
      anotacoes_gerais: anotacoesGerais || null,
      comentarios: comentarios || null,
      created_at: new Date().toISOString(),
      condicoes_climaticas: {
        periodos: periodosDia,
        condicao: condicaoClimatica
      },
      cca: ccas.find(c => c.id === ccaSelecionado) ? {
        codigo: ccas.find(c => c.id === ccaSelecionado)!.codigo,
        nome: ccas.find(c => c.id === ccaSelecionado)!.nome
      } : null,
      encarregado_equipe: encarregadoData?.equipe || [],
      atividades_eletricas: atividadesResolvidas
    }
    
    setRelatorioPreview(preview)
    setShowPreview(true)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="border-l-4 border-l-blue-500 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-blue-800 dark:text-blue-200">Elétrica/Instrumentação - Registro de Atividades</CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Registre as atividades de elétrica e instrumentação realizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campos principais no topo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cca">Centro de Custo (CCA)</Label>
                <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um CCA" />
                  </SelectTrigger>
                  <SelectContent>
                    {ccas.map((cca) => (
                      <SelectItem key={cca.id} value={cca.id}>
                        {cca.codigo} - {cca.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="encarregado">Encarregado</Label>
                <Select value={encarregadoSelecionado} onValueChange={setEncarregadoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um encarregado" />
                  </SelectTrigger>
                  <SelectContent>
                    {encarregados.map((encarregado) => (
                      <SelectItem key={encarregado.id} value={encarregado.id}>
                        {encarregado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Informe a localização"
                />
              </div>
            </div>

            {/* Capacidade da equipe (disponível vs. alocado) */}
            {encarregadoSelecionado && (() => {
              const enc = encarregados.find(e => e.id === encarregadoSelecionado);
              if (!enc || !enc.equipe || enc.equipe.length === 0) return null;
              
              const dia = date.getDay();
              const horasPorPessoa = (dia >= 1 && dia <= 4) ? 9 : 8;
              const disponivel: Record<string, number> = {};
              const totalFuncionarios = enc.equipe.reduce((acc, f) => acc + (f.quantidade || 0), 0);
              
              enc.equipe.forEach(f => {
                disponivel[f.funcao] = (disponivel[f.funcao] || 0) + (f.quantidade || 0) * horasPorPessoa;
              });
              
              const consumido: Record<string, number> = {};
              atividadesEletricas.forEach(a => {
                const horasAtividade = parseFloat(a.horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
                a.equipe.forEach(f => {
                  consumido[f.funcao] = (consumido[f.funcao] || 0) + (f.quantidade || 0) * horasAtividade;
                });
              });
              
              const funcoes = Array.from(new Set([...Object.keys(disponivel), ...Object.keys(consumido)]));
              
              return (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Capacidade da equipe</CardTitle>
                    <CardDescription>
                      Horas por pessoa no dia: {horasPorPessoa}h • Total de funcionários: {totalFuncionarios}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {funcoes.map((funcao) => {
                      const disp = disponivel[funcao] || 0;
                      const cons = consumido[funcao] || 0;
                      const saldo = disp - cons;
                      const excedido = saldo < 0;
                      return (
                        <div key={funcao} className="flex items-center justify-between rounded-md border p-2">
                          <div>
                            <div className="font-medium">{funcao}</div>
                            <div className="text-xs text-muted-foreground">
                              disponível: {disp.toFixed(1)}h • alocado: {cons.toFixed(1)}h
                            </div>
                          </div>
                          <div className={excedido ? "text-destructive font-medium" : "text-muted-foreground"}>
                            {excedido ? `Excedido em ${(Math.abs(saldo)).toFixed(1)}h` : `Saldo: ${saldo.toFixed(1)}h`}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Seção Condição Climática */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Condição Climática</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Períodos do dia</Label>
                  <div className="flex flex-wrap gap-4">
                    {["Manhã", "Tarde", "Noite"].map((periodo) => (
                      <div key={periodo} className="flex items-center space-x-2">
                        <Checkbox
                          id={periodo}
                          checked={periodosDia.includes(periodo)}
                          onCheckedChange={(checked) => handlePeriodoChange(periodo, checked as boolean)}
                        />
                        <Label htmlFor={periodo}>{periodo}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condicao">Condição climática</Label>
                  <Select value={condicaoClimatica} onValueChange={setCondicaoClimatica}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a condição climática" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ensolarado">Ensolarado</SelectItem>
                      <SelectItem value="nublado">Nublado</SelectItem>
                      <SelectItem value="chuva">Chuva</SelectItem>
                      <SelectItem value="neblina">Neblina</SelectItem>
                      <SelectItem value="vento-forte">Vento Forte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Seção Lista de Atividades */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Lista de Atividades</CardTitle>
                <AtividadeSelector
                  atividades={atividadesCadastradas}
                  atividadeSelecionada={atividadeSelecionada}
                  onAtividadeSelect={(atividadeId) => {
                    setAtividadeSelecionada(atividadeId)
                    if (atividadeId) {
                      adicionarAtividadeEletrica(atividadeId)
                    }
                  }}
                  modulo="eletrica"
                >
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Selecionar Atividade
                  </Button>
                </AtividadeSelector>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Lista de atividades adicionadas */}
                {atividadesEletricas.map((atividade, atividadeIndex) => (
                  <Card key={atividade.id} className="border rounded-md">
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{atividade.nomeAtividade}</CardTitle>
                          {atividade.descricao && (
                            <CardDescription className="text-xs mt-1">{atividade.descricao}</CardDescription>
                          )}
                        </div>
                        <Button
                          onClick={() => removerAtividadeEletrica(atividade.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Sub-card Equipe */}
                        <Card className="border-secondary/30">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              Equipe
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 space-y-2">
                            <div className="space-y-2">
                              <Label className="text-sm">Selecionar Equipe</Label>
                              <EquipeSeletorEletrica
                                value={atividade.equipe}
                                onChange={(equipe) => atualizarAtividadeEletrica(atividade.id, 'equipe', equipe)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Horas Trabalhadas</Label>
                              <Input
                                value={atividade.horas}
                                onChange={(e) => atualizarAtividadeEletrica(atividade.id, 'horas', e.target.value)}
                                placeholder="0"
                                type="number"
                                step="0.5"
                                min="0"
                              />
                              {atividade.equipe.length > 0 && parseFloat(atividade.horas) > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Total: {calcularHorasTotais(atividade.horas, atividade.equipe).toFixed(1)}h
                                  ({calcularTotalPessoas(atividade.equipe)} pessoas)
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Sub-card Registro de Etapas */}
                        <Card className="border-accent/30">
                          <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Settings className="h-3 w-3" />
                                Registro de Etapas
                                <span className="text-xs font-normal text-muted-foreground">
                                  ({atividade.registrosEtapas.length})
                                </span>
                              </CardTitle>
                              <Button
                                onClick={() => adicionarRegistroEtapa(atividade.id)}
                                variant="outline"
                                size="sm"
                                disabled={atividade.equipe.length === 0 || parseFloat(atividade.horas) === 0}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 space-y-2">
                            {(atividade.equipe.length === 0 || parseFloat(atividade.horas) === 0) && (
                              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                  ⚠️ Preencha os dados da equipe e horas para habilitar o registro de etapas
                                </p>
                              </div>
                            )}
                            <div className="space-y-2">
                            {atividade.registrosEtapas.map((registro, index) => {
                              const disciplinasUnicas = [...new Set(desenhos.map(d => d.disciplina))];
                              const tiposEquipamentosUnicos = [...new Set(equipamentos.map(e => e.tipo_equipamento))];
                              const tiposInstrumentosUnicos = [...new Set(instrumentos.map(i => i.tipo_instrumento))];
                              const dimensoesCadastradas = registro.tipo_infraestrutura_id 
                                ? (() => {
                                    const tipo = tiposInfraestrutura.find(t => t.id === registro.tipo_infraestrutura_id);
                                    return tipo && Array.isArray(tipo.dimensoes_padrao) 
                                      ? tipo.dimensoes_padrao.map((d: any) => d.dimensao || d)
                                      : [];
                                  })()
                                : [];
                              
                              return (
                              <div key={registro.id} className="border rounded-md p-3 space-y-3">
                                 <div className="flex justify-between items-start gap-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <Badge variant="outline" className="text-xs">{atividade.codigo}</Badge>
                                    <span className="text-xs text-muted-foreground italic">
                                      (tipo vinculado)
                                    </span>
                                  </div>
                                  <Button
                                    onClick={() => removerRegistroEtapa(atividade.id, registro.id)}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>

                                {/* ELE-INFRA */}
                                {(registro.tipo_atividade === "ELE-INFRA" || atividade.codigo === "ELE-INFRA") && (() => {
                                  // 1️⃣ DISCIPLINAS: Filtrar por área selecionada
                                  const disciplinasInfraDisponiveis = registro.area_id 
                                    ? [...new Set(
                                        desenhos
                                          .filter(d => d.area_id === registro.area_id)
                                          .map(d => d.disciplina)
                                          .filter(Boolean)
                                      )].sort()
                                    : [];

                                  // 2️⃣ DESENHOS: Filtrar por área + disciplina
                                  const desenhosInfraDisponiveis = registro.area_id && registro.disciplina
                                    ? desenhos.filter(d => 
                                        d.area_id === registro.area_id && 
                                        d.disciplina === registro.disciplina
                                      )
                                    : [];

                                  // 3️⃣ TIPOS DE INFRAESTRUTURA: Filtrar por área + disciplina + desenho
                                  const tiposInfraDisponiveis = registro.area_id && registro.disciplina && registro.desenho_id
                                    ? (() => {
                                        const tiposIdsUnicos = [...new Set(
                                          infraestruturas
                                            .filter(inf => 
                                              inf.area_id === registro.area_id &&
                                              inf.disciplina === registro.disciplina &&
                                              inf.desenho_id === registro.desenho_id
                                            )
                                            .map(inf => inf.tipo_infraestrutura_id)
                                        )];
                                        return tiposInfraestrutura.filter(t => tiposIdsUnicos.includes(t.id));
                                      })()
                                    : [];

                                  // 4️⃣ DIMENSÕES: Carregar do tipo selecionado (já existente)
                                  const dimensoesCadastradas = registro.tipo_infraestrutura_id 
                                    ? (() => {
                                        const tipo = tiposInfraestrutura.find(t => t.id === registro.tipo_infraestrutura_id);
                                        return tipo && Array.isArray(tipo.dimensoes_padrao) 
                                          ? tipo.dimensoes_padrao.map((d: any) => d.dimensao || d)
                                          : [];
                                      })()
                                    : [];

                                  return (
                                    <div className="space-y-2 p-3 border rounded-md bg-muted/20">
                                      <h4 className="font-semibold">Infraestrutura Elétrica - Filtros em Cascata</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* 1️⃣ ÁREA DO PROJETO */}
                                        <div className="space-y-2">
                                          <Label className="flex items-center gap-2">
                                            <span className="text-lg">1️⃣</span>
                                            Área do Projeto
                                          </Label>
                                          <Select 
                                            value={registro.area_id} 
                                            onValueChange={(v) => {
                                              // Limpar campos dependentes em cascata
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'area_id', v);
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'disciplina', '');
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'desenho_id', '');
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'tipo_infraestrutura_id', '');
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'dimensao_infra', '');
                                            }}
                                          >
                                            <SelectTrigger className={registro.area_id ? "border-green-500" : ""}>
                                              <SelectValue placeholder="Selecione a área" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {areas.map(area => (
                                                <SelectItem key={area.id} value={area.id}>{area.nome}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* 2️⃣ DISCIPLINA */}
                                        <div className="space-y-2">
                                          <Label className="flex items-center gap-2">
                                            <span className="text-lg">2️⃣</span>
                                            Disciplina
                                            {disciplinasInfraDisponiveis.length > 0 && (
                                              <span className="text-xs text-muted-foreground">
                                                ({disciplinasInfraDisponiveis.length} disponíveis)
                                              </span>
                                            )}
                                          </Label>
                                          <Select 
                                            value={registro.disciplina} 
                                            onValueChange={(v) => {
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'disciplina', v);
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'desenho_id', '');
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'tipo_infraestrutura_id', '');
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'dimensao_infra', '');
                                            }}
                                            disabled={!registro.area_id}
                                          >
                                            <SelectTrigger className={registro.disciplina ? "border-green-500" : registro.area_id ? "" : "opacity-50"}>
                                              <SelectValue placeholder={!registro.area_id ? "🔒 Selecione área primeiro" : "Selecione a disciplina"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {disciplinasInfraDisponiveis.map(disc => (
                                                <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* 3️⃣ NOME DO DESENHO */}
                                        <div className="space-y-2">
                                          <Label className="flex items-center gap-2">
                                            <span className="text-lg">3️⃣</span>
                                            Nome do Desenho
                                            {desenhosInfraDisponiveis.length > 0 && (
                                              <span className="text-xs text-muted-foreground">
                                                ({desenhosInfraDisponiveis.length} disponíveis)
                                              </span>
                                            )}
                                          </Label>
                                          <Select 
                                            value={registro.desenho_id} 
                                            onValueChange={(v) => {
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'desenho_id', v);
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'tipo_infraestrutura_id', '');
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'dimensao_infra', '');
                                            }}
                                            disabled={!registro.area_id || !registro.disciplina}
                                          >
                                            <SelectTrigger className={registro.desenho_id ? "border-green-500" : (registro.area_id && registro.disciplina) ? "" : "opacity-50"}>
                                              <SelectValue placeholder={!registro.area_id || !registro.disciplina ? "🔒 Complete área e disciplina" : "Selecione o desenho"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {desenhosInfraDisponiveis.map(des => (
                                                <SelectItem key={des.id} value={des.id}>{des.codigo} - {des.descricao}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* 4️⃣ TIPO DE INFRAESTRUTURA */}
                                        <div className="space-y-2">
                                          <Label className="flex items-center gap-2">
                                            <span className="text-lg">4️⃣</span>
                                            Tipo de Infraestrutura
                                            {tiposInfraDisponiveis.length > 0 && (
                                              <span className="text-xs text-muted-foreground">
                                                ({tiposInfraDisponiveis.length} disponíveis)
                                              </span>
                                            )}
                                          </Label>
                                          <Select 
                                            value={registro.tipo_infraestrutura_id} 
                                            onValueChange={(v) => {
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'tipo_infraestrutura_id', v);
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'dimensao_infra', '');
                                            }}
                                            disabled={!registro.area_id || !registro.disciplina || !registro.desenho_id}
                                          >
                                            <SelectTrigger className={registro.tipo_infraestrutura_id ? "border-green-500" : (registro.area_id && registro.disciplina && registro.desenho_id) ? "" : "opacity-50"}>
                                              <SelectValue placeholder={!registro.area_id || !registro.disciplina || !registro.desenho_id ? "🔒 Complete área, disciplina e desenho" : "Selecione o tipo"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {tiposInfraDisponiveis.map(tipo => (
                                                <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* 5️⃣ DIMENSÃO */}
                                        <div className="space-y-2">
                                          <Label className="flex items-center gap-2">
                                            <span className="text-lg">5️⃣</span>
                                            Dimensão
                                            {dimensoesCadastradas.length > 0 && (
                                              <span className="text-xs text-muted-foreground">
                                                ({dimensoesCadastradas.length} disponíveis)
                                              </span>
                                            )}
                                          </Label>
                                          <Select 
                                            value={registro.dimensao_infra} 
                                            onValueChange={(v) => atualizarRegistroEtapa(atividade.id, registro.id, 'dimensao_infra', v)}
                                            disabled={!registro.tipo_infraestrutura_id}
                                          >
                                            <SelectTrigger className={registro.dimensao_infra ? "border-green-500" : registro.tipo_infraestrutura_id ? "" : "opacity-50"}>
                                              <SelectValue placeholder={!registro.tipo_infraestrutura_id ? "🔒 Selecione o tipo primeiro" : "Selecione a dimensão"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {dimensoesCadastradas.map((dim: string) => (
                                                <SelectItem key={dim} value={dim}>{dim}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* QUANTIDADE */}
                                        <div className="space-y-2">
                                          <Label>Quantidade</Label>
                                          <Input 
                                            type="number" 
                                            value={registro.quantidade} 
                                            onChange={(e) => atualizarRegistroEtapa(atividade.id, registro.id, 'quantidade', e.target.value)} 
                                            placeholder="Digite a quantidade" 
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* ELE-CABOS */}
                                {(registro.tipo_atividade === "ELE-CABOS" || atividade.codigo === "ELE-CABOS") && (
                                  <div className="space-y-3 p-3 border rounded-md bg-muted/20">
                                    <h4 className="text-sm font-semibold">Cabos Elétricos</h4>
                                    
                                    {/* Fluxo Cascata: Disciplina → Área → Cabo */}
                                    {(() => {
                                      const isDisciplinaSelecionada = Boolean(registro.disciplina)
                                      const isAreaSelecionada = Boolean(registro.area_id)
                                      const podeHabilitarArea = isDisciplinaSelecionada
                                      const podeHabilitarCabo = isDisciplinaSelecionada && isAreaSelecionada
                                      
                                      return (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          {/* 1️⃣ DISCIPLINA (obrigatório) */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`disciplina-${atividadeIndex}-${index}`} className="flex items-center gap-1">
                                              <span className="text-destructive">*</span>
                                              1️⃣ Disciplina
                                            </Label>
                                            <Select
                                              value={registro.disciplina || ""}
                                              onValueChange={(value) => {
                                                atualizarRegistroEtapa(atividade.id, registro.id, "disciplina", value)
                                                // Limpar seleções subsequentes em cascata
                                                atualizarRegistroEtapa(atividade.id, registro.id, "area_id", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "cabo_id", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "ponto_origem", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "ponto_destino", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "tipo_condutor", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "dimensao", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "sub_area", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "circuito", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "tipo_cabo", "")
                                              }}
                                            >
                                              <SelectTrigger className={registro.disciplina ? "border-green-500" : ""}>
                                                <SelectValue placeholder="Selecione a disciplina" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {disciplinasDisponiveis.map((disciplina) => (
                                                  <SelectItem key={disciplina} value={disciplina}>
                                                    {disciplina}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          
                                          {/* 2️⃣ ÁREA (obrigatório, filtrado por disciplina) */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`area-${atividadeIndex}-${index}`} className="flex items-center gap-1">
                                              <span className="text-destructive">*</span>
                                              2️⃣ Área do Projeto
                                            </Label>
                                            <Select
                                              key={`area-${registro.disciplina || 'none'}`}
                                              value={registro.area_id || ""}
                                              disabled={!podeHabilitarArea}
                                              onValueChange={(value) => {
                                                atualizarRegistroEtapa(atividade.id, registro.id, "area_id", value)
                                                // Limpar cabo selecionado
                                                atualizarRegistroEtapa(atividade.id, registro.id, "cabo_id", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "ponto_origem", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "ponto_destino", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "tipo_condutor", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "dimensao", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "sub_area", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "circuito", "")
                                                atualizarRegistroEtapa(atividade.id, registro.id, "tipo_cabo", "")
                                              }}
                                            >
                                              <SelectTrigger 
                                                className={cn(
                                                  registro.area_id && "border-green-500",
                                                  !podeHabilitarArea && "opacity-50 cursor-not-allowed"
                                                )}
                                              >
                                                <SelectValue placeholder={podeHabilitarArea ? "Selecione a área" : "🔒 Selecione disciplina primeiro"} />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {areas.filter(area => {
                                                  // Filtrar áreas que possuem cabos da disciplina selecionada
                                                  if (!registro.disciplina) return false
                                                  return cabos.some(c => 
                                                    c.disciplina?.trim() === registro.disciplina?.trim() && 
                                                    c.area_id === area.id
                                                  )
                                                }).map((area) => (
                                                  <SelectItem key={area.id} value={area.id}>
                                                    📍 {area.nome}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* 3️⃣ CABO ELÉTRICO (filtrado por disciplina + área) */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`cabo-${atividadeIndex}-${index}`} className="flex items-center gap-1">
                                              <span className="text-destructive">*</span>
                                              3️⃣ Cabo Elétrico
                                            </Label>
                                            <Select
                                              key={`cabo-${registro.disciplina || 'none'}-${registro.area_id || 'none'}`}
                                              value={registro.cabo_id || ""}
                                              disabled={!podeHabilitarCabo}
                                              onValueChange={(value) => {
                                                const caboSelecionado = cabos.find(c => c.id === value)
                                                if (caboSelecionado) {
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "cabo_id", value)
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "ponto_origem", caboSelecionado.ponto_origem || "")
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "ponto_destino", caboSelecionado.ponto_destino || "")
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "tipo_condutor", caboSelecionado.tipo_condutor || "")
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "dimensao", caboSelecionado.dimensao || "")
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "sub_area", caboSelecionado.sub_area || "")
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "circuito", caboSelecionado.circuito || "")
                                                  atualizarRegistroEtapa(atividade.id, registro.id, "tipo_cabo", caboSelecionado.tipo_cabo || "")
                                                }
                                              }}
                                            >
                                              <SelectTrigger 
                                                className={cn(
                                                  registro.cabo_id && "border-green-500",
                                                  !podeHabilitarCabo && "opacity-50 cursor-not-allowed"
                                                )}
                                              >
                                                <SelectValue placeholder={
                                                  !isDisciplinaSelecionada ? "🔒 Selecione disciplina primeiro" :
                                                  !isAreaSelecionada ? "🔒 Selecione área primeiro" :
                                                  "Buscar cabo elétrico..."
                                                } />
                                              </SelectTrigger>
                                              <SelectContent className="max-h-[300px]">
                                                {(() => {
                                                  const cabosFiltrados = cabos.filter(cabo => {
                                                    if (!registro.disciplina || !registro.area_id) return false
                                                    return cabo.disciplina?.trim() === registro.disciplina?.trim() && 
                                                           cabo.area_id === registro.area_id
                                                  })
                                                  
                                                  if (cabosFiltrados.length === 0) {
                                                    return (
                                                      <div className="p-4 text-center text-muted-foreground">
                                                        <p>Nenhum cabo cadastrado para</p>
                                                        <p className="font-medium">{registro.disciplina} na área {areas.find(a => a.id === registro.area_id)?.nome}</p>
                                                      </div>
                                                    )
                                                  }
                                                  
                                                  return cabosFiltrados.map(cabo => (
                                                    <SelectItem key={cabo.id} value={cabo.id}>
                                                      <div className="flex flex-col">
                                                        <span className="font-medium">
                                                          {cabo.circuito || "S/C"} - {cabo.tipo_cabo || "N/D"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                          {cabo.ponto_origem || "?"} → {cabo.ponto_destino || "?"} ({cabo.dimensao || "N/D"})
                                                        </span>
                                                      </div>
                                                    </SelectItem>
                                                  ))
                                                })()}
                                              </SelectContent>
                                            </Select>
                                            {registro.disciplina && registro.area_id && (
                                              <p className="text-xs text-muted-foreground mt-1">
                                                📊 {cabos.filter(cabo => {
                                                  if (cabo.disciplina !== registro.disciplina) return false
                                                  const areaNome = areas.find(a => a.id === registro.area_id)?.nome
                                                  if (cabo.sub_area !== areaNome) return false
                                                  return true
                                                }).length} cabos disponíveis
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })()}

                                    {/* Informações do Cabo Selecionado */}
                                    {registro.cabo_id && (
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-background/50 rounded border">
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Condutor</Label>
                                          <p className="text-sm font-medium">{registro.tipo_condutor || "-"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">Bitola</Label>
                                          <p className="text-sm font-medium">{registro.dimensao || "-"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">DE (Origem)</Label>
                                          <p className="text-sm font-medium">{registro.ponto_origem || "-"}</p>
                                        </div>
                                        <div>
                                          <Label className="text-xs text-muted-foreground">PARA (Destino)</Label>
                                          <p className="text-sm font-medium">{registro.ponto_destino || "-"}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Etapas */}
                                    <div className="space-y-2">
                                      <Label>Etapas Realizadas</Label>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={registro.etapa_cabos?.includes("Lançamento")}
                                            onCheckedChange={(checked) => {
                                              const newEtapas = checked 
                                                ? [...(registro.etapa_cabos || []), "Lançamento"]
                                                : (registro.etapa_cabos || []).filter(e => e !== "Lançamento");
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'etapa_cabos', newEtapas);
                                            }}
                                          />
                                          <Label>Lançamento</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={registro.etapa_cabos?.includes("Ligação A (Origem)")}
                                            onCheckedChange={(checked) => {
                                              const newEtapas = checked 
                                                ? [...(registro.etapa_cabos || []), "Ligação A (Origem)"]
                                                : (registro.etapa_cabos || []).filter(e => e !== "Ligação A (Origem)");
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'etapa_cabos', newEtapas);
                                            }}
                                          />
                                          <Label>Ligação A (Origem)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={registro.etapa_cabos?.includes("Ligação B (Destino)")}
                                            onCheckedChange={(checked) => {
                                              const newEtapas = checked 
                                                ? [...(registro.etapa_cabos || []), "Ligação B (Destino)"]
                                                : (registro.etapa_cabos || []).filter(e => e !== "Ligação B (Destino)");
                                              atualizarRegistroEtapa(atividade.id, registro.id, 'etapa_cabos', newEtapas);
                                            }}
                                          />
                                          <Label>Ligação B (Destino)</Label>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Metragem */}
                                    <div className="space-y-2">
                                      <Label>Metragem (metros)</Label>
                                      <Input 
                                        type="number" 
                                        value={registro.metragem} 
                                        onChange={(e) => atualizarRegistroEtapa(atividade.id, registro.id, 'metragem', e.target.value)} 
                                        placeholder="Digite a metragem"
                                        step="0.01"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* ELE-EQUIP */}
                                {(registro.tipo_atividade === "ELE-EQUIP" || atividade.codigo === "ELE-EQUIP") && (
                                  <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                                    <h4 className="text-sm font-semibold">Equipamentos Elétricos</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      
                                      {/* 1️⃣ Área do Projeto */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          1️⃣ Área do Projeto
                                        </Label>
                                        <Select
                                          value={registro.area_id || ""}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "area_id", value)
                                            // Limpar subsequentes (cascata)
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_equipamento", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "equipamento_tag", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "equipamento_id", "")
                                          }}
                                        >
                                          <SelectTrigger className={registro.area_id ? "border-green-500" : ""}>
                                            <SelectValue placeholder="Selecione a área" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {areas.map(area => (
                                              <SelectItem key={area.id} value={area.id}>
                                                📍 {area.nome}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 2️⃣ Tipo de Equipamento - Filtrado por Área */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          2️⃣ Tipo {(() => {
                                            const tipos = registro.area_id 
                                              ? [...new Set(equipamentos.filter(eq => eq.area_id === registro.area_id).map(eq => eq.tipo_equipamento))]
                                              : [];
                                            return tipos.length > 0 ? `(${tipos.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.tipo_equipamento || ""}
                                          disabled={!registro.area_id}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_equipamento", value)
                                            // Limpar TAG
                                            atualizarRegistroEtapa(atividade.id, registro.id, "equipamento_tag", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "equipamento_id", "")
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.tipo_equipamento ? "border-green-500" : ""} ${!registro.area_id ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={!registro.area_id ? "🔒 Selecione área primeiro" : "Selecione o tipo"} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.area_id && [...new Set(
                                              equipamentos
                                                .filter(eq => eq.area_id === registro.area_id)
                                                .map(eq => eq.tipo_equipamento)
                                            )].map(tipo => (
                                              <SelectItem key={tipo} value={tipo}>
                                                🔧 {tipo}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 3️⃣ TAGs - Filtrado por Área + Tipo */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          3️⃣ TAGs {(() => {
                                            const tags = registro.area_id && registro.tipo_equipamento
                                              ? equipamentos.filter(eq => 
                                                  eq.area_id === registro.area_id &&
                                                  eq.tipo_equipamento === registro.tipo_equipamento
                                                )
                                              : [];
                                            return tags.length > 0 ? `(${tags.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.equipamento_tag || ""}
                                          disabled={!registro.area_id || !registro.tipo_equipamento}
                                          onValueChange={(value) => {
                                            const equipamentoSelecionado = equipamentos.find(eq => eq.tag === value)
                                            if (equipamentoSelecionado) {
                                              atualizarRegistroEtapa(atividade.id, registro.id, "equipamento_tag", value)
                                              atualizarRegistroEtapa(atividade.id, registro.id, "equipamento_id", equipamentoSelecionado.id)
                                            }
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.equipamento_tag ? "border-green-500" : ""} ${(!registro.area_id || !registro.tipo_equipamento) ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={
                                              !registro.area_id ? "🔒 Selecione área primeiro" :
                                              !registro.tipo_equipamento ? "🔒 Selecione tipo primeiro" :
                                              "Selecione a TAG"
                                            } />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.area_id && registro.tipo_equipamento && equipamentos
                                              .filter(eq => 
                                                eq.area_id === registro.area_id &&
                                                eq.tipo_equipamento === registro.tipo_equipamento
                                              )
                                              .map(eq => (
                                                <SelectItem key={eq.id} value={eq.tag}>
                                                  🏷️ {eq.tag} {eq.descricao && `- ${eq.descricao.substring(0, 50)}...`}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* INS-INST */}
                                {(registro.tipo_atividade === "INS-INST" || atividade.codigo === "INS-INST") && (
                                  <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                                    <h4 className="text-sm font-semibold">Instrumentação</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* 1️⃣ Área do Projeto */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          1️⃣ Área do Projeto
                                        </Label>
                                        <Select
                                          value={registro.area_id || ""}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "area_id", value)
                                            // Limpar subsequentes (cascata)
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_instrumento", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "fluido_id", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_tag", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_id", "")
                                          }}
                                        >
                                          <SelectTrigger className={registro.area_id ? "border-green-500" : ""}>
                                            <SelectValue placeholder="Selecione a área" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {areas.map(area => (
                                              <SelectItem key={area.id} value={area.id}>
                                                📍 {area.nome}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 2️⃣ Tipo de Instrumento - Filtrado por Área */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          2️⃣ Tipo {(() => {
                                            const tipos = registro.area_id 
                                              ? [...new Set(instrumentos.filter(inst => inst.area_id === registro.area_id).map(inst => inst.tipo_instrumento))]
                                              : [];
                                            return tipos.length > 0 ? `(${tipos.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.tipo_instrumento || ""}
                                          disabled={!registro.area_id}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_instrumento", value)
                                            // Limpar subsequentes
                                            atualizarRegistroEtapa(atividade.id, registro.id, "fluido_id", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_tag", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_id", "")
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.tipo_instrumento ? "border-green-500" : ""} ${!registro.area_id ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={!registro.area_id ? "🔒 Selecione área primeiro" : "Selecione o tipo"} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.area_id && [...new Set(
                                              instrumentos
                                                .filter(inst => inst.area_id === registro.area_id)
                                                .map(inst => inst.tipo_instrumento)
                                            )].map(tipo => (
                                              <SelectItem key={tipo} value={tipo}>
                                                🔧 {tipo}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 3️⃣ Fluidos - Filtrado por Área + Tipo */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          3️⃣ Fluidos {(() => {
                                            const fluidosDisponiveis = registro.area_id && registro.tipo_instrumento
                                              ? [...new Set(
                                                  instrumentos
                                                    .filter(inst => 
                                                      inst.area_id === registro.area_id &&
                                                      inst.tipo_instrumento === registro.tipo_instrumento &&
                                                      inst.fluido_id
                                                    )
                                                    .map(inst => inst.fluido_id)
                                                )].map(fluidoId => fluidos.find(f => f.id === fluidoId)).filter(Boolean)
                                              : [];
                                            return fluidosDisponiveis.length > 0 ? `(${fluidosDisponiveis.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.fluido_id || ""}
                                          disabled={!registro.area_id || !registro.tipo_instrumento}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "fluido_id", value)
                                            // Limpar TAG
                                            atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_tag", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_id", "")
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.fluido_id ? "border-green-500" : ""} ${(!registro.area_id || !registro.tipo_instrumento) ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={
                                              !registro.area_id ? "🔒 Selecione área primeiro" :
                                              !registro.tipo_instrumento ? "🔒 Selecione tipo primeiro" :
                                              "Selecione o fluido (opcional)"
                                            } />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.area_id && registro.tipo_instrumento && (() => {
                                              const fluidosIds = [...new Set(
                                                instrumentos
                                                  .filter(inst => 
                                                    inst.area_id === registro.area_id &&
                                                    inst.tipo_instrumento === registro.tipo_instrumento &&
                                                    inst.fluido_id
                                                  )
                                                  .map(inst => inst.fluido_id)
                                              )];
                                              return fluidosIds.map(fluidoId => {
                                                const fluido = fluidos.find(f => f.id === fluidoId);
                                                return fluido ? (
                                                  <SelectItem key={fluido.id} value={fluido.id}>
                                                    💧 {fluido.nome}
                                                  </SelectItem>
                                                ) : null;
                                              });
                                            })()}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 4️⃣ TAGs - Filtrado por Área + Tipo + Fluido (opcional) */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          4️⃣ TAGs {(() => {
                                            const tags = registro.area_id && registro.tipo_instrumento
                                              ? instrumentos.filter(inst => {
                                                  const matchArea = inst.area_id === registro.area_id;
                                                  const matchTipo = inst.tipo_instrumento === registro.tipo_instrumento;
                                                  const matchFluido = !registro.fluido_id || inst.fluido_id === registro.fluido_id;
                                                  return matchArea && matchTipo && matchFluido;
                                                })
                                              : [];
                                            return tags.length > 0 ? `(${tags.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.instrumento_tag || ""}
                                          disabled={!registro.area_id || !registro.tipo_instrumento}
                                          onValueChange={(value) => {
                                            const instrumentoSelecionado = instrumentos.find(inst => inst.tag === value)
                                            if (instrumentoSelecionado) {
                                              atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_tag", value)
                                              atualizarRegistroEtapa(atividade.id, registro.id, "instrumento_id", instrumentoSelecionado.id)
                                              // Preencher fluido automaticamente se não foi selecionado
                                              if (!registro.fluido_id && instrumentoSelecionado.fluido_id) {
                                                atualizarRegistroEtapa(atividade.id, registro.id, "fluido_id", instrumentoSelecionado.fluido_id)
                                              }
                                            }
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.instrumento_tag ? "border-green-500" : ""} ${(!registro.area_id || !registro.tipo_instrumento) ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={
                                              !registro.area_id ? "🔒 Selecione área primeiro" :
                                              !registro.tipo_instrumento ? "🔒 Selecione tipo primeiro" :
                                              "Selecione a TAG"
                                            } />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.area_id && registro.tipo_instrumento && instrumentos
                                              .filter(inst => {
                                                const matchArea = inst.area_id === registro.area_id;
                                                const matchTipo = inst.tipo_instrumento === registro.tipo_instrumento;
                                                const matchFluido = !registro.fluido_id || inst.fluido_id === registro.fluido_id;
                                                return matchArea && matchTipo && matchFluido;
                                              })
                                              .map(inst => (
                                                <SelectItem key={inst.id} value={inst.tag}>
                                                  🏷️ {inst.tag} {inst.descricao && `- ${inst.descricao.substring(0, 50)}...`}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* ELE-LUMI */}
                                {(registro.tipo_atividade === "ELE-LUMI" || atividade.codigo === "ELE-LUMI") && (
                                  <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                                    <h4 className="text-sm font-semibold">Luminárias</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      
                                      {/* 1️⃣ Área do Projeto */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          1️⃣ Área do Projeto
                                        </Label>
                                        <Select
                                          value={registro.area_id || ""}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "area_id", value)
                                            // Limpar subsequentes (cascata)
                                            atualizarRegistroEtapa(atividade.id, registro.id, "desenho_id", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_luminaria", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "luminaria_id", "")
                                          }}
                                        >
                                          <SelectTrigger className={registro.area_id ? "border-green-500" : ""}>
                                            <SelectValue placeholder="Selecione a área" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {areas.map(area => (
                                              <SelectItem key={area.id} value={area.id}>
                                                📍 {area.nome}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 2️⃣ Nome do Desenho - Filtrado por Área */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          2️⃣ Nome do Desenho {(() => {
                                            const desenhosDisponiveis = registro.area_id
                                              ? desenhos.filter(d => d.area_id === registro.area_id)
                                              : [];
                                            return desenhosDisponiveis.length > 0 ? `(${desenhosDisponiveis.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.desenho_id || ""}
                                          disabled={!registro.area_id}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "desenho_id", value)
                                            // Limpar tipo e luminaria_id
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_luminaria", "")
                                            atualizarRegistroEtapa(atividade.id, registro.id, "luminaria_id", "")
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.desenho_id ? "border-green-500" : ""} ${!registro.area_id ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={!registro.area_id ? "🔒 Selecione área primeiro" : "Selecione o desenho"} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.area_id && desenhos
                                              .filter(d => d.area_id === registro.area_id)
                                              .map(des => (
                                                <SelectItem key={des.id} value={des.id}>
                                                  📐 {des.codigo} {des.descricao && `- ${des.descricao}`}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/* 3️⃣ Tipo de Luminária - Filtrado por Desenho */}
                                      <div className="space-y-2">
                                        <Label className="flex items-center gap-1">
                                          <span className="text-destructive">*</span>
                                          3️⃣ Tipo {(() => {
                                            const tipos = registro.desenho_id
                                              ? [...new Set(luminarias.filter(l => l.desenho_id === registro.desenho_id).map(l => l.tipo_luminaria))]
                                              : [];
                                            return tipos.length > 0 ? `(${tipos.length})` : "";
                                          })()}
                                        </Label>
                                        <Select
                                          value={registro.tipo_luminaria || ""}
                                          disabled={!registro.desenho_id}
                                          onValueChange={(value) => {
                                            atualizarRegistroEtapa(atividade.id, registro.id, "tipo_luminaria", value)
                                            // Buscar a primeira luminária desse tipo para preencher o ID
                                            const luminariaEncontrada = luminarias.find(l => 
                                              l.desenho_id === registro.desenho_id && 
                                              l.tipo_luminaria === value
                                            )
                                            if (luminariaEncontrada) {
                                              atualizarRegistroEtapa(atividade.id, registro.id, "luminaria_id", luminariaEncontrada.id)
                                            }
                                          }}
                                        >
                                          <SelectTrigger 
                                            className={`${registro.tipo_luminaria ? "border-green-500" : ""} ${!registro.desenho_id ? "opacity-50 cursor-not-allowed" : ""}`}
                                          >
                                            <SelectValue placeholder={
                                              !registro.area_id ? "🔒 Selecione área primeiro" :
                                              !registro.desenho_id ? "🔒 Selecione desenho primeiro" :
                                              "Selecione o tipo"
                                            } />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {registro.desenho_id && [...new Set(
                                              luminarias
                                                .filter(l => l.desenho_id === registro.desenho_id)
                                                .map(l => l.tipo_luminaria)
                                            )].map(tipo => (
                                              <SelectItem key={tipo} value={tipo}>
                                                💡 {tipo}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    {/* Campos de Etapa (Montagem/Ligação) e Quantidade */}
                                    <div className="space-y-3">
                                      <div className="space-y-2">
                                        <Label>Etapa</Label>
                                        <div className="space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              checked={registro.etapa_luminaria?.includes("Montagem")}
                                              onCheckedChange={(checked) => {
                                                const newEtapas = checked 
                                                  ? [...(registro.etapa_luminaria || []), "Montagem"]
                                                  : (registro.etapa_luminaria || []).filter(e => e !== "Montagem");
                                                atualizarRegistroEtapa(atividade.id, registro.id, 'etapa_luminaria', newEtapas);
                                              }}
                                            />
                                            <Label>Montagem</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              checked={registro.etapa_luminaria?.includes("Ligação")}
                                              onCheckedChange={(checked) => {
                                                const newEtapas = checked 
                                                  ? [...(registro.etapa_luminaria || []), "Ligação"]
                                                  : (registro.etapa_luminaria || []).filter(e => e !== "Ligação");
                                                atualizarRegistroEtapa(atividade.id, registro.id, 'etapa_luminaria', newEtapas);
                                              }}
                                            />
                                            <Label>Ligação</Label>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label>Quantidade Montada</Label>
                                        <Input 
                                          type="number" 
                                          value={registro.quantidade_montada || ""} 
                                          onChange={(e) => atualizarRegistroEtapa(atividade.id, registro.id, 'quantidade_montada', e.target.value)} 
                                          placeholder="Digite a quantidade" 
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Campos de observação (sempre visíveis) */}
                                <div className="space-y-2">
                                  <Label>Observações</Label>
                                  <Textarea
                                    value={registro.observacoes || ""}
                                    onChange={(e) => atualizarRegistroEtapa(atividade.id, registro.id, 'observacoes', e.target.value)}
                                    placeholder="Observações adicionais"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                            )}

                            {atividade.registrosEtapas.length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhuma etapa registrada. Clique em "Adicionar Etapa" para começar.
                              </p>
                            )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {atividadesEletricas.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma atividade adicionada. Selecione uma atividade acima para começar.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Seções inferiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Anotações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={anotacoesGerais}
                    onChange={(e) => setAnotacoesGerais(e.target.value)}
                    placeholder="Anotações gerais sobre as atividades do dia"
                    rows={5}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comentários</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Comentários adicionais"
                    rows={5}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Botão de ação */}
            <div className="flex gap-4 pt-6">
              <Button 
                onClick={abrirPrevisualizacao}
                disabled={salvandoRelatorio || atividadesEletricas.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {salvandoRelatorio ? "Salvando..." : "Salvar Registro"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Pré-visualização */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
              <DialogTitle>Pré-visualização do Relatório - Elétrica/Instrumentação</DialogTitle>
              <DialogDescription className="sr-only">
                Visualize o relatório antes de confirmar e salvar
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 px-6">
              <RelatorioPreviewEletrica relatorio={relatorioPreview} />
            </ScrollArea>
            <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Fechar
              </Button>
              <Button 
                onClick={() => {
                  setShowPreview(false)
                  salvarRelatorio()
                }}
                disabled={salvandoRelatorio}
              >
                {salvandoRelatorio ? "Salvando..." : "Confirmar e Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}