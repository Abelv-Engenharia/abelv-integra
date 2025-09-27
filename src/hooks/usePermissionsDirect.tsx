import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TipoUsuario, PermissoesCustomizadas } from "@/types/users";

interface UsePermissionsDirectReturn {
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccessMenu: (menu: string) => boolean;
  permissions: PermissoesCustomizadas;
  allowedCCAs: number[];
  userType: TipoUsuario | null;
  loading: boolean;
}

export const usePermissionsDirect = (): UsePermissionsDirectReturn => {
  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-profile-direct'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('tipo_usuario, permissoes_customizadas, ccas_permitidas, menus_sidebar')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        return null;
      }

      return data;
    },
  });

  const isAdmin = useMemo(() => {
    return userProfile?.tipo_usuario === 'administrador';
  }, [userProfile?.tipo_usuario]);

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (isAdmin) return true;
      
      if (!userProfile?.permissoes_customizadas) {
        return false;
      }

      const permissions = userProfile.permissoes_customizadas as any;
      
      // Verificar permissão booleana direta
      if (permissions[permission] === true) {
        return true;
      }
      
      // Verificar nos menus_sidebar
      if (Array.isArray(userProfile.menus_sidebar) && 
          userProfile.menus_sidebar.includes(permission)) {
        return true;
      }
      
      return false;
    };
  }, [isAdmin, userProfile?.permissoes_customizadas, userProfile?.menus_sidebar]);

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
    permissions: (userProfile?.permissoes_customizadas as PermissoesCustomizadas) || {},
    allowedCCAs: Array.isArray(userProfile?.ccas_permitidas) 
      ? userProfile.ccas_permitidas as number[]
      : [],
    userType: (userProfile?.tipo_usuario as TipoUsuario) || null,
    loading: loadingProfile
  };
};