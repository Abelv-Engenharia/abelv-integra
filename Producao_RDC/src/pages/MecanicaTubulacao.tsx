import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { supabase } from "@/integrations/supabase/client"


type EtapasEquipamento = {
  liberacaoBaseCivil: string
  posicionamentoBase: string
  montagemComponentes: string
  alinhamentoFinal: string
  testeGiro: string
  limpezaFinal: string
}

type Atividade = {
  id: string
  atividade: string
  equipe: FuncaoEquipe[]
  horas: string
  fluido: string
  linha: string
  juntaTag: string[] // Mudou para array para múltipla seleção
  tagValvula: string
  acoes: string
  tipoEquipamento?: 'Estático' | 'Rotativo'
  tagEquipamento?: string
  etapasEquipamento?: EtapasEquipamento
}

export default function MecanicaTubulacao() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [projeto, setProjeto] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [localizacao, setLocalizacao] = useState("")
  const [tempo, setTempo] = useState<string[]>([])
  const [condicao, setCondicao] = useState("")
  const [indicePluviometrico, setIndicePluviometrico] = useState("")
  const [anotacoesGerais, setAnotacoesGerais] = useState("")
  const [comentarios, setComentarios] = useState("")
  
  // Estados para dados do Supabase
  const [fluidos, setFluidos] = useState<{id: string, nome: string}[]>([])
  const [linhas, setLinhas] = useState<{id: string, nome_linha: string, fluido_id: string}[]>([])
  const [juntas, setJuntas] = useState<{id: string, numero_junta: string, linha_id: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [juntasBloqueadas, setJuntasBloqueadas] = useState<string[]>([])
  const [salvandoRelatorio, setSalvandoRelatorio] = useState(false)
  
  const [atividades, setAtividades] = useState<Atividade[]>([
    {
      id: "1",
      atividade: "",
      equipe: [],
      horas: "0h",
      fluido: "Não aplicado",
      linha: "",
      juntaTag: [], // Agora é um array
      tagValvula: "",
      acoes: "",
      tipoEquipamento: undefined,
      tagEquipamento: "",
      etapasEquipamento: {
        liberacaoBaseCivil: "",
        posicionamentoBase: "",
        montagemComponentes: "",
        alinhamentoFinal: "",
        testeGiro: "",
        limpezaFinal: ""
      }
    }
  ])

  // Carregar dados do Supabase
  useEffect(() => {
    const carregarDados = async () => {
      try {
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

  const adicionarAtividade = () => {
    const novaAtividade: Atividade = {
      id: Date.now().toString(),
      atividade: "",
      equipe: [],
      horas: "0h",
      fluido: "Não aplicado",
      linha: "",
      juntaTag: [], // Array vazio para múltipla seleção
      tagValvula: "",
      acoes: "",
      tipoEquipamento: undefined,
      tagEquipamento: "",
      etapasEquipamento: {
        liberacaoBaseCivil: "",
        posicionamentoBase: "",
        montagemComponentes: "",
        alinhamentoFinal: "",
        testeGiro: "",
        limpezaFinal: ""
      }
    }
    setAtividades([...atividades, novaAtividade])
  }

  const removerAtividade = (id: string) => {
    setAtividades(atividades.filter(a => a.id !== id))
  }

  const atualizarAtividade = (id: string, campo: keyof Atividade, valor: any) => {
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
        // Se mudou para MEC_EQUIP, inicializar etapas
        if (campo === 'atividade' && valor === 'MEC_EQUIP') {
          updated.tipoEquipamento = undefined
          updated.tagEquipamento = ""
          updated.etapasEquipamento = {
            liberacaoBaseCivil: "",
            posicionamentoBase: "",
            montagemComponentes: "",
            alinhamentoFinal: "",
            testeGiro: "",
            limpezaFinal: ""
          }
        }
        // Se mudou o tipo de equipamento, limpar o TAG selecionado
        if (campo === 'tipoEquipamento') {
          updated.tagEquipamento = ""
        }
        return updated
      }
      return a
    }))
  }

  const atualizarEtapaEquipamento = (id: string, etapa: keyof EtapasEquipamento, valor: string) => {
    setAtividades(atividades.map(a => {
      if (a.id === id && a.etapasEquipamento) {
        return {
          ...a,
          etapasEquipamento: {
            ...a.etapasEquipamento,
            [etapa]: valor
          }
        }
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
  const podeSerSelecionada = (juntaId: string, atividadeAtual: string) => {
    // Se a atividade for "Retrabalho", sempre pode selecionar
    if (atividadeAtual === "Retrabalho") {
      return true
    }
    // Caso contrário, só pode selecionar se não estiver bloqueada
    return !juntasBloqueadas.includes(juntaId)
  }

  // Função para obter juntas não bloqueadas para uma atividade
  const getJuntasDisponiveis = (linhaId: string, atividadeAtual: string) => {
    const juntasDaLinha = getJuntasPorLinha(linhaId)
    return juntasDaLinha.filter(junta => podeSerSelecionada(junta.id, atividadeAtual))
  }

  // Função para obter juntas bloqueadas para uma linha
  const getJuntasBloqueadasPorLinha = (linhaId: string) => {
    const juntasDaLinha = getJuntasPorLinha(linhaId)
    return juntasBloqueadas.filter(juntaId => 
      juntasDaLinha.some(junta => junta.id === juntaId)
    )
  }

  const salvarRelatorio = async () => {
    setSalvandoRelatorio(true)
    
    try {
      // Validações básicas
      if (!projeto.trim()) {
        toast({
          title: "Erro",
          description: "O campo projeto é obrigatório",
          variant: "destructive"
        })
        return
      }

      if (atividades.some(a => !a.atividade || a.equipe.length === 0)) {
        toast({
          title: "Erro", 
          description: "Todas as atividades devem ter tipo e equipe definidos",
          variant: "destructive"
        })
        return
      }

      // Criar registro do relatório
      const { data: relatorioData, error: relatorioError } = await supabase
        .from('relatorios_mecanica')
        .insert({
          data: format(date, 'yyyy-MM-dd'),
          projeto: projeto.trim(),
          responsavel: responsavel.trim() || null,
          localizacao: localizacao.trim() || null,
          condicoes_climaticas: tempo,
          condicao_descricao: condicao.trim() || null,
          indice_pluviometrico: indicePluviometrico.trim() || null,
          anotacoes_gerais: anotacoesGerais.trim() || null,
          comentarios: comentarios.trim() || null
        })
        .select()
        .single()

      if (relatorioError) {
        throw relatorioError
      }

      // Inserir atividades
      const atividadesParaInserir = atividades.map(atividade => ({
        relatorio_id: relatorioData.id,
        atividade: atividade.atividade,
        fluido_id: atividade.fluido === "Não aplicado" ? null : atividade.fluido,
        linha_id: atividade.linha || null,
        juntas_ids: atividade.juntaTag,
        tag_valvula: atividade.tagValvula.trim() || null,
        horas_informadas: parseFloat(atividade.horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        total_pessoas_equipe: calcularTotalPessoas(atividade.equipe),
        horas_totais: calcularHorasTotais(atividade.horas, atividade.equipe),
        detalhes_equipe: atividade.equipe
      }))

      const { data: atividadesData, error: atividadesError } = await supabase
        .from('relatorios_atividades')
        .insert(atividadesParaInserir)
        .select()

      if (atividadesError) {
        throw atividadesError
      }

      // Inserir informações de suporte para atividades do tipo "SUP"
      const informacoesSuporte: any[] = []
      
      atividadesData.forEach((atividadeDb, index) => {
        const atividadeOriginal = atividades[index]
        
        // Se a atividade for do tipo "SUP", salvar na tabela informacoes_suporte
        if (atividadeOriginal.atividade.toUpperCase().includes('SUP')) {
          informacoesSuporte.push({
            relatorio_atividade_id: atividadeDb.id,
            peso_kg: null, // Pode ser expandido para capturar peso se necessário
            quantidade: calcularTotalPessoas(atividadeOriginal.equipe),
            observacoes: `Atividade: ${atividadeOriginal.atividade}, Horas: ${atividadeOriginal.horas}, Equipe: ${atividadeOriginal.equipe.map(e => `${e.funcao}: ${e.quantidade}`).join(', ')}, Linha: ${atividadeOriginal.linha || 'N/A'}, Tag Válvula: ${atividadeOriginal.tagValvula || 'N/A'}`
          })
        }
      })

      // Inserir informações de suporte se existirem
      if (informacoesSuporte.length > 0) {
        const { error: suporteError } = await supabase
          .from('informacoes_suporte')
          .insert(informacoesSuporte)

        if (suporteError) {
          console.error('Erro ao inserir informações de suporte:', suporteError)
          // Não bloquear o salvamento por erro no suporte
        }
      }

      // Atualizar status das juntas
      const statusParaInserir: any[] = []
      
      atividadesData.forEach((atividadeDb, index) => {
        const atividadeOriginal = atividades[index]
        if (atividadeOriginal.juntaTag && atividadeOriginal.juntaTag.length > 0) {
          atividadeOriginal.juntaTag.forEach(juntaId => {
            statusParaInserir.push({
              junta_id: juntaId,
              atividade: atividadeOriginal.atividade,
              relatorio_atividade_id: atividadeDb.id
            })
          })
        }
      })

      if (statusParaInserir.length > 0) {
        const { error: statusError } = await supabase
          .from('status_juntas')
          .insert(statusParaInserir)

        if (statusError) {
          console.error('Erro ao inserir status das juntas:', statusError)
          // Não bloquear o salvamento por erro no status
        }
      }

      // Recarregar status das juntas
      await carregarStatusJuntas()

      toast({
        title: "Relatório Salvo",
        description: `Relatório salvo com sucesso! ${atividadesData.length} atividade(s) registrada(s).`
      })

      // Limpar formulário após salvar
      setProjeto("")
      setResponsavel("")
      setLocalizacao("")
      setTempo([])
      setCondicao("")
      setIndicePluviometrico("")
      setAnotacoesGerais("")
      setComentarios("")
      setAtividades([{
        id: "1",
        atividade: "",
        equipe: [],
        horas: "0h",
        fluido: "Não aplicado",
        linha: "",
        juntaTag: [],
        tagValvula: "",
        acoes: "",
        tipoEquipamento: undefined,
        tagEquipamento: "",
        etapasEquipamento: {
          liberacaoBaseCivil: "",
          posicionamentoBase: "",
          montagemComponentes: "",
          alinhamentoFinal: "",
          testeGiro: "",
          limpezaFinal: ""
        }
      }])

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

  return (
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
                PROJETO
              </Label>
              <Input
                id="projeto"
                placeholder="Nome do projeto"
                value={projeto}
                onChange={(e) => setProjeto(e.target.value)}
                className="mt-1"
              />
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
                RESPONSÁVEL
              </Label>
              <Input
                id="responsavel"
                placeholder="Responsável"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="mt-1"
              />
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

      {/* Condição Climática */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary">Condição climática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Input
                id="condicao"
                placeholder="Descreva a condição"
                value={condicao}
                onChange={(e) => setCondicao(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="indice" className="text-sm font-medium">
                Índice pluviométrico (mm)
              </Label>
              <Input
                id="indice"
                placeholder="Ex: 5,30"
                value={indicePluviometrico}
                onChange={(e) => setIndicePluviometrico(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registro de Atividades */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-primary">Registro de Atividades</CardTitle>
          <Button onClick={adicionarAtividade} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Atividade</th>
                  <th className="text-left p-2 text-sm font-medium">Equipe</th>
                  <th className="text-left p-2 text-sm font-medium">Horas</th>
                   <th className="text-left p-2 text-sm font-medium">Fluido</th>
                   <th className="text-left p-2 text-sm font-medium">Linha</th>
                  <th className="text-left p-2 text-sm font-medium">Junta/TAG/Peça</th>
                  <th className="text-left p-2 text-sm font-medium">TAG Válvula</th>
                  <th className="text-left p-2 text-sm font-medium">Ações</th>
                  <th className="text-left p-2 text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {atividades.map((atividade) => (
                  <React.Fragment key={atividade.id}>
                    <tr className="border-b">
                      <td className="p-2">
                        <Select
                          value={atividade.atividade}
                          onValueChange={(value) => atualizarAtividade(atividade.id, "atividade", value)}
                        >
                          <SelectTrigger className="min-w-[150px]">
                            <SelectValue placeholder="Selecione atividade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Acoplamento">Acoplamento</SelectItem>
                            <SelectItem value="Solda">Solda</SelectItem>
                            <SelectItem value="Fabricação de suporte">Fabricação de suporte</SelectItem>
                            <SelectItem value="Montagem de suporte">Montagem de suporte</SelectItem>
                            <SelectItem value="Pré Montagem de estrutura">Pré Montagem de estrutura</SelectItem>
                            <SelectItem value="Montagem de estrutura">Montagem de estrutura</SelectItem>
                            <SelectItem value="Teste Hidrostatico">Teste Hidrostatico</SelectItem>
                            <SelectItem value="Pintura">Pintura</SelectItem>
                            <SelectItem value="Retrabalho">Retrabalho</SelectItem>
                            <SelectItem value="MEC_EQUIP">MEC_EQUIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <EquipeSelector
                          value={atividade.equipe}
                          onChange={(equipe) => atualizarAtividade(atividade.id, "equipe", equipe)}
                        />
                      </td>
                       <td className="p-2">
                         <div className="space-y-1">
                           <Input
                             value={atividade.horas}
                             onChange={(e) => atualizarAtividade(atividade.id, "horas", e.target.value)}
                             placeholder="0h"
                             className="min-w-[80px]"
                           />
                           {atividade.equipe.length > 0 && (
                             <div className="text-xs text-muted-foreground">
                               Total: {calcularHorasTotais(atividade.horas, atividade.equipe).toFixed(1)}h
                               ({calcularTotalPessoas(atividade.equipe)} pessoas)
                             </div>
                           )}
                         </div>
                       </td>
                       <td className="p-2">
                         <Select
                           value={atividade.fluido}
                           onValueChange={(value) => atualizarAtividade(atividade.id, "fluido", value)}
                           disabled={loading}
                         >
                           <SelectTrigger className="min-w-[120px]">
                             <SelectValue placeholder={loading ? "Carregando..." : "Selecione fluido"} />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Não aplicado">Não aplicado</SelectItem>
                              {fluidos.map((fluido) => (
                                <SelectItem key={fluido.id} value={fluido.id}>
                                  {fluido.nome}
                                </SelectItem>
                              ))}
                           </SelectContent>
                         </Select>
                       </td>
                       <td className="p-2">
                         <Select
                           value={atividade.linha}
                           onValueChange={(value) => atualizarAtividade(atividade.id, "linha", value)}
                           disabled={loading || atividade.fluido === "Não aplicado" || !atividade.fluido}
                         >
                           <SelectTrigger className="min-w-[120px]">
                             <SelectValue placeholder={
                               loading ? "Carregando..." : 
                               atividade.fluido === "Não aplicado" || !atividade.fluido ? "Selecione um fluido primeiro" : 
                               getLinhasPorFluido(atividade.fluido).length === 0 ? "Nenhuma linha disponível" :
                               "Selecione linha"
                             } />
                           </SelectTrigger>
                           <SelectContent>
                             {getLinhasPorFluido(atividade.fluido).map((linha) => (
                               <SelectItem key={linha.id} value={linha.id}>
                                 {linha.nome_linha}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </td>
                       <td className="p-2">
                         <JuntaMultiSelector
                           value={atividade.juntaTag}
                           onChange={(juntasIds) => atualizarAtividade(atividade.id, "juntaTag", juntasIds)}
                           juntasDisponiveis={getJuntasPorLinha(atividade.linha)}
                           juntasBloqueadas={getJuntasBloqueadasPorLinha(atividade.linha)}
                           disabled={loading || !atividade.linha}
                         />
                       </td>
                      <td className="p-2">
                        <Input
                          value={atividade.tagValvula}
                          onChange={(e) => atualizarAtividade(atividade.id, "tagValvula", e.target.value)}
                          placeholder="TAG"
                          className="min-w-[100px]"
                        />
                      </td>
                      <td className="p-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="min-w-[80px]"
                        >
                          ⚪
                        </Button>
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerAtividade(atividade.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    {/* Mostrar etapas do equipamento quando MEC_EQUIP for selecionado */}
                    {atividade.atividade === 'MEC_EQUIP' && (
                      <tr>
                        <td colSpan={9} className="p-4 bg-muted/30">
                          <div className="space-y-4">                            
                            {/* Seletor de tipo de equipamento */}
                            <div className="flex items-center space-x-4">
                              <Label className="text-sm font-medium">Tipo de Equipamento:</Label>
                              <Select
                                value={atividade.tipoEquipamento || ""}
                                onValueChange={(value: 'Estático' | 'Rotativo') => {
                                  console.log(`Selecionando tipo: ${value} para atividade ${atividade.id}`)
                                  atualizarAtividade(atividade.id, "tipoEquipamento", value)
                                }}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Estático">Equipamento Estático</SelectItem>
                                  <SelectItem value="Rotativo">Equipamento Rotativo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            
                            {/* Campo TAG do Equipamento - Aparece somente quando tipo é selecionado */}
                            {atividade.tipoEquipamento && (
                              <div className="flex items-center space-x-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <Label className="text-sm font-medium text-blue-800">TAG do Equipamento:</Label>
                                <Select
                                  value={atividade.tagEquipamento || ""}
                                  onValueChange={(value) => {
                                    console.log(`Selecionando TAG: ${value} para atividade ${atividade.id}`)
                                    atualizarAtividade(atividade.id, "tagEquipamento", value)
                                  }}
                                >
                                  <SelectTrigger className="w-[250px] bg-white">
                                    <SelectValue placeholder="Selecione o TAG do equipamento" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                    {/* Tags para Equipamento Estático */}
                                    {atividade.tipoEquipamento === 'Estático' && (
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
                                    {atividade.tipoEquipamento === 'Rotativo' && (
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
 
                             {/* Título das etapas */}
                             <div className="text-center">
                               <h4 className="text-lg font-semibold text-primary">
                                 Etapas - Equipamento {atividade.tipoEquipamento || ""}
                               </h4>
                             </div>

                            {/* Grid das etapas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Liberação Base Civil */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Liberação Base Civil</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">
                                    {atividade.tipoEquipamento === 'Estático' ? 'Sim' : 
                                     atividade.tipoEquipamento === 'Rotativo' ? 'Sim' : 'N/A'}
                                  </span>
                                  {((atividade.tipoEquipamento === 'Estático') || 
                                    (atividade.tipoEquipamento === 'Rotativo')) && (
                                    <Input
                                      placeholder="% concluído"
                                      value={atividade.etapasEquipamento?.liberacaoBaseCivil || ""}
                                      onChange={(e) => atualizarEtapaEquipamento(atividade.id, "liberacaoBaseCivil", e.target.value)}
                                      className="w-24"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Posicionamento na Base */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Posicionamento na Base</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">
                                    {atividade.tipoEquipamento === 'Estático' ? 'Sim' : 
                                     atividade.tipoEquipamento === 'Rotativo' ? 'Sim' : 'N/A'}
                                  </span>
                                  {((atividade.tipoEquipamento === 'Estático') || 
                                    (atividade.tipoEquipamento === 'Rotativo')) && (
                                    <Input
                                      placeholder="% concluído"
                                      value={atividade.etapasEquipamento?.posicionamentoBase || ""}
                                      onChange={(e) => atualizarEtapaEquipamento(atividade.id, "posicionamentoBase", e.target.value)}
                                      className="w-24"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Montagem dos Componentes */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Montagem dos Componentes</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">
                                    {atividade.tipoEquipamento === 'Estático' ? 'Sim' : 
                                     atividade.tipoEquipamento === 'Rotativo' ? 'Sim' : 'N/A'}
                                  </span>
                                  {((atividade.tipoEquipamento === 'Estático') || 
                                    (atividade.tipoEquipamento === 'Rotativo')) && (
                                    <Input
                                      placeholder="% concluído"
                                      value={atividade.etapasEquipamento?.montagemComponentes || ""}
                                      onChange={(e) => atualizarEtapaEquipamento(atividade.id, "montagemComponentes", e.target.value)}
                                      className="w-24"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Alinhamento Final do Acoplamento */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Alinhamento Final do Acoplamento</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">
                                    {atividade.tipoEquipamento === 'Estático' ? 'Não' : 
                                     atividade.tipoEquipamento === 'Rotativo' ? 'Sim' : 'N/A'}
                                  </span>
                                  {atividade.tipoEquipamento === 'Rotativo' && (
                                    <Input
                                      placeholder="% concluído"
                                      value={atividade.etapasEquipamento?.alinhamentoFinal || ""}
                                      onChange={(e) => atualizarEtapaEquipamento(atividade.id, "alinhamentoFinal", e.target.value)}
                                      className="w-24"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Teste de Giro */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Teste de Giro</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">
                                    {atividade.tipoEquipamento === 'Estático' ? 'Não' : 
                                     atividade.tipoEquipamento === 'Rotativo' ? 'Sim' : 'N/A'}
                                  </span>
                                  {atividade.tipoEquipamento === 'Rotativo' && (
                                    <Input
                                      placeholder="% concluído"
                                      value={atividade.etapasEquipamento?.testeGiro || ""}
                                      onChange={(e) => atualizarEtapaEquipamento(atividade.id, "testeGiro", e.target.value)}
                                      className="w-24"
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Limpeza Final */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Limpeza Final</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">
                                    {atividade.tipoEquipamento === 'Estático' ? 'Não' : 
                                     atividade.tipoEquipamento === 'Rotativo' ? 'Sim' : 'N/A'}
                                  </span>
                                  {atividade.tipoEquipamento === 'Rotativo' && (
                                    <Input
                                      placeholder="% concluído"
                                      value={atividade.etapasEquipamento?.limpezaFinal || ""}
                                      onChange={(e) => atualizarEtapaEquipamento(atividade.id, "limpezaFinal", e.target.value)}
                                      className="w-24"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
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
          onClick={salvarRelatorio} 
          disabled={salvandoRelatorio}
          className="bg-primary hover:bg-primary/90"
        >
          {salvandoRelatorio ? "Salvando..." : "Salvar Relatório"}
        </Button>
      </div>
    </div>
  )
}