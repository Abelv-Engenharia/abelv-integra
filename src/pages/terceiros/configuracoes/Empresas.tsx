
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Empresas = () => {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState([
    {
      id: 1,
      nome: "Empresa Terceirizada Ltda",
      cnpj: "12.345.678/0001-90",
      email: "contato@terceirizada.com",
      telefone: "(11) 3333-4444",
      status: "ativa"
    },
    {
      id: 2,
      nome: "Prestadora de Serviços SA",
      cnpj: "98.765.432/0001-10",
      email: "admin@prestadora.com",
      telefone: "(11) 5555-6666",
      status: "ativa"
    }
  ]);

  const [novaEmpresa, setNovaEmpresa] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = empresas.length + 1;
    setEmpresas([...empresas, { id, ...novaEmpresa, status: "ativa" }]);
    setNovaEmpresa({ nome: "", cnpj: "", email: "", telefone: "" });
    toast({
      title: "Empresa cadastrada",
      description: "A empresa foi cadastrada com sucesso.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setNovaEmpresa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas terceirizadas
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nova Empresa</CardTitle>
            <CardDescription>
              Cadastre uma nova empresa terceirizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  value={novaEmpresa.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={novaEmpresa.cnpj}
                  onChange={(e) => handleChange("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={novaEmpresa.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novaEmpresa.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  placeholder="(00) 0000-0000"
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Empresa
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Empresas Cadastradas
            </CardTitle>
            <CardDescription>
              Lista de empresas terceirizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{empresa.nome}</h4>
                    <Badge variant={empresa.status === 'ativa' ? 'default' : 'secondary'}>
                      {empresa.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>CNPJ: {empresa.cnpj}</p>
                    <p>Email: {empresa.email}</p>
                    <p>Telefone: {empresa.telefone}</p>
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

export default Empresas;
