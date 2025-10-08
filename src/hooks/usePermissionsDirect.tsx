import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UsePermissionsDirectReturn {
  isAdmin: boolean;
  isAdminSistema: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  canAccessMenu: (menu: string) => boolean;
  permissions: string[];
  allowedCCAs: number[];
  userType: 'admin_sistema' | 'usuario' | null;
  loading: boolean;
}

export const usePermissionsDirect = (): UsePermissionsDirectReturn => {
  // Buscar dados do usuário usando as novas funções e estruturas
  const { data: userData, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-profile-direct'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return null;
      
      // 1. Buscar role do usuário
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      // 2. Buscar permissões usando a função do banco
      const { data: permissionsData } = await supabase.rpc('get_user_permissions', {
        user_id_param: user.id
      });
      
      // 3. Buscar CCAs usando a função do banco
      const { data: ccasData } = await supabase.rpc('get_user_allowed_ccas', {
        user_id_param: user.id
      });
      
      console.log('🔍 [usePermissionsDirect] Dados carregados:', {
        role: roleData?.role,
        permissions: permissionsData,
        ccas: ccasData
      });
      
      return {
        role: roleData?.role || 'usuario',
        permissions: permissionsData || [],
        ccas: ccasData || []
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    gcTime: 10 * 60 * 1000, // 10 minutos antes de garbage collect
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const isAdminSistema = useMemo(() => {
    return userData?.role === 'admin_sistema';
  }, [userData?.role]);

  const isAdmin = isAdminSistema; // Alias para compatibilidade

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      console.log('🔍 [usePermissionsDirect] Verificando permissão:', permission);
      
      // Guard clause: se não há userData, retornar false
      if (!userData) {
        console.log('⚠️ [usePermissionsDirect] userData não definido');
        return false;
      }
      
      // Se é admin_sistema, tem acesso total
      if (isAdminSistema) {
        console.log('✅ [usePermissionsDirect] Admin sistema tem acesso total');
        return true;
      }
      
      // Se permissões incluem '*', tem acesso total
      if (userData.permissions.includes('*')) {
        console.log('✅ [usePermissionsDirect] Permissões incluem acesso total (*)');
        return true;
      }
      
      // Verificar se a permissão específica está na lista
      if (userData.permissions.includes(permission)) {
        console.log('✅ [usePermissionsDirect] Permissão encontrada:', permission);
        return true;
      }
      
      console.log('❌ [usePermissionsDirect] Permissão não encontrada:', permission);
      console.log('📊 [usePermissionsDirect] Permissões disponíveis:', userData.permissions);
      return false;
    };
  }, [isAdminSistema, userData?.permissions]);

  const hasAnyPermission = useMemo(() => {
    return (permissions: string[]): boolean => {
      if (isAdminSistema) return true;
      
      return permissions.some(permission => hasPermission(permission));
    };
  }, [isAdminSistema, hasPermission]);

  const canAccessMenu = useMemo(() => {
    return (menu: string): boolean => {
      if (isAdminSistema) return true;
      
      return hasPermission(menu);
    };
  }, [isAdminSistema, hasPermission]);

  return {
    isAdmin,
    isAdminSistema,
    hasPermission,
    hasAnyPermission,
    canAccessMenu,
    permissions: userData?.permissions || [],
    allowedCCAs: userData?.ccas || [],
    userType: userData?.role || null,
    loading: loadingProfile
  };
};
