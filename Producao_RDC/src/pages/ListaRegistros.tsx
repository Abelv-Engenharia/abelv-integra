import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Trash2, Eye, Copy, Search, Filter, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Layout from "@/components/Layout"
import RelatorioPreview from "@/components/RelatorioPreview"

type RelatorioRegistro = {
  id: string
  data: string
  projeto: string
  responsavel: string | null
  localizacao: string | null
  anotacoes_gerais: string | null
  comentarios: string | null
  created_at: string
  cca?: { codigo: string, nome: string }
  encarregado?: { nome: string }
  atividades_count: number
  total_horas: number
  total_pessoas: number
}

export default function ListaRegistros() {
  const { toast } = useToast()
  const [registros, setRegistros] = useState<RelatorioRegistro[]>([])
  const [loading, setLoading] = useState(true)
  const [excluindo, setExcluindo] = useState<string | null>(null)
  
  // Estados para pré-visualização
  const [showPreview, setShowPreview] = useState(false)
  const [relatorioCompleto, setRelatorioCompleto] = useState<any>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  
  // Estados dos filtros
  const [filtroTexto, setFiltroTexto] = useState("")
  const [filtroProjeto, setFiltroProjeto] = useState("all")
  const [filtroEncarregado, setFiltroEncarregado] = useState("all")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  
  // Estados para dados dos filtros
  const [projetosDisponiveis, setProjetosDisponiveis] = useState<string[]>([])
  const [encarregadosDisponiveis, setEncarregadosDisponiveis] = useState<{id: string, nome: string}[]>([])

  useEffect(() => {
    carregarRegistros()
  }, [])

  const carregarRegistros = async () => {
    try {
      setLoading(true)

      // Primeiro, buscar todos os relatórios
      const { data: relatoriosData, error: relatoriosError } = await supabase
        .from('relatorios_mecanica')
        .select(`
          id,
          data,
          projeto,
          responsavel,
          localizacao,
          anotacoes_gerais,
          comentarios,
          created_at,
          ccas (codigo, nome),
          encarregados (nome)
        `)
        .order('data', { ascending: false })

      if (relatoriosError) throw relatoriosError

      // Segundo, buscar as atividades principais agrupadas por relatório
      const { data: atividadesData, error: atividadesError } = await supabase
        .from('atividades_principais')
        .select(`
          relatorio_id,
          horas_informadas,
          total_pessoas
        `)

      if (atividadesError) throw atividadesError

      // Agrupar atividades por relatório
      const atividadesPorRelatorio = {}
      atividadesData?.forEach(atividade => {
        if (!atividadesPorRelatorio[atividade.relatorio_id]) {
          atividadesPorRelatorio[atividade.relatorio_id] = []
        }
        atividadesPorRelatorio[atividade.relatorio_id].push(atividade)
      })

      // Processar dados para incluir estatísticas
      const registrosProcessados = (relatoriosData || []).map(registro => {
        const atividades = atividadesPorRelatorio[registro.id] || []
        
        return {
          id: registro.id,
          data: registro.data,
          projeto: registro.projeto,
          responsavel: registro.responsavel,
          localizacao: registro.localizacao,
          anotacoes_gerais: registro.anotacoes_gerais,
          comentarios: registro.comentarios,
          created_at: registro.created_at,
          cca: registro.ccas,
          encarregado: registro.encarregados,
          atividades_count: atividades.length,
          total_horas: atividades.reduce((sum, a) => sum + (a.horas_informadas || 0), 0),
          total_pessoas: atividades.reduce((sum, a) => sum + (a.total_pessoas || 0), 0)
        }
      })

      setRegistros(registrosProcessados as RelatorioRegistro[])

      // Extrair dados únicos para filtros
      const projetos = [...new Set(registrosProcessados.map(r => r.projeto))].sort()
      const encarregados = registrosProcessados
        .filter(r => r.encarregado?.nome)
        .map(r => ({ id: r.id, nome: r.encarregado!.nome }))
        .filter((e, index, arr) => arr.findIndex(item => item.nome === e.nome) === index)
        .sort((a, b) => a.nome.localeCompare(b.nome))

      setProjetosDisponiveis(projetos)
      setEncarregadosDisponiveis(encarregados)

    } catch (error) {
      console.error('Erro ao carregar registros:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar registros",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const excluirRegistro = async (id: string) => {
    try {
      setExcluindo(id)

      // Buscar todas as atividades principais relacionadas ao relatório
      const { data: atividadesPrincipais, error: errorAtividades } = await supabase
        .from('atividades_principais')
        .select('id')
        .eq('relatorio_id', id)

      if (errorAtividades) throw errorAtividades

      // Para cada atividade principal, buscar os relatorios_atividades relacionados
      for (const atividade of atividadesPrincipais || []) {
        const { data: relatoriosAtividades, error: errorRelatorios } = await supabase
          .from('relatorios_atividades')
          .select('id')
          .eq('atividade_principal_id', atividade.id)

        if (errorRelatorios) throw errorRelatorios

        // Para cada relatorio_atividade, excluir dados relacionados
        for (const relatorio of relatoriosAtividades || []) {
          // Excluir informações de suporte
          await supabase
            .from('informacoes_suporte')
            .delete()
            .eq('relatorio_atividade_id', relatorio.id)

          // Excluir status das juntas
          await supabase
            .from('status_juntas')
            .delete()
            .eq('relatorio_atividade_id', relatorio.id)
        }

        // Excluir relatorios_atividades
        await supabase
          .from('relatorios_atividades')
          .delete()
          .eq('atividade_principal_id', atividade.id)
      }

      // Excluir atividades principais
      await supabase
        .from('atividades_principais')
        .delete()
        .eq('relatorio_id', id)

      // Finalmente, excluir o relatório principal
      const { error: errorRelatorio } = await supabase
        .from('relatorios_mecanica')
        .delete()
        .eq('id', id)

      if (errorRelatorio) throw errorRelatorio

      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso"
      })

      // Recarregar a lista
      carregarRegistros()

    } catch (error) {
      console.error('Erro ao excluir registro:', error)
      toast({
        title: "Erro",
        description: "Erro ao excluir registro",
        variant: "destructive"
      })
    } finally {
      setExcluindo(null)
    }
  }

  const visualizarRelatorio = async (id: string) => {
    try {
      setLoadingPreview(true)
      
      // Buscar dados completos do relatório
      const { data: relatorio, error: relatorioError } = await supabase
        .from('relatorios_mecanica')
        .select(`
          *,
          ccas (codigo, nome),
          encarregados (nome)
        `)
        .eq('id', id)
        .single()
      
      if (relatorioError) throw relatorioError
      
      // Buscar atividades principais
      const { data: atividades, error: atividadesError } = await supabase
        .from('atividades_principais')
        .select(`
          *,
          relatorios_atividades (
            *,
            linhas (nome_linha),
            fluidos (nome),
            informacoes_suporte (*),
            status_juntas (
              *,
              juntas (Junta, DN)
            )
          )
        `)
        .eq('relatorio_id', id)
        .order('created_at')
      
      if (atividadesError) throw atividadesError
      
      const relatorioCompleto = {
        ...relatorio,
        atividades_principais: atividades
      }
      
      setRelatorioCompleto(relatorioCompleto)
      setShowPreview(true)
      
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do relatório",
        variant: "destructive"
      })
    } finally {
      setLoadingPreview(false)
    }
  }

  const duplicarRelatorio = async (id: string) => {
    try {
      // Buscar dados do relatório original
      const { data: relatorioOriginal, error: relatorioError } = await supabase
        .from('relatorios_mecanica')
        .select('*')
        .eq('id', id)
        .single()
      
      if (relatorioError) throw relatorioError
      
      // Criar novo relatório com dados similares mas nova data
      const novoRelatorio = {
        ...relatorioOriginal,
        id: undefined, // Será gerado automaticamente
        data: format(new Date(), 'yyyy-MM-dd'), // Data atual
        created_at: undefined, // Será gerado automaticamente
        updated_at: undefined // Será gerado automaticamente
      }
      
      const { data: novoRelatorioData, error: insertError } = await supabase
        .from('relatorios_mecanica')
        .insert(novoRelatorio)
        .select()
        .single()
      
      if (insertError) throw insertError
      
      toast({
        title: "Sucesso",
        description: "Relatório duplicado com sucesso. Edite conforme necessário.",
      })
      
      // Redirecionar para o novo relatório ou recarregar a lista
      carregarRegistros()
      
    } catch (error) {
      console.error('Erro ao duplicar relatório:', error)
      toast({
        title: "Erro",
        description: "Erro ao duplicar relatório",
        variant: "destructive"
      })
    }
  }

  const registrosFiltrados = registros.filter(registro => {
    const matchTexto = !filtroTexto || 
      registro.projeto.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      registro.localizacao?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      registro.anotacoes_gerais?.toLowerCase().includes(filtroTexto.toLowerCase())
    
    const matchProjeto = !filtroProjeto || filtroProjeto === "all" || registro.projeto === filtroProjeto
    const matchEncarregado = !filtroEncarregado || filtroEncarregado === "all" || registro.encarregado?.nome === filtroEncarregado
    
    const dataRegistro = new Date(registro.data + 'T12:00:00') // Adiciona horário para evitar problemas de timezone
    const matchDataInicio = !dataInicio || dataRegistro >= dataInicio
    const matchDataFim = !dataFim || dataRegistro <= dataFim

    return matchTexto && matchProjeto && matchEncarregado && matchDataInicio && matchDataFim
  })

  const limparFiltros = () => {
    setFiltroTexto("")
    setFiltroProjeto("all")
    setFiltroEncarregado("all")
    setDataInicio(undefined)
    setDataFim(undefined)
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">Carregando registros...</div>
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
              Lista de Registros
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Projeto, localização..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Projeto</label>
                <Select value={filtroProjeto} onValueChange={setFiltroProjeto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os projetos</SelectItem>
                    {projetosDisponiveis.map(projeto => (
                      <SelectItem key={projeto} value={projeto}>
                        {projeto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Encarregado</label>
                <Select value={filtroEncarregado} onValueChange={setFiltroEncarregado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os encarregados</SelectItem>
                    {encarregadosDisponiveis.map(encarregado => (
                      <SelectItem key={encarregado.id} value={encarregado.nome}>
                        {encarregado.nome}
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
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {registrosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{registrosFiltrados.length}</div>
                <p className="text-sm text-muted-foreground">Registros</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {registrosFiltrados.reduce((sum, r) => sum + r.atividades_count, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Atividades</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(registrosFiltrados.reduce((sum, r) => sum + r.total_horas, 0))}h
                </div>
                <p className="text-sm text-muted-foreground">Horas Totais</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {registrosFiltrados.reduce((sum, r) => sum + r.total_pessoas, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Pessoas Envolvidas</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabela de Registros */}
        <Card>
          <CardContent className="p-0">
            {registrosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum registro encontrado com os filtros aplicados</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Projeto/CCA</TableHead>
                    <TableHead>Encarregado</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-center">Atividades</TableHead>
                    <TableHead className="text-center">Horas</TableHead>
                    <TableHead className="text-center">Pessoas</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosFiltrados.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>
                        {format(new Date(registro.data + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registro.projeto}</div>
                          {registro.cca && (
                            <div className="text-sm text-muted-foreground">
                              {registro.cca.codigo} - {registro.cca.nome}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {registro.encarregado?.nome || registro.responsavel || '-'}
                      </TableCell>
                      <TableCell>
                        {registro.localizacao || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="flex items-center justify-center space-x-1">
                          <span>{registro.atividades_count}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="flex items-center justify-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{Math.round(registro.total_horas)}h</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="flex items-center justify-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{registro.total_pessoas}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Visualizar"
                            onClick={() => visualizarRelatorio(registro.id)}
                            disabled={loadingPreview}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Duplicar"
                            onClick={() => duplicarRelatorio(registro.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                title="Excluir"
                                disabled={excluindo === registro.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este registro?
                                  <br /><br />
                                  <strong>Esta ação irá excluir:</strong>
                                  <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>O relatório principal ({format(new Date(registro.data), "dd/MM/yyyy")} - {registro.projeto})</li>
                                    <li>Todas as {registro.atividades_count} atividades associadas</li>
                                    <li>Todos os registros de etapas</li>
                                    <li>Informações de suporte</li>
                                    <li>Status das juntas relacionadas</li>
                                  </ul>
                                  <br />
                                  <strong className="text-destructive">Esta ação não pode ser desfeita.</strong>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => excluirRegistro(registro.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir Definitivamente
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de Pré-visualização */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Visualização do Relatório
              </DialogTitle>
            </DialogHeader>
            
            <RelatorioPreview relatorio={relatorioCompleto} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}