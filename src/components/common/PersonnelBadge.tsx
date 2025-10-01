import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserX, Clock } from "lucide-react";
import { PersonnelData } from "@/types/personnelSnapshot";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PersonnelBadgeProps {
  person: PersonnelData;
  showFunction?: boolean;
  showMatricula?: boolean;
}

export const PersonnelBadge = ({ person, showFunction = true, showMatricula = false }: PersonnelBadgeProps) => {
  const isInactive = !person.ativo || person.is_snapshot;
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={isInactive ? "text-muted-foreground" : ""}>
        {person.nome}
      </span>
      
      {isInactive && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="gap-1 bg-muted">
                <UserX className="h-3 w-3" />
                Inativo
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="text-sm font-medium">Pessoa não está mais ativa no sistema</p>
                {person.snapshot_date && (
                  <p className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Dados de: {format(new Date(person.snapshot_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {showFunction && person.funcao && (
        <Badge variant="secondary" className="text-xs">
          {person.funcao}
        </Badge>
      )}
      
      {showMatricula && person.matricula && (
        <Badge variant="outline" className="text-xs">
          Mat: {person.matricula}
        </Badge>
      )}
    </div>
  );
};
