
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessCadastroTarefaCardProps {
  onNewTask: () => void;
  onGoToDashboard: () => void;
}

const SuccessCadastroTarefaCard: React.FC<SuccessCadastroTarefaCardProps> = ({
  onNewTask,
  onGoToDashboard
}) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Tarefa registrada com sucesso!
        </h3>
        <p className="text-gray-600 mb-4">
          O responsável foi notificado.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={onNewTask} className="w-full" variant="outline">
            Registrar nova tarefa
          </Button>
          <Button onClick={onGoToDashboard} className="w-full">
            Ir para dashboard de tarefas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessCadastroTarefaCard;

