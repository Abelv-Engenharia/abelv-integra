import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SolicitacaoServico, PrioridadeSolicitacao, TipoServico, StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";
import { 
  Car, 
  Plane, 
  Hotel, 
  Bus, 
  Briefcase,
  FileText,
  Eye,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { formatarNumeroSolicitacao } from "@/utils/gestao-pessoas/formatters";

interface SolicitacaoKanbanCardProps {
  solicitacao: SolicitacaoServico;
  onViewDetails: (solicitacao: SolicitacaoServico) => void;
}

const getTipoServicoIcon = (tipo: TipoServico) => {
  const iconMap: Record<TipoServico, React.ReactNode> = {
    [TipoServico.VOUCHER_UBER]: <Car className="h-4 w-4" />,
    [TipoServico.LOCACAO_VEICULO]: <Car className="h-4 w-4" />,
    [TipoServico.CARTAO_ABASTECIMENTO]: <Car className="h-4 w-4" />,
    [TipoServico.VELOE_GO]: <Car className="h-4 w-4" />,
    [TipoServico.PASSAGENS]: <Plane className="h-4 w-4" />,
    [TipoServico.HOSPEDAGEM]: <Hotel className="h-4 w-4" />,
    [TipoServico.LOGISTICA]: <Bus className="h-4 w-4" />,
    [TipoServico.CORREIOS_LOGGI]: <Briefcase className="h-4 w-4" />,
  };
  return iconMap[tipo] || <FileText className="h-4 w-4" />;
};

const getTipoServicoLabel = (tipo: TipoServico): string => {
  const labelMap: Record<TipoServico, string> = {
    [TipoServico.VOUCHER_UBER]: "Voucher Uber",
    [TipoServico.LOCACAO_VEICULO]: "Locação Veículo",
    [TipoServico.CARTAO_ABASTECIMENTO]: "Cartão Abast.",
    [TipoServico.VELOE_GO]: "Veloe/Go",
    [TipoServico.PASSAGENS]: "Passagens",
    [TipoServico.HOSPEDAGEM]: "Hospedagem",
    [TipoServico.LOGISTICA]: "Logística",
    [TipoServico.CORREIOS_LOGGI]: "Correios/Loggi",
  };
  return labelMap[tipo] || "Outros";
};

const getPrioridadeColor = (prioridade: PrioridadeSolicitacao) => {
  switch (prioridade) {
    case PrioridadeSolicitacao.ALTA:
      return "bg-red-100 text-red-700 border-red-300";
    case PrioridadeSolicitacao.MEDIA:
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case PrioridadeSolicitacao.BAIXA:
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export const SolicitacaoKanbanCard = ({
  solicitacao,
  onViewDetails,
}: SolicitacaoKanbanCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(solicitacao)}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-sm text-primary">
            {formatarNumeroSolicitacao(solicitacao.numeroSolicitacao)}
          </span>
          <Badge 
            variant="outline" 
            className={`text-xs ${getPrioridadeColor(solicitacao.prioridade)}`}
          >
            {solicitacao.prioridade}
          </Badge>
        </div>

        {/* Indicador de movimentação automática */}
        {solicitacao.foimovidoautomaticamente && solicitacao.status === StatusSolicitacao.PENDENTE && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                  <Clock className="h-3 w-3" />
                  <span>Movida automaticamente</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="text-xs">
                    {solicitacao.motivomudancaautomatica}
                  </p>
                  {solicitacao.datamudancaautomatica && (
                    <p className="text-xs text-muted-foreground">
                      Movida em: {format(new Date(solicitacao.datamudancaautomatica), "dd/MM/yyyy 'às' HH:mm")}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className="flex items-center gap-2 text-sm">
          {getTipoServicoIcon(solicitacao.tipoServico)}
          <span className="font-medium line-clamp-1">
            {getTipoServicoLabel(solicitacao.tipoServico)}
          </span>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>CCA:</span>
            <span className="font-medium line-clamp-1 max-w-[140px]">
              {solicitacao.centroCusto}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Data:</span>
            <span className="font-medium">
              {format(new Date(solicitacao.dataSolicitacao), "dd/MM/yyyy")}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(solicitacao);
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
};
