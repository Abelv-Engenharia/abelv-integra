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
      console.log('🔍 [usePermissionsDirect] Verificando permissão:', permission);
      
      if (isAdmin) {
        console.log('✅ [usePermissionsDirect] Admin tem acesso total');
        return true;
      }
      
      if (!userProfile?.permissoes_customizadas) {
        console.log('❌ [usePermissionsDirect] Sem permissoes_customizadas');
        return false;
      }

      console.log('📊 [usePermissionsDirect] Permissões disponíveis:', {
        permissoes_customizadas: userProfile.permissoes_customizadas,
        menus_sidebar: userProfile.menus_sidebar
      });

      const permissions = userProfile.permissoes_customizadas as any;
      
      // Verificar permissão booleana direta
      if (permissions[permission] === true) {
        console.log('✅ [usePermissionsDirect] Encontrada em permissoes_customizadas como boolean');
        return true;
      }
      
      // Verificar se há uma propriedade menus_sidebar dentro de permissoes_customizadas
      if (permissions.menus_sidebar && Array.isArray(permissions.menus_sidebar)) {
        if (permissions.menus_sidebar.includes(permission)) {
          console.log('✅ [usePermissionsDirect] Encontrada em permissoes_customizadas.menus_sidebar');
          return true;
        }
      }
      
      // Verificar nos menus_sidebar do nível raiz
      if (Array.isArray(userProfile.menus_sidebar) && 
          userProfile.menus_sidebar.includes(permission)) {
        console.log('✅ [usePermissionsDirect] Encontrada em menus_sidebar raiz');
        return true;
      }
      
      // Verificar variações comuns de slug que podem ter inconsistências
      const slugVariations = [
        // Para hora da segurança: tentar versão sem "_inspecao"
        permission.replace('_cadastro_inspecao', '_cadastro'),
        permission.replace('_inspecao', ''),
        // Para outras possíveis variações
        permission.replace('_consulta', ''),
        permission.replace('_dashboard', ''),
      ];
      
      for (const variation of slugVariations) {
        if (variation !== permission) {
          // Verificar boolean
          if (permissions[variation] === true) {
            console.log('✅ [usePermissionsDirect] Encontrada variação em permissoes_customizadas:', variation);
            return true;
          }
          
          // Verificar menus_sidebar dentro de permissoes_customizadas
          if (permissions.menus_sidebar && Array.isArray(permissions.menus_sidebar)) {
            if (permissions.menus_sidebar.includes(variation)) {
              console.log('✅ [usePermissionsDirect] Encontrada variação em permissoes_customizadas.menus_sidebar:', variation);
              return true;
            }
          }
          
          // Verificar menus_sidebar raiz
          if (Array.isArray(userProfile.menus_sidebar) && userProfile.menus_sidebar.includes(variation)) {
            console.log('✅ [usePermissionsDirect] Encontrada variação em menus_sidebar raiz:', variation);
            return true;
          }
        }
      }
      
      console.log('❌ [usePermissionsDirect] Permissão não encontrada:', permission);
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