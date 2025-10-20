import { useState } from "react"
import { Mail, Send, Check, AlertTriangle, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DocumentUploadField } from "./DocumentUploadField"
import { MultaCompleta, EmailTemplate, MultaEmailLog } from "@/types/gestao-pessoas/multa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MultipurposeEmailManagerProps {
  multa: MultaCompleta
  onUpdate: (multaId: string, dadosAtualizados: Partial<MultaCompleta>) => void
  disabled?: boolean
}

export function MultipurposeEmailManager({ multa, onUpdate, disabled }: MultipurposeEmailManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipientType, setRecipientType] = useState<'Condutor' | 'RH/Financeiro' | ''>('')
  const [customMessage, setCustomMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const { toast } = useToast()

  const generateEmailTemplate = (type: 'Condutor' | 'RH/Financeiro'): EmailTemplate => {
    if (type === 'Condutor') {
      return {
        to: [multa.emailCondutor || `${multa.condutorInfrator.toLowerCase().replace(' ', '.')}@empresa.com`],
        subject: `Notificação de Multa - Auto de Infração Nº ${multa.numeroAutoInfracao}`,
        body: `Prezado(a) ${multa.condutorInfrator},

Informamos que foi registrada uma multa de trânsito em seu nome:

DADOS DA MULTA:
• Nº Auto de Infração: ${multa.numeroAutoInfracao}
• Data da Infração: ${new Date(multa.dataMulta).toLocaleDateString('pt-BR')}
• Horário: ${multa.horario}
• Placa do Veículo: ${multa.placa}
• Ocorrência: ${multa.ocorrencia}
• Pontos na CNH: ${multa.pontos}
${multa.valor ? `• Valor da Multa: R$ ${multa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}

IMPORTANTE:
Você deve preencher o formulário de indicação de condutor em anexo e devolvê-lo preenchido o mais rápido possível.

O formulário deve ser preenchido com todos os dados solicitados e devolvido ao setor responsável.

${customMessage ? `\nObservações adicionais:\n${customMessage}` : ''}

Atenciosamente,
Departamento de Gestão de Veículos`
      }
    } else {
      return {
        to: ['rh@empresa.com', 'financeiro@empresa.com'],
        subject: `Solicitação de Desconto em Folha - Multa ${multa.numeroAutoInfracao}`,
        body: `Prezados RH e Financeiro,

Solicitamos o desconto em folha de pagamento referente à multa de trânsito abaixo:

DADOS DA MULTA:
• Nº Auto de Infração: ${multa.numeroAutoInfracao}
• Funcionário: ${multa.condutorInfrator}
• Data da Infração: ${new Date(multa.dataMulta).toLocaleDateString('pt-BR')}
• Placa: ${multa.placa}
• Valor: R$ ${multa.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}

DADOS FINANCEIROS:
• Nº da Fatura: ${multa.numeroFatura || 'Pendente'}
• Título Sienge: ${multa.tituloSienge || 'Pendente'}

STATUS DO PROCESSO:
• Indicado ao Órgão: ${multa.indicadoOrgao}
• Status Atual: ${multa.statusMulta}

${customMessage ? `\nObservações:\n${customMessage}` : ''}

Favor confirmar a execução do desconto.

Atenciosamente,
Departamento de Gestão de Veículos`
      }
    }
  }

  const sendEmail = async () => {
    if (!recipientType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de destinatário",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const template = generateEmailTemplate(recipientType)
      
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Log do email
      const emailLog: MultaEmailLog = {
        id: crypto.randomUUID(),
        multaId: multa.id,
        recipients: template.to,
        recipientType,
        subject: template.subject,
        body: template.body,
        sentAt: new Date().toISOString(),
        status: 'sent',
        attachments: attachment ? [attachment.name] : []
      }

      // Salvar log
      const existingLogs = JSON.parse(localStorage.getItem("multa_emails") || "[]")
      localStorage.setItem("multa_emails", JSON.stringify([...existingLogs, emailLog]))

      // Atualizar multa
      const updates: Partial<MultaCompleta> = {
        updatedAt: new Date()
      }

      if (recipientType === 'Condutor') {
        updates.emailCondutorEnviado = new Date()
        updates.statusMulta = 'Condutor Notificado'
        updates.documentoNotificacao = attachment?.name
      } else {
        updates.emailRHFinanceiroEnviado = new Date()
        updates.statusMulta = 'RH/Financeiro Notificado'
      }

      onUpdate(multa.id, updates)

      toast({
        title: "E-mail Enviado",
        description: `Notificação enviada para ${recipientType} com sucesso!`,
      })

      // Reset form
      setRecipientType('')
      setCustomMessage('')
      setAttachment(null)
      setOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar e-mail. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getButtonState = () => {
    const condutorEnviado = multa.emailCondutorEnviado
    const rhEnviado = multa.emailRHFinanceiroEnviado

    if (condutorEnviado && rhEnviado) {
      return { icon: Check, text: "E-mails Enviados", variant: "outline" as const, disabled: true }
    } else if (condutorEnviado || rhEnviado) {
      return { icon: Mail, text: "Enviar E-mail", variant: "default" as const, disabled: false }
    } else {
      return { icon: Mail, text: "Enviar E-mail", variant: "default" as const, disabled: false }
    }
  }

  const buttonState = getButtonState()
  const Icon = buttonState.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonState.variant} 
          size="sm"
          disabled={disabled || buttonState.disabled}
          className="gap-1"
        >
          <Icon className="h-3 w-3" />
          {buttonState.text}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Envio de E-mail - Multa {multa.numeroAutoInfracao}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status da Multa */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{multa.statusMulta}</Badge>
                <Badge variant={multa.indicadoOrgao === 'Sim' ? 'default' : 'secondary'}>
                  Indicado: {multa.indicadoOrgao}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className={multa.emailCondutorEnviado ? "text-green-600" : "text-muted-foreground"}>
                    Condutor: {multa.emailCondutorEnviado ? "Notificado" : "Pendente"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className={multa.emailRHFinanceiroEnviado ? "text-green-600" : "text-muted-foreground"}>
                    RH/Financeiro: {multa.emailRHFinanceiroEnviado ? "Notificado" : "Pendente"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Destinatário */}
          <div className="space-y-2">
            <Label>Destinatário *</Label>
            <Select value={recipientType} onValueChange={(value: 'Condutor' | 'RH/Financeiro') => setRecipientType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o destinatário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Condutor" disabled={!!multa.emailCondutorEnviado}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Condutor
                    {multa.emailCondutorEnviado && <Badge variant="outline" className="ml-2">Já enviado</Badge>}
                  </div>
                </SelectItem>
                <SelectItem value="RH/Financeiro" disabled={!!multa.emailRHFinanceiroEnviado}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    RH/Financeiro
                    {multa.emailRHFinanceiroEnviado && <Badge variant="outline" className="ml-2">Já enviado</Badge>}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview do E-mail */}
          {recipientType && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Preview do E-mail</CardTitle>
                <CardDescription>
                  Para: {generateEmailTemplate(recipientType).to.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Assunto:</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {generateEmailTemplate(recipientType).subject}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Corpo do E-mail:</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans">
                      {generateEmailTemplate(recipientType).body}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensagem Adicional */}
          <div className="space-y-2">
            <Label>Observações Adicionais</Label>
            <Textarea 
              placeholder="Digite observações adicionais que serão incluídas no e-mail..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Anexo */}
          {recipientType === 'Condutor' && (
            <div className="space-y-2">
                <DocumentUploadField
                  label="Formulário de Indicação (Anexo)"
                  value={attachment?.name || null}
                  onChange={setAttachment}
                  accept=".pdf,.doc,.docx"
                  required={false}
                />
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={sendEmail} 
              disabled={loading || !recipientType}
              className="gap-2"
            >
              {loading ? (
                <Send className="h-4 w-4 animate-pulse" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {loading ? "Enviando..." : "Enviar E-mail"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}