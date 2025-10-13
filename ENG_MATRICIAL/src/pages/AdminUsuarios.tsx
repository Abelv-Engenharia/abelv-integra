import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, UserX, UserCheck, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Usuario, Papel, Disciplina, mockUsuarios, getPapelLabel } from "@/lib/usuarios";

// Matriz de permissões
const permissoes = {
  "Acessar Relatórios (todos)": {
    EM: true,
    OBRA: false,
    CONTROLADORIA: true,
    ADMIN: true
  },
  "Abrir OS": {
    EM: true,
    OBRA: true,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Planejar OS (definir HH e Data)": {
    EM: true,
    OBRA: false,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Aceitar Planejamento": {
    EM: false,
    OBRA: true,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Entregar OS / Upload de anexos": {
    EM: true,
    OBRA: false,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Validar Entrega": {
    EM: false,
    OBRA: true,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Solicitar HH adicional": {
    EM: true,
    OBRA: false,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Aprovar HH adicional": {
    EM: false,
    OBRA: true,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Ver todas as OS": {
    EM: true,
    OBRA: false,
    CONTROLADORIA: true,
    ADMIN: true
  },
  "Ver OS da sua obra": {
    EM: true,
    OBRA: true,
    CONTROLADORIA: false,
    ADMIN: true
  },
  "Gestão de usuários": {
    EM: false,
    OBRA: false,
    CONTROLADORIA: false,
    ADMIN: true
  }
};

