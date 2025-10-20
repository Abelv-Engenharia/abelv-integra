import { useState } from "react"
import { Send, Upload, FileText, Mail, Calendar, Clock, MapPin, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DocumentUploadField } from "./DocumentUploadField"
import { DocumentReturnUpload } from "./DocumentReturnUpload"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface MultaData {
  id: number
  numeroAutoInfracao: string
  dataMulta: string
  horario: string
  ocorrencia: string
  pontos: number
  condutorInfrator: string
  placa: string
  veiculo: string
  locadora: string
  valor: number
  emailCondutor?: string
  prazoPreenchimento?: Date
  localCompleto?: string
  statusNotificacao?: "Pendente" | "Enviado" | "Documento Retornado" | "Em Atraso"
  documentoNotificacao?: File | null
  documentoPreenchido?: File | null
  dataEnvioNotificacao?: Date
  dataRetornoDocumento?: Date
  observacoesNotificacao?: string
}

interface MultaNotificationManagerProps {
  multa: MultaData
  onUpdate: (multaId: number, updatedData: Partial<MultaData>) => void
}

export function MultaNotificationManager({ multa, onUpdate }: MultaNotificationManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailCondutor, setEmailCondutor] = useState(multa.emailCondutor || "")
  const [localCompleto, setLocalCompleto] = useState(multa.localCompleto || "")
  const [observacoes, setObservacoes] = useState(multa.observacoesNotificacao || "")
  const [documentoNotificacao, setDocumentoNotificacao] = useState<File | null>(multa.documentoNotificacao || null)
  
  const prazoPreenchimento = multa.prazoPreenchimento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const statusNotificacao = multa.statusNotificacao || "Pendente"

  const generateEmailContent = () => {
    return `Boa tarde, ${multa.condutorInfrator}.

Tudo bem?

Recebemos a notificação de infração de trânsito referente ao veículo sob sua responsabilidade. Solicitamos sua ciência e o devido preenchimento da indicação de condutor, dentro do prazo estabelecido.

Segue abaixo o resumo da infração:

Nº AIT | Data da Infração | Horário | Local | Veículo | Prazo para Preenchimento
${multa.numeroAutoInfracao} | ${format(new Date(multa.dataMulta), "dd/MM/yyyy")} | ${multa.horario} | ${localCompleto} | ${multa.placa} | ${format(prazoPreenchimento, "dd/MM/yyyy")}

Orientações Importantes:
• O formulário de indicação de condutor deve ser preenchido e devolvido até a data limite acima.
• Caso o condutor não seja indicado dentro do prazo, a multa será de responsabilidade do condutor cadastrado no contrato do veículo.
• Pedimos atenção para evitar atrasos que possam gerar penalidades adicionais.

Em caso de dúvidas ou necessidade de orientação sobre o preenchimento, entre em contato com o setor de Recursos e Benefícios.`
  }

  const handleSendNotification = async () => {
    if (!emailCondutor) {
      toast({
        title: "E-mail obrigatório",
        description: "Informe o e-mail do condutor para enviar a notificação.",
        variant: "destructive"
      })
      return
    }

    if (!documentoNotificacao) {
      toast({
        title: "Documento obrigatório",
        description: "Anexe o documento oficial do órgão antes de enviar.",
        variant: "destructive"
      })
      return
    }

    if (!localCompleto) {
      toast({
        title: "Local obrigatório",
        description: "Informe o local completo da infração.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Simular envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Salvar no localStorage para histórico
      const notificationLog = {
        multaId: multa.id,
        emailDestinatario: emailCondutor,
        dataEnvio: new Date(),
        assunto: `Notificação de Infração de Trânsito - Placa ${multa.placa}`,
        conteudo: generateEmailContent(),
        documentoAnexado: documentoNotificacao.name
      }
      
      const existingLogs = JSON.parse(localStorage.getItem("multa_notificacoes_condutor") || "[]")
      localStorage.setItem("multa_notificacoes_condutor", JSON.stringify([...existingLogs, notificationLog]))

      // Atualizar dados da multa
      onUpdate(multa.id, {
        emailCondutor,
        localCompleto,
        observacoesNotificacao: observacoes,
        statusNotificacao: "Enviado",
        documentoNotificacao,
        dataEnvioNotificacao: new Date(),
        prazoPreenchimento
      })

      toast({
        title: "Notificação enviada!",
        description: `E-mail enviado para ${emailCondutor} com sucesso.`
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar a notificação. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentReturn = (file: File | null) => {
    onUpdate(multa.id, {
      documentoPreenchido: file,
      statusNotificacao: file ? "Documento Retornado" : "Enviado",
      dataRetornoDocumento: file ? new Date() : undefined
    })

    if (file) {
      toast({
        title: "Documento recebido!",
        description: `Documento ${file.name} foi registrado como retornado.`
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gerenciar Notificação - Multa {multa.numeroAutoInfracao}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados da Multa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados da Infração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">AIT:</span>
                <span className="font-mono">{multa.numeroAutoInfracao}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data/Hora:</span>
                <span>{format(new Date(multa.dataMulta), "dd/MM/yyyy")} às {multa.horario}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Veículo:</span>
                <span>{multa.placa} - {multa.veiculo}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Condutor:</span>
                <span>{multa.condutorInfrator}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Pontos:</span>
                <Badge variant={multa.pontos >= 5 ? "destructive" : "secondary"}>
                  {multa.pontos} pts
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Prazo:</span>
                <span className="font-mono">{format(prazoPreenchimento, "dd/MM/yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Notificação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados para Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailCondutor">E-mail do Condutor *</Label>
                <Input
                  id="emailCondutor"
                  type="email"
                  value={emailCondutor}
                  onChange={(e) => setEmailCondutor(e.target.value)}
                  placeholder="condutor@email.com"
                  className={!emailCondutor ? "border-destructive" : ""}
                />
              </div>

              <div>
                <Label htmlFor="localCompleto">Local Completo da Infração *</Label>
                <Input
                  id="localCompleto"
                  value={localCompleto}
                  onChange={(e) => setLocalCompleto(e.target.value)}
                  placeholder="Ex: R PRIMEIRO DE MAIO 106 EMBU DAS ARTES SP SENTIDO CENTRO/BAIRRO"
                  className={!localCompleto ? "border-destructive" : ""}
                />
              </div>

              <DocumentUploadField
                label="Documento Oficial do Órgão"
                value={documentoNotificacao?.name || null}
                onChange={setDocumentoNotificacao}
                required={true}
              />

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Preview do E-mail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview do E-mail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="font-medium mb-2">
                <strong>Para:</strong> {emailCondutor || "Informe o e-mail do condutor"}
              </div>
              <div className="font-medium mb-2">
                <strong>Assunto:</strong> Notificação de Infração de Trânsito - Placa {multa.placa}
              </div>
              <div className="font-medium mb-2">
                <strong>Anexo:</strong> {documentoNotificacao ? documentoNotificacao.name : "Nenhum documento anexado"}
              </div>
              <Separator className="my-3" />
              <div className="whitespace-pre-line text-sm">
                {generateEmailContent()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Documento Retornado */}
        {statusNotificacao === "Enviado" && (
          <>
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documento Retornado</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentReturnUpload
                  multaId={multa.id}
                  currentDocument={multa.documentoPreenchido}
                  onDocumentUpload={handleDocumentReturn}
                />
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          {statusNotificacao === "Pendente" && (
            <Button onClick={handleSendNotification} disabled={loading}>
              {loading ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Notificação
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}