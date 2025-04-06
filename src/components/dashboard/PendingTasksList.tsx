
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

interface PendingTasksListProps {
  title: string;
  tasks: Task[];
  onMarkComplete?: (taskId: string) => void;
}

const PendingTasksList = ({ title, tasks, onMarkComplete }: PendingTasksListProps) => {
  const pendingTasks = tasks.filter(task => task.status !== "completed");
  
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-amber-600 bg-amber-50";
      case "completed":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-progress":
        return "Em Andamento";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks.length > 0 ? (
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getPriorityStyles(task.priority)
                      )}
                    >
                      {task.priority === "high" && "Alta"}
                      {task.priority === "medium" && "Média"}
                      {task.priority === "low" && "Baixa"}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        getStatusStyles(task.status)
                      )}
                    >
                      {getStatusText(task.status)}
                    </span>
                  </div>
                  <p className="font-medium mt-1">{task.title}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Vencimento: {task.dueDate}</span>
                  </div>
                </div>
                {onMarkComplete && task.status !== "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => onMarkComplete(task.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    <span>Concluir</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Não há tarefas pendentes
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTasksList;
