
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CadastroDocumentos = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Documentos</CardTitle>
          <CardDescription>
            Configure os tipos de documentos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá cadastrar novos tipos de documentos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroDocumentos;
