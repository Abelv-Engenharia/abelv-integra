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
  const { userPermissoes, userRole, loadingProfile } = useProfile();

  const isAdmin = useMemo(() => {
    return (
      (userRole && typeof userRole === "string" && 
       (userRole.toLowerCase().includes("admin") || userRole.toLowerCase() === "administrador")) ||
      (userPermissoes && 
       typeof userPermissoes === "object" && 
       (userPermissoes as any).admin_funcionarios === true)
    );
  }, [userRole, userPermissoes]);

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (isAdmin) return true;
      
      if (!userPermissoes || typeof userPermissoes !== "object") {
        return false;
      }

      const permissions = userPermissoes as any;
      
      // Verificar permissão booleana direta
      if (permissions[permission] === true) {
        return true;
      }
      
      // Verificar nos menus_sidebar
      if (Array.isArray(permissions.menus_sidebar) && 
          permissions.menus_sidebar.includes(permission)) {
        return true;
      }
      
      return false;
    };
  }, [isAdmin, userPermissoes]);

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