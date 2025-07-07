
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MinhaDocumentacao = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Minha Documentação</CardTitle>
          <CardDescription>
            Visualize seus documentos pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá visualizar sua documentação pessoal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinhaDocumentacao;
