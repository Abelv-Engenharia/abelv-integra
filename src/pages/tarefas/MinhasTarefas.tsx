
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TarefaCard } from "@/components/tarefas/TarefaCard";
import { Tarefa } from "@/types/tarefas";
import { mockTarefas } from "@/utils/tarefasUtils";
import { Search } from "lucide-react";

const MinhasTarefas = () => {
  const [filteredTarefas, setFilteredTarefas] = useState<Tarefa[]>(mockTarefas);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const navigate = useNavigate();

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
    let result = mockTarefas;
    
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
    navigate(`/tarefas/detalhes/${tarefa.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie suas tarefas atribuídas
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
            />
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasTarefas;
