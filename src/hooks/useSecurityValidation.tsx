
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { supabase } from '@/integrations/supabase/client';

interface SecurityValidationResult {
  isValid: boolean;
  hasAdminAccess: boolean;
  canManageUsers: boolean;
  canManageFuncionarios: boolean;
  allowedCCAs: number[];
  securityLevel: 'low' | 'medium' | 'high';
}

export const useSecurityValidation = () => {
  const { user } = useAuth();
  const { userPermissoes } = useProfile();
  const { toast } = useToast();
  const { logSecurityEvent } = useSecurityAudit();
  const [validation, setValidation] = useState<SecurityValidationResult>({
    isValid: false,
    hasAdminAccess: false,
    canManageUsers: false,
    canManageFuncionarios: false,
    allowedCCAs: [],
    securityLevel: 'low'
  });

  useEffect(() => {
    const fetchValidation = async () => {
      if (!user || !userPermissoes) {
        setValidation({
          isValid: false,
          hasAdminAccess: false,
          canManageUsers: false,
          canManageFuncionarios: false,
          allowedCCAs: [],
          securityLevel: 'low'
        });
        return;
      }

      const permissions = userPermissoes as any;
      const hasAdminAccess = permissions?.admin_usuarios === true;
      const canManageUsers = permissions?.admin_usuarios === true;
      const canManageFuncionarios = permissions?.admin_funcionarios === true;
      
      // Buscar CCAs permitidos usando a função RPC (usuario_ccas)
      let allowedCCAs: number[] = [];
      try {
        const { data: ccaIds } = await supabase.rpc('get_user_allowed_ccas', {
          user_id_param: user.id
        });
        allowedCCAs = ccaIds || [];
      } catch (error) {
        console.error('Erro ao buscar CCAs permitidos:', error);
      }

      // Determine security level based on permissions
      let securityLevel: 'low' | 'medium' | 'high' = 'low';
      if (hasAdminAccess) {
        securityLevel = 'high';
      } else if (canManageFuncionarios || Object.values(permissions || {}).some(v => v === true)) {
        securityLevel = 'medium';
      }

      setValidation({
        isValid: true,
        hasAdminAccess,
        canManageUsers,
        canManageFuncionarios,
        allowedCCAs,
        securityLevel
      });
    };

    fetchValidation();
  }, [user, userPermissoes]);

  const validateAction = async (action: string, requiredPermission?: string) => {
    if (!validation.isValid) {
      await logSecurityEvent({
        action: 'unauthorized_access_attempt',
        details: { attempted_action: action, reason: 'not_authenticated' }
      });
      
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar autenticado para realizar esta ação.",
        variant: "destructive",
      });
      return false;
    }

    if (requiredPermission && !userPermissoes?.[requiredPermission as keyof typeof userPermissoes]) {
      await logSecurityEvent({
        action: 'insufficient_permissions',
        details: { 
          attempted_action: action, 
          required_permission: requiredPermission,
          user_permissions: userPermissoes
        }
      });
      
      toast({
        title: "Permissões Insuficientes",
        description: "Você não tem permissão para realizar esta ação.",
        variant: "destructive",
      });
      return false;
    }

    // Log successful security validation
    await logSecurityEvent({
      action: 'security_validation_passed',
      details: { action, required_permission: requiredPermission }
    });

    return true;
  };

  const validateCCAAccess = async (ccaId: number) => {
    if (!validation.isValid) return false;
    
    if (validation.hasAdminAccess) return true;
    
    if (!validation.allowedCCAs.includes(ccaId)) {
      await logSecurityEvent({
        action: 'unauthorized_cca_access',
        details: { attempted_cca: ccaId, allowed_ccas: validation.allowedCCAs }
      });
      
      toast({
        title: "Acesso Negado ao CCA",
        description: "Você não tem permissão para acessar este CCA.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return {
    validation,
    validateAction,
    validateCCAAccess
  };
};
