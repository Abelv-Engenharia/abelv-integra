
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuditLogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  details?: Record<string, any>;
}

export const useSecurityAudit = () => {
  const logSecurityEvent = useCallback(async (entry: AuditLogEntry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Call the RPC function that we created in the database
      const { error } = await supabase.rpc('log_audit_event', {
        p_user_id: user.id,
        p_action: entry.action,
        p_table_name: entry.table_name,
        p_record_id: entry.record_id,
        p_details: entry.details || {}
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  const logDataAccess = useCallback(async (tableName: string, recordId?: string) => {
    await logSecurityEvent({
      action: 'data_access',
      table_name: tableName,
      record_id: recordId
    });
  }, [logSecurityEvent]);

  const logDataModification = useCallback(async (tableName: string, recordId: string, action: 'create' | 'update' | 'delete') => {
    await logSecurityEvent({
      action: `data_${action}`,
      table_name: tableName,
      record_id: recordId
    });
  }, [logSecurityEvent]);

  const logAuthEvent = useCallback(async (action: 'login' | 'logout' | 'failed_login') => {
    await logSecurityEvent({
      action: `auth_${action}`
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logDataAccess,
    logDataModification,
    logAuthEvent
  };
};
