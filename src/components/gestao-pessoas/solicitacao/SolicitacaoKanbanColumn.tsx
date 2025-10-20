import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SolicitacaoServico, StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";
import { SolicitacaoKanbanCard } from "./SolicitacaoKanbanCard";
import { LucideIcon } from "lucide-react";

interface SolicitacaoKanbanColumnProps {
  status: StatusSolicitacao;
  titulo: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  solicitacoes: SolicitacaoServico[];
  onViewDetails: (solicitacao: SolicitacaoServico) => void;
}

export const SolicitacaoKanbanColumn = ({
  status,
  titulo,
  icon: Icon,
  color,
  bgColor,
  solicitacoes,
  onViewDetails,
}: SolicitacaoKanbanColumnProps) => {
  return (
    <div className="w-full min-w-0">
      <Card className="h-full min-h-[400px]">
        <div className={`p-4 border-b ${bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <h3 className="font-semibold text-sm">{titulo}</h3>
            </div>
            <Badge variant="secondary" className={`${bgColor} ${color}`}>
              {solicitacoes.length}
            </Badge>
          </div>
        </div>
        
        <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
          {solicitacoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhuma solicitação nesta etapa
            </div>
          ) : (
            solicitacoes.map((solicitacao) => (
              <SolicitacaoKanbanCard
                key={solicitacao.id}
                solicitacao={solicitacao}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
