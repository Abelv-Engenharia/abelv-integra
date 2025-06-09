
import React, { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar 
} from "lucide-react";
import { tarefasService } from "@/services/tarefasService";

const TarefasSummaryCards = () => {
  const [stats, setStats] = useState({
    concluidas: 0,
    emAndamento: 0,
    pendentes: 0,
    programadas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await tarefasService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Tarefas Concluídas"
        value={stats.concluidas.toString()}
        icon={<CheckCircle />}
        description="Este mês"
        className="border-l-4 border-green-500"
      />
      <StatCard
        title="Tarefas em Andamento"
        value={stats.emAndamento.toString()}
        icon={<Clock />}
        description="Atualizadas recentemente"
        className="border-l-4 border-blue-500"
      />
      <StatCard
        title="Tarefas Pendentes"
        value={stats.pendentes.toString()}
        icon={<AlertCircle />}
        description="Necessitando atenção"
        className="border-l-4 border-yellow-500"
      />
      <StatCard
        title="Tarefas Programadas"
        value={stats.programadas.toString()}
        icon={<Calendar />}
        description="Para os próximos 30 dias"
        className="border-l-4 border-gray-500"
      />
    </div>
  );
};

export default TarefasSummaryCards;
