
import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EditarFuncionario = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Funcionário</CardTitle>
          <CardDescription>
            Editar dados do funcionário ID: {id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá editar os dados do funcionário.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarFuncionario;
