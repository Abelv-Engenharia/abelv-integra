import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";
import { ReactNode } from "react";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export const PermissionGuard = ({ 
  children, 
  requiredPermission, 
  requiredPermissions = [],
  requireAdmin = false,
  fallback = null 
}: PermissionGuardProps) => {
  const { isAdmin, hasPermission, hasAnyPermission, loading } = usePermissionsDirect();

  // Se ainda está carregando, não mostrar nada
  if (loading) {
    return <>{fallback}</>;
  }

  // Se requer admin e usuário é admin, liberar acesso
  if (requireAdmin && isAdmin) {
    return <>{children}</>;
  }

  // Se é admin, sempre liberar acesso
  if (isAdmin) {
    return <>{children}</>;
  }

  // Verificar permissão individual
  if (requiredPermission) {
    if (hasPermission(requiredPermission)) {
      return <>{children}</>;
    }
  }

  // Verificar múltiplas permissões (pelo menos uma deve ser verdadeira)
  if (requiredPermissions.length > 0) {
    if (hasAnyPermission(requiredPermissions)) {
      return <>{children}</>;
    }
  }

  return <>{fallback}</>;
};