
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessExecucaoCardProps {
  onNewTraining: () => void;
  onGoToDashboard: () => void;
}

const SuccessExecucaoCard: React.FC<SuccessExecucaoCardProps> = ({ onNewTraining, onGoToDashboard }) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Treinamento registrado com sucesso!</h3>
        <p className="text-gray-600 mb-4">
          O treinamento foi salvo no sistema.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={onNewTraining} className="w-full" variant="outline">
            Registrar novo treinamento
          </Button>
          <Button onClick={onGoToDashboard} className="w-full">
            Ir para dashboard de treinamentos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessExecucaoCard;

