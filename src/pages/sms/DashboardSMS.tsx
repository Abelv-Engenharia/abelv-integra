import React, { useEffect, useState } from "react";
import { TrendingUp, CheckCircle2, Gauge, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { usePiramideOcorrencias } from "@/hooks/usePiramideOcorrencias";
import { useIDSMSDashboard } from "@/hooks/useIDSMSDashboard";
import { fetchDashboardStats } from "@/services/desvios/dashboardStatsService";
import { fetchHSAPercentage } from "@/services/dashboard/hsaStatsService";
import { fetchTreinamentoInvestmentPercentage } from "@/services/dashboard/treinamentoStatsService";
import { fetchOcorrenciasStats } from "@/services/ocorrencias/ocorrenciasStatsService";
import { fetchTreinamentosStats } from "@/services/treinamentos/treinamentosStatsService";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import SMSDashboardFilters from "@/components/sms/SMSDashboardFilters";

// Simple stat card component (uses design tokens)
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-lg border border-border bg-card text-card-foreground p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-semibold leading-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </article>
  );
}

const freqData = [
  { name: "Jan", valor: 2 },
  { name: "Fev", valor: 0 },
  { name: "Mar", valor: 1 },
  { name: "Abr", valor: 0 },
  { name: "Mai", valor: 3 },
  { name: "Jun", valor: 0 },
];

