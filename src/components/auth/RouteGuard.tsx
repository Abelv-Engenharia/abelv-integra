import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-toast";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  fallbackPath?: string;
}

const RouteGuard = ({ 
  children, 
  requiredPermissions, 
  fallbackPath = "/dashboard" 
}: RouteGuardProps) => {
  const { hasMenuAccess, hasPermission, isLoading } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      // Verificar se o usuário tem pelo menos uma das permissões necessárias
      const hasAccess = requiredPermissions.some(permission => 
        hasMenuAccess(permission) || hasPermission(permission)
      );

      if (!hasAccess) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        
        navigate(fallbackPath, { 
          replace: true,
          state: { from: location.pathname }
        });
      }
    }
  }, [isLoading, requiredPermissions, hasMenuAccess, hasPermission, navigate, fallbackPath, location.pathname, toast]);

  if (isLoading) {
    return null; // O AuthGuard já mostra o loading
  }

  // Verificar se o usuário tem pelo menos uma das permissões necessárias
  const hasAccess = requiredPermissions.some(permission => 
    hasMenuAccess(permission) || hasPermission(permission)
  );

  if (!hasAccess) {
    return null; // O useEffect vai redirecionar
  }

  return <>{children}</>;
};

export default RouteGuard;