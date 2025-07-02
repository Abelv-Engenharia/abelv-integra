
import React from "react";
import { useCertificadoUrl } from "@/hooks/useCertificadoUrl";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";

interface CertificadoLinkProps {
  certificadoUrl: string | null;
  className?: string;
}

export const CertificadoLink: React.FC<CertificadoLinkProps> = ({ 
  certificadoUrl, 
  className = "" 
}) => {
  const { signedUrl, loading, error } = useCertificadoUrl(certificadoUrl);

  if (!certificadoUrl) {
    return (
      <span className="text-muted-foreground text-xs">-</span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-sm">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Carregando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-1 text-red-600 text-sm">
        <AlertCircle className="h-3 w-3" />
        <span>Erro ao carregar</span>
      </div>
    );
  }

  if (signedUrl) {
    return (
      <a
        href={signedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-600 underline hover:text-blue-800 flex items-center gap-1 ${className}`}
      >
        <span>Visualizar certificado</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  return (
    <span className="text-muted-foreground text-xs">Certificado indisponível</span>
  );
};
