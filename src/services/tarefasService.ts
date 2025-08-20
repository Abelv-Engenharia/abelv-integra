
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

      // Primeiro, vamos buscar todas as tarefas para debug
      const { data: allTasks, error: allTasksError } = await supabase
        .from('tarefas')
        .select(`
          id,
          titulo,
          responsavel_id,
          criado_por,
          status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (allTasksError) {
        console.error("Erro ao buscar todas as tarefas para debug:", allTasksError);
      } else {
        console.log("=== DEBUG: Total de tarefas na base ===", allTasks?.length || 0);
        if (allTasks && allTasks.length > 0) {
          console.log("Primeiras 5 tarefas da base:", allTasks.slice(0, 5).map(t => ({
            id: t.id,
            titulo: t.titulo,
            responsavel_id: t.responsavel_id,
            criado_por: t.criado_por,
            eh_responsavel: t.responsavel_id === user.id,
            eh_criador: t.criado_por === user.id
          })));
          
          // Contar quantas tarefas o usuário deveria ver
          const minhasTarefasCount = allTasks.filter(t => 
            t.responsavel_id === user.id || t.criado_por === user.id
          ).length;
          console.log("Tarefas que o usuário deveria ver:", minhasTarefasCount);
        }
      }

      // Tentar a query principal com LEFT JOIN
      console.log("=== Tentando query principal com LEFT JOIN ===");
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          *,
          profiles!left(id, nome)
        `)
        .or(`responsavel_id.eq.${user.id},criado_por.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro na query principal:", error);
        console.error("Detalhes do erro:", JSON.stringify(error, null, 2));
        
        // Tentar query mais simples sem o JOIN
        console.log("=== Tentando query alternativa sem JOIN ===");
        const { data: simpleData, error: simpleError } = await supabase
          .from('tarefas')
          .select('*')
          .or(`responsavel_id.eq.${user.id},criado_por.eq.${user.id}`)
          .order('created_at', { ascending: false });
        
        if (simpleError) {
          console.error("Erro na query alternativa:", simpleError);
          return [];
        }
        
        console.log("Query alternativa funcionou! Tarefas encontradas:", simpleData?.length || 0);
        
        // Processar os dados sem o JOIN do profile
        return (simpleData || []).map(tarefa => ({
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
            nome: 'Usuário'
          },
          anexo: tarefa.anexo,
          status: tarefa.status as TarefaStatus,
          iniciada: tarefa.iniciada,
          configuracao: tarefa.configuracao as any
        }));
      }

      console.log("=== DEBUG: Resultado da query principal ===");
      console.log("Tarefas encontradas:", data?.length || 0);

      if (data && data.length > 0) {
        console.log("Detalhes das tarefas encontradas:");
        data.forEach((tarefa, index) => {
          console.log(`Tarefa ${index + 1}:`, {
            id: tarefa.id,
            titulo: tarefa.titulo,
            responsavel_id: tarefa.responsavel_id,
            criado_por: tarefa.criado_por,
            status: tarefa.status,
            eh_responsavel: tarefa.responsavel_id === user.id,
            eh_criador: tarefa.criado_por === user.id
          });
        });
      }

      return (data || []).map(tarefa => {
        return {
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
        };
      });
    } catch (error) {
      console.error("Exceção ao buscar minhas tarefas:", error);
      return [];
    }
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
