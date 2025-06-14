import { useEffect, useState } from "react";
interface SystemLogoProps {
  className?: string;
  defaultTitle?: string;
}
const SystemLogo = ({
  className = "h-8",
  defaultTitle = "Gestão de SMS Abelv"
}: SystemLogoProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  useEffect(() => {
    // Recuperar a logo do localStorage
    const savedLogo = localStorage.getItem("system-logo");
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);
  if (logoUrl) {
    return <img src={logoUrl} alt="Logo do Sistema" className={`object-contain ${className}`} />;
  }

  // Retorna texto padrão se não houver logo
  return;
};
export default SystemLogo;