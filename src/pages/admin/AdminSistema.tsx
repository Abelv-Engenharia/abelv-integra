import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldOff, Search, Crown } from "lucide-react";
import { AdminSistemaGuard } from "@/components/security/AdminSistemaGuard";

export default function AdminSistema() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todos os usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users-with-roles'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .order('nome');
      
      if (!profiles) return [];
      
      // Buscar roles para cada usuário
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)
            .single();
          
          return {
            ...profile,
            role: roleData?.role || 'usuario'
          };
        })
      );
      
      return usersWithRoles;
    }
  });

  // Mutation para promover usuário
  const promoteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin_sistema' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile-direct'] });
      toast({
        title: "Usuário promovido",
        description: "O usuário agora é um administrador de sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao promover usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para remover privilégio
  const demoteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin_sistema');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile-direct'] });
      toast({
        title: "Privilégio removido",
        description: "O usuário não é mais um administrador de sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover privilégio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminUsers = filteredUsers.filter(u => u.role === 'admin_sistema');
  const regularUsers = filteredUsers.filter(u => u.role !== 'admin_sistema');

  return (
    <AdminSistemaGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Administradores de Sistema</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários com acesso total ao sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="space-y-6">
            {/* Administradores atuais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Administradores de Sistema ({adminUsers.length})
                </CardTitle>
                <CardDescription>
                  Usuários com acesso total a todas as funcionalidades e CCAs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {adminUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum administrador de sistema
                    </p>
                  ) : (
                    adminUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{user.nome}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="gap-1">
                            <Crown className="h-3 w-3" />
                            Admin Sistema
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => demoteUser.mutate(user.id)}
                            disabled={demoteUser.isPending}
                          >
                            <ShieldOff className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usuários comuns */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários Comuns ({regularUsers.length})</CardTitle>
                <CardDescription>
                  Usuários que podem ser promovidos a administradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {regularUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum usuário comum encontrado
                    </p>
                  ) : (
                    regularUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{user.nome}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => promoteUser.mutate(user.id)}
                          disabled={promoteUser.isPending}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Promover a Admin
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminSistemaGuard>
  );
}
