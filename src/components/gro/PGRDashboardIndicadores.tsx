
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

type Plano = {
  id: string;
  nome: string;
  criado_em: string;
};

type Medida = {
  id: string;
  tipo: string;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  "pendente": "Pendente",
  "em andamento": "Em Andamento",
  "concluída": "Concluída",
  "não eficaz": "Não Eficaz"
};

export default function PGRDashboardIndicadores() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const planosRes = await supabase.from("pgr_planos").select("id, nome, criado_em");
      const medidasRes = await supabase.from("pgr_medidas").select("id, tipo, status");
      setPlanos(planosRes.data || []);
      setMedidas(medidasRes.data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  // Calcular medidas por status
  const statusData = Object.keys(STATUS_LABELS).map(status => ({
    status: STATUS_LABELS[status],
    total: medidas.filter(m => m.status === status).length
  }));

  // Total de bloqueios/pendências
  const medidasPendentes = medidas.filter(m => m.status === "pendente" || m.status === "em andamento").length;
  const medidasConcluidas = medidas.filter(m => m.status === "concluída").length;
  const medidasNaoEficaz = medidas.filter(m => m.status === "não eficaz").length;

  return (
    <Card className="p-4 mb-6">
      <h3 className="font-semibold text-lg mb-3">Indicadores do PGR (Programa de Gerenciamento de Riscos)</h3>
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" /> Carregando indicadores...
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div>
              <span className="font-medium">Planos cadastrados:</span>
              <Badge className="ml-2">{planos.length}</Badge>
            </div>
            <div>
              <span className="font-medium">Medidas cadastradas:</span>
              <Badge variant="secondary" className="ml-2">{medidas.length}</Badge>
            </div>
            <div>
              <span className="font-medium">Medidas pendentes/em andamento:</span>
              <Badge variant="destructive" className="ml-2">{medidasPendentes}</Badge>
            </div>
            <div>
              <span className="font-medium">Concluídas:</span>
              <Badge variant="success" className="ml-2">{medidasConcluidas}</Badge>
            </div>
            <div>
              <span className="font-medium">Não eficaz:</span>
              <Badge className="ml-2 bg-yellow-400">{medidasNaoEficaz}</Badge>
            </div>
          </div>
          <div className="flex-1 min-w-[240px]">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={statusData}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Card>
  );
}
