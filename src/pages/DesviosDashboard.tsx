
import { useState, useEffect } from "react";
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Calendar, 
  CircleAlert, 
  Clock, 
  Filter, 
  Pencil, 
  Search, 
  Trash2 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatCard from "@/components/dashboard/StatCard";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import DesviosBarChart from "@/components/desvios/DesviosBarChart";
import DesviosPieChart from "@/components/desvios/DesviosPieChart";
import DesviosAreaChart from "@/components/desvios/DesviosAreaChart";
import LatestDesvios from "@/components/desvios/LatestDesvios";
import DesviosByRisk from "@/components/desvios/DesviosByRisk";
import { supabase } from "@/integrations/supabase/client";

const DesviosDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [dashboardStats, setDashboardStats] = useState({
    totalDesvios: 0,
    desviosThisMonth: 0,
    pendingActions: 0,
    riskLevel: "Baixo",
  });
  const [loading, setLoading] = useState(true);

  // Buscar estatísticas do dashboard do Supabase
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // Contar total de desvios
        const { count: totalCount, error: totalError } = await supabase
          .from('desvios')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) {
          console.error('Erro ao contar desvios:', totalError);
        }

        // Contar desvios deste mês
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const { count: monthlyCount, error: monthlyError } = await supabase
          .from('desvios')
          .select('*', { count: 'exact', head: true })
          .gte('data', firstDayOfMonth.toISOString())
          .lte('data', lastDayOfMonth.toISOString());
        
        if (monthlyError) {
          console.error('Erro ao contar desvios do mês:', monthlyError);
        }

        // Contar ações pendentes
        const { count: pendingCount, error: pendingError } = await supabase
          .from('desvios')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Pendente');
        
        if (pendingError) {
          console.error('Erro ao contar ações pendentes:', pendingError);
        }

        // Determinar nível de risco médio
        const { data: riskData, error: riskError } = await supabase
          .from('desvios')
          .select('classificacao');
        
        if (riskError) {
          console.error('Erro ao buscar classificações de risco:', riskError);
        }
        
        let riskLevel = "Baixo";
        if (riskData && riskData.length > 0) {
          const riskLevels = {
            "Trivial": 1,
            "Tolerável": 2,
            "Moderado": 3,
            "Substancial": 4,
            "Intolerável": 5
          };
          
          const riskValues = riskData
            .filter(item => item.classificacao)
            .map(item => riskLevels[item.classificacao as keyof typeof riskLevels] || 0);
          
          if (riskValues.length > 0) {
            const avgRisk = riskValues.reduce((sum, val) => sum + val, 0) / riskValues.length;
            
            if (avgRisk >= 4) riskLevel = "Alto";
            else if (avgRisk >= 3) riskLevel = "Moderado";
            else if (avgRisk >= 2) riskLevel = "Baixo";
          }
        }

        setDashboardStats({
          totalDesvios: totalCount || 0,
          desviosThisMonth: monthlyCount || 0,
          pendingActions: pendingCount || 0,
          riskLevel: riskLevel
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleFilterChange = () => {
    toast({
      title: "Filtros aplicados",
      description: `Mostrando dados para: ${month}/${year}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Desvios</h1>
          <p className="text-muted-foreground">
            Visão geral dos desvios de segurança e suas métricas.
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/desvios/consulta")}
          >
            <Search className="mr-2 h-4 w-4" />
            Consultar Desvios
          </Button>
          <Button 
            onClick={() => navigate("/desvios/cadastro")}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Novo Desvio
          </Button>
        </div>
      </div>

      {/* Filter controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Filtros</CardTitle>
          <CardDescription>
            Selecione o período para visualizar os dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid gap-1">
              <label htmlFor="year" className="text-sm font-medium">
                Ano
              </label>
              <Select
                value={year}
                onValueChange={setYear}
              >
                <SelectTrigger id="year" className="w-[120px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(new Date().getFullYear() - 2).toString()}>{new Date().getFullYear() - 2}</SelectItem>
                  <SelectItem value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</SelectItem>
                  <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <label htmlFor="month" className="text-sm font-medium">
                Mês
              </label>
              <Select
                value={month}
                onValueChange={setMonth}
              >
                <SelectTrigger id="month" className="w-[120px]">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto">
              <Button onClick={handleFilterChange}>
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Desvios"
          value={loading ? "..." : dashboardStats.totalDesvios}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Todos os desvios registrados"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Desvios no Mês"
          value={loading ? "..." : dashboardStats.desviosThisMonth}
          icon={<Calendar className="h-4 w-4" />}
          description={`Desvios em ${month}/${year}`}
          trend="neutral"
          trendValue="2%"
        />
        <StatCard
          title="Ações Pendentes"
          value={loading ? "..." : dashboardStats.pendingActions}
          icon={<Clock className="h-4 w-4" />}
          description="Ações a serem realizadas"
          trend="down"
          trendValue="12%"
        />
        <StatCard
          title="Nível de Risco"
          value={loading ? "..." : dashboardStats.riskLevel}
          icon={<Activity className="h-4 w-4" />}
          description="Média de risco dos desvios"
          trend="up"
          trendValue="5%"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosBarChart />
        <DesviosPieChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosAreaChart />
        <DesviosByRisk />
      </div>

      {/* Latest Deviations */}
      <LatestDesvios />
    </div>
  );
};

export default DesviosDashboard;
