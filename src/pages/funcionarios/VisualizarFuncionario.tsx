
import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VisualizarFuncionario = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Visualizar Funcionário</CardTitle>
          <CardDescription>
            Detalhes do funcionário ID: {id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página está sendo implementada. Em breve você poderá visualizar os detalhes completos do funcionário.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizarFuncionario;
