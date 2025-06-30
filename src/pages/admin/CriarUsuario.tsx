
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchProfiles } from "@/services/usuariosService";
import { CreateUserForm } from "@/components/admin/usuarios/CreateUserForm";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CriarUsuario = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Buscar perfis disponíveis
  const { data: profiles = [], isLoading: loadingProfiles, error: profilesError } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    staleTime: 10 * 60 * 1000
  });

  const handleSuccess = () => {
    setShowSuccess(true);
    // Opcionalmente redirecionar após sucesso
    setTimeout(() => {
      navigate('/admin/usuarios');
    }, 3000);
  };

  if (loadingProfiles) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Criar Novo Usuário</h1>
          <p className="text-muted-foreground">
            Adicione um novo usuário ao sistema
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profilesError) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Criar Novo Usuário</h1>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">
              Erro ao carregar perfis disponíveis. Tente recarregar a página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Criar Novo Usuário</h1>
        </div>
        <p className="text-muted-foreground">
          Adicione um novo usuário ao sistema com perfil de acesso adequado
        </p>
      </div>

      <CreateUserForm 
        profiles={profiles} 
        onSuccess={handleSuccess}
      />

      {showSuccess && (
        <div className="text-center text-green-600 font-medium">
          Redirecionando para a lista de usuários...
        </div>
      )}
    </div>
  );
};

export default CriarUsuario;
