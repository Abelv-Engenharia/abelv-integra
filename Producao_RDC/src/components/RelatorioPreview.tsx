import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, MapPin, User, Clock, Users } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type RelatorioCompleto = {
  id: string
  data: string
  projeto: string
  responsavel: string | null
  localizacao: string | null
  anotacoes_gerais: string | null
  comentarios: string | null
  created_at: string
  condicoes_climaticas?: any
  condicao_descricao?: string
  indice_pluviometrico?: string
  cca?: { codigo: string, nome: string }
  encarregado?: { nome: string }
  atividades_principais?: Array<{
    id: string
    nome_atividade: string
    equipe: any
    horas_informadas: number
    total_pessoas: number
    horas_totais: number
    relatorios_atividades?: Array<{
      id: string
      atividade: string
      juntas_ids: string[]
      horas_informadas: number
      total_pessoas_equipe: number
      horas_totais: number
      detalhes_equipe: any
      tag_valvula?: string
      linha?: { nome_linha: string }
      fluido?: { nome: string }
      informacoes_suporte?: Array<{
        observacoes: string
        peso_kg: number
        quantidade: number
      }>
      status_juntas?: Array<{
        atividade: string
        junta: { Junta: string, DN: number }
        data_atividade: string
      }>
    }>
  }>
}

interface RelatorioPreviewProps {
  relatorio: RelatorioCompleto | null
}

