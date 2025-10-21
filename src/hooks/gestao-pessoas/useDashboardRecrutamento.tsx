import { useMemo } from "react";
import { useVagas } from "./useVagas";
import { useCandidatos } from "./useCandidatos";
import { StatusVaga, PrioridadeVaga, TipoContrato } from "@/types/gestao-pessoas/vaga";
import { OrigemCandidato, EtapaProcesso as EtapaProcessoCandidato, StatusCandidato } from "@/types/gestao-pessoas/candidato";

export function useDashboardRecrutamento() {
  const { data: vagas = [], isLoading: loadingVagas } = useVagas();
  const { data: candidatos = [], isLoading: loadingCandidatos } = useCandidatos();

  const kpis = useMemo(() => {
    const vagasAbertas = vagas.filter(v => 
      v.status === StatusVaga.SOLICITACAO_ABERTA || 
      v.status === StatusVaga.APROVADA || 
      v.status === StatusVaga.DIVULGACAO_FEITA
    );

    return {
      totalVagasAtivas: vagasAbertas.length,
      vagasNoSLA: vagasAbertas.filter(v => {
        if (!v.prazoMobilizacao) return true;
        return new Date() <= v.prazoMobilizacao;
      }).length,
      vagasAtrasadas: vagasAbertas.filter(v => {
        if (!v.prazoMobilizacao) return false;
        return new Date() > v.prazoMobilizacao;
      }).length,
      taxaConversao: vagasAbertas.length > 0 
        ? ((vagas.filter(v => v.status === StatusVaga.FINALIZADA).length / vagas.length) * 100).toFixed(1)
        : "0.0",
      totalCandidatos: candidatos.length,
      tempoMedioFechamento: "45", // Calcular baseado em datas
    };
  }, [vagas, candidatos]);

  const funilConversao = useMemo(() => {
    return [
      { etapa: "Vagas Abertas", quantidade: vagas.filter(v => v.status === StatusVaga.SOLICITACAO_ABERTA || v.status === StatusVaga.APROVADA).length },
      { etapa: "Divulgadas", quantidade: vagas.filter(v => v.status === StatusVaga.DIVULGACAO_FEITA).length },
      { etapa: "Candidatos Aplicados", quantidade: candidatos.filter(c => c.etapaProcesso !== EtapaProcessoCandidato.TRIAGEM_CURRICULAR).length },
      { etapa: "Em Entrevista", quantidade: candidatos.filter(c => c.etapaProcesso === EtapaProcessoCandidato.ENTREVISTA_RH || c.etapaProcesso === EtapaProcessoCandidato.ENTREVISTA_GESTOR).length },
      { etapa: "Aprovados", quantidade: candidatos.filter(c => c.etapaProcesso === EtapaProcessoCandidato.APROVADO).length },
      { etapa: "Contratados", quantidade: candidatos.filter(c => c.statusCandidato === StatusCandidato.CONTRATADO).length },
    ];
  }, [vagas, candidatos]);

  const distribuicaoVagas = useMemo(() => {
    return [
      { status: "Solicitadas", quantidade: vagas.filter(v => v.status === StatusVaga.SOLICITACAO_ABERTA).length, fill: "hsl(var(--chart-1))" },
      { status: "Aprovadas", quantidade: vagas.filter(v => v.status === StatusVaga.APROVADA).length, fill: "hsl(var(--chart-2))" },
      { status: "Divulgadas", quantidade: vagas.filter(v => v.status === StatusVaga.DIVULGACAO_FEITA).length, fill: "hsl(var(--chart-3))" },
      { status: "Finalizadas", quantidade: vagas.filter(v => v.status === StatusVaga.FINALIZADA).length, fill: "hsl(var(--chart-4))" },
    ];
  }, [vagas]);

  const vagasPorPrioridade = useMemo(() => {
    return [
      { prioridade: "Alta", quantidade: vagas.filter(v => v.prioridade === PrioridadeVaga.ALTA).length, fill: "hsl(0, 84%, 60%)" },
      { prioridade: "Média", quantidade: vagas.filter(v => v.prioridade === PrioridadeVaga.MEDIA).length, fill: "hsl(48, 96%, 53%)" },
      { prioridade: "Baixa", quantidade: vagas.filter(v => v.prioridade === PrioridadeVaga.BAIXA).length, fill: "hsl(142, 76%, 36%)" },
    ];
  }, [vagas]);

  const vagasPorContrato = useMemo(() => {
    return [
      { tipo: "CLT", quantidade: vagas.filter(v => v.tipoContrato === TipoContrato.CLT).length, fill: "hsl(var(--chart-1))" },
      { tipo: "PJ", quantidade: vagas.filter(v => v.tipoContrato === TipoContrato.PJ).length, fill: "hsl(var(--chart-2))" },
      { tipo: "Estágio", quantidade: vagas.filter(v => v.tipoContrato === TipoContrato.ESTAGIO).length, fill: "hsl(var(--chart-3))" },
    ];
  }, [vagas]);

  const origemCandidatos = useMemo(() => {
    const cores = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(217, 91%, 60%)",
      "hsl(142, 76%, 36%)"
    ];

    return Object.values(OrigemCandidato).map((origem, index) => ({
      name: origem,
      value: candidatos.filter(c => c.origemCandidato === origem).length,
      fill: cores[index % cores.length]
    })).filter(item => item.value > 0);
  }, [candidatos]);

  const candidatosPorStatus = useMemo(() => {
    return [
      { status: "Disponível", quantidade: candidatos.filter(c => c.statusCandidato === StatusCandidato.DISPONIVEL).length, fill: "hsl(142, 76%, 36%)" },
      { status: "Em outro processo", quantidade: candidatos.filter(c => c.statusCandidato === StatusCandidato.EM_OUTRO_PROCESSO).length, fill: "hsl(48, 96%, 53%)" },
      { status: "Contratado", quantidade: candidatos.filter(c => c.statusCandidato === StatusCandidato.CONTRATADO).length, fill: "hsl(217, 91%, 60%)" },
      { status: "Não disponível", quantidade: candidatos.filter(c => c.statusCandidato === StatusCandidato.NAO_DISPONIVEL).length, fill: "hsl(0, 0%, 60%)" },
    ];
  }, [candidatos]);

  const topCargos = useMemo(() => {
    const cargosCont: Record<string, number> = {};
    vagas.forEach(vaga => {
      cargosCont[vaga.cargo] = (cargosCont[vaga.cargo] || 0) + 1;
    });

    return Object.entries(cargosCont)
      .map(([cargo, quantidade]) => ({ cargo, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }, [vagas]);

  const vagasEmAberto = useMemo(() => {
    return vagas
      .filter(v => 
        v.status === StatusVaga.SOLICITACAO_ABERTA || 
        v.status === StatusVaga.APROVADA || 
        v.status === StatusVaga.DIVULGACAO_FEITA
      )
      .slice(0, 10);
  }, [vagas]);

  return {
    kpis,
    funilConversao,
    distribuicaoVagas,
    vagasPorPrioridade,
    vagasPorContrato,
    origemCandidatos,
    candidatosPorStatus,
    topCargos,
    vagasEmAberto,
    isLoading: loadingVagas || loadingCandidatos,
  };
}
