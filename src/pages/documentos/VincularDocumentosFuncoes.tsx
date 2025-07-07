
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VincularDocumentosFuncoes = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Vincular Documentos às Funções</CardTitle>
          <CardDescription>
            Configure quais documentos são obrigatórios para cada função
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá vincular documentos às funções.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VincularDocumentosFuncoes;
