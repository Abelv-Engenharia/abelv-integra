import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { PageLoader } from "@/components/common/PageLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallbackPath?: string;
}

const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  fallbackPath = "/dashboard" 
}: PermissionGuardProps) => {
  const { hasMenuAccess, hasPermission, isLoading } = usePermissions();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading || isChecking) {
    return <PageLoader text="Verificando permissões..." size="md" />;
  }

  // Verificar se o usuário tem acesso ao menu/submenu
  const hasAccess = hasMenuAccess(requiredPermission) || hasPermission(requiredPermission);

  if (!hasAccess) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Permissão necessária: <strong>{requiredPermission}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Entre em contato com o administrador do sistema para solicitar acesso.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;