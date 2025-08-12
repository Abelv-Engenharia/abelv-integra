import React, { useEffect } from "react";
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
        {/* Índice de Desenvolvimento de SMS */}
        <section aria-labelledby="idsms" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="idsms" className="text-lg font-semibold">
              Índice de Desenvolvimento de SMS
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard title="IDSMS Médio" value="95,1%" subtitle="média geral" icon={Gauge} />
            <StatCard title="Status Geral" value="Bom" subtitle="baseado no IDSMS médio" icon={CheckCircle2} />
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
              <StatCard title="Total de Desvios" value={55} subtitle="1% Todos os desvios registrados" icon={AlertTriangle} />
              <StatCard title="Ações Concluídas" value="51 (93%)" subtitle="Ações finalizadas" icon={CheckCircle2} />
              <StatCard title="Ações em Andamento" value="4 (7%)" subtitle="Ações sendo executadas" icon={Clock} />
              <StatCard title="Ações Pendentes" value="0 (0%)" subtitle="Ações ainda não iniciadas" icon={AlertTriangle} />
            </div>
          </article>

          {/* Horas Investidas em Treinamentos */}
          <article className="space-y-3">
            <h3 className="text-base font-medium">Horas Investidas em Treinamentos</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Percentual investido" value="0,13%" subtitle="Do total de horas trabalhadas (HHT)" icon={TrendingUp} />
              <StatCard title="Horas Trabalhadas (HHT)" value="564.090,36" subtitle="no período selecionado" icon={Clock} />
              <StatCard title="Meta de Horas (2,5% HHT)" value="14.102" subtitle="Meta no trimestre" icon={Gauge} />
              <StatCard title="Horas Totais de Treinamentos" value={718} subtitle="Realizadas no período" icon={CheckCircle2} />
            </div>
          </article>

          {/* Execução Hora da Segurança */}
          <article className="space-y-3">
            <h3 className="text-base font-medium">Execução Hora da Segurança</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <StatCard title="Adesão HSA (real)" value="36,44%" subtitle="Realizadas vs Programadas" icon={TrendingUp} />
              <StatCard title="Adesão HSA (ajustada)" value="36,97%" subtitle="Incluindo não programadas" icon={TrendingUp} />
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
              <StatCard title="Ocorrências com perda de dias" value={2} />
              <StatCard title="Ocorrências sem perda de dias" value={1} />
              <StatCard title="Incidentes" value={3} />
              <StatCard title="Desvios de Alto Potencial" value={0} />
              <StatCard title="Dias Perdidos" value={32} />
              <StatCard title="Dias Debitados" value={0} />
              <StatCard title="Ocorrências Concluídas" value={6} />
              <StatCard title="Ocorrências Pendentes" value={0} />
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-base font-medium">Pirâmide de Ocorrências</h3>
              <p className="text-sm text-muted-foreground">
                Visualização simplificada. Gráfico detalhado pode ser adicionado posteriormente.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between"><span>Fatal</span><span className="font-semibold">0</span></li>
                <li className="flex items-center justify-between"><span>CPD</span><span className="font-semibold">2</span></li>
                <li className="flex items-center justify-between"><span>SPD</span><span className="font-semibold">3</span></li>
                <li className="flex items-center justify-between"><span>Incidente</span><span className="font-semibold">4</span></li>
                <li className="flex items-center justify-between"><span>Desvios</span><span className="font-semibold">964</span></li>
              </ul>
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
