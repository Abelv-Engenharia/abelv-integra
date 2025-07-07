
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CadastroFuncionarios = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Funcionários</CardTitle>
          <CardDescription>
            Cadastre novos funcionários no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá cadastrar novos funcionários.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroFuncionarios;
