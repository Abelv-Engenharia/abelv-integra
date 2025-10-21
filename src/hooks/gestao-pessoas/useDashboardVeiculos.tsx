import { useMemo } from "react";
import { useVeiculos } from "./useVeiculos";
import { useCondutores } from "./useCondutores";
import { useMultas } from "./useMultas";
import { useAbastecimentos } from "./useAbastecimentos";
import { differenceInDays, isSameMonth, format } from "date-fns";
import { MultaCompleta } from "@/types/gestao-pessoas/multa";
import { FuelTransaction } from "@/types/gestao-pessoas/fuel";
import { Database } from "@/integrations/supabase/types";

type VeiculoDB = Database['public']['Tables']['veiculos']['Row'];
type CondutorDB = Database['public']['Tables']['veiculos_condutores']['Row'];
type MultaDB = Database['public']['Tables']['veiculos_multas']['Row'];
type AbastecimentoDB = Database['public']['Tables']['veiculos_abastecimentos']['Row'];

// Interfaces para os componentes
interface Veiculo {
  id: string;
  status: string;
  locadora: string;
  tipoLocacao: string;
  placa: string;
  modelo: string;
  condutorAtual?: string;
  dataInicioLocacao?: Date;
  dataFimLocacao?: Date;
}

interface Condutor {
  id: string;
  nome: string;
  cpf: string;
  categoriaCnh: string;
  validadeCnh: Date;
  statusCnh: string;
  termoResponsabilidade?: boolean;
}

// Funções de conversão
const converterVeiculo = (v: VeiculoDB): Veiculo => ({
  id: v.id,
  status: v.status,
  locadora: v.locadora_nome || 'Não informada',
  tipoLocacao: v.tipo_locacao,
  placa: v.placa,
  modelo: v.modelo,
  condutorAtual: v.condutor_principal_nome,
  dataInicioLocacao: new Date(v.data_retirada),
  dataFimLocacao: new Date(v.data_devolucao)
});

const converterCondutor = (c: CondutorDB): Condutor => ({
  id: c.id,
  nome: c.nome_condutor,
  cpf: c.cpf,
  categoriaCnh: c.categoria_cnh,
  validadeCnh: new Date(c.validade_cnh),
  statusCnh: c.status_cnh,
  termoResponsabilidade: c.termo_responsabilidade_assinado
});

const converterMulta = (m: MultaDB): MultaCompleta => ({
  id: m.id,
  numeroAutoInfracao: m.numero_auto_infracao,
  dataMulta: new Date(m.data_multa),
  horario: m.horario,
  ocorrencia: m.ocorrencia,
  pontos: m.pontos,
  condutorInfrator: m.condutor_infrator_nome,
  placa: m.placa,
  dataNotificacao: m.data_notificacao ? new Date(m.data_notificacao) : undefined,
  responsavel: m.responsavel || undefined,
  veiculo: m.veiculo_modelo || undefined,
  locadora: m.locadora_nome || undefined,
  valor: m.valor || undefined,
  numeroFatura: m.numero_fatura || undefined,
  tituloSienge: m.titulo_sienge || undefined,
  indicadoOrgao: m.indicado_orgao as 'Sim' | 'Não' | 'Pendente',
  statusMulta: m.status_multa as any,
  documentoNotificacao: m.documento_notificacao_url || undefined,
  formularioPreenchido: m.formulario_preenchido_url || undefined,
  comprovanteIndicacao: m.comprovante_indicacao_url || undefined,
  emailCondutorEnviado: m.email_condutor_enviado_em ? new Date(m.email_condutor_enviado_em) : undefined,
  emailRHFinanceiroEnviado: m.email_rh_financeiro_enviado_em ? new Date(m.email_rh_financeiro_enviado_em) : undefined,
  descontoConfirmado: m.desconto_confirmado,
  createdAt: new Date(m.created_at),
  updatedAt: new Date(m.updated_at),
  createdBy: m.created_by || '',
  localCompleto: m.local_completo || undefined,
  emailCondutor: m.email_condutor || undefined
});

