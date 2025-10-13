import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  useUsuariosEngenhariaMatricial,
  type DisciplinaEngenhariaMatricial,
  type UsuarioEngenhariaMatricial,
} from "@/hooks/useUsuariosEngenhariaMatricial";

export default function AdminUsuarios() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [usuarioEdicao, setUsuarioEdicao] = useState<UsuarioEngenhariaMatricial | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    ativo: true,
    disciplinaPreferida: "" as DisciplinaEngenhariaMatricial | "",
  });
  const { toast } = useToast();

  const {
    usuarios,
    isLoading,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    isCreating,
    isUpdating,
  } = useUsuariosEngenhariaMatricial();

  // Buscar todos os usuários do sistema (profiles) para seleção
  const { data: usuariosDisponiveis } = useQuery({
    queryKey: ["usuarios-sistema-disponiveis"],
    queryFn: async () => {
      // Buscar todos os profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .order("nome");

      if (profilesError) throw profilesError;

      // Buscar usuários já cadastrados na engenharia matricial
      const { data: usuariosExistentes, error: existentesError } = await supabase
        .from("usuarios_engenharia_matricial")
        .select("usuario_id");

      if (existentesError) throw existentesError;

      const idsExistentes = new Set(usuariosExistentes?.map((u) => u.usuario_id) || []);

      // Filtrar apenas usuários que ainda não estão cadastrados
      return (profiles || []).filter((p) => !idsExistentes.has(p.id));
    },
  });

  const abrirFormulario = (usuario?: UsuarioEngenhariaMatricial) => {
    if (usuario) {
      setUsuarioEdicao(usuario);
      setFormData({
        email: usuario.email,
        ativo: usuario.ativo,
        disciplinaPreferida: usuario.disciplina_preferida || "",
      });
    } else {
      setUsuarioEdicao(null);
      setFormData({
        email: "",
        ativo: true,
        disciplinaPreferida: "",
      });
    }
    setDialogAberto(true);
  };

  const salvarUsuario = async () => {
    // Validações
    if (!formData.email.trim()) {
      toast({ title: "Erro", description: "E-mail é obrigatório", variant: "destructive" });
      return;
    }

    // Disciplina padrão
    const disciplinaFinal = (formData.disciplinaPreferida || "AMBAS") as DisciplinaEngenhariaMatricial;

    try {
      if (usuarioEdicao) {
        // Atualizar usuário existente
        await atualizarUsuario({
          id: usuarioEdicao.id,
          disciplina_preferida: disciplinaFinal,
          ativo: formData.ativo,
        });
      } else {
        // Buscar o usuario_id pelo email selecionado
        const usuarioSelecionado = usuariosDisponiveis?.find((u) => u.email === formData.email);
        
        if (!usuarioSelecionado) {
          toast({ title: "Erro", description: "Usuário não encontrado", variant: "destructive" });
          return;
        }

        // Criar novo usuário
        await criarUsuario({
          usuario_id: usuarioSelecionado.id,
          disciplina_preferida: disciplinaFinal,
          ativo: formData.ativo,
        });
      }

      setDialogAberto(false);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const removerUsuario = async (id: string) => {
    if (window.confirm("Deseja realmente remover este usuário do módulo de Engenharia Matricial?")) {
      try {
        await deletarUsuario(id);
      } catch (error) {
        console.error("Erro ao remover usuário:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Cadastro e gerenciamento de usuários do sistema</p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirFormulario()} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{usuarioEdicao ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Formulário */}
              {!usuarioEdicao && (
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Select
                    value={formData.email}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        email: value,
                      }));
                    }}
                  >
                    <SelectTrigger className={!formData.email ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o usuário" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {usuariosDisponiveis?.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.email}>
                          {usuario.nome} ({usuario.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {usuarioEdicao && (
                <div className="space-y-2">
                  <div>
                    <Label>Nome</Label>
                    <div className="p-2 bg-muted rounded-md text-sm">{usuarioEdicao.nome}</div>
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <div className="p-2 bg-muted rounded-md text-sm">{usuarioEdicao.email}</div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="disciplina">Disciplina Preferida</Label>
                <Select
                  value={formData.disciplinaPreferida}
                  onValueChange={(value: DisciplinaEngenhariaMatricial) =>
                    setFormData((prev) => ({ ...prev, disciplinaPreferida: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="ELETRICA">Elétrica</SelectItem>
                    <SelectItem value="MECANICA">Mecânica</SelectItem>
                    <SelectItem value="AMBAS">Ambas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">Se não informado, será definido como "Ambas"</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ativo: !!checked }))}
                />
                <Label htmlFor="ativo">Usuário ativo</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={salvarUsuario} 
                  className="flex-1"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? "Salvando..." : usuarioEdicao ? "Atualizar" : "Criar"}
                </Button>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando usuários...</div>
          ) : usuarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário cadastrado ainda
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {usuario.disciplina_preferida === "ELETRICA"
                            ? "Elétrica"
                            : usuario.disciplina_preferida === "MECANICA"
                            ? "Mecânica"
                            : "Ambas"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.ativo ? "default" : "secondary"}>
                          {usuario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => abrirFormulario(usuario)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removerUsuario(usuario.id)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
