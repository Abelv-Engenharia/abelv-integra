import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, Shield, User } from 'lucide-react';
import { AdminOnlySection } from '@/components/security/AdminOnlySection';
import { MigrateUsersButton } from '@/components/admin/usuarios/MigrateUsersButton';
import { EditUserDirectForm } from '@/components/admin/usuarios/EditUserDirectForm';
import { useUpdateUserDirect } from '@/hooks/useUpdateUserDirect';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function GerenciarUsuariosDirect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUser } = useUpdateUserDirect();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Buscar usuários usando o novo sistema
  const { data: usuarios, isLoading, refetch } = useQuery({
    queryKey: ['usuarios-direct'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          nome,
          email,
          tipo_usuario,
          permissoes_customizadas,
          ccas_permitidas,
          created_at,
          updated_at
        `)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }

      return data || [];
    }
  });

  const filteredUsers = usuarios?.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (userData: any) => {
    const success = await updateUser(userData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      refetch();
    }
    return success;
  };

  const handleDeleteUser = async (user: any) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Usuário excluído com sucesso!",
        });
        refetch();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir usuário. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const getUserPermissionsCount = (user: any) => {
    if (user.tipo_usuario === 'administrador') return 'Acesso Total';
    if (!user.permissoes_customizadas) return '0 permissões';
    const count = Object.keys(user.permissoes_customizadas).filter(
      key => user.permissoes_customizadas[key] === true
    ).length;
    return `${count} permissões`;
  };

  const getUserCCAsCount = (user: any) => {
    if (user.tipo_usuario === 'administrador') return 'Todas as CCAs';
    if (!Array.isArray(user.ccas_permitidas)) return '0 CCAs';
    return `${user.ccas_permitidas.length} CCAs`;
  };

  return (
    <AdminOnlySection>
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
              <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
              <p className="text-muted-foreground">
                Sistema de permissões diretas - Novo modelo
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/admin/criar-usuario-direct')}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Usuário
          </Button>
        </div>

        {/* Migração */}
        <MigrateUsersButton />

        {/* Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Carregando usuários...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.tipo_usuario === 'administrador' ? (
                          <Shield className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.nome}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge 
                            variant={user.tipo_usuario === 'administrador' ? 'default' : 'secondary'}
                          >
                            {user.tipo_usuario === 'administrador' ? 'Administrador' : 'Usuário'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getUserPermissionsCount(user)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getUserCCAsCount(user)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Nenhum usuário encontrado com essa busca.' : 'Nenhum usuário encontrado.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <EditUserDirectForm
                user={selectedUser}
                onSubmit={handleUpdateUser}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminOnlySection>
  );
}