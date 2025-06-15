
import { supabase } from "@/integrations/supabase/client";

/**
 * Faz upload da imagem de avatar para o bucket 'avatars'.
 * Retorna o path salvo com sucesso, ou null se erro.
 */
export async function uploadAvatarToBucket(userId: string, file: File): Promise<string | null> {
  if (!userId || !file) return null;

  const ext = file.name.split('.').pop();
  const filename = `avatar-${userId}-${Date.now()}.${ext}`;
  const filePath = `avatars/${filename}`;

  // Upload da imagem
  const { error } = await supabase.storage
    .from("avatars")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Erro no upload do avatar:", error);
    return null;
  }
  // Salva apenas o nome do arquivo (para manter padrão do hook de URL)
  return filename;
}
