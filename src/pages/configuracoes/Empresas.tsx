
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Empresas = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Empresas</CardTitle>
          <CardDescription>
            Gerencie as empresas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá gerenciar as empresas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
