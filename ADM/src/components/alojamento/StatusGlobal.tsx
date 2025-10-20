import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, FileText, XCircle } from "lucide-react";

interface StatusGlobalProps {
  blocoAtual: string;
  numeroContrato?: string;
}

const statusMap: Record<string, { label: string; icon: any; variant: any }> = {
  'cadastro': {
    label: 'Em Preenchimento',
    icon: FileText,
    variant: 'default',
  },
  'validacao_adm': {
    label: 'Aguardando Validação Adm. Matricial',
    icon: Clock,
    variant: 'secondary',
  },
  'validacao_financeiro': {
    label: 'Aguardando Validação Financeira',
    icon: Clock,
    variant: 'secondary',
  },
  'validacao_documentacao': {
    label: 'Aguardando Validação Documentação',
    icon: Clock,
    variant: 'secondary',
  },
  'validacao_superintendencia': {
    label: 'Aguardando Validação Superintendência',
    icon: Clock,
    variant: 'secondary',
  },
  'aguardando_assinatura': {
    label: 'Aprovado - Aguardando Assinatura Ely',
    icon: CheckCircle,
    variant: 'default',
  },
  'concluido': {
    label: 'Concluído',
    icon: CheckCircle,
    variant: 'default',
  },
  'reprovado': {
    label: 'Reprovado',
    icon: XCircle,
    variant: 'destructive',
  },
};

export function StatusGlobal({ blocoAtual, numeroContrato }: StatusGlobalProps) {
  const status = statusMap[blocoAtual] || statusMap['cadastro'];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-3">
        <StatusIcon className="h-6 w-6" />
        <div>
          <h2 className="font-semibold">Status Geral</h2>
          {numeroContrato && (
            <p className="text-sm text-muted-foreground">
              Contrato: {numeroContrato}
            </p>
          )}
        </div>
      </div>
      <Badge variant={status.variant} className="text-sm">
        {status.label}
      </Badge>
    </div>
  );
}
