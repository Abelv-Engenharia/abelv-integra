
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCertificadoUrl(certificadoUrl: string | null) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificadoUrl) {
      setSignedUrl(null);
      return;
    }

    const generateUrl = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extrair o caminho do arquivo da URL
        const urlParts = certificadoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // Usar a edge function para servir o certificado
        const functionUrl = `https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/serve-certificado?file=${encodeURIComponent(fileName)}`;
        setSignedUrl(functionUrl);
      } catch (err) {
        console.error('Erro ao gerar URL do certificado:', err);
        setError('Erro interno ao gerar link do certificado');
        setSignedUrl(null);
      } finally {
        setLoading(false);
      }
    };

    generateUrl();
  }, [certificadoUrl]);

  return { signedUrl, loading, error };
}
