
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PerfisConfig = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Perfis</CardTitle>
          <CardDescription>
            Gerencie os perfis de acesso do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá gerenciar os perfis de acesso.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfisConfig;
