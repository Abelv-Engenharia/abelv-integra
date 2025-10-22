import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, User, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

type RelatorioEletricoCompleto = {
  id: string
  data: string
  data_registro?: Date
  projeto: string
  responsavel: string | null
  localizacao: string | null
  anotacoes_gerais: string | null
  comentarios: string | null
  created_at: string
  condicoes_climaticas?: {
    periodos: string[]
    condicao: string
  }
  cca?: { codigo: string, nome: string }
  encarregado_equipe?: Array<{ funcao: string, quantidade: number }>
  atividades_eletricas?: Array<{
    id: string
    nomeAtividade: string
    codigo: string
    equipe: Array<{ funcao: string, quantidade: number }>
    horas: string
    registrosEtapas: Array<{
      id: string
      tipo_atividade: string
      // ELE-INFRA
      desenho_nome?: string
      tipo_infraestrutura_nome?: string
      dimensao_infra?: string
      quantidade?: string
      // ELE-CABOS
      cabo_info?: string
      ponto_origem?: string
      ponto_destino?: string
      etapa_cabos?: string[]
      metragem?: string
      disciplina?: string
      area_nome?: string
      // ELE-EQUIP
      tipo_equipamento?: string
      equipamento_tag?: string
      // INS-INST
      fluido_nome?: string
      linha_nome?: string
      tipo_instrumento?: string
      instrumento_tag?: string
      // ELE-LUMI
      tipo_luminaria?: string
      etapa_luminaria?: string[]
      quantidade_montada?: string
      // Campos gerais
      detalhamentoAtividade?: string
      etapaProducao?: string
      observacoes?: string
    }>
  }>
}

interface RelatorioPreviewEletricaProps {
  relatorio: RelatorioEletricoCompleto | null
}

