
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Recebe a string do avatar_url do perfil e retorna uma URL utilizável,
 * assinando pelo Storage caso necessário.
 */
export function useProfileAvatarUrl(avatarUrl?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!avatarUrl) {
      setUrl(null);
      return;
    }

    // Se já é uma URL http(s), pode usar diretamente
    if (/^https?:\/\//.test(avatarUrl)) {
      setUrl(avatarUrl);
      return;
    }

    // Caso venha apenas com o nome do arquivo, assume bucket "avatars"
    let path = avatarUrl;
    if (!avatarUrl.startsWith("avatars/") && !avatarUrl.startsWith("/")) {
      path = "avatars/" + avatarUrl;
    }

    setLoading(true);

    supabase.storage
      .from("avatars")
      .createSignedUrl(path, 300)
      .then(({ data, error }) => {
        if (error || !data?.signedUrl) {
          setUrl(null);
        } else {
          setUrl(data.signedUrl);
        }
        setLoading(false);
      })
      .catch(() => {
        setUrl(null);
        setLoading(false);
      });

  }, [avatarUrl]);

  return { url, loading };
}
