
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, X } from "lucide-react";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import PhotoUpload from "@/components/profile/PhotoUpload";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, userRole, loadingProfile, updateProfileMutation } = useProfile();
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Atualizar formData quando o perfil carrega
  useEffect(() => {
    if (profile) {
      const initialData = {
        nome: profile.nome || '',
        email: profile.email || '',
        cargo: profile.cargo || '',
        departamento: profile.departamento || '',
        avatar_url: profile.avatar_url || ''
      };
      setFormData(initialData);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handlePhotoChange = (photoUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      avatar_url: photoUrl || ''
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        setHasChanges(false);
        navigate('/account/profile');
      }
    });
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm(
        "Você tem alterações não salvas. Deseja realmente cancelar?"
      );
      if (!confirmDiscard) return;
    }
    navigate('/account/profile');
  };

  if (loadingProfile) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/account/profile')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Não foi possível carregar as informações do perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Editar Perfil</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Editar Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e foto do perfil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload de Foto */}
          <div className="flex justify-center">
            <PhotoUpload
              currentPhotoUrl={formData.avatar_url}
              userName={formData.nome || 'Usuário'}
              onPhotoChange={handlePhotoChange}
            />
          </div>
          
          {/* Formulário */}
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={formData.nome || ''}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email || ''}
                  onChange={handleChange}
                  disabled
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input 
                  id="departamento" 
                  name="departamento" 
                  value={formData.departamento || ''}
                  onChange={handleChange}
                  placeholder="Digite seu departamento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input 
                  id="cargo" 
                  name="cargo" 
                  value={formData.cargo || ''}
                  onChange={handleChange}
                  placeholder="Digite seu cargo"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Perfil de Acesso</Label>
              <Input 
                id="role" 
                name="role" 
                value={userRole || 'Usuário'}
                disabled
                readOnly
                className="bg-muted"
              />
            </div>
          </form>
          
          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateProfileMutation.isPending || !hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
