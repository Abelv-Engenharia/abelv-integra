
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UsuariosConfig = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Usuários</CardTitle>
          <CardDescription>
            Gerencie os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá gerenciar os usuários.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosConfig;
