import { Vaga, StatusVaga } from "@/types/gestao-pessoas/vaga";
import { Candidato } from "@/types/gestao-pessoas/candidato";
import { KPICard } from "@/components/gestao-pessoas/veiculos/dashboard/KPICard";
import { Briefcase, Clock, AlertTriangle, UserCheck, Users, Calendar } from "lucide-react";

interface KPIsRecrutamentoProps {
  vagas: Vaga[];
  candidatos: Candidato[];
}

export function KPIsRecrutamento({ vagas, candidatos }: KPIsRecrutamentoProps) {
  const vagasAtivas = vagas.filter(v => 
    v.status !== StatusVaga.FINALIZADA
  ).length;

  const prazoMedio = 45;
  const vagasNoSLA = vagas.filter(v => {
    if (!v.diasRestantes) return true;
    return v.diasRestantes >= 0;
  }).length;

  const vagasAtrasadas = vagas.filter(v => v.atrasado).length;

  const totalCandidatos = candidatos.length;

  const candidatosAprovados = vagas.reduce((acc, vaga) => {
    return acc + vaga.candidatos.filter(c => c.status === "aprovado").length;
  }, 0);

  const totalCandidatosProcesso = vagas.reduce((acc, vaga) => {
    return acc + vaga.candidatos.length;
  }, 0);

  const taxaConversao = totalCandidatosProcesso > 0 
    ? ((candidatosAprovados / totalCandidatosProcesso) * 100).toFixed(1)
    : "0.0";

  const tempoMedioFechamento = 32;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <KPICard
        titulo="Total de vagas ativas"
        valor={vagasAtivas}
        Icon={Briefcase}
        cor="azul"
      />
      
      <KPICard
        titulo="Vagas em sla"
        valor={vagasNoSLA}
        Icon={Clock}
        cor="verde"
      />
      
      <KPICard
        titulo="Vagas atrasadas"
        valor={vagasAtrasadas}
        Icon={AlertTriangle}
        cor="vermelho"
      />
      
      <KPICard
        titulo="Taxa de conversão"
        valor={`${taxaConversao}%`}
        Icon={UserCheck}
        cor="roxo"
      />
      
      <KPICard
        titulo="Total de candidatos no banco"
        valor={totalCandidatos}
        Icon={Users}
        cor="azul"
      />
      
      <KPICard
        titulo="Tempo médio de fechamento"
        valor={`${tempoMedioFechamento} dias`}
        Icon={Calendar}
        cor="amarelo"
      />
    </div>
  );
}
