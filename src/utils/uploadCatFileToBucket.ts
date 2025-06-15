
import { supabase } from "@/integrations/supabase/client";

// Faz upload do arquivo CAT para o bucket ocorrencias, retorna a URL pública
export async function uploadCatFileToBucket(file: File): Promise<string | null> {
  // Gera um nome único para o arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 8)}.${fileExt}`;

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
