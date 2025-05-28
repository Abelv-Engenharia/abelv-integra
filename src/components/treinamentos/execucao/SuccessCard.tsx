
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SuccessCardProps {
  onNewTraining: () => void;
}

const SuccessCard: React.FC<SuccessCardProps> = ({ onNewTraining }) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Treinamento Cadastrado!</h3>
        <p className="text-gray-600 mb-4">
          O treinamento foi registrado com sucesso no sistema.
        </p>
        <Button onClick={onNewTraining} className="w-full">
          Cadastrar Novo Treinamento
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuccessCard;
