
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TarefaCard } from "@/components/tarefas/TarefaCard";
import { Tarefa } from "@/types/tarefas";
import { tarefasService } from "@/services/tarefasService";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MinhasTarefas = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filteredTarefas, setFilteredTarefas] = useState<Tarefa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMinhasTarefas = async () => {
      try {
        const data = await tarefasService.getMyTasks();
        setTarefas(data);
        setFilteredTarefas(data);
      } catch (error) {
        console.error("Erro ao carregar minhas tarefas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMinhasTarefas();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterTarefas(term, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterTarefas(searchTerm, value);
  };

  const filterTarefas = (term: string, status: string) => {
    let result = tarefas;
    if (term) {
      result = result.filter(tarefa => 
        tarefa.descricao.toLowerCase().includes(term) || 
        tarefa.cca.toLowerCase().includes(term)
      );
    }
    if (status !== "todas") {
      result = result.filter(tarefa => tarefa.status === status);
    }
    setFilteredTarefas(result);
  };

  const handleTarefaClick = (tarefa: Tarefa) => {
    navigate(`/tarefas/detalhe/${tarefa.id}`);
  };

  // Função de remover tarefa da lista após exclusão (efeito local + banco)
  const handleTarefaDelete = async (tarefa: Tarefa) => {
    setLoading(true);
    const sucesso = await tarefasService.deleteById(tarefa.id);
    setLoading(false);

    if (sucesso) {
      setTarefas(prev => prev.filter(t => t.id !== tarefa.id));
      setFilteredTarefas(prev => prev.filter(t => t.id !== tarefa.id));
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi removida com sucesso.",
        variant: "default"
      });
    } else {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a tarefa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          <p className="text-muted-foreground">
            Carregando suas tarefas atribuídas...
          </p>
        </div>
        <div className="flex justify-center items-center p-8">
          <p>Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie suas tarefas atribuídas ou criadas por você
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar tarefas..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        <Select defaultValue="todas" onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as tarefas</SelectItem>
            <SelectItem value="programada">Programadas</SelectItem>
            <SelectItem value="em-andamento">Em andamento</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="concluida">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTarefas.length > 0 ? (
          filteredTarefas.map((tarefa) => (
            <TarefaCard
              key={tarefa.id}
              tarefa={tarefa}
              onClick={handleTarefaClick}
              onDelete={handleTarefaDelete}
            />
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              {tarefas.length === 0 
                ? "Nenhuma tarefa encontrada para você." 
                : "Nenhuma tarefa corresponde aos filtros aplicados."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasTarefas;
