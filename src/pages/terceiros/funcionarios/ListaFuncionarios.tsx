
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

const ListaFuncionarios = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários Terceirizados</h1>
          <p className="text-muted-foreground">
            Gerencie os funcionários de empresas terceirizadas
          </p>
        </div>
        <Button asChild>
          <Link to="/terceiros/funcionarios/cadastro">
            <Plus className="h-4 w-4 mr-2" />
            Novo Funcionário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Funcionários</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar funcionários específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, matrícula ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Lista de Funcionários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Nenhum funcionário cadastrado</p>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando o primeiro funcionário terceirizado
            </p>
            <Button asChild>
              <Link to="/terceiros/funcionarios/cadastro">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Funcionário
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaFuncionarios;
