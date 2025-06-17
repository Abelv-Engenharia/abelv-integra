
import * as z from "zod";

export const ocorrenciaFormSchema = z.object({
  // Aba 1: Identificação
  data: z.coerce.date({ required_error: "Campo obrigatório" }),
  hora: z.string().min(1, "Campo obrigatório"),
  mes: z.string().min(1, "Campo obrigatório"),
  ano: z.string().min(1, "Campo obrigatório"),
  cca: z.string().min(1, "Campo obrigatório"),
  empresa: z.string().min(1, "Campo obrigatório"),
  disciplina: z.string().min(1, "Campo obrigatório"),
  engenheiro_responsavel: z.string().optional(),
  supervisor_responsavel: z.string().optional(),
  encarregado_responsavel: z.string().optional(),
  colaboradores_acidentados: z
    .array(
      z.object({
        colaborador: z.string().optional(),
        funcao: z.string().optional(),
        matricula: z.string().optional(),
      })
    )
    .optional(),
  tipoOcorrencia: z.string().min(1, "Campo obrigatório"),
  tipoEvento: z.string().min(1, "Campo obrigatório"),
  classificacaoOcorrencia: z.string().min(1, "Campo obrigatório"),

  // Informações Ocorrência
  houve_afastamento: z.string().optional(),
  dias_perdidos: z.union([z.number(), z.null()]).optional(),
  dias_debitados: z.union([z.number(), z.null()]).optional(),
  parte_corpo_atingida: z.string().optional(),
  lateralidade: z.string().optional(),
  agente_causador: z.string().optional(),
  situacao_geradora: z.string().optional(),
  natureza_lesao: z.string().optional(),
  descricaoOcorrencia: z.string().optional(),
  numeroCat: z.string().optional(),
  cid: z.string().optional(),
  arquivo_cat: z.any().optional(),

  // Classificação de Risco
  exposicao: z.string().optional(),
  controle: z.string().optional(),
  deteccao: z.string().optional(),
  efeitoFalha: z.string().optional(),
  impacto: z.string().optional(),
  probabilidade: z.number().optional(),
  severidade: z.number().optional(),
  classificacaoRisco: z.string().optional(),

  // Plano de Ação
  acoes: z
    .array(
      z.object({
        tratativa_aplicada: z.string().optional(),
        data_adequacao: z.date().nullable().optional(),
        responsavel_acao: z.string().optional(),
        funcao_responsavel: z.string().optional(),
        situacao: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .optional(),

  // Fechamento
  investigacao_realizada: z.string().optional(),
  informe_preliminar: z.any().optional(),
  relatorio_analise: z.any().optional(),
  licoes_aprendidas_enviada: z.string().optional(),
  arquivo_licoes_aprendidas: z.any().optional(),
  // outros campos podem ser adicionados aqui...
});

export type OcorrenciaFormSchema = z.infer<typeof ocorrenciaFormSchema>;
