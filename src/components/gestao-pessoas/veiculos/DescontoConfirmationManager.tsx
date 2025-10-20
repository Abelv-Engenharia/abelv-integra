import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { MultaCompleta } from "@/types/gestao-pessoas/multa"
import { toast } from "@/hooks/use-toast"

interface DescontoConfirmationManagerProps {
  multa: MultaCompleta
  onUpdate: (multaId: string, updates: Partial<MultaCompleta>) => void
  disabled?: boolean
}

export function DescontoConfirmationManager({
  multa,
  onUpdate,
  disabled = false
}: DescontoConfirmationManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [observacoes, setObservacoes] = useState("")
  const [dataDesconto, setDataDesconto] = useState<Date>()
  const [responsavel, setResponsavel] = useState("")

  const confirmarDesconto = async () => {
    if (!dataDesconto) {
      toast({
        title: "Erro",
        description: "Informe a data do desconto",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    try {
      // Simular processo de confirmação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updates: Partial<MultaCompleta> = {
        descontoConfirmado: true,
        statusMulta: 'Processo Concluído',
        updatedAt: new Date(),
        // Adicionar campos de controle do desconto
        ...(responsavel && { responsavel: responsavel }),
      }

      onUpdate(multa.id, updates)
      
      // Log da ação no localStorage
      const logEntry = {
        id: `desconto_${multa.id}_${Date.now()}`,
        multaId: multa.id,
        action: 'desconto_confirmado',
        dataDesconto: dataDesconto.toISOString(),
        responsavel: responsavel || 'RH/Financeiro',
        observacoes,
        timestamp: new Date().toISOString()
      }
      
      const existingLogs = JSON.parse(localStorage.getItem('multa_desconto_logs') || '[]')
      localStorage.setItem('multa_desconto_logs', JSON.stringify([...existingLogs, logEntry]))
      
      toast({
        title: "Desconto confirmado",
        description: "Desconto em folha de pagamento confirmado com sucesso",
      })
      
      setOpen(false)
      setObservacoes("")
      setDataDesconto(undefined)
      setResponsavel("")
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao confirmar desconto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusDesconto = () => {
    if (!multa.emailRHFinanceiroEnviado) {
      return { text: "N/A", variant: "secondary" as const, icon: Clock }
    }
    
    if (multa.descontoConfirmado) {
      return { text: "Confirmado", variant: "outline" as const, icon: CheckCircle, style: "bg-green-50 text-green-700 border-green-200" }
    }
    
    return { text: "Pendente", variant: "destructive" as const, icon: XCircle }
  }

  const statusDesconto = getStatusDesconto()
  const StatusIcon = statusDesconto.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          disabled={disabled || !multa.emailRHFinanceiroEnviado}
          className="h-8 w-8 p-0"
        >
          <StatusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmação de Desconto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status atual */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">Status atual do desconto:</div>
            <Badge 
              variant={statusDesconto.variant}
              className={`${statusDesconto.style || ""}`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusDesconto.text}
            </Badge>
          </div>

          {/* Informações da multa */}
          <div className="text-sm space-y-1">
            <div><strong>Auto de Infração:</strong> {multa.numeroAutoInfracao}</div>
            <div><strong>Condutor:</strong> {multa.condutorInfrator}</div>
            <div><strong>Valor:</strong> R$ {multa.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>

          {!multa.descontoConfirmado && multa.emailRHFinanceiroEnviado && (
            <>
              {/* Data do desconto */}
              <div className="space-y-2">
                <Label htmlFor="dataDesconto">Data do desconto *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataDesconto && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataDesconto ? format(dataDesconto, "PPP", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataDesconto}
                      onSelect={setDataDesconto}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Responsável */}
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável pela confirmação</Label>
                <Input
                  id="responsavel"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Nome do responsável"
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações sobre o desconto..."
                  rows={3}
                />
              </div>
            </>
          )}

          {multa.descontoConfirmado && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>✓ Desconto confirmado</strong>
                <div className="mt-1">Processo concluído com sucesso</div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            {!multa.descontoConfirmado && multa.emailRHFinanceiroEnviado && (
              <Button 
                onClick={confirmarDesconto}
                disabled={loading || !dataDesconto}
                className="flex-1"
              >
                {loading ? "Confirmando..." : "Confirmar desconto"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}