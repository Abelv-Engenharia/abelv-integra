import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MultaCompleta } from "@/types/gestao-pessoas/multa"

interface VisualizarMultaModalProps {
  multa: MultaCompleta | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VisualizarMultaModal({
  multa,
  open,
  onOpenChange
}: VisualizarMultaModalProps) {
  if (!multa) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Multa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dados básicos da infração */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Infração</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nº Auto Infração</label>
                <p className="font-mono text-sm">{multa.numeroAutoInfracao}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data da Multa</label>
                <p className="text-sm">{format(multa.dataMulta, "dd/MM/yyyy", { locale: ptBR })}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Horário</label>
                <p className="text-sm">{multa.horario}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ocorrência</label>
                <p className="text-sm">{multa.ocorrencia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pontos</label>
                <Badge variant={multa.pontos >= 5 ? "destructive" : "secondary"}>
                  {multa.pontos} pts
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valor</label>
                <p className="text-sm">R$ {multa.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || 'Não informado'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do veículo e condutor */}
          <Card>
            <CardHeader>
              <CardTitle>Veículo e Condutor</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condutor Infrator</label>
                <p className="text-sm">{multa.condutorInfrator}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Placa</label>
                <p className="font-mono text-sm">{multa.placa}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Veículo</label>
                <p className="text-sm">{multa.veiculo || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Locadora</label>
                <p className="text-sm">{multa.locadora || 'Não informado'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados financeiros */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Financeiros</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nº Fatura</label>
                <p className="text-sm">{multa.numeroFatura || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Título Sienge</label>
                <p className="text-sm">{multa.tituloSienge || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Desconto Confirmado</label>
                <Badge variant={multa.descontoConfirmado ? "outline" : "destructive"}>
                  {multa.descontoConfirmado ? "Sim" : "Não"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status e processo */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status da Multa</label>
                  <Badge className="ml-2">{multa.statusMulta}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Indicado ao Órgão</label>
                  <Badge variant={multa.indicadoOrgao === 'Sim' ? "default" : "secondary"} className="ml-2">
                    {multa.indicadoOrgao}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Histórico de Notificações</h4>
                
                {multa.emailCondutorEnviado && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">Email enviado ao condutor</span>
                    <span className="text-xs text-muted-foreground">
                      {format(multa.emailCondutorEnviado, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                {multa.emailRHFinanceiroEnviado && (
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">Email enviado ao RH/Financeiro</span>
                    <span className="text-xs text-muted-foreground">
                      {format(multa.emailRHFinanceiroEnviado, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                {!multa.emailCondutorEnviado && !multa.emailRHFinanceiroEnviado && (
                  <p className="text-sm text-muted-foreground">Nenhuma notificação enviada ainda</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Documento de Notificação</label>
                <p className="text-sm">
                  {typeof multa.documentoNotificacao === 'string' 
                    ? multa.documentoNotificacao 
                    : multa.documentoNotificacao?.name || 'Não anexado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Formulário Preenchido</label>
                <p className="text-sm">
                  {typeof multa.formularioPreenchido === 'string' 
                    ? multa.formularioPreenchido 
                    : multa.formularioPreenchido?.name || 'Não retornado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Comprovante de Indicação</label>
                <p className="text-sm">
                  {typeof multa.comprovanteIndicacao === 'string' 
                    ? multa.comprovanteIndicacao 
                    : multa.comprovanteIndicacao?.name || 'Não anexado'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}