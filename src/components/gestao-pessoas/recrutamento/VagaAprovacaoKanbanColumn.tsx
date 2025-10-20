import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vaga, StatusAprovacao } from "@/types/gestao-pessoas/vaga";
import { VagaAprovacaoKanbanCard } from "./VagaAprovacaoKanbanCard";

interface VagaAprovacaoKanbanColumnProps {
  status: StatusAprovacao;
  titulo: string;
  vagas: Vaga[];
  onViewDetails: (vaga: Vaga) => void;
  onAprovar: (vaga: Vaga) => void;
  onReprovar: (vaga: Vaga) => void;
}

export function VagaAprovacaoKanbanColumn({ 
  status, 
  titulo, 
  vagas, 
  onViewDetails,
  onAprovar,
  onReprovar 
}: VagaAprovacaoKanbanColumnProps) {
  const getColumnColor = () => {
    switch (status) {
      case StatusAprovacao.PENDENTE:
        return "bg-yellow-500/10 border-yellow-500/20";
      case StatusAprovacao.APROVADO:
        return "bg-green-500/10 border-green-500/20";
      case StatusAprovacao.REPROVADO:
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-muted/50";
    }
  };

  const getBadgeVariant = () => {
    switch (status) {
      case StatusAprovacao.PENDENTE:
        return "secondary";
      case StatusAprovacao.APROVADO:
        return "default";
      case StatusAprovacao.REPROVADO:
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex-shrink-0 w-full md:w-80">
      <Card className="h-full">
        <div className={`p-4 border-b ${getColumnColor()}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{titulo}</h3>
            <Badge variant={getBadgeVariant()}>{vagas.length}</Badge>
          </div>
        </div>
        <CardContent className="pt-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto space-y-3">
          {vagas.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              Nenhuma vaga nesta etapa
            </div>
          ) : (
            vagas.map((vaga) => (
              <VagaAprovacaoKanbanCard
                key={vaga.id}
                vaga={vaga}
                onViewDetails={onViewDetails}
                onAprovar={onAprovar}
                onReprovar={onReprovar}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
