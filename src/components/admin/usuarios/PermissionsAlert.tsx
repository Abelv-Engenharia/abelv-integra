
import { CheckCircle, Lock, AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Permissoes } from "@/types/users";
import { useSecurityValidation } from "@/hooks/useSecurityValidation";

interface PermissionsAlertProps {
  canManageUsers: boolean;
  permissions: Permissoes | null;
}

export const PermissionsAlert = ({ canManageUsers, permissions }: PermissionsAlertProps) => {
  const { validation } = useSecurityValidation();

  if (canManageUsers && validation.hasAdminAccess) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Você tem permissões de administrador para gerenciar usuários.</span>
          <Badge variant="default" className="bg-green-500">
            Nível: {validation.securityLevel.toUpperCase()}
          </Badge>
        </AlertDescription>
      </Alert>
    );
  }

  if (canManageUsers) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Você tem permissões para gerenciar usuários.</span>
          <Badge variant="secondary">
            Nível: {validation.securityLevel.toUpperCase()}
          </Badge>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Você não tem permissão para gerenciar usuários. Entre em contato com o administrador do sistema para obter as permissões necessárias.</p>
            <Badge variant="outline" className="text-destructive">
              Nível Atual: {validation.securityLevel.toUpperCase()}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {permissions && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Suas permissões atuais:</p>
              <div className="flex flex-wrap gap-1">
                {permissions.admin_perfis && <Badge variant="secondary">Gerenciar perfis</Badge>}
                {permissions.admin_funcionarios && <Badge variant="secondary">Gerenciar funcionários</Badge>}
                {permissions.desvios && <Badge variant="secondary">Desvios</Badge>}
                {permissions.ocorrencias && <Badge variant="secondary">Ocorrências</Badge>}
                {permissions.treinamentos && <Badge variant="secondary">Treinamentos</Badge>}
                {Object.values(permissions).every(v => v === false) && (
                  <Badge variant="outline">Nenhuma permissão especial</Badge>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
