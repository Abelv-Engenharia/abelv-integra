
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IndicadorFlagProps {
  taxaAcumulada: number;
  meta: number;
  className?: string;
}

export const IndicadorFlag = ({ taxaAcumulada, meta, className }: IndicadorFlagProps) => {
  if (meta === 0) return null;
  
  const isPositivo = taxaAcumulada <= meta;
  
  return (
    <div className={`flex items-center ${className}`}>
      <Badge 
        className={`flex items-center gap-1 text-xs font-semibold ${
          isPositivo 
            ? "bg-green-500 hover:bg-green-600 text-white" 
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {isPositivo ? (
          <>
            <TrendingUp className="h-3 w-3" />
            Positivo
          </>
        ) : (
          <>
            <TrendingDown className="h-3 w-3" />
            Negativo
          </>
        )}
      </Badge>
    </div>
  );
};
