import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { Calendar, CheckCircle, FileWarning } from "lucide-react";
import { fetchInspectionsSummary } from "@/services/hora-seguranca";
import { InspecoesSummary } from "@/types/users";

export const InspecoesSummaryCards = () => {
  const [stats, setStats] = useState({
    totalInspecoes: 0,
    inspecoesMes: 0,
    inspecoesPendentes: 0,
    anomaliasEncontradas: 0,
    realizadas: 0,
    canceladas: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: InspecoesSummary = await fetchInspectionsSummary();
        
        // Mapear os dados retornados pela API para o formato esperado pelo componente
        setStats({
          totalInspecoes: data.totalInspecoes || 0,
          inspecoesMes: data.programadas || 0,
          inspecoesPendentes: data.naoProgramadas || 0,
          anomaliasEncontradas: data.desviosIdentificados || 0,
          realizadas: data.programadas || 0, // Usando programadas como valor padrão para realizadas
          canceladas: 0 // Valor padrão para canceladas
        });
      } catch (error) {
        console.error("Erro ao carregar dados de inspeções:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de Inspeções"
        value={stats.totalInspecoes}
        icon={<Calendar className="h-4 w-4" />}
        description="Realizadas até o momento"
        loading={isLoading}
      />
      <StatCard
        title="Inspeções do Mês"
        value={stats.inspecoesMes}
        icon={<Calendar className="h-4 w-4" />}
        description="Programadas para este mês"
        loading={isLoading}
      />
      <StatCard
        title="Inspeções Realizadas"
        value={stats.realizadas}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Concluídas com sucesso"
        trend="up"
        loading={isLoading}
      />
      <StatCard
        title="Anomalias Encontradas"
        value={stats.anomaliasEncontradas}
        icon={<FileWarning className="h-4 w-4" />}
        description="Desvios identificados"
        trend="up"
        loading={isLoading}
      />
    </div>
  );
};
