
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

    const generateSignedUrl = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extrair o caminho do arquivo da URL
        const urlParts = certificadoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // Gerar URL assinada válida por 1 hora
        const { data, error } = await supabase.storage
          .from('certificados-treinamentos-normativos')
          .createSignedUrl(fileName, 3600);

        if (error) {
          console.error('Erro ao gerar URL assinada:', error);
          setError(error.message);
          setSignedUrl(null);
        } else if (data?.signedUrl) {
          setSignedUrl(data.signedUrl);
        } else {
          setError('URL inválida');
          setSignedUrl(null);
        }
      } catch (err) {
        console.error('Exceção ao gerar URL assinada:', err);
        setError('Erro interno ao gerar link do certificado');
        setSignedUrl(null);
      } finally {
        setLoading(false);
      }
    };

    generateSignedUrl();
  }, [certificadoUrl]);

  return { signedUrl, loading, error };
}
