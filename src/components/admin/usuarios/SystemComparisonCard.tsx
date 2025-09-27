import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Shield, Users, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SystemComparisonCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Comparação dos Sistemas
        </CardTitle>
        <CardDescription>
          Escolha o sistema de gerenciamento de usuários mais adequado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sistema Antigo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Sistema de Perfis (Antigo)</h3>
              <Badge variant="outline">Legado</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Perfis pré-definidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Sistema estável</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                <span>Menos flexibilidade</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                <span>Gerenciamento indireto</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/admin/usuarios')}
              className="w-full"
            >
              Acessar Sistema Antigo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />
          <Separator className="md:hidden" />

          {/* Sistema Novo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Permissões Diretas (Novo)</h3>
              <Badge>Recomendado</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Controle granular</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Configuração direta</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Interface simplificada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Administrador/Usuário</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/admin/usuarios-direct')}
              className="w-full"
            >
              Usar Novo Sistema
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center space-y-2">
          <p className="text-sm font-medium">Recursos Adicionais</p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/criar-usuario-direct')}
            >
              Criar Usuário (Novo)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/criar-usuario')}
            >
              Criar Usuário (Antigo)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};