const converterAbastecimento = (a: AbastecimentoDB): FuelTransaction => ({
  id: a.id,
  motorista: a.motorista,
  centro_custo: a.centro_custo || '',
  placa: a.placa,
  modelo_veiculo: a.modelo_veiculo || '',
  tipo_cartao: a.tipo_cartao || '',
  numero_cartao: a.numero_cartao || '',
  data_hora_transacao: a.data_hora_transacao,
  uf_ec: a.uf_estabelecimento || '',
  cidade_ec: a.cidade_estabelecimento || '',
  nome_ec: a.nome_estabelecimento || '',
  tipo_mercadoria: a.tipo_mercadoria || '',
  mercadoria: a.mercadoria || '',
  qtd_mercadoria: a.quantidade_litros || 0,
  valor: a.valor,
  data_upload: a.data_upload,
  usuario_responsavel: a.usuario_responsavel || ''
});

export const useDashboardVeiculos = (periodo: 'mensal' | 'trimestral' | 'anual' = 'mensal') => {
  const { data: veiculosDB = [], isLoading: isLoadingVeiculos } = useVeiculos();
  const { data: condutoresDB = [], isLoading: isLoadingCondutores } = useCondutores();
  const { data: multasDB = [], isLoading: isLoadingMultas } = useMultas();
  const { data: abastecimentosDB = [], isLoading: isLoadingAbastecimentos } = useAbastecimentos();

  const isLoading = isLoadingVeiculos || isLoadingCondutores || isLoadingMultas || isLoadingAbastecimentos;

  // Converter dados do banco para formatos esperados pelos componentes
  const veiculos = useMemo(() => veiculosDB.map(converterVeiculo), [veiculosDB]);
  const condutores = useMemo(() => condutoresDB.map(converterCondutor), [condutoresDB]);
  const multas = useMemo(() => multasDB.map(converterMulta), [multasDB]);
  const abastecimentos = useMemo(() => abastecimentosDB.map(converterAbastecimento), [abastecimentosDB]);

  const dashboardData = useMemo(() => {
    // KPIs
    const veiculosAtivos = veiculos.filter(v => v.status === 'Ativo').length;

    const cnhVencendo = condutores.filter(c => {
      const diasRestantes = differenceInDays(c.validadeCnh, new Date());
      return diasRestantes > 0 && diasRestantes <= 30;
    }).length;

    const multasPendentes = multas.filter(m => m.statusMulta !== 'Processo Concluído').length;

    // Calcular pontuação por condutor a partir das multas
    const pontuacaoPorCondutor = new Map<string, number>();
    multas.forEach(m => {
      const nome = m.condutorInfrator;
      const pontos = pontuacaoPorCondutor.get(nome) || 0;
      pontuacaoPorCondutor.set(nome, pontos + m.pontos);
    });

    const condutoresCriticos = Array.from(pontuacaoPorCondutor.values()).filter(
      pontos => pontos >= 20
    ).length;

    const gastosCombustivelMes = abastecimentos
      .filter(a => isSameMonth(new Date(a.data_hora_transacao), new Date()))
      .reduce((sum, a) => sum + a.valor, 0);

    const totalMultasMes = multas
      .filter(m => isSameMonth(m.dataMulta, new Date()))
      .reduce((sum, m) => sum + (m.valor || 0), 0);

    // Dados para gráficos de veículos
    const veiculosPorStatus = veiculos.reduce((acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const veiculosPorLocadora = veiculos.reduce((acc, v) => {
      const locadora = v.locadora || 'Não informado';
      acc[locadora] = (acc[locadora] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const veiculosPorTipoLocacao = veiculos.reduce((acc, v) => {
      acc[v.tipoLocacao] = (acc[v.tipoLocacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Próximas devoluções (próximos 30 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 30);
    
    const proximasDevolucoes = veiculos
      .filter(v => {
        if (!v.dataFimLocacao) return false;
        return v.dataFimLocacao >= new Date() && v.dataFimLocacao <= dataLimite;
      })
      .sort((a, b) => (a.dataFimLocacao?.getTime() || 0) - (b.dataFimLocacao?.getTime() || 0))
      .slice(0, 10)
      .map(v => ({
        placa: v.placa,
        modelo: v.modelo,
        dataDevolucao: v.dataFimLocacao!.toISOString(),
        diasRestantes: differenceInDays(v.dataFimLocacao!, new Date())
      }));

    // Dados para gráficos de multas
    const multasPorStatus = multas.reduce((acc, m) => {
      acc[m.statusMulta] = (acc[m.statusMulta] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const multasPorOcorrencia = multas.reduce((acc, m) => {
      acc[m.ocorrencia] = (acc[m.ocorrencia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top 10 ocorrências
    const topOcorrencias = Object.entries(multasPorOcorrencia)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([ocorrencia, quantidade]) => ({ ocorrencia, quantidade }));

    // Evolução mensal de multas (últimos 6 meses)
    const multasPorMes = multas.reduce((acc, m) => {
      const mes = format(m.dataMulta, 'MM/yyyy');
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Dados para gráficos de condutores
    const condutoresPorStatusCNH = condutores.reduce((acc, c) => {
      acc[c.statusCnh] = (acc[c.statusCnh] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ranking de condutores por pontuação
    const rankingCondutores = Array.from(pontuacaoPorCondutor.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([nome, pontos]) => ({ nome, pontos }));

    // Dados para gráficos de abastecimento
    const totalLitros = abastecimentos.reduce((sum, a) => sum + a.qtd_mercadoria, 0);
    const mediaLitrosPorAbastecimento = abastecimentos.length > 0
      ? totalLitros / abastecimentos.length
      : 0;

    const abastecimentosPorTipo = abastecimentos.reduce((acc, a) => {
      const tipo = a.tipo_mercadoria || 'Não informado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Evolução mensal de gastos com combustível (últimos 6 meses)
    const gastosPorMes = abastecimentos.reduce((acc, a) => {
      const mes = format(new Date(a.data_hora_transacao), 'MM/yyyy');
      acc[mes] = (acc[mes] || 0) + a.valor;
      return acc;
    }, {} as Record<string, number>);

    // Top veículos por consumo
    const consumoPorVeiculo = abastecimentos.reduce((acc, a) => {
      if (!acc[a.placa]) {
        acc[a.placa] = { placa: a.placa, modelo: a.modelo_veiculo, total: 0, litros: 0 };
      }
      acc[a.placa].total += a.valor;
      acc[a.placa].litros += a.qtd_mercadoria;
      return acc;
    }, {} as Record<string, any>);

    const topVeiculosConsumo = Object.values(consumoPorVeiculo)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10);

    return {
      kpis: {
        veiculosAtivos,
        cnhVencendo,
        multasPendentes,
        condutoresCriticos,
        gastosCombustivelMes,
        totalMultasMes
      },
      veiculos: {
        porStatus: veiculosPorStatus,
        porLocadora: veiculosPorLocadora,
        porTipoLocacao: veiculosPorTipoLocacao,
        proximasDevolucoes
      },
      multas: {
        porStatus: multasPorStatus,
        porOcorrencia: multasPorOcorrencia,
        topOcorrencias,
        evolucaoMensal: multasPorMes
      },
      condutores: {
        porStatusCNH: condutoresPorStatusCNH,
        ranking: rankingCondutores
      },
      abastecimento: {
        totalLitros,
        mediaLitrosPorAbastecimento,
        porTipo: abastecimentosPorTipo,
        evolucaoGastos: gastosPorMes,
        topVeiculosConsumo
      },
      rawData: {
        veiculos,
        multas,
        condutores,
        abastecimentos
      }
    };
  }, [veiculos, condutores, multas, abastecimentos, periodo]);

  return {
    dashboardData,
    isLoading
  };
};