export default function DashboardSMS() {
  const { counts, loading: loadingPiramide } = usePiramideOcorrencias();
  const { data: userCCAs = [] } = useUserCCAs();
  
  // Estados para filtros
  const [year, setYear] = useState("todos");
  const [month, setMonth] = useState("todos");
  const [ccaId, setCcaId] = useState("todos");

  // Usar o hook IDSMS com filtros
  const { data: idsmsData = [], isLoading: loadingIDSMS } = useIDSMSDashboard({
    cca_id: ccaId !== "todos" ? ccaId : "all",
    ano: year !== "todos" ? year : "all",
    mes: month !== "todos" ? month : "all"
  });
  
  // Estados para dados dos indicadores
  const [desviosStats, setDesviosStats] = useState<any>(null);
  const [hsaPercentage, setHsaPercentage] = useState<number | null>(null);
  const [treinamentoData, setTreinamentoData] = useState<any>(null);
  const [ocorrenciasStats, setOcorrenciasStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Calcular IDSMS médio e status geral
  const idsmsMedia = idsmsData.length > 0 
    ? idsmsData.reduce((sum, item) => sum + item.idsms_total, 0) / idsmsData.length 
    : 0;

  const getStatusLabel = (value: number) => {
    if (value > 100) return 'Excelente';
    if (value >= 95) return 'Bom';
    return 'Atenção';
  };

  const statusGeral = getStatusLabel(idsmsMedia);

  // Carregar dados dos indicadores com filtros aplicados
  useEffect(() => {
    const loadIndicadores = async () => {
      try {
        setLoading(true);
        
        // Aplicar filtros de CCA
        let ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : undefined;
        if (ccaId !== "todos") {
          ccaIds = [parseInt(ccaId)];
        }

        // Criar filtros para os diferentes serviços
        const desviosFilters = {
          year: year !== "todos" ? year : undefined,
          month: month !== "todos" ? month : undefined,
          ccaIds: ccaIds?.map(id => id.toString())
        };

        const treinamentosFilters = {
          year: year !== "todos" ? year : undefined,
          month: month !== "todos" ? month : undefined,
          ccaId: ccaId !== "todos" ? ccaId : undefined
        };

        const [desviosData, hsaData, treinamentoStatsData, ocorrenciasData] = await Promise.all([
          fetchDashboardStats(desviosFilters),
          fetchHSAPercentage(ccaIds),
          fetchTreinamentosStats(ccaIds || [], treinamentosFilters),
          fetchOcorrenciasStats(ccaIds)
        ]);

        setDesviosStats(desviosData);
        setHsaPercentage(hsaData);
        setTreinamentoData(treinamentoStatsData);
        setOcorrenciasStats(ocorrenciasData);
      } catch (error) {
        console.error('Erro ao carregar indicadores:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userCCAs.length >= 0) {
      loadIndicadores();
    }
  }, [userCCAs, year, month, ccaId]);

  useEffect(() => {
    document.title = "Dashboard SMS | Gestão de SMS";
    const desc =
      "Dashboard SMS com indicadores proativos e reativos do sistema de SMS.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/sms/dashboard`);
  }, []);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard SMS</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral dos principais indicadores de SMS.
        </p>
      </header>

      <main className="space-y-8">
        {/* Filtros */}
        <SMSDashboardFilters 
          year={year}
          month={month}
          ccaId={ccaId}
          setYear={setYear}
          setMonth={setMonth}
          setCcaId={setCcaId}
        />

        {/* Índice de Desenvolvimento de SMS */}
        <section aria-labelledby="idsms" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="idsms" className="text-lg font-semibold">
              Índice de Desenvolvimento de SMS
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard 
              title="IDSMS Médio" 
              value={loadingIDSMS ? "..." : `${idsmsMedia.toFixed(1)}`} 
              subtitle="média geral" 
              icon={Gauge} 
            />
            <StatCard 
              title="Status Geral" 
              value={loadingIDSMS ? "..." : statusGeral} 
              subtitle="baseado no IDSMS médio" 
              icon={CheckCircle2} 
            />
          </div>
        </section>

        {/* Indicadores proativos */}
        <section aria-labelledby="indicadores-proativos" className="space-y-4">
          <h2 id="indicadores-proativos" className="text-lg font-semibold">
            Indicadores proativos
          </h2>

          {/* Identificação de Desvios */}
          <article className="space-y-3">
            <h3 className="text-base font-medium">Identificação de Desvios</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total de Desvios" 
                value={loading ? "..." : desviosStats?.totalDesvios || 0} 
                subtitle="Todos os desvios registrados" 
                icon={AlertTriangle} 
              />
              <StatCard 
                title="Ações Concluídas" 
                value={loading ? "..." : `${desviosStats?.acoesCompletas || 0} (${desviosStats?.percentualCompletas || 0}%)`} 
                subtitle="Ações finalizadas" 
                icon={CheckCircle2} 
              />
              <StatCard 
                title="Ações em Andamento" 
                value={loading ? "..." : `${desviosStats?.acoesAndamento || 0} (${desviosStats?.percentualAndamento || 0}%)`} 
                subtitle="Ações sendo executadas" 
                icon={Clock} 
              />
              <StatCard 
                title="Ações Pendentes" 
                value={loading ? "..." : `${desviosStats?.acoesPendentes || 0} (${desviosStats?.percentualPendentes || 0}%)`} 
                subtitle="Ações ainda não iniciadas" 
                icon={AlertTriangle} 
              />
            </div>
          </article>

          {/* Horas Investidas em Treinamentos */}
          <article className="space-y-3">
            <h3 className="text-base font-medium">Horas Investidas em Treinamentos</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Percentual investido" 
                value={loading ? "..." : `${treinamentoData?.percentualHorasInvestidas?.toFixed(2) || 0}%`} 
                subtitle="Do total de horas trabalhadas (HHT)" 
                icon={TrendingUp} 
              />
              <StatCard 
                title="Horas Trabalhadas (HHT)" 
                value={loading ? "..." : treinamentoData?.totalHHT?.toLocaleString() || 0} 
                subtitle="no período selecionado" 
                icon={Clock} 
              />
              <StatCard 
                title="Meta de Horas (2,5% HHT)" 
                value={loading ? "..." : Math.round(treinamentoData?.metaHoras || 0).toLocaleString()} 
                subtitle="Meta no período" 
                icon={Gauge} 
              />
              <StatCard 
                title="Horas Totais de Treinamentos" 
                value={loading ? "..." : Math.round(treinamentoData?.totalHorasTreinamento || 0).toLocaleString()} 
                subtitle="Realizadas no período" 
                icon={CheckCircle2} 
              />
            </div>
          </article>

          {/* Execução Hora da Segurança */}
          <article className="space-y-3">
            <h3 className="text-base font-medium">Execução Hora da Segurança</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <StatCard 
                title="Adesão HSA (real)" 
                value="36,44%" 
                subtitle="Realizadas vs Programadas" 
                icon={TrendingUp} 
              />
              <StatCard 
                title="Adesão HSA (ajustada)" 
                value={loading ? "..." : `${hsaPercentage?.toFixed(2) || 0}%`} 
                subtitle="Incluindo não programadas" 
                icon={TrendingUp} 
              />
              <StatCard title="Inspeções Programadas" value={118} subtitle="A realizar + Replanejadas + Não realizadas" icon={Clock} />
              <StatCard title="Inspeções Realizadas" value={43} subtitle="Inspeções concluídas" icon={CheckCircle2} />
              <StatCard title="Não Programadas" value={1} subtitle="Inspeções não programadas" icon={BarChart3} />
              <StatCard title="Não Realizadas" value={1} subtitle="Inspeções não executadas" icon={AlertTriangle} />
            </div>
          </article>
        </section>

        {/* Indicadores reativos */}
        <section aria-labelledby="indicadores-reativos" className="space-y-4">
          <h2 id="indicadores-reativos" className="text-lg font-semibold">
            Indicadores reativos
          </h2>
          <article className="space-y-3">
            <h3 className="text-base font-medium">Ocorrências</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Ocorrências com perda de dias" 
                value={loading ? "..." : ocorrenciasStats?.ocorrenciasComPerdaDias || 0} 
                icon={AlertTriangle}
                subtitle="AC CPD" 
              />
              <StatCard 
                title="Ocorrências sem perda de dias" 
                value={loading ? "..." : ocorrenciasStats?.ocorrenciasSemPerdaDias || 0}
                icon={CheckCircle2}
                subtitle="AC SPD"
              />
              <StatCard 
                title="Incidentes" 
                value={loading ? "..." : ocorrenciasStats?.incidentes || 0}
                icon={BarChart3}
                subtitle="INC DM, INC SDM, INC AMB"
              />
              <StatCard 
                title="Desvios de Alto Potencial" 
                value={loading ? "..." : ocorrenciasStats?.desviosAltoPotencial || 0}
                icon={AlertTriangle}
                subtitle="DAP"
              />
              <StatCard 
                title="Dias Perdidos" 
                value={loading ? "..." : ocorrenciasStats?.totalDiasPerdidos || 0}
                icon={Clock}
                subtitle="Total de dias perdidos"
              />
              <StatCard 
                title="Dias Debitados" 
                value={loading ? "..." : ocorrenciasStats?.totalDiasDebitados || 0}
                icon={Clock}
                subtitle="Total de dias debitados"
              />
              <StatCard 
                title="Ocorrências Concluídas" 
                value={loading ? "..." : ocorrenciasStats?.ocorrenciasConcluidas || 0}
                icon={CheckCircle2}
                subtitle="Status concluído/fechado"
              />
              <StatCard 
                title="Ocorrências Pendentes" 
                value={loading ? "..." : ocorrenciasStats?.ocorrenciasPendentes || 0}
                icon={AlertTriangle}
                subtitle="Status aberto/pendente"
              />
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-base font-medium">Pirâmide de Ocorrências</h3>
              <div className="relative w-full">
                <img
                  src="/lovable-uploads/1e50cebd-983a-47e4-af70-4e60b3a4439c.png"
                  alt="Pirâmide de Ocorrências: Fatal, CPD, SPD, Incidente e Desvios"
                  loading="lazy"
                  className="w-full h-auto select-none"
                />
                {/* Overlay com valores dinâmicos */}
                <span className="absolute right-2 rounded px-1.5 py-0.5 text-xs font-semibold bg-background/80 text-foreground" style={{ top: "6%" }}>
                  {loadingPiramide ? "..." : counts.fatal}
                </span>
                <span className="absolute right-2 rounded px-1.5 py-0.5 text-xs font-semibold bg-background/80 text-foreground" style={{ top: "24%" }}>
                  {loadingPiramide ? "..." : counts.cpd}
                </span>
                <span className="absolute right-2 rounded px-1.5 py-0.5 text-xs font-semibold bg-background/80 text-foreground" style={{ top: "41%" }}>
                  {loadingPiramide ? "..." : counts.spd}
                </span>
                <span className="absolute right-2 rounded px-1.5 py-0.5 text-xs font-semibold bg-background/80 text-foreground" style={{ top: "58%" }}>
                  {loadingPiramide ? "..." : counts.incidente}
                </span>
                <span className="absolute right-2 rounded px-1.5 py-0.5 text-xs font-semibold bg-background/80 text-foreground" style={{ top: "88%" }}>
                  {loadingPiramide ? "..." : counts.desvios}
                </span>
              </div>
            </article>

            <article className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-base font-medium">Taxas de Frequência e Gravidade</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {["Taxa de Frequência AC CPD", "Taxa de Frequência AC SPD", "Taxa de Gravidade"].map((titulo) => (
                  <div key={titulo} className="h-40 rounded-md border border-border bg-background p-2">
                    <p className="mb-1 text-xs text-muted-foreground">{titulo}</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={freqData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
