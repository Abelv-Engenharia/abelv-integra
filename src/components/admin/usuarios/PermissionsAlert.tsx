
import { CheckCircle, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Permissoes } from "@/types/users";

interface PermissionsAlertProps {
  canManageUsers: boolean;
  permissions: Permissoes | null;
}

export const PermissionsAlert = ({ canManageUsers, permissions }: PermissionsAlertProps) => {
  if (canManageUsers) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Você tem permissões de administrador para gerenciar usuários.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Você não tem permissão para gerenciar usuários. Entre em contato com o administrador do sistema para obter as permissões necessárias.
        </AlertDescription>
      </Alert>

      {permissions && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Suas permissões atuais: 
            {permissions.admin_perfis ? " Gerenciar perfis." : ""}
            {permissions.admin_funcionarios ? " Gerenciar funcionários." : ""}
            {permissions.desvios ? " Desvios." : ""}
            {permissions.ocorrencias ? " Ocorrências." : ""}
            {permissions.treinamentos ? " Treinamentos." : ""}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
