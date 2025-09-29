
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MedidasPieChart } from "@/components/medidas-disciplinares/MedidasPieChart";
import { MedidasBarChart } from "@/components/medidas-disciplinares/MedidasBarChart";

export default function MedidasDisciplinaresDashboard() {
  const { data: userCCAs = [] } = useUserCCAs();
  const [stats, setStats] = useState({
    totalMedidas: 0,
    comAnexo: 0,
    ultimaMedida: "-"
  });

  useEffect(() => {
    const loadStats = async () => {
      if (userCCAs.length === 0) return;

      const allowedCcaIds = userCCAs.map(cca => cca.id);
      const currentYear = new Date().getFullYear();

      try {
        // Total de medidas no ano atual
        const { count: totalCount } = await supabase
          .from("medidas_disciplinares")
          .select("*", { count: "exact", head: true })
          .in('cca_id', allowedCcaIds)
          .eq('ano', currentYear.toString());

        // Medidas com anexo
        const { count: comAnexoCount } = await supabase
          .from("medidas_disciplinares")
          .select("*", { count: "exact", head: true })
          .in('cca_id', allowedCcaIds)
          .not('pdf_url', 'is', null);

        // Última medida
        const { data: ultimaMedidaData } = await supabase
          .from("medidas_disciplinares")
          .select("data")
          .in('cca_id', allowedCcaIds)
          .order('data', { ascending: false })
          .limit(1);

        setStats({
          totalMedidas: totalCount || 0,
          comAnexo: comAnexoCount || 0,
          ultimaMedida: ultimaMedidaData?.[0]?.data 
            ? new Date(ultimaMedidaData[0].data).toLocaleDateString('pt-BR')
            : "-"
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    loadStats();
  }, [userCCAs]);

  if (userCCAs.length === 0) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-4 animate-fade-in">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Você não possui acesso a nenhum CCA.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-primary" size={32} />
            Medidas Disciplinares
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Acompanhe o registro, monitoramento e gestão das medidas disciplinares aplicadas na empresa.
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <Button asChild>
            <Link to="/medidas-disciplinares/cadastro">Cadastrar Nova Medida</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/medidas-disciplinares/consulta">Consultar Medidas</Link>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Medidas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{stats.totalMedidas}</span>
            <div className="text-xs text-muted-foreground">No ano atual</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Com Anexo</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{stats.comAnexo}</span>
            <div className="text-xs text-muted-foreground">Com documento anexado</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Última Medida</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-bold">{stats.ultimaMedida}</span>
            <div className="text-xs text-muted-foreground">Data mais recente</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MedidasPieChart ccaIds={userCCAs.map(cca => cca.id)} />
        <MedidasBarChart ccaIds={userCCAs.map(cca => cca.id)} />
      </div>

      <div className="text-sm text-muted-foreground mb-10">
        <span>
          Utilize os botões acima para registrar ou consultar medidas disciplinares dos CCAs permitidos.
        </span>
      </div>
    </div>
  );
}
