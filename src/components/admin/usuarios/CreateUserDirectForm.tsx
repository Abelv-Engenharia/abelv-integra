import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Info } from 'lucide-react';
import { authUserCreateDirectSchema, type AuthUserCreateDirectValues } from '@/types/users';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  COMPLETE_PERMISSIONS,
  getAllPermissionsFromCategory,
  areAllPermissionsSelected,
  areSomePermissionsSelected,
  convertPermissionsToMenusSidebar
} from '@/services/permissionsService';

interface CreateUserDirectFormProps {
  onSuccess?: () => void;
  onSubmit: (data: AuthUserCreateDirectValues) => Promise<boolean>;
  isSubmitting?: boolean;
}

async function fetchCCAs() {
  const { data, error } = await supabase
    .from('ccas')
    .select('id, codigo, nome')
    .eq('ativo', true)
    .order('codigo');
  
  if (error) throw error;
  return data;
}

export const CreateUserDirectForm: React.FC<CreateUserDirectFormProps> = ({
  onSuccess,
  onSubmit,
  isSubmitting = false
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedCCAs, setSelectedCCAs] = useState<number[]>([]);
  const [success, setSuccess] = useState(false);

  const form = useForm<AuthUserCreateDirectValues>({
    resolver: zodResolver(authUserCreateDirectSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      tipo_usuario: 'usuario'
    }
  });

  const { data: ccas } = useQuery({
    queryKey: ['ccas'],
    queryFn: fetchCCAs
  });

  const userType = form.watch('tipo_usuario');

  // useEffect para auto-selecionar todas as permissões quando tipo = administrador
  useEffect(() => {
    if (form.watch('tipo_usuario') === 'administrador') {
      // Selecionar todas as permissões
      const allPermissions = COMPLETE_PERMISSIONS.flatMap(category => 
        category.permissions.map(p => p.key)
      );
      setSelectedPermissions(allPermissions);
      
      // Selecionar todos os CCAs
      if (ccas) {
        setSelectedCCAs(ccas.map(cca => cca.id));
      }
    }
  }, [form.watch('tipo_usuario'), ccas]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permission]);
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permission));
    }
  };

  const handleCCAChange = (ccaId: number, checked: boolean) => {
    if (checked) {
      setSelectedCCAs(prev => [...prev, ccaId]);
    } else {
      setSelectedCCAs(prev => prev.filter(id => id !== ccaId));
    }
  };

  const handleFormSubmit = async (values: Omit<AuthUserCreateDirectValues, 'permissoes_customizadas' | 'ccas_permitidas' | 'menus_sidebar'>) => {
    // Preparar dados para envio
    const permissoesCustomizadas = selectedPermissions.reduce((acc, permission) => {
      acc[permission] = true;
      return acc;
    }, {} as any);
    
    const userData: AuthUserCreateDirectValues = {
      ...values,
      permissoes_customizadas: permissoesCustomizadas,
      ccas_permitidas: selectedCCAs,
      menus_sidebar: convertPermissionsToMenusSidebar(permissoesCustomizadas)
    };

    try {
      const success = await onSubmit(userData);
      if (success) {
        setSuccess(true);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">
                Usuário criado com sucesso!
              </h3>
              <p className="text-sm text-muted-foreground">
                O usuário pode agora fazer login no sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Você está criando um usuário com permissões diretas. Configure o tipo de usuário e as permissões específicas conforme necessário.
        </AlertDescription>
      </Alert>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome" className={!form.formState.dirtyFields.nome && !form.getValues().nome ? "text-red-500" : ""}>
              Nome *
            </Label>
            <Input
              id="nome"
              {...form.register('nome')}
              placeholder="Digite o nome completo"
              className={form.formState.errors.nome ? 'border-red-500' : ''}
            />
            {form.formState.errors.nome && (
              <p className="text-sm text-red-500">{form.formState.errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className={!form.formState.dirtyFields.email && !form.getValues().email ? "text-red-500" : ""}>
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Digite o email"
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="senha" className={!form.formState.dirtyFields.senha && !form.getValues().senha ? "text-red-500" : ""}>
              Senha *
            </Label>
            <Input
              id="senha"
              type="password"
              {...form.register('senha')}
              placeholder="Digite a senha"
              className={form.formState.errors.senha ? 'border-red-500' : ''}
            />
            {form.formState.errors.senha && (
              <p className="text-sm text-red-500">{form.formState.errors.senha.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tipo de Usuário */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={form.watch('tipo_usuario')}
            onValueChange={(value) => form.setValue('tipo_usuario', value as 'administrador' | 'usuario')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="administrador" id="administrador" />
              <Label htmlFor="administrador">Administrador (acesso total)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usuario" id="usuario" />
              <Label htmlFor="usuario">Usuário (permissões específicas)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Permissões Específicas - apenas para usuário */}
      {userType === 'usuario' && (
        <Card>
          <CardHeader>
            <CardTitle>Permissões do Sistema</CardTitle>
            <p className="text-sm text-muted-foreground">
              Selecione os módulos e funcionalidades que o usuário poderá acessar
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {COMPLETE_PERMISSIONS.map((category) => {
              const categoryPermissions = category.permissions.map(p => p.key);
              const allSelected = areAllPermissionsSelected(category.name, selectedPermissions);
              const someSelected = areSomePermissionsSelected(category.name, selectedPermissions);
              
              return (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.name}`}
                        checked={allSelected}
                        onCheckedChange={(checked) => {
                        if (checked) {
                          // Adicionar todas as permissões da categoria
                          const newPermissions = [...selectedPermissions];
                          categoryPermissions.forEach(permission => {
                            if (!newPermissions.includes(permission)) {
                              newPermissions.push(permission);
                            }
                          });
                          setSelectedPermissions(newPermissions);
                        } else {
                          // Remover todas as permissões da categoria
                          setSelectedPermissions(prev => 
                            prev.filter(p => !categoryPermissions.includes(p))
                          );
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`category-${category.name}`} 
                      className="font-medium text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                  
                  <div className="ml-6 grid grid-cols-3 gap-3">
                    {category.permissions.map((permission) => (
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
                          className="text-xs cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* CCAs Permitidas - apenas para usuário */}
      {userType === 'usuario' && (
        <Card>
          <CardHeader>
            <CardTitle>CCAs Permitidas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Selecione quais CCAs o usuário poderá acessar
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
              {ccas?.map((cca) => (
                <div key={cca.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cca-${cca.id}`}
                    checked={selectedCCAs.includes(cca.id)}
                    onCheckedChange={(checked) => 
                      handleCCAChange(cca.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`cca-${cca.id}`} className="text-sm">
                    {cca.codigo} - {cca.nome}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            setSelectedPermissions([]);
            setSelectedCCAs([]);
          }}
        >
          Limpar Formulário
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? 'Criando...' : 'Criar Usuário'}
        </Button>
      </div>
    </form>
  );
};