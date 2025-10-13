import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, UserX, UserCheck, Mail, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Usuario, Disciplina, mockUsuarios } from "@/lib/engenharia-matricial/usuarios";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    try {
      const saved = localStorage.getItem("admin_usuarios");
      return saved ? (JSON.parse(saved) as Usuario[]) : mockUsuarios;
    } catch {
      return mockUsuarios;
    }
  });
  const [dialogAberto, setDialogAberto] = useState(false);
  const [usuarioEdicao, setUsuarioEdicao] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    ativo: true,
    disciplinaPreferida: "" as Disciplina | "",
    papel: "" as "EM" | "OBRA" | "CONTROLADORIA" | "ADMIN" | "",
  });
  const { toast } = useToast();

  // Buscar usuários ativos do Supabase
  const { data: usuariosSupabase } = useQuery({
    queryKey: ["usuarios-supabase-ativos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, nome, email").order("nome");

      if (error) throw error;
      return data || [];
    },
  });

  const abrirFormulario = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEdicao(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        ativo: usuario.ativo,
        disciplinaPreferida: usuario.disciplinaPreferida || "",
        papel: usuario.papel || "",
      });
    } else {
      setUsuarioEdicao(null);
      setFormData({
        nome: "",
        email: "",
        ativo: true,
        disciplinaPreferida: "",
        papel: "",
      });
    }
    setDialogAberto(true);
  };

  const salvarUsuario = () => {
    // Validações
    if (!formData.email.trim()) {
      toast({ title: "Erro", description: "E-mail é obrigatório", variant: "destructive" });
      return;
    }

    // Verificar email único
    const emailExiste = usuarios.some(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== usuarioEdicao?.id,
    );

    // Disciplina padrão para EM
    let disciplinaFinal = formData.disciplinaPreferida;
    if (formData.papel === "EM" && !disciplinaFinal) {
      disciplinaFinal = "AMBAS";
    }

    const agora = new Date().toISOString().split("T")[0];

    if (usuarioEdicao) {
      // Editar
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioEdicao.id
            ? {
                ...u,
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                ativo: formData.ativo,
                disciplinaPreferida: disciplinaFinal as Disciplina,
              }
            : u,
        ),
      );
      toast({ title: "Sucesso", description: "Usuário atualizado com sucesso" });
    } else {
      // Criar
      const novoId = (Math.max(0, ...usuarios.map((u) => parseInt(u.id, 10))) + 1).toString();
      const novoUsuario: Usuario = {
        id: novoId,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        ativo: formData.ativo,
        disciplinaPreferida: disciplinaFinal as Disciplina,
      };
      setUsuarios((prev) => [...prev, novoUsuario]);
      toast({ title: "Sucesso", description: "Usuário criado com sucesso" });
    }

    setDialogAberto(false);
  };

  const toggleAtivo = (id: string) => {
    const usuario = usuarios.find((u) => u.id === id);
    const novoStatus = !usuario?.ativo;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, ativo: novoStatus, atualizadoEm: new Date().toISOString().split("T")[0] } : u,
      ),
    );

    toast({
      title: "Sucesso",
      description: `Usuário ${novoStatus ? "ativado" : "desativado"} com sucesso`,
    });
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
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Select
                  value={formData.email}
                  onValueChange={(value) => {
                    const usuarioSelecionado = usuariosSupabase?.find((u) => u.email === value);
                    setFormData((prev) => ({
                      ...prev,
                      email: value,
                      nome: usuarioSelecionado?.nome || "",
                    }));
                  }}
                >
                  <SelectTrigger className={!formData.email ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o e-mail" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {usuariosSupabase?.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.email}>
                        {usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  readOnly
                  className="bg-muted"
                  placeholder="Será preenchido automaticamente"
                />
              </div>

              <div>
                <Label htmlFor="disciplina">Disciplina Preferida</Label>
                <Select
                  value={formData.disciplinaPreferida}
                  onValueChange={(value: Disciplina) =>
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
                <Button onClick={salvarUsuario} className="flex-1">
                  {usuarioEdicao ? "Atualizar" : "Criar"}
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
                      {usuario.disciplinaPreferida && <Badge variant="outline">{usuario.disciplinaPreferida}</Badge>}
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
