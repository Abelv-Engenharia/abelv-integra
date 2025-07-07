
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ListaFuncionarios = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
          <CardDescription>
            Aqui você pode visualizar e gerenciar todos os funcionários cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá visualizar a lista completa de funcionários.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaFuncionarios;
