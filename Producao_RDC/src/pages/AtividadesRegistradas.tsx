import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Users, ChevronDown, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Layout from "@/components/Layout"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type AtividadeRegistrada = {
  id: string
  nome_atividade: string
  horas_informadas: number
  total_pessoas: number
  horas_totais: number
  equipe: any[]
  created_at: string
  relatorio: {
    id: string
    data: string
    projeto: string
    cca?: { codigo: string, nome: string }
    encarregado?: { nome: string }
  }
  etapas: {
    id: string
    atividade: string
    fluido?: { nome: string }
    linha?: { nome_linha: string }
    juntas_ids: string[]
    tag_valvula?: string
    juntas?: { numero_junta: string }[]
  }[]
}

export default function AtividadesRegistradas() {
  const { toast } = useToast()
  const [atividades, setAtividades] = useState<AtividadeRegistrada[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroAtividade, setFiltroAtividade] = useState("")
  const [filtroProjeto, setFiltroProjeto] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [atividadesExpandidas, setAtividadesExpandidas] = useState<Set<string>>(new Set())

  // Estados para os filtros
  const [atividadesDisponiveis, setAtividadesDisponiveis] = useState<string[]>([])
  const [projetosDisponiveis, setProjetosDisponiveis] = useState<{id: string, nome: string}[]>([])

  useEffect(() => {
    carregarAtividades()
  }, [])

  const carregarAtividades = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('atividades_principais')
        .select(`
          id,
          nome_atividade,
          horas_informadas,
          total_pessoas,
          horas_totais,
          equipe,
          created_at,
          relatorio_id,
          relatorios_mecanica!inner (
            id,
            data,
            projeto,
            ccas (codigo, nome),
            encarregados (nome)
          ),
          relatorios_atividades (
            id,
            atividade,
            tag_valvula,
            juntas_ids,
            fluidos (nome),
            linhas (nome_linha)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Buscar informações das juntas para cada etapa
      const atividadesComJuntas = await Promise.all(
        (data || []).map(async (atividade) => {
          const etapasComJuntas = await Promise.all(
            atividade.relatorios_atividades.map(async (etapa) => {
              if (etapa.juntas_ids && etapa.juntas_ids.length > 0) {
                const { data: juntasData } = await supabase
                  .from('juntas')
                  .select('id, "Junta"')
                  .in('id', etapa.juntas_ids)

                // Mapear dados da base para estrutura esperada pelo TypeScript
                const juntasMapeadas = (juntasData || []).map((junta: any) => ({
                  numero_junta: junta.Junta
                }))

                return {
                  ...etapa,
                  fluido: etapa.fluidos,
                  linha: etapa.linhas,
                  juntas: juntasMapeadas
                }
              }
              return { 
                ...etapa, 
                fluido: etapa.fluidos,
                linha: etapa.linhas,
                juntas: [] 
              }
            })
          )

          const relatorioData = Array.isArray(atividade.relatorios_mecanica) 
            ? atividade.relatorios_mecanica[0] 
            : atividade.relatorios_mecanica

          return {
            ...atividade,
            relatorio: {
              id: relatorioData.id,
              data: relatorioData.data,
              projeto: relatorioData.projeto,
              cca: relatorioData.ccas,
              encarregado: relatorioData.encarregados
            },
            etapas: etapasComJuntas
          }
        })
      )

      setAtividades(atividadesComJuntas as AtividadeRegistrada[])

      // Extrair atividades e projetos únicos para os filtros
      const atividadesUnicas = [...new Set(atividadesComJuntas.map(a => a.nome_atividade))].sort()
      const projetosUnicos = atividadesComJuntas
        .map(a => ({ id: a.relatorio.id, nome: a.relatorio.projeto }))
        .filter((p, index, arr) => arr.findIndex(item => item.id === p.id) === index)
        .sort((a, b) => a.nome.localeCompare(b.nome))

      setAtividadesDisponiveis(atividadesUnicas)
      setProjetosDisponiveis(projetosUnicos)

    } catch (error) {
      console.error('Erro ao carregar atividades:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar atividades registradas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleExpansao = (atividadeId: string) => {
    const novasExpandidas = new Set(atividadesExpandidas)
    if (novasExpandidas.has(atividadeId)) {
      novasExpandidas.delete(atividadeId)
    } else {
      novasExpandidas.add(atividadeId)
    }
    setAtividadesExpandidas(novasExpandidas)
  }

  const atividadesFiltradas = atividades.filter(atividade => {
    const matchAtividade = !filtroAtividade || atividade.nome_atividade.includes(filtroAtividade)
    const matchProjeto = !filtroProjeto || atividade.relatorio.projeto.includes(filtroProjeto)
    
    const dataAtividade = new Date(atividade.relatorio.data)
    const matchDataInicio = !dataInicio || dataAtividade >= dataInicio
    const matchDataFim = !dataFim || dataAtividade <= dataFim

    return matchAtividade && matchProjeto && matchDataInicio && matchDataFim
  })

  const formatarEquipe = (equipe: any[]) => {
    if (!equipe || equipe.length === 0) return "Nenhuma equipe definida"
    
    return equipe.map(funcao => `${funcao.quantidade} ${funcao.funcao}`).join(", ")
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">Carregando atividades...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <Card>
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-xl font-bold">
              Atividades Registradas
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Atividade</label>
                <Select value={filtroAtividade} onValueChange={setFiltroAtividade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as atividades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as atividades</SelectItem>
                    {atividadesDisponiveis.map(atividade => (
                      <SelectItem key={atividade} value={atividade}>
                        {atividade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Projeto</label>
                <Select value={filtroProjeto} onValueChange={setFiltroProjeto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os projetos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os projetos</SelectItem>
                    {projetosDisponiveis.map(projeto => (
                      <SelectItem key={projeto.id} value={projeto.nome}>
                        {projeto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Data Início</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataInicio}
                      onSelect={setDataInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">Data Fim</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataFim && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataFim}
                      onSelect={setDataFim}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFiltroAtividade("")
                  setFiltroProjeto("")
                  setDataInicio(undefined)
                  setDataFim(undefined)
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Atividades */}
        <div className="space-y-4">
          {atividadesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma atividade encontrada com os filtros aplicados</p>
              </CardContent>
            </Card>
          ) : (
            atividadesFiltradas.map((atividade) => (
              <Card key={atividade.id}>
                <Collapsible
                  open={atividadesExpandidas.has(atividade.id)}
                  onOpenChange={() => toggleExpansao(atividade.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {atividadesExpandidas.has(atividade.id) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                          <div>
                            <CardTitle className="text-lg">{atividade.nome_atividade}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(atividade.relatorio.data), "dd/MM/yyyy")} - {atividade.relatorio.projeto}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{atividade.horas_informadas}h</span>
                          </Badge>
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{atividade.total_pessoas} pessoas</span>
                          </Badge>
                          <Badge variant="outline">
                            {atividade.horas_totais}h totais
                          </Badge>
                          <Badge variant="outline">
                            {atividade.etapas.length} etapas
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informações da Atividade */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Informações da Atividade</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>CCA:</strong> {atividade.relatorio.cca?.codigo} - {atividade.relatorio.cca?.nome}</div>
                              <div><strong>Encarregado:</strong> {atividade.relatorio.encarregado?.nome}</div>
                              <div><strong>Data:</strong> {format(new Date(atividade.relatorio.data), "dd/MM/yyyy")}</div>
                              <div><strong>Horas Trabalhadas:</strong> {atividade.horas_informadas}h</div>
                              <div><strong>Total de Pessoas:</strong> {atividade.total_pessoas}</div>
                              <div><strong>Horas Totais:</strong> {atividade.horas_totais}h</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Equipe</h4>
                            <p className="text-sm">{formatarEquipe(atividade.equipe)}</p>
                          </div>
                        </div>

                        {/* Etapas */}
                        <div>
                          <h4 className="font-semibold mb-2">Etapas Executadas ({atividade.etapas.length})</h4>
                          <div className="space-y-2">
                            {atividade.etapas.map((etapa, index) => (
                              <div key={etapa.id} className="p-3 bg-muted/50 rounded-md">
                                <div className="font-medium text-sm">{index + 1}. {etapa.atividade}</div>
                                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {etapa.fluido && <div><strong>Fluido:</strong> {etapa.fluido.nome}</div>}
                                  {etapa.linha && <div><strong>Linha:</strong> {etapa.linha.nome_linha}</div>}
                                  {etapa.juntas && etapa.juntas.length > 0 && (
                                    <div><strong>Juntas:</strong> {etapa.juntas.map(j => j.numero_junta).join(", ")}</div>
                                  )}
                                  {etapa.tag_valvula && <div><strong>TAG Válvula:</strong> {etapa.tag_valvula}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>

        {/* Estatísticas */}
        {atividadesFiltradas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{atividadesFiltradas.length}</div>
                  <div className="text-sm text-muted-foreground">Atividades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {atividadesFiltradas.reduce((sum, a) => sum + a.horas_informadas, 0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Horas Trabalhadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {atividadesFiltradas.reduce((sum, a) => sum + a.horas_totais, 0)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Horas Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {atividadesFiltradas.reduce((sum, a) => sum + a.etapas.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Etapas Executadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}