export default function RelatorioPreview({ relatorio }: RelatorioPreviewProps) {
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

  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <div className="space-y-6">
        {/* Cabeçalho do Relatório */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-primary">RELATÓRIO DE MECÂNICA</h2>
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
                  <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {relatorio.responsavel}
                  </p>
                </div>
              )}
              {relatorio.encarregado && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Encarregado</label>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {relatorio.encarregado.nome}
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
        {(relatorio.condicoes_climaticas || relatorio.condicao_descricao || relatorio.indice_pluviometrico) && (
          <Card>
            <CardHeader>
              <CardTitle>Condições Climáticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatorio.condicao_descricao && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p>{relatorio.condicao_descricao}</p>
                </div>
              )}
              {relatorio.indice_pluviometrico && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Índice Pluviométrico</label>
                  <p>{relatorio.indice_pluviometrico}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Atividades Registradas */}
        {relatorio.atividades_principais && relatorio.atividades_principais.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Atividades Registradas ({relatorio.atividades_principais.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {relatorio.atividades_principais.map((atividade, index) => (
                  <div key={atividade.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{index + 1}. {atividade.nome_atividade}</h4>
                      <div className="text-right space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Horas: <span className="font-medium text-foreground">{atividade.horas_informadas}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Pessoas: <span className="font-medium text-foreground">{atividade.total_pessoas}</span>
                        </div>
                        <div className="text-sm font-semibold">
                          Total Horas: <span className="text-primary">{atividade.horas_totais}h</span>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes da Equipe */}
                    {atividade.equipe && Object.keys(atividade.equipe).length > 0 && (
                      <div className="mb-4 bg-muted/30 rounded-md p-3">
                        <h5 className="font-medium mb-2 text-sm">Equipe:</h5>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(atividade.equipe).map(([funcao, quantidade]) => (
                            Number(quantidade) > 0 && (
                              <div key={funcao} className="flex items-center justify-between">
                                <span className="text-muted-foreground capitalize">{funcao.replace('_', ' ')}:</span>
                                <span className="font-medium">{String(quantidade)}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Registros de Etapas */}
                    {atividade.relatorios_atividades && atividade.relatorios_atividades.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-sm">Registros de Etapas ({atividade.relatorios_atividades.length}):</h5>
                        {atividade.relatorios_atividades.map((subAtividade, subIndex) => (
                          <div key={subAtividade.id} className="bg-muted/20 rounded-md p-4 space-y-3">
                            {/* Para equipamentos MEC_EQUIP */}
                            {subAtividade.atividade === 'MEC_EQUIP' ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">Tipo de Equipamento:</label>
                                  <p className="font-medium">{(subAtividade as any)?.detalhes_equipe?.tipoEquipamento || 'Equipamento Estático'}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">TAG do Equipamento:</label>
                                  <p className="font-medium">{(subAtividade as any)?.detalhes_equipe?.tagEquipamento || subAtividade.tag_valvula || 'N/A'}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">Tipo de Equipamento:</label>
                                  <p className="font-medium">{subAtividade.atividade}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">TAG do Equipamento:</label>
                                  <p className="font-medium">{subAtividade.tag_valvula || 'N/A'}</p>
                                </div>
                              </div>
                            )}

                            {subAtividade.linha && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Linha:</label>
                                <p className="font-medium">{subAtividade.linha.nome_linha}</p>
                              </div>
                            )}
                            
                            {subAtividade.fluido && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Fluido:</label>
                                <p className="font-medium">{subAtividade.fluido.nome}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Horas Informadas:</label>
                                <p className="font-medium">{subAtividade.horas_informadas}h</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Total Pessoas:</label>
                                <p className="font-medium">{subAtividade.total_pessoas_equipe}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Horas Totais:</label>
                                <p className="font-medium text-primary">{subAtividade.horas_totais}h</p>
                              </div>
                            </div>

                            {/* Detalhes da Equipe da Etapa */}
                            {subAtividade.detalhes_equipe && Object.keys(subAtividade.detalhes_equipe).length > 0 && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-2 block">Equipe da Etapa:</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                  {Object.entries(subAtividade.detalhes_equipe).map(([funcao, quantidade]) => (
                                    Number(quantidade) > 0 && (
                                      <div key={funcao} className="bg-muted/30 p-2 rounded">
                                        <span className="font-medium capitalize">{funcao.replace('_', ' ')}:</span> {String(quantidade)}
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Juntas Selecionadas */}
                            {subAtividade.juntas_ids && subAtividade.juntas_ids.length > 0 && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-2 block">Juntas Selecionadas:</label>
                                <div className="flex flex-wrap gap-1">
                                  {subAtividade.juntas_ids.map((juntaId: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {juntaId}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Etapas do Equipamento - diferente para MEC_EQUIP e outras atividades */}
                            {subAtividade.atividade === 'MEC_EQUIP' ? (
                              // Layout especial para MEC_EQUIP com etapas de equipamento
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-2 block">Etapas do Equipamento:</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {[
                                    { nome: 'Liberação Base Civil', valor: (subAtividade as any)?.detalhes_equipe?.liberacaoBaseCivil || '100' },
                                    { nome: 'Posicionamento Base', valor: (subAtividade as any)?.detalhes_equipe?.posicionamentoBase || '100' },
                                    { nome: 'Montagem Componentes', valor: (subAtividade as any)?.detalhes_equipe?.montagemComponentes || '50' },
                                    { nome: 'Alinhamento Final', valor: (subAtividade as any)?.detalhes_equipe?.alinhamentoFinal || '50' },
                                    { nome: 'Teste Giro', valor: (subAtividade as any)?.detalhes_equipe?.testeGiro || '0' },
                                    { nome: 'Limpeza Final', valor: (subAtividade as any)?.detalhes_equipe?.limpezaFinal || '0' }
                                  ].map((etapa, idx) => (
                                    <div key={idx} className="bg-primary/10 text-primary px-3 py-2 rounded-md text-xs font-medium">
                                      <div className="font-semibold">{etapa.nome}: {etapa.valor}%</div>
                                      <div className="text-xs opacity-80">
                                        {(subAtividade as any)?.detalhes_equipe?.tagEquipamento || subAtividade.tag_valvula || 'N/A'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              // Layout padrão para outras atividades (TUB_AC, etc)
                              subAtividade.status_juntas && subAtividade.status_juntas.length > 0 && (
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Etapas do Equipamento:</label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {subAtividade.status_juntas.map((status: any, idx: number) => {
                                      const juntaObj = status?.juntas ?? status?.junta
                                      const nome = juntaObj?.Junta || "Junta não encontrada"
                                      const dn = juntaObj?.DN
                                      const etapa = status?.atividade || "Acoplamento"
                                      const percentual = "100%"
                                      
                                      return (
                                        <div key={idx} className="bg-primary/10 text-primary px-3 py-2 rounded-md text-xs font-medium">
                                          <div className="font-semibold">{etapa}: {percentual}</div>
                                          <div className="text-xs opacity-80">{nome} {dn ? `(DN ${dn})` : ''}</div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            )}

                            {/* Informações de Suporte */}
                            {subAtividade.informacoes_suporte && subAtividade.informacoes_suporte.length > 0 && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-2 block">Informações de Suporte:</label>
                                <div className="space-y-2">
                                  {subAtividade.informacoes_suporte.map((info, idx) => (
                                    <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3 text-sm">
                                          {info.quantidade && (
                                            <Badge variant="secondary" className="text-xs">
                                              Qtd: {info.quantidade}
                                            </Badge>
                                          )}
                                          {info.peso_kg && (
                                            <Badge variant="outline" className="text-xs">
                                              Peso: {info.peso_kg}kg
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      {info.observacoes && (
                                        <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded">
                                          {info.observacoes}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Indicador de Progresso da Etapa */}
                            <div className="mt-4 pt-3 border-t">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Progresso da Etapa</span>
                                <span className="font-medium text-primary">100% Concluído</span>
                              </div>
                              <div className="w-full bg-muted/30 rounded-full h-2 mt-1">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Anotações e Comentários */}
        {(relatorio.anotacoes_gerais || relatorio.comentarios) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}

        {/* Resumo Final */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Resumo do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_principais?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Atividades</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_principais?.reduce((sum, a) => sum + (a.relatorios_atividades?.length || 0), 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Etapas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(relatorio.atividades_principais?.reduce((sum, a) => sum + a.horas_totais, 0) || 0)}h
                </p>
                <p className="text-sm text-muted-foreground">Horas Totais</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {relatorio.atividades_principais?.reduce((sum, a) => sum + a.total_pessoas, 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Pessoas</p>
              </div>
            </div>

            {/* Detalhamento por Atividade */}
            {relatorio.atividades_principais && relatorio.atividades_principais.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Detalhamento por Atividade:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relatorio.atividades_principais.map((atividade, index) => (
                    <div key={atividade.id} className="bg-muted/30 p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-2">{atividade.nome_atividade}</h5>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-primary">{atividade.relatorios_atividades?.length || 0}</div>
                          <div className="text-muted-foreground">Etapas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-primary">{atividade.horas_totais.toFixed(1)}h</div>
                          <div className="text-muted-foreground">Horas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-primary">{atividade.total_pessoas}</div>
                          <div className="text-muted-foreground">Pessoas</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}