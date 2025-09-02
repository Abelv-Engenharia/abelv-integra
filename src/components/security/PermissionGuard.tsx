import { useProfile } from "@/hooks/useProfile";
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
  const { userPermissoes, userRole } = useProfile();

  // Verificar se é admin de forma robusta
  const isAdmin = 
    (userRole && typeof userRole === "string" && 
     (userRole.toLowerCase().includes("admin") || userRole.toLowerCase() === "administrador")) ||
    (userPermissoes && 
     typeof userPermissoes === "object" && 
     (userPermissoes as any).admin_funcionarios === true);

  // Se requer admin e usuário é admin, liberar acesso
  if (requireAdmin && isAdmin) {
    return <>{children}</>;
  }

  // Se não tem permissões carregadas ainda, não mostrar nada
  if (!userPermissoes || typeof userPermissoes !== "object") {
    return <>{fallback}</>;
  }

  const permissions = userPermissoes as any;

  // Verificar permissão individual
  if (requiredPermission) {
    // Verificar se tem a permissão booleana
    if (permissions[requiredPermission] === true) {
      return <>{children}</>;
    }
    
    // Verificar se tem nos menus_sidebar
    if (Array.isArray(permissions.menus_sidebar) && 
        permissions.menus_sidebar.includes(requiredPermission)) {
      return <>{children}</>;
    }
  }

  // Verificar múltiplas permissões (pelo menos uma deve ser verdadeira)
  if (requiredPermissions.length > 0) {
    const hasAnyPermission = requiredPermissions.some(perm => {
      return permissions[perm] === true || 
             (Array.isArray(permissions.menus_sidebar) && 
              permissions.menus_sidebar.includes(perm));
    });
    
    if (hasAnyPermission) {
      return <>{children}</>;
    }
  }

  // Se chegou até aqui e é admin, liberar acesso
  if (isAdmin) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};