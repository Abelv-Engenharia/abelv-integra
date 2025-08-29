
import { supabase } from "@/integrations/supabase/client";
import { Tarefa, TarefaStatus, TarefaCriticidade } from "@/types/tarefas";

export interface TarefaFormData {
  titulo?: string;
  cca_id: number;
  data_conclusao: string;
  descricao: string;
  responsaveis_ids: string[];
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
          tarefas_responsaveis!inner(
            profiles!inner(id, nome)
          )
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
        responsaveis: data.tarefas_responsaveis ? data.tarefas_responsaveis.map((tr: any) => ({
          id: tr.profiles?.id || '',
          nome: tr.profiles?.nome || 'Não atribuído'
        })) : [],
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
          tarefas_responsaveis(
            profiles(id, nome)
          )
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
        responsaveis: tarefa.tarefas_responsaveis ? tarefa.tarefas_responsaveis.map((tr: any) => ({
          id: tr.profiles?.id || '',
          nome: tr.profiles?.nome || 'Não atribuído'
        })) : [],
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

      console.log("=== getMyTasks: Buscando tarefas do usuário ===");
      console.log("User ID:", user.id);
      console.log("User email:", user.email);

      // Buscar tarefas onde o usuário é responsável OU criador
      const { data: tarefasData, error } = await supabase
        .from('tarefas')
        .select(`
          *,
          tarefas_responsaveis(
            usuario_id,
            profiles(id, nome)
          )
        `)
        .or(`tarefas_responsaveis.usuario_id.eq.${user.id},criado_por.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro na query de minhas tarefas:", error);
        return [];
      }

      console.log("=== getMyTasks: Dados retornados ===");
      console.log("Total de registros:", tarefasData?.length || 0);
      
      if (!tarefasData || tarefasData.length === 0) {
        console.log("Nenhuma tarefa encontrada para o usuário");
        return [];
      }

      // Mapear os dados para o formato esperado
      const tarefasMapeadas = tarefasData.map(tarefa => {
        console.log("Mapeando tarefa:", tarefa.id, "Título:", tarefa.titulo);
        
        return {
          id: tarefa.id,
          cca: tarefa.cca || 'N/A',
          tipoCca: 'linha-inteira' as const,
          dataCadastro: tarefa.data_cadastro || tarefa.created_at,
          dataConclusao: tarefa.data_conclusao,
          data_real_conclusao: tarefa.data_real_conclusao ?? null,
          descricao: tarefa.descricao || '',
          titulo: tarefa.titulo || tarefa.descricao?.substring(0, 50) || 'Tarefa sem título',
          responsaveis: tarefa.tarefas_responsaveis ? tarefa.tarefas_responsaveis.map((tr: any) => ({
            id: tr.profiles?.id || '',
            nome: tr.profiles?.nome || 'Não atribuído'
          })) : [],
          anexo: tarefa.anexo,
          status: tarefa.status as TarefaStatus || 'programada',
          iniciada: tarefa.iniciada || false,
          observacoes_progresso: tarefa.observacoes_progresso,
          configuracao: (tarefa.configuracao as any) || {
            criticidade: 'media' as TarefaCriticidade,
            requerValidacao: false,
            notificarUsuario: false
          },
          criado_por: tarefa.criado_por
        };
      });

      console.log("Tarefas mapeadas com sucesso:", tarefasMapeadas.length);
      return tarefasMapeadas;
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
        responsaveis: tarefa.tarefas_responsaveis ? tarefa.tarefas_responsaveis.map((tr: any) => ({
          id: tr.profiles?.id || '',
          nome: tr.profiles?.nome || 'Não atribuído'
        })) : [],
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
        !dadosTarefa.responsaveis_ids ||
        dadosTarefa.responsaveis_ids.length === 0
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

      const { data: tarefaData, error } = await supabase
        .from('tarefas')
        .insert({
          titulo: dadosTarefa.titulo,
          cca: `${ccaData.codigo} - ${ccaData.nome}`,
          tipo_cca: 'linha-inteira',
          data_conclusao: dadosTarefa.data_conclusao,
          descricao: dadosTarefa.descricao,
          criado_por: user.id,
          status: 'programada',
          iniciada: false,
          configuracao: dadosTarefa.configuracao
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar tarefa:", error);
        return false;
      }

      // Inserir responsáveis na tabela de relacionamento
      const responsaveisData = dadosTarefa.responsaveis_ids.map(responsavelId => ({
        tarefa_id: tarefaData.id,
        responsavel_id: responsavelId
      }));

      const { error: responsaveisError } = await supabase
        .from('tarefas_responsaveis')
        .insert(responsaveisData);

      if (responsaveisError) {
        console.error("Erro ao criar responsáveis da tarefa:", responsaveisError);
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
          tarefas_responsaveis(
            profiles(id, nome)
          )
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
          responsaveis: tarefa.tarefas_responsaveis ? tarefa.tarefas_responsaveis.map((tr: any) => ({
            id: tr.profiles?.id || '',
            nome: tr.profiles?.nome || 'Não atribuído'
          })) : [],
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
      // Primeiro, verificar se o usuário atual é o criador da tarefa
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Usuário não autenticado");
        return false;
      }

      // Buscar a tarefa para verificar quem a criou
      const { data: tarefa, error: fetchError } = await supabase
        .from('tarefas')
        .select('criado_por')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar tarefa para verificar criador:", fetchError);
        return false;
      }

      if (!tarefa) {
        console.error("Tarefa não encontrada");
        return false;
      }

      // Verificar se o usuário atual é o criador da tarefa
      if (tarefa.criado_por !== user.id) {
        console.error("Apenas o criador da tarefa pode excluí-la");
        return false;
      }

      // Excluir a tarefa
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
