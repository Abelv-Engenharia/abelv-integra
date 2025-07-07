
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Perfis = () => {
  const { toast } = useToast();
  const [perfis, setPerfis] = useState([
    {
      id: 1,
      nome: "Funcionário",
      descricao: "Perfil básico para funcionários terceirizados",
      permissoes: ["visualizar_documentos", "editar_perfil"]
    },
    {
      id: 2,
      nome: "Gestor",
      descricao: "Perfil para gestores de empresas terceirizadas",
      permissoes: ["visualizar_documentos", "editar_funcionarios", "gerar_relatorios"]
    },
    {
      id: 3,
      nome: "Administrador",
      descricao: "Perfil com acesso total ao sistema",
      permissoes: ["todas_permissoes"]
    }
  ]);

  const [novoPerfil, setNovoPerfil] = useState({
    nome: "",
    descricao: "",
    permissoes: [] as string[]
  });

  const permissoesDisponiveis = [
    { id: "visualizar_documentos", nome: "Visualizar Documentos" },
    { id: "editar_perfil", nome: "Editar Perfil Próprio" },
    { id: "editar_funcionarios", nome: "Editar Funcionários" },
    { id: "gerar_relatorios", nome: "Gerar Relatórios" },
    { id: "gerenciar_empresas", nome: "Gerenciar Empresas" },
    { id: "gerenciar_usuarios", nome: "Gerenciar Usuários" },
    { id: "configurar_sistema", nome: "Configurar Sistema" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = perfis.length + 1;
    setPerfis([...perfis, { id, ...novoPerfil }]);
    setNovoPerfil({ nome: "", descricao: "", permissoes: [] });
    toast({
      title: "Perfil cadastrado",
      description: "O perfil foi cadastrado com sucesso.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setNovoPerfil(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissaoChange = (permissaoId: string, checked: boolean) => {
    setNovoPerfil(prev => ({
      ...prev,
      permissoes: checked 
        ? [...prev.permissoes, permissaoId]
        : prev.permissoes.filter(p => p !== permissaoId)
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Perfis</h1>
          <p className="text-muted-foreground">
            Configure os perfis de acesso do sistema
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novo Perfil</CardTitle>
            <CardDescription>
              Crie um novo perfil de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Perfil *</Label>
                <Input
                  id="nome"
                  value={novoPerfil.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Nome do perfil"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoPerfil.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  placeholder="Descrição do perfil..."
                />
              </div>

              <div className="space-y-4">
                <Label>Permissões</Label>
                <div className="space-y-3">
                  {permissoesDisponiveis.map((permissao) => (
                    <div key={permissao.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`perm-${permissao.id}`}
                        checked={novoPerfil.permissoes.includes(permissao.id)}
                        onCheckedChange={(checked) => 
                          handlePermissaoChange(permissao.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`perm-${permissao.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permissao.nome}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Perfis Cadastrados
            </CardTitle>
            <CardDescription>
              Lista de perfis de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {perfis.map((perfil) => (
                <div key={perfil.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{perfil.nome}</h4>
                    <Badge variant="outline">
                      {perfil.permissoes.length} permissões
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {perfil.descricao}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {perfil.permissoes.slice(0, 3).map((perm, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {permissoesDisponiveis.find(p => p.id === perm)?.nome || perm}
                      </span>
                    ))}
                    {perfil.permissoes.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        +{perfil.permissoes.length - 3} mais
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
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

export default Perfis;
