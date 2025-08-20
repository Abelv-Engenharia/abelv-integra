import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TarefaCard } from "@/components/tarefas/TarefaCard";
import { Tarefa } from "@/types/tarefas";
import { tarefasService } from "@/services/tarefasService";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const MinhasTarefas = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filteredTarefas, setFilteredTarefas] = useState<Tarefa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMinhasTarefas = async () => {
      try {
        console.log("=== MinhasTarefas: Iniciando busca ===");
        console.log("Usuário autenticado:", user?.id, user?.email);
        
        if (!user) {
          setDebugInfo("Usuário não autenticado");
          setLoading(false);
          return;
        }
        
        const data = await tarefasService.getMyTasks();
        console.log("=== MinhasTarefas: Resultado ===", data?.length || 0);
        console.log("Tarefas retornadas:", data);
        
        setTarefas(data);
        setFilteredTarefas(data);
        
        // Informações de debug detalhadas para o usuário
        if (data.length === 0) {
          setDebugInfo(`
            Nenhuma tarefa encontrada para o usuário ${user?.email}. 
            Detalhes técnicos:
            - User ID: ${user?.id}
            - Verifique se há tarefas na tabela 'tarefas' onde:
              • responsavel_id = '${user?.id}' OU
              • criado_por = '${user?.id}'
            - Verifique as políticas RLS da tabela 'tarefas'
          `);
        } else {
          const tarefasResponsavel = data.filter(t => t.responsavel.id === user?.id);
          const tarefasCriadas = data.filter(t => (t as any).criado_por === user?.id);
          
          setDebugInfo(`
            ${data.length} tarefa(s) encontrada(s):
            - ${tarefasResponsavel.length} como responsável
            - ${tarefasCriadas.length} criadas por você
            - User ID: ${user?.id}
          `);
        }
      } catch (error) {
        console.error("Erro ao carregar minhas tarefas:", error);
        setDebugInfo(`Erro ao carregar tarefas: ${error}`);
        toast({
          title: "Erro ao carregar tarefas",
          description: "Não foi possível carregar suas tarefas. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMinhasTarefas();
    }
  }, [user, toast]);

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
    console.log("Navegando para tarefa:", tarefa.id);
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
            Carregando suas tarefas...
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
        {debugInfo && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded border">
            <strong>Debug Info:</strong>
            <pre className="whitespace-pre-wrap mt-1">{debugInfo}</pre>
          </div>
        )}
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
            {tarefas.length === 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Tarefas aparecem aqui quando:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Você é definido como responsável por uma tarefa</li>
                  <li>Você criou uma tarefa</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  Se você acredita que deveria ver tarefas aqui, verifique com o administrador do sistema.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasTarefas;
