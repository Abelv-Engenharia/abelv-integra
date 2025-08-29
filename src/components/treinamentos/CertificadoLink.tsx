
import React, { useState } from "react";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CertificadoLinkProps {
  certificadoUrl: string | null;
  className?: string;
}

export const CertificadoLink: React.FC<CertificadoLinkProps> = ({ 
  certificadoUrl, 
  className = "" 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleViewCertificate = async () => {
    if (!certificadoUrl) return;

    setLoading(true);
    
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = certificadoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log('Tentando baixar certificado:', fileName);
      
      // Usar a edge function para servir o certificado
      const functionUrl = `https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/serve-certificado?file=${encodeURIComponent(fileName)}`;
      
      // Baixar o arquivo e criar blob URL
      const response = await fetch(functionUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      console.log('Blob URL criada para certificado:', blobUrl);
      
      // Abrir em nova aba
      window.open(blobUrl, '_blank');
      
      // Limpar o blob URL após um tempo para liberar memória
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao abrir certificado:', err);
      toast({
        title: "Erro ao abrir certificado",
        description: "Não foi possível acessar o arquivo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!certificadoUrl) {
    return (
      <span className="text-muted-foreground text-xs">-</span>
    );
  }

  return (
    <button
      onClick={handleViewCertificate}
      disabled={loading}
      className={`text-blue-600 underline hover:text-blue-800 flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Carregando...</span>
        </>
      ) : (
        <>
          <span>Visualizar certificado</span>
          <ExternalLink className="h-3 w-3" />
        </>
      )}
    </button>
  );
};
