import { useProfile } from "./useProfile";
import { useMemo } from "react";

interface UsePermissionsReturn {
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccessMenu: (menu: string) => boolean;
  permissions: any;
  loading: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { userPermissoes, userRole, loadingProfile, profile } = useProfile();

  const isAdmin = useMemo(() => {
    // Verificar primeiro o novo sistema (permissões diretas)
    if (userRole && typeof userRole === "string" && profile?.tipo_usuario) {
      return profile.tipo_usuario === 'administrador';
    }
    
    // Fallback para o sistema antigo
    return (
      (userRole && typeof userRole === "string" && 
       (userRole.toLowerCase().includes("admin") || userRole.toLowerCase() === "administrador")) ||
      (userPermissoes && 
       typeof userPermissoes === "object" && 
       (userPermissoes as any).admin_funcionarios === true)
    );
  }, [userRole, userPermissoes, profile]);

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (isAdmin) return true;
      
      // Verificar primeiro o novo sistema (permissões diretas)
      if (profile?.tipo_usuario && profile?.permissoes_customizadas) {
        const permissions = profile.permissoes_customizadas as any;
        if (permissions[permission] === true) {
          return true;
        }
        
        // Verificar nos menus_sidebar do novo sistema
        if (Array.isArray(profile.menus_sidebar) && 
            profile.menus_sidebar.includes(permission)) {
          return true;
        }
      }
      
      // Fallback para o sistema antigo
      if (!userPermissoes || typeof userPermissoes !== "object") {
        return false;
      }

      const permissions = userPermissoes as any;
      
      // Verificar permissão booleana direta
      if (permissions[permission] === true) {
        return true;
      }
      
      // Verificar nos menus_sidebar do sistema antigo
      if (Array.isArray(permissions.menus_sidebar) && 
          permissions.menus_sidebar.includes(permission)) {
        return true;
      }
      
      return false;
    };
  }, [isAdmin, userPermissoes, profile]);

  const hasAnyPermission = useMemo(() => {
    return (permissions: string[]): boolean => {
      if (isAdmin) return true;
      
      return permissions.some(permission => hasPermission(permission));
    };
  }, [isAdmin, hasPermission]);

  const canAccessMenu = useMemo(() => {
    return (menu: string): boolean => {
      if (isAdmin) return true;
      
      return hasPermission(menu);
    };
  }, [isAdmin, hasPermission]);

  return {
    isAdmin,
    hasPermission,
    hasAnyPermission,
    canAccessMenu,
    permissions: userPermissoes,
    loading: loadingProfile
  };
};