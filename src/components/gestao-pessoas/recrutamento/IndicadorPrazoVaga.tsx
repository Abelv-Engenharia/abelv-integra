import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IndicadorPrazoVagaProps {
  diasRestantes: number;
  atrasado: boolean;
}

export function IndicadorPrazoVaga({ diasRestantes, atrasado }: IndicadorPrazoVagaProps) {
  const getStatusConfig = () => {
    if (atrasado) {
      return {
        cor: "bg-red-500 text-white hover:bg-red-600",
        icone: "🔴",
        texto: `Atrasado ${diasRestantes} dias`,
        tooltip: `Esta vaga está ${diasRestantes} dias atrasada em relação ao prazo de mobilização`
      };
    } else if (diasRestantes <= 3) {
      return {
        cor: "bg-yellow-500 text-white hover:bg-yellow-600",
        icone: "🟡",
        texto: `${diasRestantes} dias restantes`,
        tooltip: `Atenção: Restam apenas ${diasRestantes} dias para o prazo de mobilização`
      };
    } else {
      return {
        cor: "bg-green-500 text-white hover:bg-green-600",
        icone: "🟢",
        texto: `${diasRestantes} dias restantes`,
        tooltip: `Dentro do prazo. Restam ${diasRestantes} dias para a mobilização`
      };
    }
  };

  const config = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={config.cor}>
            <span className="mr-1">{config.icone}</span>
            {config.texto}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
