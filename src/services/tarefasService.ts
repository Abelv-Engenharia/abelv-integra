
import { supabase } from "@/integrations/supabase/client";
import { Tarefa } from "@/types/tarefas";

export interface TarefaFormData {
  cca_id: number;
  data_conclusao: string;
  descricao: string;
  responsavel_id: string;
  configuracao: {
    criticidade: string;
    requerValidacao: boolean;
    notificarUsuario: boolean;
    recorrencia?: {
      ativa: boolean;
      frequencia?: string;
    };
  };
}

export const tarefasService = {
  async getAll(): Promise<Tarefa[]> {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          *,
          ccas!inner(id, codigo, nome),
          profiles!inner(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar tarefas:", error);
        return [];
      }

      return (data || []).map(tarefa => ({
        id: tarefa.id,
        cca: `${tarefa.ccas.codigo} - ${tarefa.ccas.nome}`,
        tipoCca: tarefa.tipo_cca || 'linha-inteira',
        dataCadastro: tarefa.data_cadastro,
        dataConclusao: tarefa.data_conclusao,
        descricao: tarefa.descricao,
        responsavel: {
          id: tarefa.responsavel_id || '',
          nome: tarefa.profiles?.nome || 'Não atribuído'
        },
        anexo: tarefa.anexo,
        status: tarefa.status,
        iniciada: tarefa.iniciada,
        configuracao: tarefa.configuracao
      }));
    } catch (error) {
      console.error("Exceção ao buscar tarefas:", error);
      return [];
    }
  },

  async create(dadosTarefa: TarefaFormData): Promise<boolean> {
    try {
      console.log("Criando tarefa:", dadosTarefa);

      const { error } = await supabase
        .from('tarefas')
        .insert({
          cca: dadosTarefa.cca_id.toString(),
          tipo_cca: 'linha-inteira',
          data_conclusao: dadosTarefa.data_conclusao,
          descricao: dadosTarefa.descricao,
          responsavel_id: dadosTarefa.responsavel_id,
          status: 'programada',
          iniciada: false,
          configuracao: dadosTarefa.configuracao
        });

      if (error) {
        console.error("Erro ao criar tarefa:", error);
        return false;
      }

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
          profiles!inner(id, nome)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar tarefas recentes:", error);
        return [];
      }

      return (data || []).map(tarefa => ({
        id: tarefa.id,
        descricao: tarefa.descricao,
        responsavel: {
          id: tarefa.responsavel_id || '',
          nome: tarefa.profiles?.nome || 'Não atribuído'
        },
        dataConclusao: new Date(tarefa.data_conclusao),
        status: tarefa.status,
        criticidade: tarefa.configuracao?.criticidade || 'media'
      }));
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
  }
};
