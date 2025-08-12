
import { ReactNode, useEffect } from 'react';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Shield, AlertTriangle } from 'lucide-react';

interface SecurityGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredSecurityLevel?: 'low' | 'medium' | 'high';
  fallbackMessage?: string;
  showFallback?: boolean;
}

export const SecurityGuard = ({ 
  children, 
  requiredPermission, 
  requiredSecurityLevel = 'low',
  fallbackMessage = "Você não tem permissão para acessar este conteúdo.",
  showFallback = true
}: SecurityGuardProps) => {
  const { user } = useAuth();
  const { validation, validateAction } = useSecurityValidation();

  useEffect(() => {
    if (requiredPermission) {
      validateAction('access_protected_content', requiredPermission);
    }
  }, [requiredPermission, validateAction]);

  // Check authentication
  if (!user) {
    if (!showFallback) return null;
    
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Autenticação Necessária</h3>
              <p className="text-sm text-muted-foreground">
                Você precisa estar logado para acessar este conteúdo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check permission if required
  if (requiredPermission && !validation.validation.isValid) {
    if (!showFallback) return null;
    
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Acesso Negado</h3>
              <p className="text-sm text-muted-foreground">{fallbackMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check security level
  const securityLevels = { low: 0, medium: 1, high: 2 };
  const userLevel = securityLevels[validation.validation.securityLevel];
  const requiredLevel = securityLevels[requiredSecurityLevel];

  if (userLevel < requiredLevel) {
    if (!showFallback) return null;
    
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Shield className="mx-auto h-12 w-12 text-warning" />
            <div>
              <h3 className="text-lg font-semibold">Nível de Segurança Insuficiente</h3>
              <p className="text-sm text-muted-foreground">
                Esta funcionalidade requer nível de segurança: {requiredSecurityLevel}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
