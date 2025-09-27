
import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface AdminOnlySectionProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export const AdminOnlySection = ({ children, fallbackMessage }: AdminOnlySectionProps) => {
  const { hasPermission, loading } = usePermissions();
  
  if (loading) {
    return null; // ou um loading spinner se preferir
  }
  
  if (!hasPermission('admin_usuarios')) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Acesso Negado</h3>
              <p className="text-sm text-muted-foreground">
                {fallbackMessage || "Apenas administradores podem acessar esta seção."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
