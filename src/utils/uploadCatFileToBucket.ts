
import { supabase } from "@/integrations/supabase/client";

// Faz upload do arquivo CAT para o bucket ocorrencias, retorna a URL pública
export async function uploadCatFileToBucket(
  file: File,
  dataOcorrencia: Date | null,
  colaboradorAcidentado: string | null
): Promise<string | null> {
  // Gera nome do arquivo no padrão: CAT_<data_ocorrencia>_<colaborador>.pdf
  if (!dataOcorrencia || !colaboradorAcidentado) {
    console.error("Data da ocorrência ou colaborador acidentado não fornecido.");
    return null;
  }
  const dataFormatada = dataOcorrencia
    ? new Date(dataOcorrencia).toISOString().slice(0, 10).replace(/-/g, "")
    : "semdata";
  // Remover espaços, acentos e caracteres especiais do nome do colaborador
  const normColab = colaboradorAcidentado
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 40); // Limita tamanho
  
  const fileExt = file.name.split('.').pop();
  const fileName = `CAT_${dataFormatada}_${normColab}.${fileExt}`;

  // Upload para o bucket
  const { data, error } = await supabase.storage
    .from("ocorrencias")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload do arquivo CAT:", error);
    return null;
  }

  // Obter URL assinada (válida por 10 minutos)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("ocorrencias")
    .createSignedUrl(fileName, 600);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    console.error("Erro ao gerar URL assinada do arquivo CAT:", signedUrlError);
    return null;
  }

  return signedUrlData.signedUrl;
}