export default function RelatorioPreviewEletrica({ relatorio }: RelatorioPreviewEletricaProps) {
  if (!relatorio) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando dados do relatório...</p>
      </div>
    )
  }

  const formatarData = (data: string) => {
    try {
      return format(new Date(data + 'T12:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return data
    }
  }

  const formatarDataHora = (data: string) => {
    try {
      return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch {
      return data
    }
  }

  const calcularTotalPessoas = (equipe: Array<{ funcao: string, quantidade: number }>) => {
    return equipe.reduce((total, f) => total + f.quantidade, 0)
  }

  const calcularHorasTotais = (horas: string, equipe: Array<{ funcao: string, quantidade: number }>) => {
    const horasNum = parseFloat(horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    const totalPessoas = calcularTotalPessoas(equipe)
    return horasNum * totalPessoas
  }

  // Calcular dados do gráfico de distribuição de horas
  const calcularDadosGrafico = () => {
    if (!relatorio.encarregado_equipe || relatorio.encarregado_equipe.length === 0) {
      return []
    }
    
    // Determinar horas por pessoa baseado no dia da semana
    const dataRegistro = relatorio.data_registro || new Date(relatorio.data + 'T12:00:00')
    const dia = dataRegistro.getDay()
    const horasPorPessoa = (dia >= 1 && dia <= 4) ? 9 : 8
    
    // Calcular horas disponíveis por função
    const disponivel: Record<string, number> = {}
    relatorio.encarregado_equipe.forEach(f => {
      disponivel[f.funcao] = (disponivel[f.funcao] || 0) + (f.quantidade || 0) * horasPorPessoa
    })
    
    // Calcular horas consumidas por função
    const consumido: Record<string, number> = {}
    if (relatorio.atividades_eletricas) {
      relatorio.atividades_eletricas.forEach(a => {
        const horasAtividade = parseFloat(a.horas.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
        a.equipe.forEach(f => {
          consumido[f.funcao] = (consumido[f.funcao] || 0) + (f.quantidade || 0) * horasAtividade
        })
      })
    }
    
    // Criar dados do gráfico
    const funcoes = Array.from(new Set([...Object.keys(disponivel), ...Object.keys(consumido)]))
    return funcoes.map(funcao => {
      const disp = disponivel[funcao] || 0
      const cons = consumido[funcao] || 0
      const saldo = Math.max(0, disp - cons)
      return {
        funcao,
        alocado: cons,
        saldo,
        excedido: cons > disp
      }
    })
  }
  
  const dadosGrafico = calcularDadosGrafico()

  // Agrupar atividades por código
  const atividadesPorCodigo = React.useMemo(() => {
    if (!relatorio.atividades_eletricas) return {}
    
    const agrupado: Record<string, typeof relatorio.atividades_eletricas> = {}
    relatorio.atividades_eletricas.forEach(atividade => {
      const codigo = atividade.codigo || 'SEM-CODIGO'
      if (!agrupado[codigo]) {
        agrupado[codigo] = []
      }
      agrupado[codigo].push(atividade)
    })
    return agrupado
  }, [relatorio.atividades_eletricas])

  return (
    <div className="space-y-6 pb-6">
        {/* Cabeçalho do Relatório */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-primary">RELATÓRIO DE ELÉTRICA/INSTRUMENTAÇÃO</h2>
          <p className="text-muted-foreground mt-2">
            Gerado em {formatarDataHora(relatorio.created_at)}
          </p>
        </div>

        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data do Relatório</label>
                <p className="font-medium">{formatarData(relatorio.data)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Projeto</label>
                <p className="font-medium">{relatorio.projeto}</p>
              </div>
              {relatorio.responsavel && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Encarregado</label>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {relatorio.responsavel}
                  </p>
                </div>
              )}
              {relatorio.localizacao && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Localização</label>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {relatorio.localizacao}
                  </p>
                </div>
              )}
              {relatorio.cca && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CCA</label>
                  <p className="font-medium">{relatorio.cca.codigo} - {relatorio.cca.nome}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Condições Climáticas */}
        {relatorio.condicoes_climaticas && (
          <Card>
            <CardHeader>
              <CardTitle>Condições Climáticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatorio.condicoes_climaticas.periodos && relatorio.condicoes_climaticas.periodos.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Períodos do Dia</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {relatorio.condicoes_climaticas.periodos.map((periodo) => (
                      <Badge key={periodo} variant="secondary">{periodo}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {relatorio.condicoes_climaticas.condicao && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Condição Climática</label>
                  <p className="capitalize">{relatorio.condicoes_climaticas.condicao.replace('-', ' ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Distribuição de Horas */}
        {dadosGrafico.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Horas por Função</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="funcao" type="category" width={120} />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}h`}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="alocado" stackId="horas" name="Alocado" fill="hsl(var(--primary))" isAnimationActive={false} />
                  <Bar dataKey="saldo" stackId="horas" name="Saldo Disponível" fill="hsl(var(--primary) / 0.3)" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
                  <span>Alocado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }}></div>
                  <span>Saldo Disponível</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Atividades Registradas */}
        {relatorio.atividades_eletricas && relatorio.atividades_eletricas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Atividades Registradas ({relatorio.atividades_eletricas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(atividadesPorCodigo).map(([codigo, atividades]) => {
                  // Calcular totais do grupo
                  const totalHorasGrupo = atividades.reduce((acc, atv) => 
                    acc + calcularHorasTotais(atv.horas, atv.equipe), 0
                  )
                  const totalEtapasGrupo = atividades.reduce((acc, atv) => 
                    acc + (atv.registrosEtapas?.length || 0), 0
                  )

                  return (
                    <div key={codigo} className="border rounded-lg overflow-hidden">
                      {/* Cabeçalho do Grupo */}
                      <div className="bg-primary/10 px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className="text-sm">{codigo}</Badge>
                            <span className="font-semibold">{atividades[0].nomeAtividade}</span>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Registros: <span className="font-medium text-foreground">{atividades.length}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Etapas: <span className="font-medium text-foreground">{totalEtapasGrupo}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Total Horas: <span className="font-semibold text-primary">{totalHorasGrupo.toFixed(1)}h</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tabela de Atividades */}
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[60px]">#</TableHead>
                              <TableHead>Detalhes da Etapa</TableHead>
                              <TableHead className="w-[150px]">Equipe</TableHead>
                              <TableHead className="w-[100px] text-center">Horas</TableHead>
                              <TableHead className="w-[100px] text-center">Pessoas</TableHead>
                              <TableHead className="w-[120px] text-right">Total Horas</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {atividades.map((atividade, index) => {
                              const totalPessoas = calcularTotalPessoas(atividade.equipe)
                              const horasTotais = calcularHorasTotais(atividade.horas, atividade.equipe)

                              return (
                                <TableRow key={atividade.id}>
                                  <TableCell className="font-medium">{index + 1}</TableCell>
                                  <TableCell>
                                    {/* Renderizar detalhes das etapas */}
                                    {atividade.registrosEtapas && atividade.registrosEtapas.length > 0 ? (
                                      <div className="space-y-2">
                                        {atividade.registrosEtapas.map((etapa, etapaIndex) => (
                                          <div key={etapa.id} className="text-sm">
                                            <Badge variant="secondary" className="text-xs mb-1">
                                              {etapa.tipo_atividade}
                                            </Badge>
                                            
                                            {/* ELE-INFRA */}
                                            {etapa.tipo_atividade === 'ELE-INFRA' && (
                                              <div className="ml-2 space-y-0.5 text-xs">
                                                {etapa.desenho_nome && <p><span className="text-muted-foreground">Desenho:</span> {etapa.desenho_nome}</p>}
                                                {etapa.tipo_infraestrutura_nome && <p><span className="text-muted-foreground">Tipo:</span> {etapa.tipo_infraestrutura_nome}</p>}
                                                {etapa.dimensao_infra && <p><span className="text-muted-foreground">Dimensão:</span> {etapa.dimensao_infra}</p>}
                                                {etapa.quantidade && <p><span className="text-muted-foreground">Qtd:</span> {etapa.quantidade}</p>}
                                                {etapa.observacoes && <p className="text-muted-foreground italic">Obs: {etapa.observacoes}</p>}
                                              </div>
                                            )}

                                            {/* ELE-CABOS */}
                                            {etapa.tipo_atividade === 'ELE-CABOS' && (
                                              <div className="ml-2 space-y-0.5 text-xs">
                                                {etapa.cabo_info && <p><span className="text-muted-foreground">Cabo:</span> {etapa.cabo_info}</p>}
                                                {etapa.ponto_origem && <p><span className="text-muted-foreground">Origem:</span> {etapa.ponto_origem}</p>}
                                                {etapa.ponto_destino && <p><span className="text-muted-foreground">Destino:</span> {etapa.ponto_destino}</p>}
                                                {etapa.metragem && <p><span className="text-muted-foreground">Metragem:</span> {etapa.metragem} m</p>}
                                                {etapa.etapa_cabos && etapa.etapa_cabos.length > 0 && (
                                                  <div className="flex flex-wrap gap-1 mt-1">
                                                    {etapa.etapa_cabos.map((e, i) => (
                                                      <Badge key={i} className="text-xs bg-green-600 hover:bg-green-700">✓ {e}</Badge>
                                                    ))}
                                                  </div>
                                                )}
                                                {etapa.observacoes && <p className="text-muted-foreground italic">Obs: {etapa.observacoes}</p>}
                                              </div>
                                            )}

                                            {/* ELE-EQUIP */}
                                            {etapa.tipo_atividade === 'ELE-EQUIP' && (
                                              <div className="ml-2 space-y-0.5 text-xs">
                                                {etapa.disciplina && <p><span className="text-muted-foreground">Disciplina:</span> {etapa.disciplina}</p>}
                                                {etapa.tipo_equipamento && <p><span className="text-muted-foreground">Tipo:</span> {etapa.tipo_equipamento}</p>}
                                                {etapa.equipamento_tag && <p><span className="text-muted-foreground">TAG:</span> {etapa.equipamento_tag}</p>}
                                                {etapa.observacoes && <p className="text-muted-foreground italic">Obs: {etapa.observacoes}</p>}
                                              </div>
                                            )}

                                            {/* INS-INST */}
                                            {etapa.tipo_atividade === 'INS-INST' && (
                                              <div className="ml-2 space-y-0.5 text-xs">
                                                {etapa.fluido_nome && <p><span className="text-muted-foreground">Fluido:</span> {etapa.fluido_nome}</p>}
                                                {etapa.linha_nome && <p><span className="text-muted-foreground">Linha:</span> {etapa.linha_nome}</p>}
                                                {etapa.tipo_instrumento && <p><span className="text-muted-foreground">Tipo:</span> {etapa.tipo_instrumento}</p>}
                                                {etapa.instrumento_tag && <p><span className="text-muted-foreground">TAG:</span> {etapa.instrumento_tag}</p>}
                                                {etapa.observacoes && <p className="text-muted-foreground italic">Obs: {etapa.observacoes}</p>}
                                              </div>
                                            )}

                                            {/* ELE-LUMI */}
                                            {etapa.tipo_atividade === 'ELE-LUMI' && (
                                              <div className="ml-2 space-y-0.5 text-xs">
                                                {etapa.tipo_luminaria && <p><span className="text-muted-foreground">Tipo:</span> {etapa.tipo_luminaria}</p>}
                                                {etapa.quantidade_montada && <p><span className="text-muted-foreground">Qtd Montada:</span> {etapa.quantidade_montada}</p>}
                                                {etapa.etapa_luminaria && etapa.etapa_luminaria.length > 0 && (
                                                  <div className="flex flex-wrap gap-1 mt-1">
                                                    {etapa.etapa_luminaria.map((e, i) => (
                                                      <Badge key={i} className="text-xs bg-green-600 hover:bg-green-700">✓ {e}</Badge>
                                                    ))}
                                                  </div>
                                                )}
                                                {etapa.observacoes && <p className="text-muted-foreground italic">Obs: {etapa.observacoes}</p>}
                                              </div>
                                            )}
                                            
                                            {etapaIndex < atividade.registrosEtapas.length - 1 && (
                                              <Separator className="my-2" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground text-sm">Sem etapas registradas</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1 text-xs">
                                      {atividade.equipe.map((funcao) => (
                                        funcao.quantidade > 0 && (
                                          <div key={funcao.funcao} className="flex justify-between gap-2">
                                            <span className="text-muted-foreground">{funcao.funcao}:</span>
                                            <span className="font-medium">{funcao.quantidade}</span>
                                          </div>
                                        )
                                      ))}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center font-medium">{atividade.horas}</TableCell>
                                  <TableCell className="text-center font-medium">{totalPessoas}</TableCell>
                                  <TableCell className="text-right font-semibold text-primary">
                                    {horasTotais.toFixed(1)}h
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Anotações Gerais */}
        {relatorio.anotacoes_gerais && (
          <Card>
            <CardHeader>
              <CardTitle>Anotações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{relatorio.anotacoes_gerais}</p>
            </CardContent>
          </Card>
        )}

        {/* Comentários */}
        {relatorio.comentarios && (
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{relatorio.comentarios}</p>
            </CardContent>
          </Card>
        )}

        {/* Resumo Final */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Resumo Final</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Atividades</p>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_eletricas?.length || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Etapas</p>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_eletricas?.reduce((acc, atv) => acc + (atv.registrosEtapas?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Horas</p>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_eletricas?.reduce((acc, atv) => acc + calcularHorasTotais(atv.horas, atv.equipe), 0).toFixed(1) || '0.0'}h
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_eletricas?.reduce((acc, atv) => {
                    const max = calcularTotalPessoas(atv.equipe)
                    return max > acc ? max : acc
                  }, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
