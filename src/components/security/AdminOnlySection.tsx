
import { ReactNode } from 'react';
import { SecurityGuard } from './SecurityGuard';

interface AdminOnlySectionProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export const AdminOnlySection = ({ children, fallbackMessage }: AdminOnlySectionProps) => {
  return (
    <SecurityGuard
      requiredPermission="admin_usuarios"
      requiredSecurityLevel="high"
      fallbackMessage={fallbackMessage || "Apenas administradores podem acessar esta seção."}
    >
      {children}
    </SecurityGuard>
  );
};
