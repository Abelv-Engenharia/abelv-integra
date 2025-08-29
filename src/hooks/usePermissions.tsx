import { useProfile } from "./useProfile";
import { getAllMenusSidebar } from "@/services/perfisService";
import { Permissoes } from "@/types/users";

export interface PermissionCheck {
  hasMenuAccess: (menuKey: string) => boolean;
  hasAdminAccess: (adminType: string) => boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
  canViewAllCCAs: boolean;
  allowedMenus: string[];
}

export const usePermissions = (): PermissionCheck => {
  const { userPermissoes } = useProfile();
  
  // Garantir que userPermissoes seja tratado como Permissoes
  const permissions = userPermissoes as any as Permissoes | undefined;
  
  const allowedMenus = permissions?.menus_sidebar || [];
  const allAvailableMenus = getAllMenusSidebar();
  
  const hasMenuAccess = (menuKey: string): boolean => {
    return allowedMenus.includes(menuKey);
  };
  
  const hasAdminAccess = (adminType: string): boolean => {
    // Verifica se tem a permissão administrativa específica
    return (permissions as any)?.[`admin_${adminType}`] === true;
  };
  
  return {
    hasMenuAccess,
    hasAdminAccess,
    canEdit: permissions?.pode_editar ?? false,
    canDelete: permissions?.pode_excluir ?? false,
    canApprove: permissions?.pode_aprovar ?? false,
    canExport: permissions?.pode_exportar ?? false,
    canViewAllCCAs: permissions?.pode_visualizar_todos_ccas ?? false,
    allowedMenus
  };
};

// Hook específico para verificar acesso a funcionalidades
export const useFeatureAccess = () => {
  const permissions = usePermissions();
  
  return {
    // SMS - Segurança, Meio Ambiente e Saúde
    canAccessDesvios: permissions.hasMenuAccess('desvios_dashboard') || 
                     permissions.hasMenuAccess('desvios_cadastro') || 
                     permissions.hasMenuAccess('desvios_consulta'),
    
    canAccessTreinamentos: permissions.hasMenuAccess('treinamentos_dashboard') ||
                          permissions.hasMenuAccess('treinamentos_normativo') ||
                          permissions.hasMenuAccess('treinamentos_consulta'),
    
    canAccessHoraSeguranca: permissions.hasMenuAccess('hora_seguranca_dashboard') ||
                           permissions.hasMenuAccess('hora_seguranca_agenda') ||
                           permissions.hasMenuAccess('hora_seguranca_acompanhamento'),
    
    canAccessInspecaoSMS: permissions.hasMenuAccess('inspecao_sms_dashboard') ||
                         permissions.hasMenuAccess('inspecao_sms_cadastro') ||
                         permissions.hasMenuAccess('inspecao_sms_consulta'),
    
    canAccessMedidasDisciplinares: permissions.hasMenuAccess('medidas_disciplinares_dashboard') ||
                                  permissions.hasMenuAccess('medidas_disciplinares_cadastro') ||
                                  permissions.hasMenuAccess('medidas_disciplinares_consulta'),
    
    canAccessOcorrencias: permissions.hasMenuAccess('ocorrencias_dashboard') ||
                         permissions.hasMenuAccess('ocorrencias_cadastro') ||
                         permissions.hasMenuAccess('ocorrencias_consulta'),
    
    canAccessGRO: permissions.hasMenuAccess('gro_dashboard') ||
                  permissions.hasMenuAccess('gro_avaliacao_riscos'),
    
    // IDSMS - Indicadores
    canAccessIDSMS: permissions.hasMenuAccess('idsms_dashboard') ||
                   permissions.hasMenuAccess('idsms_relatorios'),
    
    // Tarefas
    canAccessTarefas: permissions.hasMenuAccess('tarefas_dashboard') ||
                     permissions.hasMenuAccess('tarefas_minhas_tarefas') ||
                     permissions.hasMenuAccess('tarefas_cadastro'),
    
    // Relatórios
    canAccessRelatorios: permissions.hasMenuAccess('relatorios_dashboard') ||
                        permissions.hasMenuAccess('relatorios_idsms'),
    
    // Administração
    canAccessAdministracao: permissions.hasAdminAccess('usuarios') ||
                           permissions.hasAdminAccess('perfis') ||
                           permissions.hasAdminAccess('funcionarios') ||
                           permissions.hasAdminAccess('empresas'),
    
    // Permissões específicas
    ...permissions
  };
};