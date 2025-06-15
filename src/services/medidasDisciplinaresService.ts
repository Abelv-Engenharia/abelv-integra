import { supabase } from "@/integrations/supabase/client";
import {
  MedidaDisciplinar,
  MedidaDisciplinarFormData,
  DB_TO_UI_TIPO_MAP,
  UI_TO_DB_TIPO_MAP,
  TipoMedidaAplicada,
} from "@/types/medidasDisciplinares";

/* Buscar CCAs para select */
export async function listarCCAs() {
  const { data, error } = await supabase
    .from("ccas")
    .select("id, codigo, nome")
    .order("nome", { ascending: true });
  if (error) throw error;
  return data;
}

/* Buscar funcionários ativos para um CCA específico */
export async function listarFuncionariosPorCCAOuTodos(cca_id?: string) {
  let query = supabase
    .from("funcionarios")
    .select("id, nome, matricula")
    .eq("ativo", true);
  if (cca_id && cca_id !== "") query = query.eq("cca_id", parseInt(cca_id));
  const { data, error } = await query.order("nome", { ascending: true });
  if (error) throw error;
  return data;
}

// Utilitário para extrair ano e mês de data ISO yyyy-MM-dd
function getAnoMes(dataISO: string): { ano: string; mes: string } {
  const [ano, mes] = (dataISO || '').split('-');
  return { ano: ano || '', mes: mes || '' };
}

/* Buscar tipos de medida disciplinar do banco */
export async function listarTiposMedidaDisciplinar() {
  const { data, error } = await supabase
    .from("tipo_medida_disciplinar")
    .select("nome, id")
    .eq("ativo", true)
    .order("id", { ascending: true });
  if (error) throw error;
  // Retorna array de objetos com { id, nome }
  return data || [];
}

/* Criar medida disciplinar - converter entre form e banco */
export async function criarMedidaDisciplinar(form: MedidaDisciplinarFormData, arquivoUrl?: string) {
  const { cca_id, funcionario_id, tipo_medida, data_aplicacao, descricao } = form;
  const { ano, mes } = getAnoMes(data_aplicacao);

  // Converta o nome do tipo do UI (TipoMedidaAplicada) para formato banco
  const medidaBanco = tipo_medida
    ? UI_TO_DB_TIPO_MAP[tipo_medida as TipoMedidaAplicada]
    : undefined;

  // O Supabase espera explicitamente o tipo do enum, então garantimos o cast correto aqui:
  // (o valor sempre será um dos especificados porque vem do UI_TO_DB_TIPO_MAP)
  const insertObj: {
    cca_id: number;
    funcionario_id: string;
    medida: "ADVERTÊNCIA VERBAL" | "ADVERTÊNCIA FORMAL" | "SUSPENSÃO" | "DEMISSÃO POR JUSTA CAUSA";
    data: string;
    motivo: string;
    pdf_url: string | null;
    ano: string;
    mes: string;
  } = {
    cca_id: parseInt(cca_id, 10),
    funcionario_id,
    medida: medidaBanco as "ADVERTÊNCIA VERBAL" | "ADVERTÊNCIA FORMAL" | "SUSPENSÃO" | "DEMISSÃO POR JUSTA CAUSA",
    data: data_aplicacao,
    motivo: descricao ?? "",
    pdf_url: arquivoUrl || null,
    ano,
    mes,
  };

  const { data, error } = await supabase
    .from("medidas_disciplinares")
    .insert([insertObj])
    .select("*")
    .single();
  if (error) throw error;

  // Mapeia medida do banco para formato UI
  return {
    id: data.id,
    cca_id: data.cca_id?.toString() || "",
    funcionario_id: data.funcionario_id || "",
    tipo_medida: data.medida ? DB_TO_UI_TIPO_MAP[data.medida] : "",
    data_aplicacao: data.data,
    descricao: data.motivo,
    arquivo_url: data.pdf_url,
    created_at: data.created_at,
  };
}

/* Upload de arquivo PDF no bucket 'medidas_disciplinares' */
export async function uploadArquivoPdf(file: File, userId: string) {
  const ext = file.name.split(".").pop();
  const path = `pdfs/${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from("medidas_disciplinares").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: "application/pdf",
  });
  if (error) throw error;
  const { data: publicData } = supabase.storage.from("medidas_disciplinares").getPublicUrl(path);
  return publicData.publicUrl;
}
