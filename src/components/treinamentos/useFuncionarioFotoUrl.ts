
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Hook para gerar a signed URL da foto, se necessário
export function useFuncionarioFotoUrl(foto: string | undefined | null) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!foto) {
      setImgUrl(null);
      return;
    }

    let path = foto;

    // Foto já é URL http(s)?
    if (/^https?:\/\//.test(path)) {
      // Pode ser signed mas já está como url válida
      setImgUrl(path);
      return;
    }

    // Pode vir só "funcionarios/abc.jpg" ou só "abc.jpg"
    if (!path.startsWith("funcionarios/")) {
      path = `funcionarios/${path}`;
    }

    // Gera signed URL de 4min
    supabase
      .storage
      .from("funcionarios-fotos")
      .createSignedUrl(path, 240)
      .then(({ data, error }) => {
        if (data?.signedUrl) setImgUrl(data.signedUrl);
        else setImgUrl(null);
      });
  }, [foto]);

  return imgUrl;
}
