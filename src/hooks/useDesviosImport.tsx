import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DesvioImportData } from "@/types/desviosImport";

interface ValidatedDesvioRow {
  data_desvio: string;
  cca_id: number;
  responsavel_inspecao: string;
  descricao_desvio: string;
  tipo_registro_id?: number;
  processo_id?: number;
  evento_identificado_id?: number;
  causa_provavel_id?: number;
  empresa_id?: number;
  disciplina_id?: number;
  engenheiro_responsavel_id?: string;
  supervisor_responsavel_id?: string;
  encarregado_responsavel_id?: string;
  base_legal_opcao_id?: number;
  hora_desvio?: string;
  acao_imediata?: string;
  status?: string;
  prazo_conclusao?: string;
  exposicao?: number;
  controle?: number;
  deteccao?: number;
  efeito_falha?: number;
  impacto?: number;
  imagem_url?: string;
}

export const useDesviosImport = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    valid: ValidatedDesvioRow[];
    invalid: { data: DesvioImportData; errors: string[] }[];
  }>({
    valid: [],
    invalid: [],
  });

  const normalizeDate = (value?: string | null): string | null => {
    if (!value) return null;
    const dateStr = String(value).trim();
    
    const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, d, m, y] = ddmmyyyyMatch;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    const yyyymmddMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (yyyymmddMatch) {
      const [, y, m, d] = yyyymmddMatch;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    return null;
  };

  const validateImport = async (rows: DesvioImportData[]) => {
    setIsValidating(true);
    try {
      const { data: ccas } = await supabase.from("ccas").select("id, codigo");
      const { data: tiposRegistro } = await supabase.from("tipos_registro").select("id, nome, codigo");
      const { data: processos } = await supabase.from("processos").select("id, nome, codigo");
      const { data: eventosIdentificados } = await supabase.from("eventos_identificados").select("id, nome, codigo");
      const { data: causasProvaveis } = await supabase.from("causas_provaveis").select("id, nome, codigo");
      const { data: empresas } = await supabase.from("empresas").select("id, nome");
      const { data: disciplinas } = await supabase.from("disciplinas").select("id, nome, codigo");
      const { data: baseLeglOpcoes } = await supabase.from("base_legal_opcoes").select("id, nome, codigo");
      const { data: engenheiros } = await supabase.from("engenheiros").select("id, nome");
      const { data: supervisores } = await supabase.from("supervisores").select("id, nome");
      const { data: encarregados } = await supabase.from("encarregados").select("id, nome");
      const { data: exposicaoOpcoes } = await supabase.from("exposicao_opcoes").select("codigo, valor");
      const { data: controleOpcoes } = await supabase.from("controle_opcoes").select("codigo, valor");
      const { data: deteccaoOpcoes } = await supabase.from("deteccao_opcoes").select("codigo, valor");
      const { data: efeitoFalhaOpcoes } = await supabase.from("efeito_falha_opcoes").select("codigo, valor");
      const { data: impactoOpcoes } = await supabase.from("impacto_opcoes").select("codigo, valor");

      const valid: ValidatedDesvioRow[] = [];
      const invalid: { data: DesvioImportData; errors: string[] }[] = [];

      for (const row of rows) {
        const errors: string[] = [];

        if (!row.data_desvio) errors.push("Data do desvio é obrigatória");
        if (!row.cca_codigo) errors.push("Código CCA é obrigatório");
        if (!row.responsavel_inspecao) errors.push("Responsável pela inspeção é obrigatório");
        if (!row.descricao_desvio) errors.push("Descrição do desvio é obrigatória");

        const normalizedDate = normalizeDate(row.data_desvio);
        if (row.data_desvio && !normalizedDate) {
          errors.push("Data inválida. Use DD/MM/AAAA ou AAAA-MM-DD");
        }

        const cca = ccas?.find((c) => c.codigo === row.cca_codigo);
        if (row.cca_codigo && !cca) {
          errors.push(`CCA ${row.cca_codigo} não encontrado`);
        }

        let tipoRegistroId: number | undefined;
        if (row.tipo_registro) {
          const tr = tiposRegistro?.find((t) => 
            t.codigo?.toLowerCase() === row.tipo_registro?.toLowerCase() ||
            t.nome?.toLowerCase() === row.tipo_registro?.toLowerCase()
          );
          if (!tr) errors.push(`Tipo de registro "${row.tipo_registro}" não encontrado`);
          else tipoRegistroId = tr.id;
        }

        let processoId: number | undefined;
        if (row.processo) {
          const p = processos?.find((p) => 
            p.codigo?.toLowerCase() === row.processo?.toLowerCase() ||
            p.nome?.toLowerCase() === row.processo?.toLowerCase()
          );
          if (!p) errors.push(`Processo "${row.processo}" não encontrado`);
          else processoId = p.id;
        }

        let eventoId: number | undefined;
        if (row.evento_identificado) {
          const e = eventosIdentificados?.find((e) => 
            e.codigo?.toLowerCase() === row.evento_identificado?.toLowerCase() ||
            e.nome?.toLowerCase() === row.evento_identificado?.toLowerCase()
          );
          if (!e) errors.push(`Evento "${row.evento_identificado}" não encontrado`);
          else eventoId = e.id;
        }

        let causaId: number | undefined;
        if (row.causa_provavel) {
          const c = causasProvaveis?.find((c) => 
            c.codigo?.toLowerCase() === row.causa_provavel?.toLowerCase() ||
            c.nome?.toLowerCase() === row.causa_provavel?.toLowerCase()
          );
          if (!c) errors.push(`Causa provável "${row.causa_provavel}" não encontrada`);
          else causaId = c.id;
        }

        let empresaId: number | undefined;
        if (row.empresa) {
          const e = empresas?.find((e) => e.nome?.toLowerCase() === row.empresa?.toLowerCase());
          if (!e) errors.push(`Empresa "${row.empresa}" não encontrada`);
          else empresaId = e.id;
        }

        let disciplinaId: number | undefined;
        if (row.disciplina) {
          const d = disciplinas?.find((d) => 
            d.codigo?.toLowerCase() === row.disciplina?.toLowerCase() ||
            d.nome?.toLowerCase() === row.disciplina?.toLowerCase()
          );
          if (!d) errors.push(`Disciplina "${row.disciplina}" não encontrada`);
          else disciplinaId = d.id;
        }

        let baseLegalId: number | undefined;
        if (row.base_legal) {
          const bl = baseLeglOpcoes?.find((bl) => 
            bl.codigo?.toLowerCase() === row.base_legal?.toLowerCase() ||
            bl.nome?.toLowerCase() === row.base_legal?.toLowerCase()
          );
          if (!bl) errors.push(`Base legal "${row.base_legal}" não encontrada`);
          else baseLegalId = bl.id;
        }

        let engenheiroId: string | undefined;
        if (row.engenheiro_responsavel) {
          const eng = engenheiros?.find((e) => e.nome?.toLowerCase() === row.engenheiro_responsavel?.toLowerCase());
          if (!eng) errors.push(`Engenheiro "${row.engenheiro_responsavel}" não encontrado`);
          else engenheiroId = eng.id;
        }

        let supervisorId: string | undefined;
        if (row.supervisor_responsavel) {
          const sup = supervisores?.find((s) => s.nome?.toLowerCase() === row.supervisor_responsavel?.toLowerCase());
          if (!sup) errors.push(`Supervisor "${row.supervisor_responsavel}" não encontrado`);
          else supervisorId = sup.id;
        }

        let encarregadoId: string | undefined;
        if (row.encarregado_responsavel) {
          const enc = encarregados?.find((e) => e.nome?.toLowerCase() === row.encarregado_responsavel?.toLowerCase());
          if (!enc) errors.push(`Encarregado "${row.encarregado_responsavel}" não encontrado`);
          else encarregadoId = enc.id;
        }

        let exposicaoValor: number | undefined;
        if (row.exposicao) {
          const exp = exposicaoOpcoes?.find((o) => o.codigo?.toLowerCase() === row.exposicao?.toLowerCase());
          if (!exp) errors.push(`Exposição "${row.exposicao}" não encontrada`);
          else exposicaoValor = exp.valor;
        }

        let controleValor: number | undefined;
        if (row.controle) {
          const ctrl = controleOpcoes?.find((o) => o.codigo?.toLowerCase() === row.controle?.toLowerCase());
          if (!ctrl) errors.push(`Controle "${row.controle}" não encontrado`);
          else controleValor = ctrl.valor;
        }

        let deteccaoValor: number | undefined;
        if (row.deteccao) {
          const det = deteccaoOpcoes?.find((o) => o.codigo?.toLowerCase() === row.deteccao?.toLowerCase());
          if (!det) errors.push(`Detecção "${row.deteccao}" não encontrada`);
          else deteccaoValor = det.valor;
        }

        let efeitoFalhaValor: number | undefined;
        if (row.efeito_falha) {
          const ef = efeitoFalhaOpcoes?.find((o) => o.codigo?.toLowerCase() === row.efeito_falha?.toLowerCase());
          if (!ef) errors.push(`Efeito falha "${row.efeito_falha}" não encontrado`);
          else efeitoFalhaValor = ef.valor;
        }

        let impactoValor: number | undefined;
        if (row.impacto) {
          const imp = impactoOpcoes?.find((o) => o.codigo?.toLowerCase() === row.impacto?.toLowerCase());
          if (!imp) errors.push(`Impacto "${row.impacto}" não encontrado`);
          else impactoValor = imp.valor;
        }

        const normalizedPrazo = normalizeDate(row.prazo_conclusao);

        if (errors.length > 0) {
          invalid.push({ data: row, errors });
        } else if (cca && normalizedDate) {
          valid.push({
            data_desvio: normalizedDate,
            cca_id: cca.id,
            responsavel_inspecao: row.responsavel_inspecao!,
            descricao_desvio: row.descricao_desvio!,
            hora_desvio: row.hora_desvio,
            tipo_registro_id: tipoRegistroId,
            processo_id: processoId,
            evento_identificado_id: eventoId,
            causa_provavel_id: causaId,
            empresa_id: empresaId,
            disciplina_id: disciplinaId,
            engenheiro_responsavel_id: engenheiroId,
            supervisor_responsavel_id: supervisorId,
            encarregado_responsavel_id: encarregadoId,
            base_legal_opcao_id: baseLegalId,
            acao_imediata: row.acao_imediata,
            status: row.status || "Aberto",
            prazo_conclusao: normalizedPrazo || undefined,
            exposicao: exposicaoValor,
            controle: controleValor,
            deteccao: deteccaoValor,
            efeito_falha: efeitoFalhaValor,
            impacto: impactoValor,
            imagem_url: row.imagem_url,
          });
        }
      }

      setValidationResults({ valid, invalid });

      if (valid.length > 0) {
        toast.success(`${valid.length} registros válidos prontos para importação`);
      }
      if (invalid.length > 0) {
        toast.error(`${invalid.length} registros com erros`);
      }
    } catch (error) {
      console.error("Erro na validação:", error);
      toast.error("Erro ao validar dados");
    } finally {
      setIsValidating(false);
    }
  };

  const importDesvios = async () => {
    if (validationResults.valid.length === 0) {
      toast.error("Nenhum registro válido para importar");
      return;
    }

    setIsImporting(true);
    try {
      const { data, error } = await supabase
        .from("desvios_completos")
        .insert(validationResults.valid)
        .select();

      if (error) throw error;

      toast.success(`${data?.length || 0} desvios importados com sucesso`);
      setValidationResults({ valid: [], invalid: [] });
    } catch (error: any) {
      console.error("Erro ao importar:", error);
      toast.error(error.message || "Erro ao importar desvios");
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isValidating,
    isImporting,
    validationResults,
    validateImport,
    importDesvios,
  };
};
