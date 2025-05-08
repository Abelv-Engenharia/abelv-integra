
import React, { useEffect, useState } from "react";
import { fetchInspecoesSummary } from "@/services/hora-seguranca/inspecoesSummaryService";
import { Activity, Calendar, CheckSquare, FileWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InspecoesSummary } from "@/types/treinamentos";

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
  <Card className={className}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const InspecoesSummaryCards = () => {
  const [data, setData] = useState<InspecoesSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const summary = await fetchInspecoesSummary();
        setData(summary);
      } catch (error) {
        console.error("Error loading inspeções summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Inspeções"
        value={data?.totalInspecoes || 0}
        icon={<Activity className="h-5 w-5" />}
        className="border-l-4 border-blue-500"
      />
      <StatCard
        title="Programadas"
        value={data?.programadas || 0}
        icon={<Calendar className="h-5 w-5" />}
        className="border-l-4 border-green-500"
      />
      <StatCard
        title="Não Programadas"
        value={data?.naoProgramadas || 0}
        icon={<CheckSquare className="h-5 w-5" />}
        className="border-l-4 border-amber-500"
      />
      <StatCard
        title="Desvios Identificados"
        value={data?.desviosIdentificados || 0}
        icon={<FileWarning className="h-5 w-5" />}
        className="border-l-4 border-red-500"
      />
    </div>
  );
};

export default InspecoesSummaryCards;
