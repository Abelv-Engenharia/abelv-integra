
// Função para subir o Relatório de Análise e Investigação (RAI) para o bucket 'ocorrencias'
import { supabase } from "@/integrations/supabase/client";

// Faz upload do arquivo RAI para o bucket ocorrencias, retorna a URL pública
export async function uploadRAIToBucket(
  file: File,
  dataOcorrencia: Date | null,
  classificacaoOcorrencia: string | null,
  codigoCca: string | null
): Promise<string | null> {
  if (!dataOcorrencia || !classificacaoOcorrencia || !codigoCca) {
    console.error("Data da ocorrência, classificação da ocorrência ou código do CCA não fornecido.");
    return null;
  }
  // Data no formato dd.mm.aaaa
  const oc = new Date(dataOcorrencia);
  const dd = String(oc.getDate()).padStart(2, '0');
  const mm = String(oc.getMonth() + 1).padStart(2, '0');
  const aaaa = oc.getFullYear();
  const dataFormatada = `${dd}.${mm}.${aaaa}`;

  // Normaliza classificação para ser “seguro” em nomes de arquivos
  const normClassificacao = classificacaoOcorrencia
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 40);

  // Normaliza código do CCA para evitar caracteres indesejados
  const normCodigoCca = codigoCca
    .toString()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 20);

  const fileExt = file.name.split('.').pop();
  const fileName = `${normCodigoCca}_RAI_${dataFormatada}_${normClassificacao}.${fileExt}`;

  // Upload para o bucket
  const { data, error } = await supabase.storage
    .from("ocorrencias")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload do arquivo RAI:", error);
    return null;
  }

  // Gerar URL pública do arquivo
  const { data: { publicUrl } } = supabase.storage
    .from("ocorrencias")
    .getPublicUrl(fileName);

  console.log(`[UPLOAD] RAI enviado com sucesso: ${fileName}`);
  console.log(`[UPLOAD] URL pública gerada: ${publicUrl}`);
  return publicUrl;
}
