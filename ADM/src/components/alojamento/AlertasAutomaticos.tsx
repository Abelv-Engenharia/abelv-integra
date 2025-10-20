import { AlertTriangle, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Alerta {
  tipo: 'erro' | 'atencao' | 'info';
  mensagem: string;
}

interface AlertasAutomaticosProps {
  alertas: Alerta[];
}

export function AlertasAutomaticos({ alertas }: AlertasAutomaticosProps) {
  if (alertas.length === 0) return null;

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'erro':
        return <XCircle className="h-4 w-4" />;
      case 'atencao':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (tipo: string) => {
    switch (tipo) {
      case 'erro':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-2">
      {alertas.map((alerta, index) => (
        <Alert 
          key={index} 
          variant={getVariant(alerta.tipo)}
          className={alerta.tipo === 'atencao' ? 'border-yellow-500 bg-yellow-50' : ''}
        >
          <div className="flex items-center gap-2">
            {getIcon(alerta.tipo)}
            <AlertDescription className="text-sm">
              {alerta.mensagem}
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
}
