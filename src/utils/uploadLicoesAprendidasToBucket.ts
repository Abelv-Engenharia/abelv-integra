
import { supabase } from "@/integrations/supabase/client";

// Faz upload do arquivo de Lições Aprendidas para o bucket ocorrencias, retorna a URL pública
export async function uploadLicoesAprendidasToBucket(
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
  const fileName = `${normCodigoCca}_LICOES_APRENDIDAS_${dataFormatada}_${normClassificacao}.${fileExt}`;

  // Upload para o bucket
  const { data, error } = await supabase.storage
    .from("ocorrencias")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload do arquivo de lições aprendidas:", error);
    return null;
  }

  // Obter URL assinada (válida por 10 minutos)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("ocorrencias")
    .createSignedUrl(fileName, 600);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("Erro ao gerar URL assinada das lições aprendidas:", signedUrlError);
    return null;
  }

  return signedUrlData.signedUrl;
}

