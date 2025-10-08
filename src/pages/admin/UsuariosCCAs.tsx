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
import { MapPin, Search, Building2 } from "lucide-react";
import { AdminSistemaGuard } from "@/components/security/AdminSistemaGuard";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  ccas: { id: number; codigo: string; nome: string }[];
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

export default function UsuariosCCAs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selectedCCAs, setSelectedCCAs] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar usuários NÃO-ADMINS com seus CCAs
  const { data: usuarios = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['usuarios-with-ccas'],
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
      
      // Buscar CCAs para cada usuário
      const usersWithCCAs = await Promise.all(
        regularUsers.map(async (user) => {
          const { data: ccasData } = await supabase
            .from('usuario_ccas')
            .select('cca_id, ccas(id, codigo, nome)')
            .eq('usuario_id', user.id)
            .eq('ativo', true);
          
          return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            ccas: ccasData?.map(c => ({
              id: c.cca_id,
              codigo: (c.ccas as any)?.codigo || '',
              nome: (c.ccas as any)?.nome || ''
            })) || []
          };
        })
      );
      
      return usersWithCCAs as Usuario[];
    }
  });

  // Buscar todos os CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      
      return data as CCA[] || [];
    }
  });

  // Mutation para atualizar CCAs do usuário
  const updateUserCCAs = useMutation({
    mutationFn: async ({ userId, ccaIds }: { userId: string; ccaIds: number[] }) => {
      // Desativar todos os CCAs atuais
      await supabase
        .from('usuario_ccas')
        .update({ ativo: false })
        .eq('usuario_id', userId);
      
      // Inserir/atualizar novos CCAs
      if (ccaIds.length > 0) {
        for (const ccaId of ccaIds) {
          // Verificar se já existe
          const { data: existing } = await supabase
            .from('usuario_ccas')
            .select('id')
            .eq('usuario_id', userId)
            .eq('cca_id', ccaId)
            .single();
          
          if (existing) {
            // Atualizar para ativo
            await supabase
              .from('usuario_ccas')
              .update({ ativo: true })
              .eq('usuario_id', userId)
              .eq('cca_id', ccaId);
          } else {
            // Inserir novo
            const { error } = await supabase
              .from('usuario_ccas')
              .insert({
                usuario_id: userId,
                cca_id: ccaId,
                ativo: true
              });
            
            if (error) throw error;
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-with-ccas'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile-direct'] });
      setSelectedUser(null);
      setSelectedCCAs([]);
      toast({
        title: "CCAs atualizados",
        description: "Os CCAs do usuário foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar CCAs",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (user: Usuario) => {
    setSelectedUser(user);
    setSelectedCCAs(user.ccas.map(c => c.id));
  };

  const handleSubmit = () => {
    if (selectedUser) {
      updateUserCCAs.mutate({
        userId: selectedUser.id,
        ccaIds: selectedCCAs
      });
    }
  };

  const toggleCCA = (ccaId: number) => {
    setSelectedCCAs(prev =>
      prev.includes(ccaId)
        ? prev.filter(id => id !== ccaId)
        : [...prev, ccaId]
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
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de CCAs por Usuário</h1>
            <p className="text-muted-foreground">
              Controle individual de acesso aos CCAs
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
                          <MapPin className="h-5 w-5" />
                          {user.nome}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(user)}
                      >
                        Gerenciar CCAs
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        CCAs Autorizados ({user.ccas.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.ccas.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Nenhum CCA autorizado</p>
                        ) : (
                          user.ccas.map((cca) => (
                            <Badge key={cca.id} variant="secondary">
                              {cca.codigo} - {cca.nome}
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
                Gerenciar CCAs - {selectedUser?.nome}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione os CCAs que o usuário pode acessar. O usuário só terá acesso
                aos dados dos CCAs selecionados.
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {ccas.map((cca) => (
                  <div key={cca.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      checked={selectedCCAs.includes(cca.id)}
                      onCheckedChange={() => toggleCCA(cca.id)}
                    />
                    <Label className="cursor-pointer flex-1" onClick={() => toggleCCA(cca.id)}>
                      <span className="font-medium">{cca.codigo}</span> - {cca.nome}
                    </Label>
                  </div>
                ))}
                {ccas.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum CCA cadastrado
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
                  disabled={updateUserCCAs.isPending}
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
