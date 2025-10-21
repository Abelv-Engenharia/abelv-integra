import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";

interface GestaoPessoasGuardProps {
  children: ReactNode;
  requiredPermission: string;
}

export const GestaoPessoasGuard = ({ 
  children, 
  requiredPermission 
}: GestaoPessoasGuardProps) => {
  const { hasPermission, loading, isAdmin } = usePermissionsDirect();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (isAdmin || hasPermission(requiredPermission)) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace />;
};
