import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, AlertCircle, User, Shield } from 'lucide-react';
import { authUserCreateDirectSchema, AuthUserCreateDirectValues, TipoUsuario } from '@/types/users';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchCCAs } from '@/services/treinamentos/ccaService';

interface CreateUserDirectFormProps {
  onSuccess?: () => void;
  onSubmit: (data: AuthUserCreateDirectValues) => Promise<boolean>;
  isSubmitting?: boolean;
}

const PERMISSION_GROUPS = {
  'Módulos Principais': [
    { key: 'desvios', label: 'Desvios' },
    { key: 'ocorrencias', label: 'Ocorrências' },
    { key: 'treinamentos', label: 'Treinamentos' },
    { key: 'tarefas', label: 'Tarefas' },
    { key: 'relatorios', label: 'Relatórios' },
    { key: 'hora_seguranca', label: 'HSA' },
    { key: 'medidas_disciplinares', label: 'Medidas Disciplinares' },
  ],
  'Administração': [
    { key: 'admin_usuarios', label: 'Usuários' },
    { key: 'admin_perfis', label: 'Perfis' },
    { key: 'admin_funcionarios', label: 'Funcionários' },
    { key: 'admin_empresas', label: 'Empresas' },
    { key: 'admin_ccas', label: 'CCAs' },
    { key: 'admin_supervisores', label: 'Supervisores' },
    { key: 'admin_engenheiros', label: 'Engenheiros' },
  ],
  'Ações Específicas': [
    { key: 'pode_editar_desvios', label: 'Editar Desvios' },
    { key: 'pode_excluir_desvios', label: 'Excluir Desvios' },
    { key: 'pode_editar_ocorrencias', label: 'Editar Ocorrências' },
    { key: 'pode_excluir_ocorrencias', label: 'Excluir Ocorrências' },
    { key: 'pode_exportar_dados', label: 'Exportar Dados' },
  ]
};

export const CreateUserDirectForm: React.FC<CreateUserDirectFormProps> = ({
  onSuccess,
  onSubmit,
  isSubmitting = false
}) => {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedCCAs, setSelectedCCAs] = useState<number[]>([]);
  const [success, setSuccess] = useState(false);

  const form = useForm<AuthUserCreateDirectValues>({
    resolver: zodResolver(authUserCreateDirectSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      tipo_usuario: 'usuario',
      permissoes_customizadas: {},
      ccas_permitidas: []
    }
  });

  const { data: ccas, isLoading: loadingCCAs } = useQuery({
    queryKey: ['ccas'],
    queryFn: fetchCCAs
  });

  const watchTipoUsuario = form.watch('tipo_usuario');

  // Quando tipo de usuário muda para administrador, selecionar todas as permissões
  useEffect(() => {
    if (watchTipoUsuario === 'administrador') {
      const allPermissions = Object.values(PERMISSION_GROUPS).flat().map(p => p.key);
      setSelectedPermissions(allPermissions);
      setSelectedCCAs(ccas?.map(cca => cca.id) || []);
    } else {
      setSelectedPermissions([]);
      setSelectedCCAs([]);
    }
  }, [watchTipoUsuario, ccas]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (watchTipoUsuario === 'administrador') return; // Não permitir alterar se for admin
    
    setSelectedPermissions(prev => 
      checked 
        ? [...prev, permission]
        : prev.filter(p => p !== permission)
    );
  };

  const handleCCAChange = (ccaId: number, checked: boolean) => {
    if (watchTipoUsuario === 'administrador') return; // Não permitir alterar se for admin
    
    setSelectedCCAs(prev => 
      checked 
        ? [...prev, ccaId]
        : prev.filter(id => id !== ccaId)
    );
  };

  const handleFormSubmit = async (data: AuthUserCreateDirectValues) => {
    try {
      // Preparar permissões customizadas
      const permissoes: Record<string, boolean> = {};
      selectedPermissions.forEach(permission => {
        permissoes[permission] = true;
      });

      const submitData = {
        ...data,
        permissoes_customizadas: permissoes,
        ccas_permitidas: selectedCCAs
      };

      const success = await onSubmit(submitData);
      
      if (success) {
        setSuccess(true);
        form.reset();
        setSelectedPermissions([]);
        setSelectedCCAs([]);
        
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (success) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Usuário criado com sucesso!</h3>
              <p className="text-sm text-muted-foreground">
                O usuário foi criado e as permissões foram configuradas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Defina o tipo de usuário e suas permissões específicas. Administradores têm acesso total ao sistema.
        </AlertDescription>
      </Alert>

      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  {...form.register('nome')}
                  className={form.formState.errors.nome ? 'border-red-500' : ''}
                />
                {form.formState.errors.nome && (
                  <p className="text-sm text-red-500">{form.formState.errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  className={form.formState.errors.email ? 'border-red-500' : ''}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                className={form.formState.errors.password ? 'border-red-500' : ''}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tipo de Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tipo de Usuário
            </CardTitle>
            <CardDescription>
              Administradores têm acesso completo ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={watchTipoUsuario}
              onValueChange={(value: TipoUsuario) => form.setValue('tipo_usuario', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="administrador" id="administrador" />
                <Label htmlFor="administrador" className="flex-1">
                  <div className="font-medium">Administrador</div>
                  <div className="text-sm text-muted-foreground">Acesso total ao sistema</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="usuario" id="usuario" />
                <Label htmlFor="usuario" className="flex-1">
                  <div className="font-medium">Usuário</div>
                  <div className="text-sm text-muted-foreground">Permissões customizadas</div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Permissões Específicas */}
        {watchTipoUsuario === 'usuario' && (
          <Card>
            <CardHeader>
              <CardTitle>Permissões</CardTitle>
              <CardDescription>
                Selecione as funcionalidades que o usuário pode acessar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => (
                <div key={groupName} className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">{groupName}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {permissions.map(permission => (
                      <div key={permission.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.key}
                          checked={selectedPermissions.includes(permission.key)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.key, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={permission.key} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* CCAs Permitidas */}
        {watchTipoUsuario === 'usuario' && (
          <Card>
            <CardHeader>
              <CardTitle>CCAs Permitidas</CardTitle>
              <CardDescription>
                Selecione as CCAs que o usuário pode acessar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCCAs ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {ccas?.map(cca => (
                    <div key={cca.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cca-${cca.id}`}
                        checked={selectedCCAs.includes(cca.id)}
                        onCheckedChange={(checked) => 
                          handleCCAChange(cca.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`cca-${cca.id}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {cca.codigo} - {cca.nome}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Limpar Formulário
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Usuário
          </Button>
        </div>
      </form>
    </div>
  );
};