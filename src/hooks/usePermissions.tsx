import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';

export const usePermissions = () => {
  const { userPermissoes, loadingProfile } = useProfile();

  const permissions = useMemo(() => {
    if (!userPermissoes || typeof userPermissoes !== 'object') {
      return null;
    }
    return userPermissoes as any;
  }, [userPermissoes]);

  const hasPermission = (permission: string): boolean => {
    if (!permissions) return false;
    return permissions[permission] === true;
  };

  const hasMenuAccess = (menuKey: string): boolean => {
    if (!permissions) return false;
    
    // Verificar se o menu está na lista de menus permitidos
    const menusSidebar = permissions.menus_sidebar;
    if (!Array.isArray(menusSidebar)) return false;
    
    return menusSidebar.includes(menuKey);
  };

  const hasAnyMenuAccess = (menuKeys: string[]): boolean => {
    if (!permissions) return false;
    
    return menuKeys.some(menuKey => hasMenuAccess(menuKey));
  };

  const hasAnyPermission = (permissionKeys: string[]): boolean => {
    if (!permissions) return false;
    
    return permissionKeys.some(permission => hasPermission(permission));
  };

  const canManageUsers = (): boolean => {
    return hasPermission('admin_usuarios');
  };

  const canManageProfiles = (): boolean => {
    return hasPermission('admin_perfis');
  };

  const canManageFuncionarios = (): boolean => {
    return hasPermission('admin_funcionarios');
  };

  const canViewReports = (): boolean => {
    return hasPermission('relatorios');
  };

  const canEditDesvios = (): boolean => {
    return hasPermission('pode_editar_desvios');
  };

  const canDeleteDesvios = (): boolean => {
    return hasPermission('pode_excluir_desvios');
  };

  const canEditOcorrencias = (): boolean => {
    return hasPermission('pode_editar_ocorrencias');
  };

  const canDeleteOcorrencias = (): boolean => {
    return hasPermission('pode_excluir_ocorrencias');
  };

  const canExportData = (): boolean => {
    return hasPermission('pode_exportar_dados');
  };

  const getAllowedCCAs = (): number[] => {
    if (!permissions) return [];
    return Array.isArray(permissions.ccas_permitidas) ? permissions.ccas_permitidas : [];
  };

  return {
    permissions,
    isLoading: loadingProfile,
    hasPermission,
    hasMenuAccess,
    hasAnyMenuAccess,
    hasAnyPermission,
    canManageUsers,
    canManageProfiles,
    canManageFuncionarios,
    canViewReports,
    canEditDesvios,
    canDeleteDesvios,
    canEditOcorrencias,
    canDeleteOcorrencias,
    canExportData,
    getAllowedCCAs,
  };
};