import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { EquipeSelector, type FuncaoEquipe } from "@/components/EquipeSelector"
import { JuntaMultiSelector } from "@/components/JuntaMultiSelector"
import { AtividadeSelector } from "@/components/AtividadeSelector"
import { supabase } from "@/integrations/supabase/client"
import Layout from "@/components/Layout"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"


type Atividade = {
  id: string
  atividade: string
  fluido: string
  linha: string
  juntaTag: string[] // Mudou para array para múltipla seleção
  tagValvula: string
  acoes: string
  pesoSuporte?: string // Campo para peso do suporte
  quantidadeSuporte?: string // Campo para quantidade do suporte
}

// Tipo para registro de etapas individual
type RegistroEtapa = {
  id: string
  fluido?: string
  linha?: string
  juntaTag?: string[]
  tagValvula?: string
  detalhamentoAtividade?: string
  etapaProducao?: string
  pesoSuporte?: string
  quantidadeSuporte?: string
  // Campos específicos para MEC_EQUIP
  tipoEquipamento?: string
  tagEquipamento?: string
  liberacaoBaseCivil?: string
  posicionamentoBase?: string
  montagemComponentes?: string
  alinhamentoFinalAcoplamento?: string
  testeGiro?: string
  limpezaFinal?: string
}

// Tipo para atividade principal
type AtividadePrincipal = {
  id: string
  atividadeId: string
  nomeAtividade: string
  descricao?: string
  equipe: FuncaoEquipe[]
  horas: string
  // Array de registros de etapas
  registrosEtapas: RegistroEtapa[]
}

