import { Badge } from "@/components/ui/badge"
import { Clock, Mail, FileCheck, AlertTriangle } from "lucide-react"

interface NotificationStatusBadgeProps {
  status: "Pendente" | "Enviado" | "Documento Retornado" | "Em Atraso"
  prazoPreenchimento?: Date
  className?: string
}

export function NotificationStatusBadge({ 
  status, 
  prazoPreenchimento, 
  className 
}: NotificationStatusBadgeProps) {
  const isOverdue = prazoPreenchimento && prazoPreenchimento < new Date()
  const finalStatus = isOverdue && status === "Enviado" ? "Em Atraso" : status

  const getStatusConfig = () => {
    switch (finalStatus) {
      case "Pendente":
        return {
          variant: "secondary" as const,
          icon: Clock,
          text: "Pendente"
        }
      case "Enviado":
        return {
          variant: "default" as const,
          icon: Mail,
          text: "Enviado"
        }
      case "Documento Retornado":
        return {
          variant: "outline" as const,
          icon: FileCheck,
          text: "Retornado",
          style: "bg-green-50 text-green-700 border-green-200"
        }
      case "Em Atraso":
        return {
          variant: "destructive" as const,
          icon: AlertTriangle,
          text: "Em Atraso"
        }
      default:
        return {
          variant: "secondary" as const,
          icon: Clock,
          text: "Pendente"
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.style || ""} ${className || ""}`.trim()}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  )
}