import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, UserCog } from "lucide-react";
import { AdminSistemaGuard } from "@/components/security/AdminSistemaGuard";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfis: { id: number; nome: string }[];
}

interface Perfil {
  id: number;
  nome: string;
}

export default function UsuariosPerfis() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selectedPerfis, setSelectedPerfis] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar usuários NÃO-ADMINS com seus perfis
  const { data: usuarios = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['usuarios-with-perfis'],
    queryFn: async () => {
      // Buscar usuários que não são admin_sistema
      const { data: nonAdminUsers } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .order('nome');
      
      if (!nonAdminUsers) return [];
      
      // Filtrar admin_sistema
      const usersWithRoles = await Promise.all(
        nonAdminUsers.map(async (user) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          return {
            ...user,
            isAdmin: roleData?.role === 'admin_sistema'
          };
        })
      );
      
      const regularUsers = usersWithRoles.filter(u => !u.isAdmin);
      
      // Buscar perfis para cada usuário
      const usersWithPerfis = await Promise.all(
        regularUsers.map(async (user) => {
          const { data: perfisData } = await supabase
            .from('usuario_perfis')
            .select('perfil_id, perfis(id, nome)')
            .eq('usuario_id', user.id);
          
          return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            perfis: perfisData?.map(p => ({
              id: p.perfil_id,
              nome: (p.perfis as any)?.nome || ''
            })) || []
          };
        })
      );
      
      return usersWithPerfis as Usuario[];
    }
  });

  // Buscar todos os perfis
  const { data: perfis = [] } = useQuery({
    queryKey: ['perfis'],
    queryFn: async () => {
      const { data } = await supabase
        .from('perfis')
        .select('id, nome')
        .order('nome');
      
      return data as Perfil[] || [];
    }
  });

  // Mutation para atualizar perfis do usuário
  const updateUserPerfis = useMutation({
    mutationFn: async ({ userId, perfilIds }: { userId: string; perfilIds: number[] }) => {
      // Remover perfis atuais
      await supabase
        .from('usuario_perfis')
        .delete()
        .eq('usuario_id', userId);
      
      // Inserir novos perfis
      if (perfilIds.length > 0) {
        const { error } = await supabase
          .from('usuario_perfis')
          .insert(
            perfilIds.map(perfilId => ({
              usuario_id: userId,
              perfil_id: perfilId
            }))
          );
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-with-perfis'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile-direct'] });
      setSelectedUser(null);
      setSelectedPerfis([]);
      toast({
        title: "Perfis atualizados",
        description: "Os perfis do usuário foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfis",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (user: Usuario) => {
    setSelectedUser(user);
    setSelectedPerfis(user.perfis.map(p => p.id));
  };

  const handleSubmit = () => {
    if (selectedUser) {
      updateUserPerfis.mutate({
        userId: selectedUser.id,
        perfilIds: selectedPerfis
      });
    }
  };

  const togglePerfil = (perfilId: number) => {
    setSelectedPerfis(prev =>
      prev.includes(perfilId)
        ? prev.filter(id => id !== perfilId)
        : [...prev, perfilId]
    );
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminSistemaGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <UserCog className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Associação de Perfis aos Usuários</h1>
            <p className="text-muted-foreground">
              Associe perfis de acesso aos usuários
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loadingUsers ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="grid gap-4">
            {filteredUsuarios.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Nenhum usuário encontrado
                </CardContent>
              </Card>
            ) : (
              filteredUsuarios.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {user.nome}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(user)}
                      >
                        Gerenciar Perfis
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Perfis Associados ({user.perfis.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.perfis.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhum perfil associado</p>
                        ) : (
                          user.perfis.map((perfil) => (
                            <Badge key={perfil.id} variant="secondary">
                              {perfil.nome}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Gerenciar Perfis - {selectedUser?.nome}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione os perfis que deseja associar a este usuário. As permissões serão
                a união de todos os perfis selecionados.
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {perfis.map((perfil) => (
                  <div key={perfil.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      checked={selectedPerfis.includes(perfil.id)}
                      onCheckedChange={() => togglePerfil(perfil.id)}
                    />
                    <Label className="cursor-pointer flex-1" onClick={() => togglePerfil(perfil.id)}>
                      {perfil.nome}
                    </Label>
                  </div>
                ))}
                {perfis.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum perfil cadastrado
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={updateUserPerfis.isPending}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminSistemaGuard>
  );
}
