

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
      
      console.log('Gerando signed URL para certificado:', fileName);
      
      // Usar createSignedUrl do Supabase
      const { data, error } = await supabase.storage
        .from('certificados-treinamentos-normativos')
        .createSignedUrl(fileName, 120); // 2 minutos de validade
      
      if (error) {
        console.error('Erro ao gerar signed URL:', error);
        toast({
          title: "Erro ao abrir certificado",
          description: "Não foi possível gerar link do arquivo",
          variant: "destructive",
        });
        return;
      }
      
      if (data?.signedUrl) {
        console.log('Signed URL gerada:', data.signedUrl);
        window.open(data.signedUrl, '_blank');
      }
      
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

