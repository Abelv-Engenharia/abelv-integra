
import { useEffect, useState } from "react";

// Hook simples que retorna a URL da logo salva via "Configuração de Logo"
export function useSystemLogoUrl() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedLogo = localStorage.getItem("system-logo");
    setLogoUrl(storedLogo || null);
  }, []);

  return logoUrl;
}
