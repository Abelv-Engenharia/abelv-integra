import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AdminSistemaGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const AdminSistemaGuard = ({ 
  children, 
  fallback = null,
  redirectTo = "/dashboard"
}: AdminSistemaGuardProps) => {
  const { isAdminSistema, loading } = usePermissionsDirect();

  // Se ainda está carregando, não mostrar nada
  if (loading) {
    return <>{fallback}</>;
  }

  // Se não é admin sistema, redirecionar ou mostrar fallback
  if (!isAdminSistema) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