export default function Registros() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [date, setDate] = useState<Date>(new Date())
  const [projeto, setProjeto] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [localizacao, setLocalizacao] = useState("")
  const [tempo, setTempo] = useState<string[]>([])
  const [condicao, setCondicao] = useState("")
  
  const [anotacoesGerais, setAnotacoesGerais] = useState("")
  const [comentarios, setComentarios] = useState("")
  
  // Estados para dados do Supabase
  const [ccas, setCcas] = useState<{id: string, codigo: string, nome: string, localizacao?: string}[]>([])
  const [encarregados, setEncarregados] = useState<{id: string, nome: string, equipe?: FuncaoEquipe[]}[]>([])
  const [fluidos, setFluidos] = useState<{id: string, nome: string}[]>([])
  const [linhas, setLinhas] = useState<{id: string, nome_linha: string, fluido_id: string}[]>([])
  const [juntas, setJuntas] = useState<{id: string, numero_junta: string, linha_id: string}[]>([])
  const [atividadesCadastradas, setAtividadesCadastradas] = useState<{id: string, nome: string, descricao: string | null}[]>([])
  const [loading, setLoading] = useState(true)
  const [juntasBloqueadas, setJuntasBloqueadas] = useState<string[]>([])
  const [salvandoRelatorio, setSalvandoRelatorio] = useState(false)
  const [mostrarPreVisualizacao, setMostrarPreVisualizacao] = useState(false)
  
  // Estado para múltiplas atividades principais
  const [atividadesPrincipais, setAtividadesPrincipais] = useState<AtividadePrincipal[]>([])
  
  const [atividades, setAtividades] = useState<Atividade[]>([
    {
      id: "1",
      atividade: "",
      fluido: "Não aplicado",
      linha: "",
      juntaTag: [], // Agora é um array
      tagValvula: "",
      acoes: "",
      pesoSuporte: "",
      quantidadeSuporte: "1"
    }
  ])

  // Carregar dados do Supabase
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar CCAs da tabela ccas
    const { data: ccasData, error: ccasError } = await supabase
      .from('ccas')
      .select('id, codigo, nome, localizacao')
      .eq('ativo', true)
      .order('codigo', { ascending: true })

        if (ccasError) {
          console.error('Erro ao carregar CCAs:', ccasError)
          toast({
            title: "Erro",
            description: "Erro ao carregar CCAs",
            variant: "destructive"
          })
        } else {
          setCcas(ccasData || [])
        }

        // Carregar Encarregados da tabela encarregados
        const { data: encarregadosData, error: encarregadosError } = await supabase
          .from('encarregados')
          .select('id, nome, equipe')
          .eq('ativo', true)
          .order('nome', { ascending: true })

        if (encarregadosError) {
          console.error('Erro ao carregar encarregados:', encarregadosError)
          toast({
            title: "Erro",
            description: "Erro ao carregar encarregados",
            variant: "destructive"
          })
        } else {
          // Converter Json para FuncaoEquipe[] e garantir tipo correto
          const encarregadosFormatados = (encarregadosData || []).map((enc: any) => ({
            ...enc,
            equipe: Array.isArray(enc.equipe) ? enc.equipe as FuncaoEquipe[] : []
          }))
          setEncarregados(encarregadosFormatados)
        }

        // Carregar fluidos da tabela fluidos
        const { data: fluidosData, error: fluidosError } = await supabase
          .from('fluidos')
          .select('id, nome')
          .order('nome', { ascending: true })

        if (fluidosError) {
          console.error('Erro ao carregar fluidos:', fluidosError)
          toast({
            title: "Erro",
            description: "Erro ao carregar fluidos",
            variant: "destructive"
          })
        } else {
          setFluidos(fluidosData || [])
        }

        // Carregar linhas da tabela linhas
        const { data: linhasData, error: linhasError } = await supabase
          .from('linhas')
          .select('id, nome_linha, fluido_id')
          .order('nome_linha', { ascending: true })

        if (linhasError) {
          console.error('Erro ao carregar linhas:', linhasError)
          toast({
            title: "Erro",
            description: "Erro ao carregar linhas",
            variant: "destructive"
          })
        } else {
          setLinhas(linhasData || [])
        }

        // Carregar juntas da tabela juntas  
        const { data: juntasData, error: juntasError } = await supabase
          .from('juntas')
          .select('id, "Junta", linha_id')
          .order('"Junta"', { ascending: true })

        if (juntasError) {
          console.error('Erro ao carregar juntas:', juntasError)
          toast({
            title: "Erro",
            description: "Erro ao carregar juntas",
            variant: "destructive"
          })
        } else {
          // Mapear dados da base para estrutura esperada pelo TypeScript
          const juntasMapeadas = (juntasData || []).map((junta: any) => ({
            id: junta.id,
            numero_junta: junta.Junta,
            linha_id: junta.linha_id
          }))
          setJuntas(juntasMapeadas)
        }

        // Carregar atividades cadastradas (apenas do módulo mecânica)
        const { data: atividadesData, error: atividadesError } = await supabase
          .from('atividades_cadastradas')
          .select('id, nome, descricao')
          .eq('ativo', true)
          .eq('modulo', 'mecanica')
          .order('nome', { ascending: true })

        if (atividadesError) {
          console.error('Erro ao carregar atividades:', atividadesError)
          toast({
            title: "Erro",
            description: "Erro ao carregar atividades",
            variant: "destructive"
          })
        } else {
          setAtividadesCadastradas(atividadesData || [])
        }

        // Carregar status das juntas para determinar quais estão bloqueadas
        await carregarStatusJuntas()
      } catch (error) {
        console.error('Erro inesperado:', error)
        toast({
          title: "Erro",
          description: "Erro inesperado ao carregar dados",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [toast])

  // Atualizar localização automaticamente quando CCA for selecionado
  useEffect(() => {
    const ccaSelecionadoObj = ccas.find(c => c.id === projeto)
    if (ccaSelecionadoObj && ccaSelecionadoObj.localizacao) {
      setLocalizacao(ccaSelecionadoObj.localizacao)
    }
  }, [projeto, ccas])

  // Função para carregar status das juntas
  const carregarStatusJuntas = async () => {
    try {
      const { data: statusData, error } = await supabase
        .from('status_juntas')
        .select('junta_id, atividade')

      if (error) {
        console.error('Erro ao carregar status das juntas:', error)
        return
      }

      // Verificar quais juntas passaram por "Acoplamento" e "Solda"
      const juntasComStatus: { [key: string]: string[] } = {}
      
      statusData?.forEach(status => {
        if (!juntasComStatus[status.junta_id]) {
          juntasComStatus[status.junta_id] = []
        }
        juntasComStatus[status.junta_id].push(status.atividade)
      })

      const bloqueadas = Object.keys(juntasComStatus).filter(juntaId => {
        const atividades = juntasComStatus[juntaId]
        return atividades.includes('Acoplamento') && atividades.includes('Solda')
      })

      setJuntasBloqueadas(bloqueadas)
    } catch (error) {
      console.error('Erro ao carregar status das juntas:', error)
    }
  }

  const handleTempoChange = (value: string, checked: boolean) => {
    if (checked) {
      setTempo([...tempo, value])
    } else {
      setTempo(tempo.filter(t => t !== value))
    }
  }

  // Função para adicionar nova atividade principal
  const adicionarAtividadePrincipal = (atividadeId: string) => {
    if (!atividadeId) return

    const atividade = atividadesCadastradas.find(a => a.id === atividadeId)
    if (!atividade) return

    const novaAtividadePrincipal: AtividadePrincipal = {
      id: Date.now().toString(),
      atividadeId: atividadeId,
      nomeAtividade: atividade.nome,
      descricao: atividade.descricao || undefined,
      equipe: [],
      horas: "0",
      registrosEtapas: []
    }

    setAtividadesPrincipais([...atividadesPrincipais, novaAtividadePrincipal])

    toast({
      title: "Atividade adicionada",
      description: `"${atividade.nome}" foi adicionada à lista`
    })
  }

  // Função para remover atividade principal
  const removerAtividadePrincipal = (id: string) => {
    setAtividadesPrincipais(atividadesPrincipais.filter(a => a.id !== id))
  }

  // Função para atualizar atividade principal
  const atualizarAtividadePrincipal = (id: string, campo: keyof AtividadePrincipal, valor: any) => {
    setAtividadesPrincipais(atividadesPrincipais.map(a => 
      a.id === id ? { ...a, [campo]: valor } : a
    ))
  }

  // Função para adicionar registro de etapa
  const adicionarRegistroEtapa = (atividadeId: string) => {
    const novoRegistro: RegistroEtapa = {
      id: Date.now().toString(),
      fluido: "",
      linha: "",
      juntaTag: [],
      tagValvula: "",
      detalhamentoAtividade: "",
      etapaProducao: "",
      pesoSuporte: "",
      quantidadeSuporte: "1",
      // Campos específicos para MEC_EQUIP
      tipoEquipamento: "",
      tagEquipamento: "",
      liberacaoBaseCivil: "",
      posicionamentoBase: "",
      montagemComponentes: "",
      alinhamentoFinalAcoplamento: "",
      testeGiro: "",
      limpezaFinal: ""
    }

    setAtividadesPrincipais(atividadesPrincipais.map(a => {
      if (a.id === atividadeId) {
        return { ...a, registrosEtapas: [...a.registrosEtapas, novoRegistro] }
      }
      return a
    }))
  }

  // Função para remover registro de etapa
  const removerRegistroEtapa = (atividadeId: string, registroId: string) => {
    setAtividadesPrincipais(atividadesPrincipais.map(a => {
      if (a.id === atividadeId) {
        return { ...a, registrosEtapas: a.registrosEtapas.filter(r => r.id !== registroId) }
      }
      return a
    }))
  }

  // Função para atualizar registro de etapa
  const atualizarRegistroEtapa = (atividadeId: string, registroId: string, campo: keyof RegistroEtapa, valor: any) => {
    setAtividadesPrincipais(prevAtividades => prevAtividades.map(a => {
      if (a.id === atividadeId) {
        const registrosAtualizados = a.registrosEtapas.map(r => {
          if (r.id === registroId) {
            const updated = { ...r, [campo]: valor }
            // Se mudou o fluido, limpar a linha e junta selecionadas
            if (campo === 'fluido') {
              updated.linha = ""
              updated.juntaTag = []
            }
            // Se mudou a linha, limpar a junta selecionada
            if (campo === 'linha') {
              updated.juntaTag = []
            }
            return updated
          }
          return r
        })
        return { ...a, registrosEtapas: registrosAtualizados }
      }
      return a
    }))
  }

  // Função para verificar se deve mostrar o registro de etapas
  const mostrarRegistroEtapas = (nomeAtividade: string) => {
    const atividadesPermitidas = ['TUB_AC', 'TUB_AI_304/304L', 'TUB_AI_316/316L', 'TUB_AI304/304L', 'TUB_AI316/316L', 'SUP_AC', 'SUP_AI', 'SUP_IA', 'MEC_EQUIP']
    return nomeAtividade && atividadesPermitidas.includes(nomeAtividade)
  }

  // Função para verificar se é atividade de suporte
  const isAtividadeSuporte = (nomeAtividade: string) => {
    return nomeAtividade.startsWith('SUP_');
  }

  const isTipoTubulacao = (nomeAtividade: string) => {
    return nomeAtividade.startsWith('TUB_');
  };

  const isMecEquip = (nomeAtividade: string) => {
    return nomeAtividade === 'MEC_EQUIP';
  };

  const getEtapasProducao = (nomeAtividade: string) => {
    if (isAtividadeSuporte(nomeAtividade)) {
      return ["Fabricação", "Montagem"];
    } else if (isTipoTubulacao(nomeAtividade)) {
      return ["Acoplamento", "Solda", "Pintura", "Retrabalho", "Teste"];
    } else if (isMecEquip(nomeAtividade)) {
      // Para MEC_EQUIP não usamos as etapas padrão pois tem lógica especial
      return [];
    }
    return [];
  };

  // Função para verificar se pode habilitar o registro de etapas
  const podeHabilitarEtapas = (atividade: AtividadePrincipal) => {
    return (
      atividade.equipe.length > 0 && 
      parseFloat(atividade.horas) > 0 &&
      mostrarRegistroEtapas(atividade.nomeAtividade)
    )
  }

  const adicionarAtividade = () => {
    const novaAtividade: Atividade = {
      id: Date.now().toString(),
      atividade: "",
      fluido: "Não aplicado",
      linha: "",
      juntaTag: [], // Array vazio para múltipla seleção
      tagValvula: "",
      acoes: "",
      pesoSuporte: "", // Inicializar campo peso
      quantidadeSuporte: "1" // Inicializar quantidade com 1
    }
    setAtividades([...atividades, novaAtividade])
  }

  const removerAtividade = (id: string) => {
    setAtividades(atividades.filter(a => a.id !== id))
  }

  const atualizarAtividade = (id: string, campo: keyof Atividade, valor: string | string[]) => {
    setAtividades(atividades.map(a => {
      if (a.id === id) {
        const updated = { ...a, [campo]: valor }
        // Se mudou o fluido, limpar a linha e junta selecionadas
        if (campo === 'fluido') {
          updated.linha = ""
          updated.juntaTag = [] // Agora é array vazio
        }
        // Se mudou a linha, limpar a junta selecionada
        if (campo === 'linha') {
          updated.juntaTag = [] // Agora é array vazio
        }
        return updated
      }
      return a
    }))
  }

  // Função para filtrar linhas baseado no fluido selecionado
  const getLinhasPorFluido = (fluidoId: string) => {
    if (fluidoId === "Não aplicado" || !fluidoId) {
      return []
    }
    return linhas.filter(linha => linha.fluido_id === fluidoId)
  }

  // Função para filtrar juntas baseado na linha selecionada
  const getJuntasPorLinha = (linhaId: string) => {
    if (!linhaId) {
      return []
    }
    return juntas.filter(junta => junta.linha_id === linhaId)
  }

  // Função para calcular horas totais de uma atividade
  const calcularHorasTotais = (horas: string, equipe: FuncaoEquipe[]) => {
    const horasNumero = parseFloat(horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    const totalPessoas = equipe.reduce((total, funcao) => total + funcao.quantidade, 0)
    return horasNumero * totalPessoas
  }

  // Função para calcular total de pessoas da equipe
  const calcularTotalPessoas = (equipe: FuncaoEquipe[]) => {
    return equipe.reduce((total, funcao) => total + funcao.quantidade, 0)
  }

  // Função para verificar se uma junta pode ser selecionada
  const podeSerSelecionada = (juntaId: string, etapaProducao: string) => {
    // Se a etapa de produção for "Retrabalho", sempre pode selecionar
    if (etapaProducao === "Retrabalho") {
      return true
    }
    // Caso contrário, só pode selecionar se não estiver bloqueada
    return !juntasBloqueadas.includes(juntaId)
  }

  // Função para obter juntas não bloqueadas para uma etapa de produção
  const getJuntasDisponiveis = (linhaId: string, etapaProducao: string) => {
    const juntasDaLinha = getJuntasPorLinha(linhaId)
    return juntasDaLinha.filter(junta => podeSerSelecionada(junta.id, etapaProducao))
  }

  // Função para obter juntas bloqueadas para uma linha
  const getJuntasBloqueadasPorLinha = (linhaId: string) => {
    const juntasDaLinha = getJuntasPorLinha(linhaId)
    return juntasBloqueadas.filter(juntaId => 
      juntasDaLinha.some(junta => junta.id === juntaId)
    )
  }

  const abrirPreVisualizacao = () => {
    // Validações básicas antes de abrir a pré-visualização
    if (!projeto.trim()) {
      toast({
        title: "Erro",
        description: "O campo Centro de Custo (CCA) é obrigatório",
        variant: "destructive"
      })
      return
    }

    if (atividadesPrincipais.length === 0) {
      toast({
        title: "Erro", 
        description: "Adicione pelo menos uma atividade",
        variant: "destructive"
      })
      return
    }

    setMostrarPreVisualizacao(true)
  }

  const confirmarESalvar = async () => {
    setMostrarPreVisualizacao(false)
    await salvarRelatorio()
  }

  const salvarRelatorio = async () => {
    setSalvandoRelatorio(true)
    
    try {
      // Validações básicas
      if (!projeto.trim()) {
        toast({
          title: "Erro",
          description: "O campo Centro de Custo (CCA) é obrigatório",
          variant: "destructive"
        })
        return
      }

      if (atividadesPrincipais.length === 0) {
        toast({
          title: "Erro", 
          description: "Adicione pelo menos uma atividade",
          variant: "destructive"
        })
        return
      }

      // Criar registro do relatório
      const { data: relatorioData, error: relatorioError } = await supabase
        .from('relatorios_mecanica')
        .insert({
          data: format(date, 'yyyy-MM-dd'),
          projeto: projeto,
          cca_id: projeto || null,
          encarregado_id: responsavel || null,
          localizacao: localizacao.trim() || null,
          condicoes_climaticas: tempo,
          condicao_descricao: condicao.trim() || null,
          indice_pluviometrico: null,
          anotacoes_gerais: anotacoesGerais.trim() || null,
          comentarios: comentarios.trim() || null
        })
        .select()
        .single()

      if (relatorioError) {
        throw relatorioError
      }

      // Inserir atividades principais
      for (const atividade of atividadesPrincipais) {
        const { data: atividadePrincipalData, error: atividadePrincipalError } = await supabase
          .from('atividades_principais')
          .insert({
            relatorio_id: relatorioData.id,
            atividade_cadastrada_id: atividade.atividadeId,
            nome_atividade: atividade.nomeAtividade,
            equipe: atividade.equipe,
            horas_informadas: parseFloat(atividade.horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
            total_pessoas: calcularTotalPessoas(atividade.equipe),
            horas_totais: calcularHorasTotais(atividade.horas, atividade.equipe)
          })
          .select()
          .single()

        if (atividadePrincipalError) {
          throw atividadePrincipalError
        }

        // Se tem registros de etapas, inserir na tabela relatorios_atividades
        if (mostrarRegistroEtapas(atividade.nomeAtividade) && podeHabilitarEtapas(atividade) && atividade.registrosEtapas.length > 0) {
          for (const registro of atividade.registrosEtapas) {
            const { data: relatorioAtividadeData, error: relatorioAtividadeError } = await supabase
              .from('relatorios_atividades')
              .insert({
                relatorio_id: relatorioData.id,
                atividade_principal_id: atividadePrincipalData.id,
                fluido_id: (registro.fluido && registro.fluido !== "Não aplicado") ? registro.fluido : null,
                linha_id: (registro.linha && registro.linha !== "") ? registro.linha : null,
                juntas_ids: registro.juntaTag || [],
                tag_valvula: registro.tagValvula || null,
                atividade: registro.etapaProducao || atividade.nomeAtividade,
                horas_informadas: parseFloat(atividade.horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
                total_pessoas_equipe: calcularTotalPessoas(atividade.equipe),
                horas_totais: calcularHorasTotais(atividade.horas, atividade.equipe),
                detalhes_equipe: atividade.equipe
              })
              .select()
              .single()

            if (relatorioAtividadeError) {
              throw relatorioAtividadeError
            }

            // Se é atividade de suporte, inserir informações de suporte
            if (isAtividadeSuporte(atividade.nomeAtividade) && atividadePrincipalData.id) {
              const { error: suporteError } = await supabase
                .from('informacoes_suporte')
                .insert({
                  relatorio_atividade_id: relatorioAtividadeData.id,
                  peso_kg: registro.pesoSuporte ? parseFloat(registro.pesoSuporte) : null,
                  quantidade: registro.quantidadeSuporte ? parseInt(registro.quantidadeSuporte) : 1,
                  observacoes: registro.detalhamentoAtividade || null
                })

              if (suporteError) {
                throw suporteError
              }
            }

            // Atualizar status das juntas se foram selecionadas
            if (registro.juntaTag && registro.juntaTag.length > 0 && registro.etapaProducao) {
              for (const juntaId of registro.juntaTag) {
                const { error: statusError } = await supabase
                  .from('status_juntas')
                  .insert({
                    junta_id: juntaId,
                    atividade: registro.etapaProducao,
                    relatorio_atividade_id: relatorioAtividadeData.id
                  })

                if (statusError) {
                  console.error('Erro ao inserir status da junta:', statusError)
                }
              }
            }
          }
        }
      }

      toast({
        title: "Relatório Salvo",
        description: `Relatório salvo com sucesso! ${atividadesPrincipais.length} atividade(s) registrada(s).`
      })

      // Limpar formulário após salvar
      setProjeto("")
      setResponsavel("")
      setLocalizacao("")
      setTempo([])
      setCondicao("")
      setAnotacoesGerais("")
      setComentarios("")
      setAtividadesPrincipais([])
      setAtividades([{
        id: "1",
        atividade: "",
        fluido: "Não aplicado",
        linha: "",
        juntaTag: [],
        tagValvula: "",
        acoes: "",
        pesoSuporte: "",
        quantidadeSuporte: "1"
      }])

      // Recarregar status das juntas após salvar
      await carregarStatusJuntas()

    } catch (error) {
      console.error('Erro ao salvar relatório:', error)
      toast({
        title: "Erro",
        description: "Erro ao salvar relatório. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setSalvandoRelatorio(false)
    }
  }

  // Função para obter nome do CCA
  const getNomeCCA = (ccaId: string) => {
    const cca = ccas.find(c => c.id === ccaId)
    return cca ? `${cca.codigo} - ${cca.nome}` : ccaId
  }

  // Função para obter nome do encarregado
  const getNomeEncarregado = (encarregadoId: string) => {
    const encarregado = encarregados.find(e => e.id === encarregadoId)
    return encarregado ? encarregado.nome : "Não informado"
  }

  // Função para obter nome do fluido
  const getNomeFluido = (fluidoId: string) => {
    if (!fluidoId || fluidoId === "Não aplicado") return "Não aplicado"
    const fluido = fluidos.find(f => f.id === fluidoId)
    return fluido ? fluido.nome : "Não informado"
  }

  // Função para obter nome da linha
  const getNomeLinha = (linhaId: string) => {
    if (!linhaId) return "Não informado"
    const linha = linhas.find(l => l.id === linhaId)
    return linha ? linha.nome_linha : "Não informado"
  }

  // Função para obter números das juntas
  const getNumerosJuntas = (juntaIds: string[]) => {
    if (!juntaIds || juntaIds.length === 0) return "Nenhuma"
    return juntaIds.map(id => {
      const junta = juntas.find(j => j.id === id)
      return junta ? junta.numero_junta : id
    }).join(", ")
  }

  return (
    <Layout>
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl font-bold">
            MECÂNICA/TUBULAÇÃO
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="projeto" className="text-sm font-medium">
                CENTRO DE CUSTO (CCA)
              </Label>
              <Select
                value={projeto}
                onValueChange={setProjeto}
                disabled={loading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loading ? "Carregando..." : "Selecione o CCA"} />
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
            <div>
              <Label htmlFor="data" className="text-sm font-medium">
                DATA
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MMM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="responsavel" className="text-sm font-medium">
                ENCARREGADO
              </Label>
              <Select
                value={responsavel}
                onValueChange={setResponsavel}
                disabled={loading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loading ? "Carregando..." : "Selecione o encarregado"} />
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
            <div>
              <Label htmlFor="localizacao" className="text-sm font-medium">
                LOCALIZAÇÃO
              </Label>
              <Input
                id="localizacao"
                placeholder="Local"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacidade da equipe (disponível vs. alocado) */}
      {responsavel && (() => {
        const enc = encarregados.find(e => e.id === responsavel);
        if (!enc || !enc.equipe || enc.equipe.length === 0) return null;
        const dia = date.getDay();
        const horasPorPessoa = (dia >= 1 && dia <= 4) ? 9 : 8;
        const disponivel: Record<string, number> = {};
        const totalFuncionarios = enc.equipe.reduce((acc, f) => acc + (f.quantidade || 0), 0);
        enc.equipe.forEach(f => {
          disponivel[f.funcao] = (disponivel[f.funcao] || 0) + (f.quantidade || 0) * horasPorPessoa;
        });
        const consumido: Record<string, number> = {};
        atividadesPrincipais.forEach(a => {
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

      {/* Condição Climática */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary">Condição climática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">Tempo</Label>
              <div className="space-y-2 mt-2">
                {["Manhã", "Tarde", "Noite"].map((periodo) => (
                  <div key={periodo} className="flex items-center space-x-2">
                    <Checkbox
                      id={periodo}
                      checked={tempo.includes(periodo)}
                      onCheckedChange={(checked) => 
                        handleTempoChange(periodo, checked as boolean)
                      }
                    />
                    <Label htmlFor={periodo} className="text-sm">{periodo}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="condicao" className="text-sm font-medium">
                Condição
              </Label>
              <Select
                value={condicao}
                onValueChange={setCondicao}
              >
                <SelectTrigger className="mt-1 bg-background">
                  <SelectValue placeholder="Selecione a condição climática" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md z-50">
                  <SelectItem value="Ensolarado">Ensolarado</SelectItem>
                  <SelectItem value="Parcialmente nublado">Parcialmente nublado</SelectItem>
                  <SelectItem value="Nublado">Nublado</SelectItem>
                  <SelectItem value="Chuvoso">Chuvoso</SelectItem>
                  <SelectItem value="Tempestade">Tempestade</SelectItem>
                  <SelectItem value="Neblina">Neblina</SelectItem>
                  <SelectItem value="Ventoso">Ventoso</SelectItem>
                  <SelectItem value="Seco">Seco</SelectItem>
                  <SelectItem value="Úmido">Úmido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Atividades */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-primary">Lista de Atividades</CardTitle>
          <div className="flex gap-2">
            <AtividadeSelector
              atividades={atividadesCadastradas}
              atividadeSelecionada=""
              onAtividadeSelect={adicionarAtividadePrincipal}
            >
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Selecionar Atividade
              </Button>
            </AtividadeSelector>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Renderizar todas as atividades principais */}
            {atividadesPrincipais.map((atividadePrincipal) => (
              <Card key={atividadePrincipal.id} className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-primary">
                      {atividadePrincipal.nomeAtividade}
                    </CardTitle>
                    {atividadePrincipal.descricao && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {atividadePrincipal.descricao}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerAtividadePrincipal(atividadePrincipal.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Sub-card Equipe */}
                    <Card className="border-secondary/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-secondary-foreground flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          Equipe
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <EquipeSelector 
                            value={atividadePrincipal.equipe}
                            onChange={(equipe) => atualizarAtividadePrincipal(atividadePrincipal.id, 'equipe', equipe)}
                          />
                          <div>
                            <Label className="text-sm">Horas Trabalhadas</Label>
                            <Input 
                              value={atividadePrincipal.horas}
                              onChange={(e) => atualizarAtividadePrincipal(atividadePrincipal.id, 'horas', e.target.value)}
                              placeholder="Ex: 8"
                              className="mt-1"
                            />
                            {atividadePrincipal.equipe.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Total: {calcularHorasTotais(atividadePrincipal.horas, atividadePrincipal.equipe).toFixed(1)}h 
                                ({calcularTotalPessoas(atividadePrincipal.equipe)} pessoas)
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Sub-card Registro de Etapas */}
                    <Card className="border-accent/30">
                      <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg text-accent-foreground flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                          Registro de Etapas
                          {atividadePrincipal.registrosEtapas.length > 0 && (
                            <span className="text-xs bg-accent/20 px-2 py-1 rounded-full">
                              {atividadePrincipal.registrosEtapas.length} registro(s)
                            </span>
                          )}
                        </CardTitle>
                        {podeHabilitarEtapas(atividadePrincipal) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adicionarRegistroEtapa(atividadePrincipal.id)}
                            className="h-7 px-2"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        {podeHabilitarEtapas(atividadePrincipal) ? (
                          <div className="space-y-4">
                            {/* Renderizar lista de registros de etapas */}
                            {atividadePrincipal.registrosEtapas.length === 0 ? (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-center">
                                <p className="text-sm text-blue-800 font-medium">
                                  Nenhum registro de etapa adicionado
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  Clique em "Adicionar" para criar um novo registro
                                </p>
                              </div>
                            ) : (
                              atividadePrincipal.registrosEtapas.map((registro, index) => (
                                <Card key={registro.id} className="border-border/50 bg-background/50">
                                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <h4 className="text-sm font-medium text-foreground">
                                      Registro {index + 1}
                                    </h4>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removerRegistroEtapa(atividadePrincipal.id, registro.id)}
                                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </CardHeader>
                                  <CardContent className="pt-0 space-y-3">
                                    {/* Campos para atividades SUP_ */}
                                    {isAtividadeSuporte(atividadePrincipal.nomeAtividade) && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <Label className="text-xs font-medium">Peso (kg)</Label>
                                          <Input
                                            value={registro.pesoSuporte || ""}
                                            onChange={(e) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'pesoSuporte', e.target.value)}
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 h-8"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs font-medium">Quantidade</Label>
                                          <Input
                                            value={registro.quantidadeSuporte || "1"}
                                            onChange={(e) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'quantidadeSuporte', e.target.value)}
                                            placeholder="1"
                                            type="number"
                                            min="1"
                                            className="mt-1 h-8"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Campos para atividades TUB_ */}
                                    {isTipoTubulacao(atividadePrincipal.nomeAtividade) && (
                                      <>
                                        {/* Fluido */}
                                        <div>
                                          <Label className="text-xs font-medium">Fluido</Label>
                                          <Select
                                            value={registro.fluido || ""}
                                            onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'fluido', value)}
                                          >
                                            <SelectTrigger className="mt-1 h-8">
                                              <SelectValue placeholder="Selecione o fluido" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border shadow-md z-50">
                                              <SelectItem value="Não aplicado">Não aplicado</SelectItem>
                                              {fluidos.map((fluido) => (
                                                <SelectItem key={fluido.id} value={fluido.id}>
                                                  {fluido.nome}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Linha */}
                                        <div>
                                          <Label className="text-xs font-medium">Linha</Label>
                                          <Select
                                            value={registro.linha || ""}
                                            onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'linha', value)}
                                            disabled={!registro.fluido || registro.fluido === "Não aplicado"}
                                          >
                                            <SelectTrigger className="mt-1 h-8">
                                              <SelectValue placeholder="Selecione a linha" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border shadow-md z-50">
                                              {getLinhasPorFluido(registro.fluido || "").map((linha) => (
                                                <SelectItem key={linha.id} value={linha.id}>
                                                  {linha.nome_linha}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Juntas */}
                                        <div>
                                          <Label className="text-xs font-medium">Junta/TAG/Peça</Label>
                                          <div className="mt-1">
                                             <JuntaMultiSelector
                                               value={registro.juntaTag || []}
                                               onChange={(juntas) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'juntaTag', juntas)}
                                               juntasDisponiveis={getJuntasDisponiveis(registro.linha || "", registro.etapaProducao || "")}
                                               juntasBloqueadas={getJuntasBloqueadasPorLinha(registro.linha || "")}
                                               disabled={!registro.linha}
                                             />
                                          </div>
                                        </div>

                                        {/* TAG Válvula */}
                                        <div>
                                          <Label className="text-xs font-medium">TAG Válvula</Label>
                                          <Input
                                            value={registro.tagValvula || ""}
                                            onChange={(e) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'tagValvula', e.target.value)}
                                            placeholder="TAG da válvula"
                                            className="mt-1 h-8"
                                          />
                                        </div>

                                        {/* Detalhamento da Atividade */}
                                        <div>
                                          <Label className="text-xs font-medium">Detalhamento da Atividade</Label>
                                          <Textarea
                                            value={registro.detalhamentoAtividade || ""}
                                            onChange={(e) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'detalhamentoAtividade', e.target.value)}
                                            placeholder="Descreva os detalhes da atividade..."
                                            className="mt-1 min-h-[60px] resize-none"
                                          />
                                        </div>
                                      </>
                                     )}

                                     {/* Campos específicos para MEC_EQUIP */}
                                     {isMecEquip(atividadePrincipal.nomeAtividade) && (
                                       <div className="space-y-3">
                                         {/* Tipo de Equipamento */}
                                         <div>
                                           <Label className="text-xs font-medium">Tipo de Equipamento</Label>
                                            <Select
                                              value={registro.tipoEquipamento || ""}
                                              onValueChange={(value) => {
                                                // Atualizar usando callback para garantir que usa o estado mais atual
                                                setAtividadesPrincipais(prevAtividades => 
                                                  prevAtividades.map(a => {
                                                    if (a.id === atividadePrincipal.id) {
                                                      const registrosAtualizados = a.registrosEtapas.map(r => {
                                                        if (r.id === registro.id) {
                                                          return {
                                                            ...r,
                                                             tipoEquipamento: value,
                                                             // Limpar TAG e campos específicos quando muda o tipo
                                                             tagEquipamento: "",
                                                             liberacaoBaseCivil: "",
                                                             posicionamentoBase: "",
                                                             montagemComponentes: "",
                                                             alinhamentoFinalAcoplamento: "",
                                                             testeGiro: "",
                                                             limpezaFinal: ""
                                                          }
                                                        }
                                                        return r
                                                      })
                                                      return { ...a, registrosEtapas: registrosAtualizados }
                                                    }
                                                    return a
                                                  })
                                                )
                                              }}
                                           >
                                             <SelectTrigger className="mt-1 h-8">
                                               <SelectValue placeholder="Selecione o tipo" />
                                             </SelectTrigger>
                                             <SelectContent className="bg-background border shadow-md z-50">
                                               <SelectItem value="Equipamento Estático">Equipamento Estático</SelectItem>
                                               <SelectItem value="Equipamento Rotativo">Equipamento Rotativo</SelectItem>
                                             </SelectContent>
                                           </Select>
                                          </div>

                                          {/* TAG do Equipamento - Aparece quando tipo é selecionado */}
                                          {(registro.tipoEquipamento === "Equipamento Estático" || registro.tipoEquipamento === "Equipamento Rotativo") && (
                                            <div>
                                              <Label className="text-xs font-medium">TAG do Equipamento</Label>
                                              <Select
                                                value={registro.tagEquipamento || ""}
                                                onValueChange={(value) => {
                                                  setAtividadesPrincipais(prevAtividades => 
                                                    prevAtividades.map(a => {
                                                      if (a.id === atividadePrincipal.id) {
                                                        const registrosAtualizados = a.registrosEtapas.map(r => {
                                                          if (r.id === registro.id) {
                                                            return { ...r, tagEquipamento: value }
                                                          }
                                                          return r
                                                        })
                                                        return { ...a, registrosEtapas: registrosAtualizados }
                                                      }
                                                      return a
                                                    })
                                                  )
                                                }}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Selecione o TAG do equipamento" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                                  {/* Tags para Equipamento Estático */}
                                                  {registro.tipoEquipamento === "Equipamento Estático" && (
                                                    <>
                                                      <SelectItem value="V-001">V-001 - Vaso de Pressão</SelectItem>
                                                      <SelectItem value="T-001">T-001 - Torre de Destilação</SelectItem>
                                                      <SelectItem value="E-001">E-001 - Trocador de Calor</SelectItem>
                                                      <SelectItem value="F-001">F-001 - Forno Industrial</SelectItem>
                                                      <SelectItem value="C-001">C-001 - Coluna de Separação</SelectItem>
                                                      <SelectItem value="R-001">R-001 - Reator</SelectItem>
                                                      <SelectItem value="S-001">S-001 - Separador</SelectItem>
                                                      <SelectItem value="H-001">H-001 - Aquecedor</SelectItem>
                                                      <SelectItem value="D-001">D-001 - Secador</SelectItem>
                                                      <SelectItem value="X-001">X-001 - Cristalizador</SelectItem>
                                                    </>
                                                  )}
                                                  {/* Tags para Equipamento Rotativo */}
                                                  {registro.tipoEquipamento === "Equipamento Rotativo" && (
                                                    <>
                                                      <SelectItem value="P-001">P-001 - Bomba Centrífuga</SelectItem>
                                                      <SelectItem value="P-002">P-002 - Bomba de Pistão</SelectItem>
                                                      <SelectItem value="P-003">P-003 - Bomba de Diafragma</SelectItem>
                                                      <SelectItem value="K-001">K-001 - Compressor</SelectItem>
                                                      <SelectItem value="K-002">K-002 - Compressor Parafuso</SelectItem>
                                                      <SelectItem value="K-003">K-003 - Compressor Centrífugo</SelectItem>
                                                      <SelectItem value="G-001">G-001 - Gerador</SelectItem>
                                                      <SelectItem value="M-001">M-001 - Motor Elétrico</SelectItem>
                                                      <SelectItem value="B-001">B-001 - Soprador</SelectItem>
                                                      <SelectItem value="T-001">T-001 - Turbina</SelectItem>
                                                      <SelectItem value="AG-001">AG-001 - Agitador</SelectItem>
                                                      <SelectItem value="V-FAN-001">V-FAN-001 - Ventilador</SelectItem>
                                                    </>
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          )}

                                           {/* Campos para Equipamento Estático */}
                                          {registro.tipoEquipamento === "Equipamento Estático" && (
                                           <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                             <h5 className="text-sm font-medium text-blue-900">Etapas - Equipamento Estático</h5>
                                             
                                             <div>
                                               <Label className="text-xs font-medium">Liberação Base Civil</Label>
                                               <Select
                                                 value={registro.liberacaoBaseCivil || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'liberacaoBaseCivil', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>

                                             <div>
                                               <Label className="text-xs font-medium">Posicionamento na Base</Label>
                                               <Select
                                                 value={registro.posicionamentoBase || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'posicionamentoBase', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>

                                             <div>
                                               <Label className="text-xs font-medium">Montagem de Componentes</Label>
                                               <Select
                                                 value={registro.montagemComponentes || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'montagemComponentes', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>
                                           </div>
                                         )}

                                          {/* Campos para Equipamento Rotativo */}
                                          {registro.tipoEquipamento === "Equipamento Rotativo" && (
                                           <div className="space-y-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                             <h5 className="text-sm font-medium text-green-900">Etapas - Equipamento Rotativo</h5>
                                             
                                             <div>
                                               <Label className="text-xs font-medium">Liberação Base Civil</Label>
                                               <Select
                                                 value={registro.liberacaoBaseCivil || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'liberacaoBaseCivil', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>

                                             <div>
                                               <Label className="text-xs font-medium">Posicionamento na Base</Label>
                                               <Select
                                                 value={registro.posicionamentoBase || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'posicionamentoBase', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>

                                             <div>
                                               <Label className="text-xs font-medium">Alinhamento Final do Acoplamento</Label>
                                               <Select
                                                 value={registro.alinhamentoFinalAcoplamento || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'alinhamentoFinalAcoplamento', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>

                                             <div>
                                               <Label className="text-xs font-medium">Teste de Giro</Label>
                                               <Select
                                                 value={registro.testeGiro || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'testeGiro', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>

                                             <div>
                                               <Label className="text-xs font-medium">Limpeza Final</Label>
                                               <Select
                                                 value={registro.limpezaFinal || ""}
                                                 onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'limpezaFinal', value)}
                                               >
                                                 <SelectTrigger className="mt-1 h-8">
                                                   <SelectValue placeholder="Selecione o percentual" />
                                                 </SelectTrigger>
                                                 <SelectContent className="bg-background border shadow-md z-50">
                                                   {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                                                     <SelectItem key={percent} value={`${percent}%`}>
                                                       {percent}%
                                                     </SelectItem>
                                                   ))}
                                                 </SelectContent>
                                               </Select>
                                             </div>
                                           </div>
                                         )}
                                       </div>
                                     )}

                                     {/* Etapa de Produção - Condicional baseada no tipo de atividade (não aplicável para MEC_EQUIP) */}
                                     {!isMecEquip(atividadePrincipal.nomeAtividade) && (
                                       <div>
                                         <Label className="text-xs font-medium">Etapa de Produção</Label>
                                         <Select
                                           value={registro.etapaProducao || ""}
                                           onValueChange={(value) => atualizarRegistroEtapa(atividadePrincipal.id, registro.id, 'etapaProducao', value)}
                                         >
                                           <SelectTrigger className="mt-1 h-8">
                                             <SelectValue placeholder="Selecione a etapa" />
                                           </SelectTrigger>
                                           <SelectContent className="bg-background border shadow-md z-50">
                                             {getEtapasProducao(atividadePrincipal.nomeAtividade).map((etapa) => (
                                               <SelectItem key={etapa} value={etapa}>
                                                 {etapa}
                                               </SelectItem>
                                             ))}
                                           </SelectContent>
                                         </Select>
                                       </div>
                                     )}
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        ) : mostrarRegistroEtapas(atividadePrincipal.nomeAtividade) ? (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800 font-medium">
                              ⚠ Preencha os dados da equipe
                            </p>
                            <p className="text-xs text-yellow-600 mt-1">
                              Preencha a equipe e horas para habilitar o registro de etapas
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800 font-medium">
                              ℹ Atividade não requer etapas
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Esta atividade não possui registro de etapas detalhadas
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Mensagem quando não há atividades */}
            {atividadesPrincipais.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma atividade adicionada</p>
                <p className="text-xs mt-1">Use o botão "Selecionar Atividade" para adicionar uma nova atividade</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* Anotações e Comentários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary">Anotações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Anotações importantes..."
              value={anotacoesGerais}
              onChange={(e) => setAnotacoesGerais(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary">Comentários</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Comentários adicionais..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button 
          onClick={abrirPreVisualizacao} 
          disabled={salvandoRelatorio}
          className="bg-primary hover:bg-primary/90"
        >
          {salvandoRelatorio ? "Salvando..." : "Salvar Relatório"}
        </Button>
      </div>

      {/* Modal de Pré-visualização */}
      <Dialog open={mostrarPreVisualizacao} onOpenChange={setMostrarPreVisualizacao}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              Pré-visualização do Relatório
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Informações do Cabeçalho */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Informações do Relatório</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Data:</span> {format(date, "dd/MM/yyyy")}
                  </div>
                  <div>
                    <span className="font-medium">CCA:</span> {getNomeCCA(projeto)}
                  </div>
                  <div>
                    <span className="font-medium">Encarregado:</span> {responsavel ? getNomeEncarregado(responsavel) : "Não informado"}
                  </div>
                  <div>
                    <span className="font-medium">Localização:</span> {localizacao || "Não informada"}
                  </div>
                </div>
              </div>

              {/* Condições Climáticas */}
              {tempo.length > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Condições Climáticas</h3>
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Períodos:</span> {tempo.join(", ")}
                    </div>
                    {condicao && (
                      <div className="mt-2">
                        <span className="font-medium">Descrição:</span> {condicao}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Atividades Principais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Atividades Registradas ({atividadesPrincipais.length})</h3>
                
                {atividadesPrincipais.map((atividade, index) => (
                  <div key={atividade.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-base">{index + 1}. {atividade.nomeAtividade}</h4>
                        {atividade.descricao && (
                          <p className="text-sm text-muted-foreground mt-1">{atividade.descricao}</p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div><span className="font-medium">Horas:</span> {atividade.horas}</div>
                        <div><span className="font-medium">Pessoas:</span> {calcularTotalPessoas(atividade.equipe)}</div>
                        <div><span className="font-medium">Total Horas:</span> {calcularHorasTotais(atividade.horas, atividade.equipe).toFixed(1)}h</div>
                      </div>
                    </div>

                    {/* Equipe */}
                    {atividade.equipe.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Equipe:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {atividade.equipe.map((funcao, idx) => (
                            <div key={idx} className="bg-muted/30 p-2 rounded">
                              <span className="font-medium">{funcao.funcao}:</span> {funcao.quantidade}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Registros de Etapas */}
                    {atividade.registrosEtapas.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Registros de Etapas ({atividade.registrosEtapas.length}):</h5>
                        <div className="space-y-3">
                          {atividade.registrosEtapas.map((registro, regIdx) => (
                            <div key={registro.id} className="border rounded p-3 bg-muted/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {!isMecEquip(atividade.nomeAtividade) && (
                                  <>
                                    <div>
                                      <span className="font-medium">Fluido:</span> {getNomeFluido(registro.fluido || "")}
                                    </div>
                                    <div>
                                      <span className="font-medium">Linha:</span> {getNomeLinha(registro.linha || "")}
                                    </div>
                                    <div>
                                      <span className="font-medium">Juntas:</span> {getNumerosJuntas(registro.juntaTag || [])}
                                    </div>
                                    {registro.tagValvula && (
                                      <div>
                                        <span className="font-medium">TAG Válvula:</span> {registro.tagValvula}
                                      </div>
                                    )}
                                    {registro.etapaProducao && (
                                      <div>
                                        <span className="font-medium">Etapa:</span> {registro.etapaProducao}
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* Campos específicos para MEC_EQUIP */}
                                {isMecEquip(atividade.nomeAtividade) && (
                                  <>
                                    {registro.tipoEquipamento && (
                                      <div>
                                        <span className="font-medium">Tipo de Equipamento:</span> {registro.tipoEquipamento}
                                      </div>
                                    )}
                                    {registro.tagEquipamento && (
                                      <div>
                                        <span className="font-medium">TAG do Equipamento:</span> {registro.tagEquipamento}
                                      </div>
                                    )}
                                    
                                    {/* Etapas MEC_EQUIP */}
                                    <div className="md:col-span-2">
                                      <span className="font-medium">Etapas do Equipamento:</span>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                        {registro.liberacaoBaseCivil && (
                                          <div className="text-xs bg-primary/10 p-1 rounded">
                                            Liberação Base Civil: {registro.liberacaoBaseCivil}
                                          </div>
                                        )}
                                        {registro.posicionamentoBase && (
                                          <div className="text-xs bg-primary/10 p-1 rounded">
                                            Posicionamento Base: {registro.posicionamentoBase}
                                          </div>
                                        )}
                                        {registro.montagemComponentes && (
                                          <div className="text-xs bg-primary/10 p-1 rounded">
                                            Montagem Componentes: {registro.montagemComponentes}
                                          </div>
                                        )}
                                        {registro.alinhamentoFinalAcoplamento && (
                                          <div className="text-xs bg-primary/10 p-1 rounded">
                                            Alinhamento Final: {registro.alinhamentoFinalAcoplamento}
                                          </div>
                                        )}
                                        {registro.testeGiro && (
                                          <div className="text-xs bg-primary/10 p-1 rounded">
                                            Teste de Giro: {registro.testeGiro}
                                          </div>
                                        )}
                                        {registro.limpezaFinal && (
                                          <div className="text-xs bg-primary/10 p-1 rounded">
                                            Limpeza Final: {registro.limpezaFinal}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Campos específicos para atividades de suporte */}
                                {isAtividadeSuporte(atividade.nomeAtividade) && (
                                  <>
                                    {registro.pesoSuporte && (
                                      <div>
                                        <span className="font-medium">Peso (kg):</span> {registro.pesoSuporte}
                                      </div>
                                    )}
                                    {registro.quantidadeSuporte && (
                                      <div>
                                        <span className="font-medium">Quantidade:</span> {registro.quantidadeSuporte}
                                      </div>
                                    )}
                                  </>
                                )}

                                {registro.detalhamentoAtividade && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Detalhamento:</span> {registro.detalhamentoAtividade}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {atividade.registrosEtapas.length === 0 && mostrarRegistroEtapas(atividade.nomeAtividade) && (
                      <div className="text-sm text-muted-foreground bg-yellow-50 p-2 rounded">
                        ⚠ Nenhum registro de etapa adicionado para esta atividade
                      </div>
                    )}

                    <Separator className="my-3" />
                  </div>
                ))}
              </div>

              {/* Gráfico de Horas por Função */}
              {atividadesPrincipais.length > 0 && responsavel && (() => {
                const enc = encarregados.find(e => e.id === responsavel);
                if (!enc || !enc.equipe || enc.equipe.length === 0) return null;

                const dia = date.getDay();
                const horasPorPessoa = (dia >= 1 && dia <= 4) ? 9 : 8;
                
                // Calcular horas disponíveis por função
                const disponivel: Record<string, number> = {};
                enc.equipe.forEach(f => {
                  disponivel[f.funcao] = (disponivel[f.funcao] || 0) + (f.quantidade || 0) * horasPorPessoa;
                });

                // Calcular horas alocadas por função
                const horasPorFuncao: { [key: string]: number } = {}
                let totalFuncionarios = 0

                atividadesPrincipais.forEach(atividade => {
                  const horasAtividade = parseFloat(atividade.horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                  atividade.equipe.forEach(funcao => {
                    const horasTotal = horasAtividade * funcao.quantidade
                    horasPorFuncao[funcao.funcao] = (horasPorFuncao[funcao.funcao] || 0) + horasTotal
                    totalFuncionarios += funcao.quantidade
                  })
                })

                // Combinar dados de disponível e alocado
                const todasFuncoes = Array.from(new Set([...Object.keys(disponivel), ...Object.keys(horasPorFuncao)]));
                const dadosGrafico = todasFuncoes.map(funcao => {
                  const alocado = horasPorFuncao[funcao] || 0;
                  const totalDisponivel = disponivel[funcao] || 0;
                  const saldo = Math.max(0, totalDisponivel - alocado);
                  
                  return {
                    funcao,
                    alocado: Number(alocado.toFixed(1)),
                    saldo: Number(saldo.toFixed(1)),
                    total: Number(totalDisponivel.toFixed(1))
                  };
                }).sort((a, b) => b.total - a.total);

                return (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Distribuição de Horas por Função</h3>
                      <div className="text-sm bg-primary/10 px-3 py-1 rounded-full">
                        <span className="font-medium">Total de Funcionários: {totalFuncionarios}</span>
                      </div>
                    </div>
                    
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dadosGrafico}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                          maxBarSize={20}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            type="number"
                            tickFormatter={(value) => `${value}h`}
                            className="text-xs"
                          />
                          <YAxis 
                            type="category"
                            dataKey="funcao"
                            className="text-xs"
                            width={70}
                          />
                          <Tooltip 
                            formatter={(value: any, name: string) => {
                              const label = name === 'alocado' ? 'Horas Alocadas' : 'Saldo Disponível';
                              return [`${value}h`, label];
                            }}
                            labelFormatter={(label) => `Função: ${label}`}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Bar 
                            dataKey="alocado"
                            stackId="horas"
                            fill="hsl(var(--primary))"
                            radius={[0, 0, 0, 0]}
                            name="alocado"
                          />
                          <Bar 
                            dataKey="saldo"
                            stackId="horas"
                            fill="hsl(var(--primary) / 0.3)"
                            radius={[0, 4, 4, 0]}
                            name="saldo"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{backgroundColor: 'hsl(var(--primary))'}}></div>
                        <span>Horas Alocadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{backgroundColor: 'hsl(var(--primary) / 0.3)'}}></div>
                        <span>Saldo Disponível</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Anotações e Comentários */}
              {(anotacoesGerais || comentarios) && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Observações</h3>
                  {anotacoesGerais && (
                    <div className="mb-3">
                      <span className="font-medium">Anotações Gerais:</span>
                      <p className="text-sm mt-1 bg-card p-2 rounded">{anotacoesGerais}</p>
                    </div>
                  )}
                  {comentarios && (
                    <div>
                      <span className="font-medium">Comentários:</span>
                      <p className="text-sm mt-1 bg-card p-2 rounded">{comentarios}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setMostrarPreVisualizacao(false)}>
              Voltar para Editar
            </Button>
            <Button 
              onClick={confirmarESalvar} 
              disabled={salvandoRelatorio}
              className="bg-green-600 hover:bg-green-700"
            >
              {salvandoRelatorio ? "Salvando..." : "Confirmar e Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </Layout>
  )
}