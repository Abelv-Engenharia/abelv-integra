
import { supabase } from "@/integrations/supabase/client";

// Faz upload do arquivo Informe Preliminar para o bucket ocorrencias, retorna a URL pública
export async function uploadInformePreliminarToBucket(
  file: File,
  dataOcorrencia: Date | null,
  classificacaoOcorrencia: string | null
): Promise<string | null> {
  if (!dataOcorrencia || !classificacaoOcorrencia) {
    console.error("Data da ocorrência ou classificação da ocorrência não fornecido.");
    return null;
  }
  const dataFormatada = dataOcorrencia
    ? new Date(dataOcorrencia).toISOString().slice(0, 10).replace(/-/g, "")
    : "semdata";

  // Normaliza classificação para ser “seguro” em nomes de arquivos
  const normClassificacao = classificacaoOcorrencia
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 40);

  const fileExt = file.name.split('.').pop();
  const fileName = `INFORME PRELIMINAR_${dataFormatada}_${normClassificacao}.${fileExt}`;

  // Upload para o bucket
  const { data, error } = await supabase.storage
    .from("ocorrencias")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload do arquivo Informe Preliminar:", error);
    return null;
  }

  // Obter URL assinada (válida por 10 minutos)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("ocorrencias")
    .createSignedUrl(fileName, 600);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("Erro ao gerar URL assinada do informe:", signedUrlError);
    return null;
  }

  return signedUrlData.signedUrl;
}

