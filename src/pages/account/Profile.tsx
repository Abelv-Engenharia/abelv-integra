import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, userRole, loadingProfile, updateProfileMutation } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Atualizar formData quando o perfil carrega
  React.useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        cargo: profile.cargo || '',
        departamento: profile.departamento || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        email: profile.email || '',
        cargo: profile.cargo || '',
        departamento: profile.departamento || ''
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loadingProfile) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-6">
              <Skeleton className="h-24 w-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-28 mb-4" />
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
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
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
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
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile.avatar_url} alt={profile.nome} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getInitials(profile.nome)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-medium">{profile.nome}</h3>
            <p className="text-sm text-muted-foreground">{userRole || 'Usuário'}</p>
            <p className="text-sm text-muted-foreground">{profile.departamento || 'Departamento não informado'}</p>
            
            <Separator className="my-4" />
            
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="truncate ml-2">{profile.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cargo:</span>
                <span className="truncate ml-2">{profile.cargo || 'Não informado'}</span>
              </div>
            </div>
            
            {/* Botão para editar perfil */}
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate('/account/edit-profile')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Informações Detalhadas</CardTitle>
            </div>
            <CardDescription>Visualize suas informações completas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input 
                    id="nome" 
                    name="nome" 
                    value={profile.nome || ''}
                    disabled
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={profile.email || ''}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input 
                    id="departamento" 
                    name="departamento" 
                    value={profile.departamento || ''}
                    disabled
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input 
                    id="cargo" 
                    name="cargo" 
                    value={profile.cargo || ''}
                    disabled
                    readOnly
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
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
