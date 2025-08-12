
import { ReactNode } from 'react';
import { SecurityGuard } from './SecurityGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AdminOnlySectionProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export const AdminOnlySection = ({ children, fallbackMessage }: AdminOnlySectionProps) => {
  const fallbackComponent = fallbackMessage ? (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {fallbackMessage}
      </AlertDescription>
    </Alert>
  ) : undefined;

  return (
    <SecurityGuard
      requiredPermission="admin_usuarios"
      requiredSecurityLevel="high"
      fallback={fallbackComponent}
    >
      {children}
    </SecurityGuard>
  );
};
