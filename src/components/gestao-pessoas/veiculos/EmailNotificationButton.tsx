import { useState } from "react"
import { Mail, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface EmailNotificationButtonProps {
  multaData: {
    numeroAutoInfracao: string
    placa: string
    condutor: string
    valor: string
    dataMulta: Date
  }
  onEmailSent?: () => void
}

export function EmailNotificationButton({ multaData, onEmailSent }: EmailNotificationButtonProps) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const sendEmailNotification = async () => {
    setLoading(true)
    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Salvar histórico do email enviado
      const emailLog = {
        id: crypto.randomUUID(),
        multaId: multaData.numeroAutoInfracao,
        recipients: ['rh@empresa.com', 'financeiro@empresa.com'],
        subject: `Multa Pendente - Placa ${multaData.placa}`,
        body: `
          Nova multa cadastrada no sistema:
          
          Nº Auto de Infração: ${multaData.numeroAutoInfracao}
          Placa: ${multaData.placa}
          Condutor: ${multaData.condutor}
          Valor: ${multaData.valor}
          Data da Multa: ${multaData.dataMulta.toLocaleDateString('pt-BR')}
          
          Favor providenciar o desconto em folha após lançamento da fatura no sistema Sienge.
          
          Sistema de Gestão de Veículos
        `,
        sentAt: new Date().toISOString(),
        status: 'sent'
      }

      const existingEmails = JSON.parse(localStorage.getItem("multa_emails") || "[]")
      localStorage.setItem("multa_emails", JSON.stringify([...existingEmails, emailLog]))

      setSent(true)
      onEmailSent?.()
      
      toast({
        title: "E-mail Enviado",
        description: "Notificação enviada para RH e Financeiro com sucesso!",
      })
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

  if (sent) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Check className="h-4 w-4 text-green-600" />
        E-mail Enviado
      </Button>
    )
  }

  return (
    <Button 
      variant="default" 
      onClick={sendEmailNotification}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Send className="h-4 w-4 animate-pulse" />
      ) : (
        <Mail className="h-4 w-4" />
      )}
      {loading ? "Enviando..." : "Enviar E-mail RH/Financeiro"}
    </Button>
  )
}