
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Documentos = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>
            Gerencie todos os documentos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá gerenciar todos os documentos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentos;
