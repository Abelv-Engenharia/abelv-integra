import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MigrationStatus {
  total: number;
  migrated: number;
  errors: number;
  inProgress: boolean;
  completed: boolean;
}

export const MigrateUsersButton: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    total: 0,
    migrated: 0,
    errors: 0,
    inProgress: false,
    completed: false
  });

  // Verificar quantos usuários precisam ser migrados
  const { data: migrationData, isLoading } = useQuery({
    queryKey: ['migration-status'],
    queryFn: async () => {
      // Buscar usuários que ainda usam o sistema antigo (têm perfil em usuario_perfis)
      const { data: oldSystemUsers, error } = await supabase
        .from('usuario_perfis')
        .select(`
          usuario_id,
          profiles!inner(
            id,
            nome,
            email,
            tipo_usuario,
            permissoes_customizadas
          ),
          perfis!inner(
            nome,
            permissoes,
            ccas_permitidas
          )
        `);

      if (error) {
        console.error('Erro ao buscar usuários para migração:', error);
        return { needsMigration: [], total: 0 };
      }

      // Filtrar apenas usuários que não foram migrados (tipo_usuario ainda é null ou não tem permissões diretas)
      const needsMigration = oldSystemUsers?.filter(user => 
        !user.profiles.tipo_usuario || 
        !user.profiles.permissoes_customizadas ||
        Object.keys(user.profiles.permissoes_customizadas).length === 0
      ) || [];

      return {
        needsMigration,
        total: needsMigration.length
      };
    }
  });

  const migrationMutation = useMutation({
    mutationFn: async () => {
      if (!migrationData?.needsMigration) return;
      
      const users = migrationData.needsMigration;
      let migrated = 0;
      let errors = 0;

      setMigrationStatus({
        total: users.length,
        migrated: 0,
        errors: 0,
        inProgress: true,
        completed: false
      });

      for (const user of users) {
        try {
          // Determinar tipo de usuário baseado no perfil
          const isAdmin = user.perfis.nome.toLowerCase().includes('admin') || 
                         (user.perfis.permissoes as any)?.admin_funcionarios === true;

          // Migrar dados do perfil antigo para o novo sistema
          const { error } = await supabase
            .from('profiles')
            .update({
              tipo_usuario: isAdmin ? 'administrador' : 'usuario',
              permissoes_customizadas: user.perfis.permissoes || {},
              ccas_permitidas: user.perfis.ccas_permitidas || [],
              menus_sidebar: (user.perfis.permissoes as any)?.menus_sidebar || []
            })
            .eq('id', user.usuario_id);

          if (error) {
            console.error(`Erro ao migrar usuário ${user.profiles.email}:`, error);
            errors++;
          } else {
            migrated++;
          }
        } catch (error) {
          console.error(`Erro ao processar usuário ${user.profiles.email}:`, error);
          errors++;
        }

        // Atualizar progresso
        setMigrationStatus(prev => ({
          ...prev,
          migrated: migrated,
          errors: errors
        }));

        // Pequena pausa para não sobrecarregar o banco
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setMigrationStatus(prev => ({
        ...prev,
        inProgress: false,
        completed: true
      }));

      return { migrated, errors, total: users.length };
    },
    onSuccess: (result) => {
      if (result) {
        toast({
          title: "Migração Concluída",
          description: `${result.migrated} usuários migrados com sucesso. ${result.errors} erros.`,
          variant: result.errors > 0 ? "destructive" : "default"
        });
        queryClient.invalidateQueries({ queryKey: ['migration-status'] });
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      }
    },
    onError: (error) => {
      console.error('Erro na migração:', error);
      toast({
        title: "Erro na Migração",
        description: "Ocorreu um erro durante a migração. Verifique o console para mais detalhes.",
        variant: "destructive"
      });
      setMigrationStatus(prev => ({
        ...prev,
        inProgress: false
      }));
    }
  });

  const handleMigrate = () => {
    migrationMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Verificando status da migração...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!migrationData?.total || migrationData.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Migração Completa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Todos os usuários já foram migrados para o novo sistema de permissões diretas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Migração do Sistema Antigo
        </CardTitle>
        <CardDescription>
          Migre usuários do sistema de perfis antigo para o novo sistema de permissões diretas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>{migrationData.total} usuários</strong> ainda estão usando o sistema antigo de perfis.
            Execute a migração para usar o novo sistema de permissões diretas.
          </AlertDescription>
        </Alert>

        {migrationStatus.inProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da migração</span>
              <span>{migrationStatus.migrated + migrationStatus.errors} / {migrationStatus.total}</span>
            </div>
            <Progress 
              value={((migrationStatus.migrated + migrationStatus.errors) / migrationStatus.total) * 100} 
              className="w-full" 
            />
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-600">
                {migrationStatus.migrated} migrados
              </Badge>
              {migrationStatus.errors > 0 && (
                <Badge variant="outline" className="text-red-600">
                  {migrationStatus.errors} erros
                </Badge>
              )}
            </div>
          </div>
        )}

        {migrationStatus.completed && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Migração concluída! {migrationStatus.migrated} usuários migrados com sucesso.
              {migrationStatus.errors > 0 && ` ${migrationStatus.errors} usuários tiveram erro na migração.`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleMigrate}
            disabled={migrationStatus.inProgress || migrationMutation.isPending}
            className="flex-1"
          >
            {migrationStatus.inProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Migrando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Migrar Usuários
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>O que será feito:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Usuários com perfis "Admin" se tornarão "Administrador"</li>
            <li>Outros usuários se tornarão "Usuário" com permissões específicas</li>
            <li>Permissões e CCAs serão copiadas do perfil antigo</li>
            <li>Sistema antigo continuará funcionando durante a transição</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};