import { Candidato } from "@/types/candidato";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidatoStatusBadge } from "./CandidatoStatusBadge";
import { OrigemIcon } from "./OrigemIcon";
import { Eye, Pencil, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface CandidatoCardProps {
  candidato: Candidato;
  onViewDetails: (candidato: Candidato) => void;
  onEdit: (candidato: Candidato) => void;
  onDelete: (id: string) => void;
}

export const CandidatoCard = ({ candidato, onViewDetails, onEdit, onDelete }: CandidatoCardProps) => {
  const getInitials = (nome: string) => {
    const parts = nome.split(" ");
    return parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : nome.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {getInitials(candidato.nomeCompleto)}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{candidato.nomeCompleto}</h3>
              <p className="text-xs text-muted-foreground">{candidato.cargoVagaPretendida}</p>
            </div>
          </div>
          <CandidatoStatusBadge status={candidato.statusCandidato} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <OrigemIcon origem={candidato.origemCandidato} showLabel={true} />
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{candidato.responsavelEtapa}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{format(candidato.dataUltimaAtualizacao, "dd/MM/yyyy")}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails(candidato)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(candidato)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete(candidato.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
