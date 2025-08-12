
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle } from "lucide-react";

interface SecurityGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredSecurityLevel?: "low" | "medium" | "high";
  fallback?: React.ReactNode;
}

export const SecurityGuard: React.FC<SecurityGuardProps> = ({
  children,
  requiredPermission,
  requiredSecurityLevel = "low",
  fallback
}) => {
  const { user, loading } = useAuth();
  const { userPermissoes, loading: profileLoading } = useProfile();

  console.log("=== DEBUG SecurityGuard ===");
  console.log("SecurityGuard - user:", user);
  console.log("SecurityGuard - loading:", loading);
  console.log("SecurityGuard - profileLoading:", profileLoading);
  console.log("SecurityGuard - userPermissoes:", userPermissoes);
  console.log("SecurityGuard - requiredPermission:", requiredPermission);
  console.log("SecurityGuard - requiredSecurityLevel:", requiredSecurityLevel);

  // Mostrar loading enquanto carrega dados
  if (loading || profileLoading) {
    console.log("SecurityGuard - ainda carregando...");
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    console.log("SecurityGuard - usuário não autenticado");
    return fallback || (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar autenticado para acessar esta seção.
        </AlertDescription>
      </Alert>
    );
  }

  // Verificar permissão específica se fornecida
  if (requiredPermission && userPermissoes) {
    const hasPermission = (userPermissoes as any)[requiredPermission] === true;
    console.log("SecurityGuard - verificando permissão:", requiredPermission, "resultado:", hasPermission);
    
    if (!hasPermission) {
      console.log("SecurityGuard - permissão negada para:", requiredPermission);
      return fallback || (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta seção. Permissão necessária: {requiredPermission}
          </AlertDescription>
        </Alert>
      );
    }
  }

  console.log("SecurityGuard - acesso permitido, renderizando children");
  return <>{children}</>;
};
