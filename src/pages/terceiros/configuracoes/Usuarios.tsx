
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Usuarios = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao@terceirizada.com",
      perfil: "Funcionário",
      empresa: "Empresa Terceirizada Ltda",
      status: "ativo"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@prestadora.com",
      perfil: "Gestor",
      empresa: "Prestadora de Serviços SA",
      status: "ativo"
    }
  ]);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    perfil: "",
    empresa: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = usuarios.length + 1;
    setUsuarios([...usuarios, { id, ...novoUsuario, status: "ativo" }]);
    setNovoUsuario({ nome: "", email: "", perfil: "", empresa: "" });
    toast({
      title: "Usuário cadastrado",
      description: "O usuário foi cadastrado com sucesso.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setNovoUsuario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema de terceiros
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novo Usuário</CardTitle>
            <CardDescription>
              Cadastre um novo usuário no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={novoUsuario.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Nome do usuário"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="usuario@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil *</Label>
                <Select value={novoUsuario.perfil} onValueChange={(value) => handleChange("perfil", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa *</Label>
                <Select value={novoUsuario.empresa} onValueChange={(value) => handleChange("empresa", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empresa1">Empresa Terceirizada Ltda</SelectItem>
                    <SelectItem value="empresa2">Prestadora de Serviços SA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Usuário
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Usuários Cadastrados
            </CardTitle>
            <CardDescription>
              Lista de usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{usuario.nome}</h4>
                    <Badge variant={usuario.status === 'ativo' ? 'default' : 'secondary'}>
                      {usuario.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Email: {usuario.email}</p>
                    <p>Perfil: {usuario.perfil}</p>
                    <p>Empresa: {usuario.empresa}</p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Usuarios;
