import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, Calendar, Trash } from "lucide-react";
import { Tarefa } from "@/types/tarefas";
import { formatDistanceToNow, format, differenceInCalendarDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface TarefaCardProps {
  tarefa: Tarefa;
  onClick: (tarefa: Tarefa) => void;
  onDelete?: (tarefa: Tarefa) => void;
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
  onClick,
  onDelete
}) => {
  const statusConfig = getStatusConfig(tarefa.status);

  // Preparar a data real de conclusão, se existir; se não, usar dataConclusao para manter retrocompatibilidade
  const dataRealConclusao = tarefa.data_real_conclusao
    ? new Date(tarefa.data_real_conclusao)
    : tarefa.status === "concluida"
      ? new Date(tarefa.dataConclusao)
      : null;

  const dataCriacaoFormatada = format(new Date(tarefa.dataCadastro), "dd/MM/yyyy", { locale: ptBR });
  const dataRealConclusaoFormatada = dataRealConclusao
    ? format(dataRealConclusao, "dd/MM/yyyy HH:mm", { locale: ptBR })
    : null;

  // Cálculo dos dias corridos entre cadastro e data real de conclusão
  let diasConclusao: number | null = null;
  if (tarefa.status === "concluida" && dataRealConclusao) {
    try {
      const inicio = new Date(tarefa.dataCadastro);
      diasConclusao = differenceInCalendarDays(dataRealConclusao, inicio);
    } catch {
      diasConclusao = null;
    }
  }

  // Texto prazo restante (se não concluída)
  const dataLimite = new Date(tarefa.dataConclusao);
  const restante = formatDistanceToNow(dataLimite, {
    addSuffix: true,
    locale: ptBR
  });

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer relative" onClick={() => onClick(tarefa)}>
      {onDelete && (
        <div className="absolute top-3 right-3 z-10">
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-red-100"
                onClick={e => {
                  e.stopPropagation();
                  setOpenDialog(true);
                }}
                title="Excluir tarefa"
              >
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={e => {
                    e.stopPropagation();
                    setOpenDialog(false);
                    onDelete(tarefa);
                  }}
                >
                  Excluir tarefa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <div>
          <p className="font-medium text-sm text-muted-foreground">CCA: {tarefa.cca}</p>
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
              {dataRealConclusaoFormatada
                ? (
                  <>
                    Concluída em {dataRealConclusaoFormatada}
                    {typeof diasConclusao === "number" && diasConclusao >= 0 && (
                      <span>{` (${diasConclusao} ${diasConclusao === 1 ? "dia" : "dias"} corridos)`}</span>
                    )}
                  </>
                )
                : "Data de conclusão não registrada"
              }
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
