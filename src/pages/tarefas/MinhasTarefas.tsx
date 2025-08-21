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
          setDebugInfo("❌ Usuário não autenticado");
          setLoading(false);
          return;
        }
        
        setDebugInfo("⏳ Carregando tarefas...");
        const data = await tarefasService.getMyTasks();
        console.log("=== MinhasTarefas: Resultado final ===", data?.length || 0, data);
        
        setTarefas(data);
        setFilteredTarefas(data);
        
        if (data.length === 0) {
          setDebugInfo(`
❌ Nenhuma tarefa encontrada para ${user?.email}

Possíveis causas:
• Você não é responsável por nenhuma tarefa
• Você não criou nenhuma tarefa
• As políticas RLS podem estar restringindo o acesso
• Verifique se existem tarefas na tabela 'tarefas' onde:
  - responsavel_id = '${user?.id}' OU
  - criado_por = '${user?.id}'

🔧 User ID: ${user?.id}

Verificação das políticas RLS:
• A query utilizada: SELECT * FROM tarefas WHERE responsavel_id = '${user?.id}' OR criado_por = '${user?.id}'
• Verifique se há dados na tabela 'profiles' para o responsável
          `);
        } else {
          const tarefasResponsavel = data.filter(t => t.responsavel.id === user?.id);
          const tarefasCriadas = data.filter(t => (t as any).criado_por === user?.id);
          
          setDebugInfo(`
✅ ${data.length} tarefa(s) encontrada(s):
• ${tarefasResponsavel.length} como responsável
• ${tarefasCriadas.length} criadas por você
• User ID: ${user?.id}
• Email: ${user?.email}

📋 Tarefas encontradas:
${data.map((t, i) => `${i + 1}. ID: ${t.id.substring(0, 8)}... | Título: ${t.titulo || t.descricao.substring(0, 50)}... | Status: ${t.status}`).join('\n')}

🔍 Tipos de relacionamento:
${data.map((t, i) => {
  const isResponsavel = t.responsavel.id === user?.id;
  const isCriador = (t as any).criado_por === user?.id;
  return `${i + 1}. ${isResponsavel ? '👤 Responsável' : ''} ${isCriador ? '✍️ Criador' : ''}`;
}).join('\n')}
          `);
        }
      } catch (error) {
        console.error("Erro ao carregar minhas tarefas:", error);
        setDebugInfo(`❌ Erro ao carregar tarefas: ${error}`);
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
        tarefa.cca.toLowerCase().includes(term) ||
        (tarefa.titulo && tarefa.titulo.toLowerCase().includes(term))
      );
    }
    if (status !== "todas") {
      result = result.filter(tarefa => tarefa.status === status);
    }
    setFilteredTarefas(result);
  };

  const handleTarefaClick = (tarefa: Tarefa) => {
    console.log("=== handleTarefaClick: Clique na tarefa ===");
    console.log("Tarefa completa:", tarefa);
    console.log("ID da tarefa:", tarefa.id);
    console.log("Tipo do ID:", typeof tarefa.id);
    
    // Validar se o ID é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!tarefa.id || !uuidRegex.test(tarefa.id)) {
      console.error("ID da tarefa inválido:", tarefa.id);
      toast({
        title: "Erro",
        description: "ID da tarefa inválido. Não é possível navegar para os detalhes.",
        variant: "destructive"
      });
      return;
    }
    
    const url = `/tarefas/detalhe/${tarefa.id}`;
    console.log("Navegando para URL:", url);
    navigate(url);
  };

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-3">Carregando tarefas...</p>
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
          <div className="text-sm bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <strong className="text-blue-800 dark:text-blue-200">Debug Info:</strong>
            <pre className="whitespace-pre-wrap mt-2 text-blue-700 dark:text-blue-300 font-mono text-xs">{debugInfo}</pre>
          </div>
        )}
      </div>

      {!loading && tarefas.length > 0 && (
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
      )}

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
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-muted-foreground text-lg mb-4">
              {tarefas.length === 0 
                ? "Nenhuma tarefa encontrada para você." 
                : "Nenhuma tarefa corresponde aos filtros aplicados."
              }
            </p>
            {tarefas.length === 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                  <p className="font-medium mb-2">📋 Tarefas aparecem aqui quando:</p>
                  <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                    <li>Você é definido como responsável por uma tarefa</li>
                    <li>Você criou uma tarefa</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    💡 Se você acredita que deveria ver tarefas aqui, verifique os logs de debug acima ou consulte o administrador do sistema.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasTarefas;