const getPapelBadge = (papel: Papel, cca?: string) => {
  const variants = {
    EM: "bg-blue-100 text-blue-800",
    OBRA: "bg-green-100 text-green-800", 
    CONTROLADORIA: "bg-yellow-100 text-yellow-800",
    ADMIN: "bg-purple-100 text-purple-800"
  };
  
  return (
    <Badge className={variants[papel]}>
      {getPapelLabel(papel, cca)}
    </Badge>
  );
};

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
    papel: "" as Papel | "",
    ativo: true,
    disciplinaPreferida: "" as Disciplina | "",
    cca: "",
    cliente: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("admin_usuarios", JSON.stringify(usuarios));
    } catch {}
  }, [usuarios]);

  const abrirFormulario = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEdicao(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        ativo: usuario.ativo,
        disciplinaPreferida: usuario.disciplinaPreferida || "",
        cca: usuario.cca || "",
        cliente: usuario.cliente || ""
      });
    } else {
      setUsuarioEdicao(null);
      setFormData({
        nome: "",
        email: "",
        papel: "",
        ativo: true,
        disciplinaPreferida: "",
        cca: "",
        cliente: ""
      });
    }
    setDialogAberto(true);
  };

  const salvarUsuario = () => {
    // Validações
    if (!formData.nome.trim()) {
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    if (!formData.email.trim()) {
      toast({ title: "Erro", description: "E-mail é obrigatório", variant: "destructive" });
      return;
    }
    if (!formData.papel) {
      toast({ title: "Erro", description: "Função é obrigatória", variant: "destructive" });
      return;
    }
    if (formData.papel === "OBRA" && (!formData.cca || !formData.cca.trim())) {
      toast({ title: "Erro", description: "CCA é obrigatório para solicitantes", variant: "destructive" });
      return;
    }
    if (formData.papel === "OBRA" && formData.cca && (!/^\d+$/.test(formData.cca) || parseInt(formData.cca) <= 0)) {
      toast({ title: "Erro", description: "CCA deve ser um número inteiro positivo", variant: "destructive" });
      return;
    }
    if (formData.papel === "OBRA" && (!formData.cliente || !formData.cliente.trim())) {
      toast({ title: "Erro", description: "Cliente é obrigatório para solicitantes", variant: "destructive" });
      return;
    }

    // Verificar email único
    const emailExiste = usuarios.some(u => 
      u.email.toLowerCase() === formData.email.toLowerCase() && 
      u.id !== usuarioEdicao?.id
    );
    if (emailExiste) {
      toast({ title: "Erro", description: "E-mail já está em uso", variant: "destructive" });
      return;
    }

    // Disciplina padrão para EM
    let disciplinaFinal = formData.disciplinaPreferida;
    if (formData.papel === "EM" && !disciplinaFinal) {
      disciplinaFinal = "AMBAS";
    }

    const agora = new Date().toISOString().split('T')[0];
    
    if (usuarioEdicao) {
      // Editar
      setUsuarios(prev => prev.map(u => 
        u.id === usuarioEdicao.id 
          ? {
              ...u,
              nome: formData.nome.trim(),
              email: formData.email.trim(),
            papel: formData.papel as Papel,
            ativo: formData.ativo,
            disciplinaPreferida: disciplinaFinal as Disciplina,
            cca: formData.papel === "OBRA" ? formData.cca.trim() : undefined,
            cliente: formData.papel === "OBRA" ? formData.cliente.trim() : undefined,
            atualizadoEm: agora
            }
          : u
      ));
      toast({ title: "Sucesso", description: "Usuário atualizado com sucesso" });
    } else {
      // Criar
      const novoId = (Math.max(0, ...usuarios.map(u => parseInt(u.id, 10))) + 1).toString();
      const novoUsuario: Usuario = {
        id: novoId,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        papel: formData.papel as Papel,
        ativo: formData.ativo,
        disciplinaPreferida: disciplinaFinal as Disciplina,
        cca: formData.papel === "OBRA" ? formData.cca.trim() : undefined,
        cliente: formData.papel === "OBRA" ? formData.cliente.trim() : undefined,
        criadoEm: agora,
        atualizadoEm: agora
      };
      setUsuarios(prev => [...prev, novoUsuario]);
      toast({ title: "Sucesso", description: "Usuário criado com sucesso" });
    }

    setDialogAberto(false);
  };

  const toggleAtivo = (id: string) => {
    const usuario = usuarios.find(u => u.id === id);
    const novoStatus = !usuario?.ativo;
    
    setUsuarios(prev => prev.map(u => 
      u.id === id ? { ...u, ativo: novoStatus, atualizadoEm: new Date().toISOString().split('T')[0] } : u
    ));
    
    toast({ 
      title: "Sucesso", 
      description: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso` 
    });
  };

  const enviarMagicLink = (email: string) => {
    toast({ title: "Magic Link", description: `Link de acesso enviado para ${email}` });
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
              <DialogTitle>
                {usuarioEdicao ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className={!formData.nome.trim() ? "border-red-500" : ""}
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={!formData.email.trim() ? "border-red-500" : ""}
                    placeholder="usuario@empresa.com"
                  />
                </div>

                <div>
                  <Label htmlFor="papel">Função *</Label>
                  <Select 
                    value={formData.papel} 
                    onValueChange={(value: Papel) => setFormData(prev => ({ ...prev, papel: value }))}
                  >
                    <SelectTrigger className={!formData.papel ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="EM">Engenharia Matricial (EM)</SelectItem>
                      <SelectItem value="OBRA">Solicitante (Obra)</SelectItem>
                      <SelectItem value="CONTROLADORIA">Controladoria</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.papel === "EM" && (
                  <div>
                    <Label htmlFor="disciplina">Disciplina Preferida</Label>
                    <Select 
                      value={formData.disciplinaPreferida} 
                      onValueChange={(value: Disciplina) => setFormData(prev => ({ ...prev, disciplinaPreferida: value }))}
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
                    <p className="text-sm text-muted-foreground mt-1">
                      Se não informado, será definido como "Ambas"
                    </p>
                  </div>
                )}

                {formData.papel === "OBRA" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cca" className={!formData.cca ? "text-destructive" : ""}>
                        Número do CCA *
                      </Label>
                      <Input
                        id="cca"
                        type="number"
                        placeholder="Ex: 12345"
                        value={formData.cca}
                        onChange={(e) => setFormData(prev => ({ ...prev, cca: e.target.value }))}
                        className={!formData.cca ? "border-destructive" : ""}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cliente" className={!formData.cliente ? "text-destructive" : ""}>
                        Nome do Cliente *
                      </Label>
                      <Input
                        id="cliente"
                        placeholder="Ex: Brainfarma"
                        value={formData.cliente}
                        onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                        className={!formData.cliente ? "border-destructive" : ""}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: !!checked }))}
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

              {/* Resumo de Permissões */}
              {formData.papel && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Permissões - {getPapelLabel(formData.papel as Papel)}
                  </h3>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {Object.entries(permissoes).map(([acao, perms]) => (
                          <div key={acao} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <span className="text-sm">{acao}</span>
                            <Badge variant={perms[formData.papel as Papel] ? "default" : "secondary"}>
                              {perms[formData.papel as Papel] ? "Sim" : "Não"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {formData.papel === "OBRA" && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Observação:</strong> Solicitantes podem aceitar planejamentos, validar entregas e aprovar HH adicional apenas das OS da sua obra.
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                  <TableHead>Função</TableHead>
                  <TableHead>Cliente/CCA</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{getPapelBadge(usuario.papel, usuario.cca)}</TableCell>
                    <TableCell>
                      {usuario.papel === "OBRA" && usuario.cliente && usuario.cca ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{usuario.cliente}</span>
                          <span className="text-xs text-muted-foreground">CCA {usuario.cca}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {usuario.disciplinaPreferida && (
                        <Badge variant="outline">{usuario.disciplinaPreferida}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={usuario.ativo ? "default" : "secondary"}>
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(usuario.atualizadoEm).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirFormulario(usuario)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAtivo(usuario.id)}
                          title={usuario.ativo ? "Desativar" : "Ativar"}
                        >
                          {usuario.ativo ? (
                            <UserX className="h-4 w-4 text-red-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => enviarMagicLink(usuario.email)}
                          title="Enviar Magic Link"
                        >
                          <Mail className="h-4 w-4 text-blue-600" />
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

      {/* Resumo de Permissões Completo */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões Completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">Permissão / Ação</TableHead>
                  <TableHead className="text-center">EM</TableHead>
                  <TableHead className="text-center">Solicitante (OBRA)</TableHead>
                  <TableHead className="text-center">Controladoria</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(permissoes).map(([acao, perms]) => (
                  <TableRow key={acao}>
                    <TableCell className="font-medium">{acao}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={perms.EM ? "default" : "secondary"}>
                        {perms.EM ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={perms.OBRA ? "default" : "secondary"}>
                        {perms.OBRA ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={perms.CONTROLADORIA ? "default" : "secondary"}>
                        {perms.CONTROLADORIA ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={perms.ADMIN ? "default" : "secondary"}>
                        {perms.ADMIN ? "Sim" : "Não"}
                      </Badge>
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