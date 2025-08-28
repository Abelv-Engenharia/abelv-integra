
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, Users, ClipboardList } from "lucide-react";

const AdminConfiguracoes = () => {
  return (
    <div className="container max-w-6xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Configurações (ADM)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Importação de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Importe funcionários via planilha Excel.</p>
            <Button asChild>
              <Link to="/admin/importacao-funcionarios">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" /> Importação de Execução de Treinamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Importe execuções em massa a partir de Excel.</p>
            <Button asChild>
              <Link to="/admin/importacao-execucao-treinamentos">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Cadastro de Checklists
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Crie e gerencie checklists de avaliação.</p>
            <Button asChild>
              <Link to="/admin/checklists">Abrir</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
