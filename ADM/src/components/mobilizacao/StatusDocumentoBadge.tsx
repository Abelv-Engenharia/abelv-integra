import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, AlertCircle, XCircle, Clock, Minus } from "lucide-react";

interface StatusDocumentoBadgeProps {
  documento?: {
    status: 'ok' | 'pendente' | 'vencido' | 'em_validacao' | 'nao_se_aplica';
    validade?: string;
    dias_restantes?: number;
    observacoes?: string;
  };
  tipo: string;
}

export default function StatusDocumentoBadge({ documento, tipo }: StatusDocumentoBadgeProps) {
  if (!documento) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="flex justify-center">
            <Minus className="h-4 w-4 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tipo}: Não aplicável</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  const getIcon = () => {
    switch (documento.status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'vencido':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'em_validacao':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'nao_se_aplica':
        return <Minus className="h-4 w-4 text-gray-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTooltipContent = () => {
    const statusText = {
      'ok': 'OK',
      'pendente': 'Pendente',
      'vencido': 'Vencido',
      'em_validacao': 'Em Validação',
      'nao_se_aplica': 'Não se aplica'
    }[documento.status];

    let content = `${tipo}: ${statusText}`;
    
    if (documento.validade) {
      const dataValidade = new Date(documento.validade);
      const hoje = new Date();
      const diasRestantes = documento.dias_restantes ?? Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      content += `\nValidade: ${dataValidade.toLocaleDateString('pt-BR')}`;
      
      if (diasRestantes > 0) {
        content += ` (${diasRestantes} dias restantes)`;
      } else if (diasRestantes === 0) {
        content += ` (vence hoje)`;
      } else {
        content += ` (vencido há ${Math.abs(diasRestantes)} dias)`;
      }
    }
    
    if (documento.observacoes) {
      content += `\nObs: ${documento.observacoes}`;
    }
    
    return content;
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex justify-center cursor-pointer hover:scale-110 transition-transform">
          {getIcon()}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="whitespace-pre-line">
          {getTooltipContent()}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}