import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const UserMigrationStatus: React.FC = () => {
  const navigate = useNavigate();

  const { data: migrationStats, isLoading } = useQuery({
    queryKey: ['user-migration-stats'],
    queryFn: async () => {
      // Buscar estatísticas dos sistemas
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, tipo_usuario, permissoes_customizadas');

      const { data: oldSystemUsers } = await supabase
        .from('usuario_perfis')
        .select('usuario_id');

      const total = allUsers?.length || 0;
      const newSystem = allUsers?.filter(user => 
        user.tipo_usuario && 
        user.permissoes_customizadas && 
        Object.keys(user.permissoes_customizadas).length > 0
      ).length || 0;
      const oldSystem = oldSystemUsers?.length || 0;
      const needsMigration = oldSystem - newSystem;

      return {
        total,
        newSystem,
        oldSystem,
        needsMigration: Math.max(0, needsMigration),
        migrationProgress: total > 0 ? (newSystem / total) * 100 : 0
      };
    }
  });

  if (isLoading || !migrationStats) {
    return null;
  }

  const { total, newSystem, oldSystem, needsMigration, migrationProgress } = migrationStats;

  if (needsMigration === 0 && newSystem > 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Sistema Atualizado
          </CardTitle>
          <CardDescription>
            Todos os usuários estão usando o novo sistema de permissões diretas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div>
                <p className="text-sm font-medium">{total} usuários total</p>
                <p className="text-xs text-muted-foreground">Sistema atual</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/usuarios-direct')}
              className="flex items-center gap-2"
            >
              Gerenciar Usuários
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
          Migração Necessária
        </CardTitle>
        <CardDescription>
          Alguns usuários ainda estão no sistema antigo de perfis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da migração</span>
            <span>{newSystem} / {total} usuários</span>
          </div>
          <Progress value={migrationProgress} className="w-full" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">{newSystem}</p>
            <p className="text-xs text-muted-foreground">Novo Sistema</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-orange-600">{needsMigration}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/usuarios-direct')}
            className="flex-1"
          >
            <Users className="mr-2 h-4 w-4" />
            Migrar Usuários
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/admin/criar-usuario-direct')}
            className="flex-1"
          >
            Criar Usuário Novo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Recomendação:</strong> Use o novo sistema para criar usuários e migre os existentes quando possível.</p>
        </div>
      </CardContent>
    </Card>
  );
};