import { supabase } from "@/integrations/supabase/client";
import { Tarefa, TarefaStatus, TarefaCriticidade } from "@/types/tarefas";

export interface TarefaFormData {
  titulo?: string;
  cca_id: number;
  data_conclusao: string;
  descricao: string;
  responsavel_id: string;
  configuracao: {
    criticidade: "baixa" | "media" | "alta" | "critica";
    requerValidacao: boolean;
    notificarUsuario: boolean;
    recorrencia?: {
      ativa?: boolean;
      frequencia?: "diaria" | "semanal" | "mensal" | "trimestral" | "semestral" | "anual";
    };
  };
}

export interface TarefaUpdateData {
  status?: TarefaStatus;
  iniciada?: boolean;
  anexo?: string;
  data_real_conclusao?: string | null;
  observacoes_progresso?: string;
  observacoes_reprovacao?: string;
}

export const tarefasService = {
  async getById(id: string): Promise<Tarefa | null> {
    try {
      console.log("=== getById: Buscando tarefa com ID ===", id);
      
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          *,
          profiles!tarefas_responsavel_id_fkey(id, nome)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Erro ao buscar tarefa por ID:", error);
        return null;
      }

      if (!data) {
        console.log("Nenhuma tarefa encontrada com ID:", id);
        return null;
      }

      console.log("Tarefa encontrada:", data);

      return {
        id: data.id,
        cca: data.cca,
        tipoCca: 'linha-inteira' as const,
        dataCadastro: data.data_cadastro,
        dataConclusao: data.data_conclusao,
        data_real_conclusao: data.data_real_conclusao ?? null,
        descricao: data.descricao,
        titulo: data.titulo ?? "",
        responsavel: {
          id: data.responsavel_id || '',
          nome: data.profiles?.nome || 'Não atribuído'
        },
        anexo: data.anexo,
        status: data.status as TarefaStatus,
        iniciada: data.iniciada,
        configuracao: data.configuracao as any
      };
    } catch (error) {
      console.error("Exceção ao buscar tarefa por ID:", error);
      return null;
    }
  },

  async updateStatus(id: string, updateData: TarefaUpdateData): Promise<boolean> {
    try {
      console.log("Atualizando tarefa:", id, updateData);

      // Se a tarefa está sendo marcada como "concluída", registrar data_real_conclusao se não enviada
      let patch = { ...updateData };
      if (
        updateData.status === "concluida" &&
        typeof updateData.data_real_conclusao === "undefined"
      ) {
        patch.data_real_conclusao = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tarefas')
        .update(patch)
        .eq('id', id);

      if (error) {
        console.error("Erro ao atualizar tarefa:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao atualizar tarefa:", error);
      return false;
    }
  },

  async getAll(): Promise<Tarefa[]> {
    try {
      console.log("=== getAll: Buscando todas as tarefas ===");
      
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          *,
          profiles!tarefas_responsavel_id_fkey(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar tarefas:", error);
        return [];
      }

      console.log("Total de tarefas encontradas:", data?.length || 0);

      return (data || []).map(tarefa => ({
        id: tarefa.id,
        cca: tarefa.cca,
        tipoCca: 'linha-inteira' as const,
        dataCadastro: tarefa.data_cadastro,
        dataConclusao: tarefa.data_conclusao,
        data_real_conclusao: tarefa.data_real_conclusao ?? null,
        descricao: tarefa.descricao,
        titulo: tarefa.titulo ?? "",
        responsavel: {
          id: tarefa.responsavel_id || '',
          nome: tarefa.profiles?.nome || 'Não atribuído'
        },
        anexo: tarefa.anexo,
        status: tarefa.status as TarefaStatus,
        iniciada: tarefa.iniciada,
        configuracao: tarefa.configuracao as any
      }));
    } catch (error) {
      console.error("Exceção ao buscar tarefas:", error);
      return [];
    }
  },

  async getMyTasks(): Promise<Tarefa[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Usuário não autenticado");
        return [];
      }

      console.log("=== DEBUG: Buscando tarefas para o usuário ===");
      console.log("User ID:", user.id);
      console.log("User email:", user.email);

      // Buscar todas as tarefas do usuário em uma única query com LEFT JOIN
      console.log("=== Buscando todas as minhas tarefas ===");
      const { data: minhasTarefas, error: errorMinhasTarefas } = await supabase
        .from('tarefas')
        .select(`
          *,
          profiles!tarefas_responsavel_id_fkey(id, nome)
        `)
        .or(`responsavel_id.eq.${user.id},criado_por.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (errorMinhasTarefas) {
        console.error("Erro ao buscar minhas tarefas:", errorMinhasTarefas);
        
        // Fallback: tentar buscar apenas como responsável
        console.log("=== FALLBACK: Buscando apenas como responsável ===");
        const { data: tarefasResponsavel, error: errorFallback } = await supabase
          .from('tarefas')
          .select(`
            *,
            profiles!tarefas_responsavel_id_fkey(id, nome)
          `)
          .eq('responsavel_id', user.id)
          .order('created_at', { ascending: false });

        if (errorFallback) {
          console.error("Erro no fallback:", errorFallback);
          return [];
        }

        console.log("Fallback executado com sucesso:", tarefasResponsavel?.length || 0, "tarefas");
        return this.mapTarefasData(tarefasResponsavel || []);
      }

      console.log("=== Resultado da query principal ===");
      console.log("Total de tarefas encontradas:", minhasTarefas?.length || 0);

      if (!minhasTarefas || minhasTarefas.length === 0) {
        console.log("=== QUERY DE DEBUG: Verificando estrutura da tabela ===");
        const { data: sampleData, error: sampleError } = await supabase
          .from('tarefas')
          .select('id, titulo, responsavel_id, criado_por, status, created_at')
          .limit(5);
        
        console.log("=== DEBUG: Amostra da tabela tarefas ===");
        console.log("Total de tarefas na base:", sampleData?.length || 0);
        if (sampleData && sampleData.length > 0) {
          console.log("Estrutura das tarefas encontradas:");
          sampleData.forEach((task, index) => {
            console.log(`Tarefa ${index + 1}:`, {
              id: task.id,
              titulo: task.titulo,
              responsavel_id: task.responsavel_id,
              criado_por: task.criado_por,
              status: task.status,
              eh_minha_responsavel: task.responsavel_id === user.id,
              eh_minha_criada: task.criado_por === user.id
            });
          });
        } else {
          console.log("Nenhuma tarefa encontrada na tabela tarefas");
        }
        
        return [];
      }

      return this.mapTarefasData(minhasTarefas);
    } catch (error) {
      console.error("Exceção ao buscar minhas tarefas:", error);
      return [];
    }
  },

  mapTarefasData(tarefasData: any[]): Tarefa[] {
    return tarefasData.map(tarefa => {
      console.log(`=== Mapeando tarefa ${tarefa.id} ===`);
      console.log("Dados brutos da tarefa:", tarefa);
      
      const tarefaMapeada = {
        id: tarefa.id,
        cca: tarefa.cca,
        tipoCca: 'linha-inteira' as const,
        dataCadastro: tarefa.data_cadastro,
        dataConclusao: tarefa.data_conclusao,
        data_real_conclusao: tarefa.data_real_conclusao ?? null,
        descricao: tarefa.descricao,
        titulo: tarefa.titulo ?? "",
        responsavel: {
          id: tarefa.responsavel_id || '',
          nome: tarefa.profiles?.nome || 'Não atribuído'
        },
        anexo: tarefa.anexo,
        status: tarefa.status as TarefaStatus,
        iniciada: tarefa.iniciada,
        observacoes_progresso: tarefa.observacoes_progresso,
        configuracao: tarefa.configuracao as any
      };
      
      console.log("Tarefa mapeada:", tarefaMapeada);
      console.log("ID da tarefa mapeada:", tarefaMapeada.id, "Tipo:", typeof tarefaMapeada.id);
      
      return tarefaMapeada;
    });
  },

  async create(dadosTarefa: TarefaFormData): Promise<boolean> {
    try {
      console.log("Criando tarefa:", dadosTarefa);

      // Validar campos obrigatórios
      if (
        !dadosTarefa.titulo ||
        !dadosTarefa.cca_id ||
        !dadosTarefa.data_conclusao ||
        !dadosTarefa.descricao ||
        !dadosTarefa.responsavel_id
      ) {
        console.error("Campos obrigatórios não preenchidos:", dadosTarefa);
        return false;
      }

      // Buscar CCA para obter código e nome
      const { data: ccaData, error: ccaError } = await supabase
        .from('ccas')
        .select('codigo, nome')
        .eq('id', dadosTarefa.cca_id)
        .single();

      if (ccaError || !ccaData) {
        console.error("Erro ao buscar CCA:", ccaError);
        return false;
      }

      // Obter usuário atual para definir como criador
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("Usuário não autenticado");
        return false;
      }

      const { error } = await supabase
        .from('tarefas')
        .insert({
          titulo: dadosTarefa.titulo,
          cca: `${ccaData.codigo} - ${ccaData.nome}`,
          tipo_cca: 'linha-inteira',
          data_conclusao: dadosTarefa.data_conclusao,
          descricao: dadosTarefa.descricao,
          responsavel_id: dadosTarefa.responsavel_id,
          criado_por: user.id,
          status: 'programada',
          iniciada: false,
          configuracao: dadosTarefa.configuracao
        });

      if (error) {
        console.error("Erro ao criar tarefa:", error);
        return false;
      }

      console.log("Tarefa criada com sucesso");
      return true;
    } catch (error) {
      console.error("Exceção ao criar tarefa:", error);
      return false;
    }
  },

  async getRecentTasks(limit: number = 5): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          *,
          profiles!tarefas_responsavel_id_fkey(id, nome)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar tarefas recentes:", error);
        return [];
      }

      return (data || []).map(tarefa => {
        const config = tarefa.configuracao as any;
        return {
          id: tarefa.id,
          descricao: tarefa.descricao,
          responsavel: {
            id: tarefa.responsavel_id || '',
            nome: tarefa.profiles?.nome || 'Não atribuído'
          },
          dataConclusao: new Date(tarefa.data_conclusao),
          status: tarefa.status,
          criticidade: config?.criticidade || 'media'
        };
      });
    } catch (error) {
      console.error("Exceção ao buscar tarefas recentes:", error);
      return [];
    }
  },

  async getStats() {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .select('status');

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return {
          concluidas: 0,
          emAndamento: 0,
          pendentes: 0,
          programadas: 0
        };
      }

      const stats = {
        concluidas: 0,
        emAndamento: 0,
        pendentes: 0,
        programadas: 0
      };

      data?.forEach(tarefa => {
        switch (tarefa.status) {
          case 'concluida':
            stats.concluidas++;
            break;
          case 'em-andamento':
            stats.emAndamento++;
            break;
          case 'pendente':
            stats.pendentes++;
            break;
          case 'programada':
            stats.programadas++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error("Exceção ao buscar estatísticas:", error);
      return {
        concluidas: 0,
        emAndamento: 0,
        pendentes: 0,
        programadas: 0
      };
    }
  },

  async deleteById(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao excluir tarefa:", error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Exceção ao excluir tarefa:", error);
      return false;
    }
  }
};
