
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const SecurityNotification = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('security-notification-dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('security-notification-dismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <Shield className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Segurança Aprimorada</AlertTitle>
      <AlertDescription className="text-green-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="mb-2">
              Importantes melhorias de segurança foram implementadas:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Políticas de acesso baseadas em função</li>
              <li>Proteção de dados sensíveis</li>
              <li>Controle de acesso por CCA</li>
              <li>Auditoria de segurança ativa</li>
            </ul>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDismiss}
            className="ml-4 border-green-300 text-green-700 hover:bg-green-100"
          >
            Entendido
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
