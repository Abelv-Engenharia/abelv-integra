
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VincularDocumentosEmpresa = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Vincular Documentos à Empresa</CardTitle>
          <CardDescription>
            Configure quais documentos são obrigatórios para cada empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá vincular documentos às empresas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VincularDocumentosEmpresa;
