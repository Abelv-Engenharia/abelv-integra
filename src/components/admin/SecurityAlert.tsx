import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";

interface UserSecurityIssue {
  id: string;
  email: string;
  nome: string;
  perfil_nome: string;
  issue_type: 'no_profile' | 'invalid_permissions';
  details: string;
}

export const SecurityAlert = () => {
  const { canManageUsers } = usePermissions();
  const [securityIssues, setSecurityIssues] = useState<UserSecurityIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (canManageUsers()) {
      checkUserPermissions();
    }
  }, [canManageUsers]);

  const checkUserPermissions = async () => {
    setIsLoading(true);
    try {
      // Buscar usuários sem perfil definido
      const { data: usersWithoutProfile } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          nome
        `)
        .not('id', 'in', `(
          SELECT usuario_id 
          FROM usuario_perfis 
          WHERE usuario_id IS NOT NULL
        )`);

      // Buscar usuários com perfis mas sem permissões válidas
      const { data: usersWithInvalidPermissions } = await supabase
        .from('usuario_perfis')
        .select(`
          usuario_id,
          profiles!inner (
            id,
            email,
            nome
          ),
          perfis!inner (
            nome,
            permissoes
          )
        `);

      const issues: UserSecurityIssue[] = [];

      // Adicionar usuários sem perfil
      if (usersWithoutProfile) {
        usersWithoutProfile.forEach(user => {
          issues.push({
            id: user.id,
            email: user.email,
            nome: user.nome,
            perfil_nome: 'Nenhum',
            issue_type: 'no_profile',
            details: 'Usuário sem perfil de acesso definido'
          });
        });
      }

      // Verificar usuários com permissões inválidas
      if (usersWithInvalidPermissions) {
        usersWithInvalidPermissions.forEach((item: any) => {
          const permissions = item.perfis?.permissoes;
          const user = item.profiles;
          
          if (!permissions || typeof permissions !== 'object') {
            issues.push({
              id: user.id,
              email: user.email,
              nome: user.nome,
              perfil_nome: item.perfis?.nome || 'Desconhecido',
              issue_type: 'invalid_permissions',
              details: 'Permissões do perfil estão mal configuradas'
            });
          }
        });
      }

      setSecurityIssues(issues);
    } catch (error) {
      console.error('Erro ao verificar permissões de usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canManageUsers() || !showAlert || securityIssues.length === 0) {
    return null;
  }

  return (
    <Alert className="border-destructive/50 bg-destructive/5 mb-6">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertTitle className="text-destructive flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Problemas de Segurança Detectados
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p className="text-sm">
            Foram encontrados <strong>{securityIssues.length}</strong> usuários com problemas de permissão:
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {securityIssues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="text-xs bg-background/50 p-2 rounded border">
                <strong>{issue.nome}</strong> ({issue.email})
                <br />
                <span className="text-muted-foreground">
                  Perfil: {issue.perfil_nome} - {issue.details}
                </span>
              </div>
            ))}
            {securityIssues.length > 5 && (
              <p className="text-xs text-muted-foreground">
                E mais {securityIssues.length - 5} usuários...
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = '/admin/usuarios'}
              className="text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Gerenciar Usuários
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowAlert(false)}
              className="text-xs"
            >
              Dispensar
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};