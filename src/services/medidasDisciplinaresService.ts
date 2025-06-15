
import { supabase } from "@/integrations/supabase/client";
import { MedidaDisciplinar, MedidaDisciplinarFormData } from "@/types/medidasDisciplinares";

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
  if (cca_id) query = query.eq("cca_id", cca_id);
  const { data, error } = await query.order("nome", { ascending: true });
  if (error) throw error;
  return data;
}

/* Criar medida disciplinar */
export async function criarMedidaDisciplinar(form: MedidaDisciplinarFormData, arquivoUrl?: string) {
  const { cca_id, funcionario_id, tipo_medida, data_aplicacao, descricao } = form;
  const { data, error } = await supabase.from("medidas_disciplinares").insert([
    {
      cca_id,
      funcionario_id,
      tipo_medida,
      data_aplicacao,
      descricao,
      arquivo_url: arquivoUrl || null,
    }
  ]).select("*").single();
  if (error) throw error;
  return data as MedidaDisciplinar;
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
  const { data: { publicUrl } } = supabase.storage.from("medidas_disciplinares").getPublicUrl(path);
  return publicUrl;
}
