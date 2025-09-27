import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CreateUserDirectForm } from '@/components/admin/usuarios/CreateUserDirectForm';
import { useCreateUserDirect } from '@/hooks/useCreateUserDirect';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const CriarUsuarioDirect = () => {
  const navigate = useNavigate();
  const { createUser, isCreating } = useCreateUserDirect();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/admin/usuarios');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">Usuário criado com sucesso!</h3>
                <p className="text-sm text-muted-foreground">
                  Redirecionando para a lista de usuários...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Criar Novo Usuário</h1>
            <p className="text-muted-foreground">
              Configure as permissões e acesso do usuário diretamente
            </p>
          </div>
        </div>
      </div>

      <CreateUserDirectForm
        onSubmit={createUser}
        onSuccess={handleSuccess}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default CriarUsuarioDirect;