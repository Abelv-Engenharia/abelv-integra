import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { fetchRecentInspections } from '@/services/hora-seguranca';

// Função para renderizar o ícone de acordo com o status
const getStatusIcon = (status: string) => {
  switch (status) {
    case "REALIZADA":
    case "Concluída":
      return <ShieldCheck className="h-4 w-4" />;
    case "REALIZADA NÃO PROGRAMADA":
      return <ShieldCheck className="h-4 w-4" />;
    case "A REALIZAR":
    case "Pendente":
      return <Shield className="h-4 w-4" />;
    case "NÃO REALIZADA":
      return <ShieldAlert className="h-4 w-4" />;
    case "CANCELADA":
    case "Cancelada":
      return <ShieldX className="h-4 w-4" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

// Função para renderizar a cor da badge de acordo com o status
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "REALIZADA":
    case "Concluída":
      return "bg-green-500 hover:bg-green-600";
    case "REALIZADA NÃO PROGRAMADA":
      return "bg-blue-500 hover:bg-blue-600";
    case "A REALIZAR":
    case "Pendente":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "NÃO REALIZADA":
      return "bg-red-500 hover:bg-red-600";
    case "CANCELADA":
    case "Cancelada":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "";
  }
};

export function RecentInspectionsList() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentInspections();
        setInspections(data);
      } catch (err) {
        console.error("Error loading recent inspections:", err);
        setError("Não foi possível carregar as inspeções recentes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 flex items-center justify-center py-8">
        <p className="text-muted-foreground">Carregando inspeções recentes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 flex items-center justify-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If we have no inspections, show a message
  if (inspections.length === 0) {
    return (
      <div className="space-y-4 flex items-center justify-center py-8">
        <p className="text-muted-foreground">Nenhuma inspeção recente encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inspections.map((inspecao) => (
        <div
          key={inspecao.id}
          className="flex items-center justify-between border-b pb-2 last:border-0"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{inspecao.tipo}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-2">{format(new Date(inspecao.data), "dd/MM/yyyy")}</span>
              <span>{inspecao.responsavel}</span>
            </div>
          </div>
          <Badge className={getStatusBadgeClass(inspecao.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(inspecao.status)}
              <span className="hidden sm:inline">{inspecao.status}</span>
            </div>
          </Badge>
        </div>
      ))}
    </div>
  );
}
