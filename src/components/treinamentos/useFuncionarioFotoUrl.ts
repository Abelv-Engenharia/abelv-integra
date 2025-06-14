
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Hook para gerar a signed URL da foto, se necessário
export function useFuncionarioFotoUrl(foto: string | undefined | null) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  useEffect(() => {
    if (!foto) {
      setImgUrl(null);
      setImgError(null);
      return;
    }

    let path = foto;
    setImgError(null);

    // Foto já é URL http(s)?
    if (/^https?:\/\//.test(path)) {
      setImgUrl(path);
      setImgError(null);
      return;
    }

    // Pode vir só "funcionarios/abc.jpg" ou só "abc.jpg"
    if (!path.startsWith("funcionarios/")) {
      path = `funcionarios/${path}`;
    }

    supabase
      .storage
      .from("funcionarios-fotos")
      .createSignedUrl(path, 240)
      .then(({ data, error }) => {
        if (data?.signedUrl) {
          setImgUrl(data.signedUrl);
          setImgError(null);
        } else {
          setImgUrl(null);
          setImgError(error?.message || "Erro ao gerar URL assinado da foto");
          console.error("Erro Supabase signedUrl:", error, "Path tentado:", path);
        }
      }).catch((err) => {
        setImgUrl(null);
        setImgError("Erro inesperado ao tentar obter a foto.");
        console.error("Erro inesperado useFuncionarioFotoUrl:", err, "Path:", path);
      });
  }, [foto]);

  return { imgUrl, imgError };
}
