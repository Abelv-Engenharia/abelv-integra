import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, User, Building2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface FeriasDetalhes {
  id: string;
  nomeprestador: string;
  empresa: string;
  funcaocargo: string;
  cca_codigo: string;
  cca_nome: string;
  datainicioferias: string;
  diasferias: number;
  responsaveldireto: string;
  observacoes: string | null;
  status: string;
  created_at: string;
  justificativareprovacao?: string | null;
  aprovadopor_gestor?: string | null;
  dataaprovacao_gestor?: string | null;
}

interface VisualizarFeriasModalProps {
  aberto: boolean;
  onFechar: () => void;
  ferias: FeriasDetalhes | null;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
    solicitado: { label: "Aguardando Gestor", variant: "secondary" },
    aguardando_aprovacao: { label: "Aguardando RH", variant: "outline" },
    aprovado: { label: "Aprovado", variant: "default", className: "bg-green-600 hover:bg-green-700" },
    em_ferias: { label: "Em Férias", variant: "default" },
    concluido: { label: "Concluído", variant: "outline" },
    reprovado: { label: "Reprovado", variant: "destructive" }
  };

  const statusInfo = statusMap[status] || { label: status, variant: "outline" };
  return <Badge variant={statusInfo.variant} className={statusInfo.className}>{statusInfo.label}</Badge>;
};

export function VisualizarFeriasModal({ aberto, onFechar, ferias }: VisualizarFeriasModalProps) {
  if (!ferias) return null;

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes da Solicitação de Férias
          </DialogTitle>
          <DialogDescription>
            Informações completas da solicitação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge(ferias.status)}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Prestador</p>
                <p className="font-medium">{ferias.nomeprestador}</p>
                <p className="text-sm text-muted-foreground">{ferias.funcaocargo}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Empresa e CCA</p>
                <p className="font-medium">{ferias.empresa}</p>
                <p className="text-sm text-muted-foreground">
                  {ferias.cca_codigo} - {ferias.cca_nome}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Período de Férias</p>
                <p className="font-medium">
                  Início: {format(new Date(ferias.datainicioferias), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ferias.diasferias} {ferias.diasferias === 1 ? 'dia' : 'dias'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Responsável Direto</p>
                <p className="font-medium">{ferias.responsaveldireto}</p>
              </div>
            </div>
          </div>

          {ferias.observacoes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Observações</p>
                <p className="text-sm">{ferias.observacoes}</p>
              </div>
            </>
          )}

          {ferias.status === 'reprovado' && ferias.justificativareprovacao && (
            <>
              <Separator />
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Motivo da Reprovação</p>
                </div>
                <p className="text-sm">{ferias.justificativareprovacao}</p>
                {ferias.aprovadopor_gestor && (
                  <p className="text-xs text-muted-foreground">
                    Reprovado por: {ferias.aprovadopor_gestor}
                  </p>
                )}
                {ferias.dataaprovacao_gestor && (
                  <p className="text-xs text-muted-foreground">
                    Em: {format(new Date(ferias.dataaprovacao_gestor), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                )}
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Solicitado em {format(new Date(ferias.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
