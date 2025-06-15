import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, Calendar } from "lucide-react";
import { Tarefa } from "@/types/tarefas";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
interface TarefaCardProps {
  tarefa: Tarefa;
  onClick: (tarefa: Tarefa) => void;
}
const getStatusConfig = (status: Tarefa["status"]) => {
  switch (status) {
    case "concluida":
      return {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-4 w-4 mr-1" />
      };
    case "em-andamento":
      return {
        color: "bg-blue-100 text-blue-800",
        icon: <Clock className="h-4 w-4 mr-1" />
      };
    case "pendente":
      return {
        color: "bg-yellow-100 text-yellow-800",
        icon: <AlertCircle className="h-4 w-4 mr-1" />
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: <Clock className="h-4 w-4 mr-1" />
      };
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
export const TarefaCard: React.FC<TarefaCardProps> = ({
  tarefa,
  onClick
}) => {
  const statusConfig = getStatusConfig(tarefa.status);
  const dataLimite = new Date(tarefa.dataConclusao);

  // NOVO: data de criação formatada
  const dataCriacaoFormatada = format(new Date(tarefa.dataCadastro), "dd/MM/yyyy", { locale: ptBR });
  // NOVO: data de conclusão formatada
  const dataConclusaoFormatada = format(new Date(tarefa.dataConclusao), "dd/MM/yyyy", { locale: ptBR });

  // Antigo: texto de prazo
  const restante = formatDistanceToNow(dataLimite, {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(tarefa)}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <p className="font-medium text-sm text-muted-foreground">CCA: {tarefa.cca}</p>
          {/* NOVO: Responsável e data de criação */}
          <div className="flex flex-col mt-1 gap-0.5">
            <span className="flex items-center text-xs text-muted-foreground">
              <User className="w-3 h-3 mr-1" />
              {tarefa.responsavel?.nome}
            </span>
            <span className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Criada em {dataCriacaoFormatada}
            </span>
          </div>
        </div>
        <Badge variant="outline" className={`flex items-center ${statusConfig.color}`}>
          {statusConfig.icon} {tarefa.status.replace('-', ' ')}
        </Badge>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Mostrar o TÍTULO no lugar da DESCRIÇÃO */}
        <p className="text-sm font-semibold text-primary line-clamp-2">
          {typeof tarefa.titulo === "string" && tarefa.titulo.trim().length > 0
            ? tarefa.titulo
            : "(Sem título)"}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Badge variant="outline" className={getCriticidadeConfig(tarefa.configuracao.criticidade)}>
            {tarefa.configuracao.criticidade}
          </Badge>
          {tarefa.configuracao.recorrencia?.ativa && <Badge variant="outline">Recorrente</Badge>}
        </div>
        {tarefa.status === "concluida"
          ? (
            <p className="text-xs text-muted-foreground flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
              Concluída em {dataConclusaoFormatada}
            </p>
          )
          : (
            <p className="text-xs text-muted-foreground">Prazo: {restante}</p>
          )
        }
      </CardFooter>
    </Card>
  );
};
