import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileAvatarUrl } from "@/hooks/useProfileAvatarUrl";
import { uploadAvatarToBucket } from "@/utils/uploadAvatarToBucket";
import { useToast } from "@/hooks/use-toast";
import { Image } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { profile, userRole, loadingProfile, updateProfileMutation } = useProfile();
  // Hook para obter URL da foto do perfil
  const { url: avatarUrl } = useProfileAvatarUrl(profile?.avatar_url);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

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

  // Atualiza preview e file selecionado
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Escolha um arquivo de imagem.",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "Tamanho máximo da imagem: 5MB.",
        variant: "destructive"
      });
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Limpa seleção do avatar
  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData(prev => ({ ...prev, avatar_url: undefined }));
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

  const handleSave = async () => {
    let avatar_url = formData.avatar_url;

    if (avatarFile) {
      if (!user?.id) {
        toast({
          title: "Erro",
          description: "Não foi possível identificar o usuário.",
          variant: "destructive",
        });
        return;
      }
      const result = await uploadAvatarToBucket(user.id, avatarFile);
      if (result) {
        avatar_url = result;
      } else {
        toast({
          title: "Erro",
          description: "Falha ao enviar a imagem de perfil.",
          variant: "destructive",
        });
        return;
      }
    }

    updateProfileMutation.mutate({
      ...formData,
      avatar_url
    });

    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações pessoais */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-4">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt={profile.nome} />
                ) : avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={profile.nome} />
                ) : (
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center">
                    <Image size={32} className="mb-1" />
                    {getInitials(profile.nome)}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1.5 -right-1.5 bg-secondary p-2 rounded-full border shadow cursor-pointer hover:bg-secondary/80 transition"
                  title="Alterar foto"
                >
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Image size={20} />
                </label>
              )}
              {isEditing && (avatarPreview || formData.avatar_url) && (
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-2 right-2 px-2 py-1 text-xs text-destructive"
                  onClick={handleAvatarRemove}
                >
                  Remover
                </Button>
              )}
            </div>
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
          </CardContent>
        </Card>
        
        {/* Editar perfil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Editar Perfil</CardTitle>
              {isEditing ? (
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
            </div>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {isEditing && (
                <div className="space-y-2 flex flex-col">
                  <Label>Foto do Perfil</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      id="avatar-upload-secondary"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button asChild variant="outline" type="button" size="sm">
                      <label htmlFor="avatar-upload-secondary" className="cursor-pointer flex items-center gap-2">
                        <Image size={18} /> Selecionar imagem
                      </label>
                    </Button>
                    {(avatarPreview || formData.avatar_url) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={handleAvatarRemove}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  {avatarPreview && (
                    <div className="mt-2">
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover border"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input 
                    id="nome" 
                    name="nome" 
                    value={formData.nome || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={formData.email || ''}
                    onChange={handleChange}
                    disabled={true}
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
                    value={formData.departamento || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input 
                    id="cargo" 
                    name="cargo" 
                    value={formData.cargo || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso</Label>
                <Input 
                  id="role" 
                  name="role" 
                  value={userRole || 'Usuário'}
                  disabled={true}
                  readOnly
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
