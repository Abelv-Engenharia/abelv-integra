
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalDesvios: number;
  desviosThisMonth: number;
  totalTreinamentos: number;
  treinamentosThisMonth: number;
  totalOcorrencias: number;
  ocorrenciasThisMonth: number;
  totalTarefas: number;
  tarefasPendentes: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface PendingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress';
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Buscar desvios
      const { data: desvios, error: desviosError } = await supabase
        .from('desvios_completos')
        .select('id, data_desvio');

      if (desviosError) throw desviosError;

      const totalDesvios = desvios?.length || 0;
      const desviosThisMonth = desvios?.filter(d => {
        const desvioDate = new Date(d.data_desvio);
        return desvioDate >= firstDayOfMonth;
      }).length || 0;

      // Buscar treinamentos
      const { data: treinamentos, error: treinamentosError } = await supabase
        .from('execucao_treinamentos')
        .select('id, data, mes, ano');

      if (treinamentosError) throw treinamentosError;

      const totalTreinamentos = treinamentos?.length || 0;
      const treinamentosThisMonth = treinamentos?.filter(t => 
        t.mes === currentMonth && t.ano === currentYear
      ).length || 0;

      // Buscar ocorrências
      const { data: ocorrencias, error: ocorrenciasError } = await supabase
        .from('ocorrencias')
        .select('id, data, mes, ano');

      if (ocorrenciasError) throw ocorrenciasError;

      const totalOcorrencias = ocorrencias?.length || 0;
      const ocorrenciasThisMonth = ocorrencias?.filter(o => 
        o.mes === currentMonth && o.ano === currentYear
      ).length || 0;

      // Buscar tarefas
      const { data: tarefas, error: tarefasError } = await supabase
        .from('tarefas')
        .select('id, status');

      if (tarefasError) throw tarefasError;

      const totalTarefas = tarefas?.length || 0;
      const tarefasPendentes = tarefas?.filter(t => 
        t.status === 'Pendente' || t.status === 'Em andamento'
      ).length || 0;

      return {
        totalDesvios,
        desviosThisMonth,
        totalTreinamentos,
        treinamentosThisMonth,
        totalOcorrencias,
        ocorrenciasThisMonth,
        totalTarefas,
        tarefasPendentes
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      return {
        totalDesvios: 0,
        desviosThisMonth: 0,
        totalTreinamentos: 0,
        treinamentosThisMonth: 0,
        totalOcorrencias: 0,
        ocorrenciasThisMonth: 0,
        totalTarefas: 0,
        tarefasPendentes: 0
      };
    }
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = [];
      
      // Buscar desvios recentes
      const { data: desvios } = await supabase
        .from('desvios_completos')
        .select('id, descricao_desvio, data_desvio, status')
        .order('created_at', { ascending: false })
        .limit(3);

      if (desvios) {
        desvios.forEach(desvio => {
          activities.push({
            id: desvio.id,
            title: 'Novo desvio registrado',
            description: desvio.descricao_desvio.slice(0, 60) + '...',
            timestamp: new Date(desvio.data_desvio).toLocaleString('pt-BR'),
            status: 'warning'
          });
        });
      }

      // Buscar ocorrências recentes
      const { data: ocorrencias } = await supabase
        .from('ocorrencias')
        .select('id, descricao_ocorrencia, data, status')
        .order('created_at', { ascending: false })
        .limit(2);

      if (ocorrencias) {
        ocorrencias.forEach(ocorrencia => {
          activities.push({
            id: ocorrencia.id,
            title: 'Nova ocorrência registrada',
            description: (ocorrencia.descricao_ocorrencia || 'Ocorrência registrada').slice(0, 60) + '...',
            timestamp: new Date(ocorrencia.data).toLocaleString('pt-BR'),
            status: 'error'
          });
        });
      }

      return activities.slice(0, 4);
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      return [];
    }
  },

  async getPendingTasks(): Promise<PendingTask[]> {
    try {
      const { data: tarefas, error } = await supabase
        .from('tarefas')
        .select('id, descricao, data_cadastro, status, configuracao')
        .in('status', ['Pendente', 'Em andamento'])
        .order('data_cadastro', { ascending: false })
        .limit(4);

      if (error) throw error;

      return tarefas?.map(tarefa => ({
        id: tarefa.id,
        title: tarefa.descricao,
        dueDate: new Date(tarefa.data_cadastro).toLocaleDateString('pt-BR'),
        priority: (tarefa.configuracao as any)?.criticidade || 'medium',
        status: tarefa.status === 'Em andamento' ? 'in-progress' : 'pending'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar tarefas pendentes:', error);
      return [];
    }
  }
};
