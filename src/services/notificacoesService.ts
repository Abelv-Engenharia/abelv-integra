
import { supabase } from "@/integrations/supabase/client";
import { Notificacao } from "@/types/notificacoes";

export const notificacoesService = {
  async getNotificacoes(): Promise<Notificacao[]> {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar notificações:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Exceção ao buscar notificações:", error);
      return [];
    }
  },

  async marcarComoLida(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id);

      if (error) {
        console.error("Erro ao marcar notificação como lida:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao marcar notificação como lida:", error);
      return false;
    }
  },

  async marcarTodasComoLidas(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('lida', false);

      if (error) {
        console.error("Erro ao marcar todas as notificações como lidas:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao marcar todas as notificações como lidas:", error);
      return false;
    }
  },

  async contarNaoLidas(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('lida', false);

      if (error) {
        console.error("Erro ao contar notificações não lidas:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Exceção ao contar notificações não lidas:", error);
      return 0;
    }
  },

  async criarNotificacao(notificacao: {
    usuario_id: string;
    titulo: string;
    mensagem: string;
    tipo: string;
    tarefa_id?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .insert(notificacao);

      if (error) {
        console.error("Erro ao criar notificação:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao criar notificação:", error);
      return false;
    }
  }
};
