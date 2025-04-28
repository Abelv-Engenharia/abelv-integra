
import React from "react";
import StatCard from "@/components/dashboard/StatCard";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar 
} from "lucide-react";

const TarefasSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Tarefas Concluídas"
        value="85"
        icon={<CheckCircle />}
        description="Este mês"
        trend="up"
        trendValue="12%"
        className="border-l-4 border-green-500"
      />
      <StatCard
        title="Tarefas em Andamento"
        value="25"
        icon={<Clock />}
        description="Atualizadas recentemente"
        className="border-l-4 border-blue-500"
      />
      <StatCard
        title="Tarefas Pendentes"
        value="15"
        icon={<AlertCircle />}
        description="Necessitando atenção"
        trend="down"
        trendValue="5%"
        className="border-l-4 border-yellow-500"
      />
      <StatCard
        title="Tarefas Programadas"
        value="30"
        icon={<Calendar />}
        description="Para os próximos 30 dias"
        trend="up"
        trendValue="8%"
        className="border-l-4 border-gray-500"
      />
    </div>
  );
};

export default TarefasSummaryCards;
