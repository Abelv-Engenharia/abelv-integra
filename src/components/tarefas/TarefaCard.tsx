
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Tarefa } from "@/types/tarefas";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TarefaCardProps {
  tarefa: Tarefa;
  onClick: (tarefa: Tarefa) => void;
}

const getStatusConfig = (status: Tarefa["status"]) => {
  switch (status) {
    case "concluida":
      return { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4 mr-1" /> };
    case "em-andamento":
      return { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-4 w-4 mr-1" /> };
    case "pendente":
      return { color: "bg-yellow-100 text-yellow-800", icon: <AlertCircle className="h-4 w-4 mr-1" /> };
    default:
      return { color: "bg-gray-100 text-gray-800", icon: <Clock className="h-4 w-4 mr-1" /> };
  }
};

const getCriticidadeConfig = (criticidade: Tarefa["configuracao"]["criticidade"]) => {
  switch (criticidade) {
    case "critica":
      return "bg-red-100 text-red-800";
    case "alta":
      return "bg-orange-100 text-orange-800";
    case "media":
      return "bg-yellow-100 text-yellow-800";
    case "baixa":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const TarefaCard: React.FC<TarefaCardProps> = ({ tarefa, onClick }) => {
  const statusConfig = getStatusConfig(tarefa.status);
  const dataLimite = new Date(tarefa.dataConclusao);
  const restante = formatDistanceToNow(dataLimite, { addSuffix: true, locale: ptBR });
  
  const handleClick = () => {
    onClick(tarefa);
  };
  
  return (
    <Card 
      className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <p className="font-medium text-sm text-muted-foreground">CCA: {tarefa.cca}</p>
          <h3 className="font-semibold truncate">{tarefa.descricao}</h3>
        </div>
        <Badge 
          variant="outline"
          className={`flex items-center ${statusConfig.color}`}
        >
          {statusConfig.icon} {tarefa.status.replace('-', ' ')}
        </Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{tarefa.descricao}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Badge variant="outline" className={getCriticidadeConfig(tarefa.configuracao.criticidade)}>
            {tarefa.configuracao.criticidade}
          </Badge>
          {tarefa.configuracao.recorrencia?.ativa && (
            <Badge variant="outline">Recorrente</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Prazo: {restante}</p>
      </CardFooter>
    </Card>
  );
};
