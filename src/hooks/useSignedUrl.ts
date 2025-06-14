
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Gera signed URL válido por N segundos
export function useSignedUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (bucket: string, path: string, expiresInSeconds: number = 120) => {
    setLoading(true);
    setError(null);
    setUrl(null);
    // Tenta gerar signed URL
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      setError(error.message || "Erro ao gerar link do arquivo");
      setUrl(null);
    } else if (data?.signedUrl) {
      setUrl(data.signedUrl);
    } else {
      setError("URL inválida");
      setUrl(null);
    }
    setLoading(false);
  }, []);

  return { url, loading, error, generate };
}
