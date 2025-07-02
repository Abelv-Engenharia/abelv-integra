
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TarefaAnexoProps {
  anexo: string;
  onView?: () => void;
}

export const TarefaAnexo: React.FC<TarefaAnexoProps> = ({ anexo, onView }) => {
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    if (onView) {
      onView();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('tarefas-anexos')
        .createSignedUrl(anexo, 60); // URL válida por 60 segundos

      if (error) {
        console.error("Erro ao gerar URL:", error);
        toast.error("Erro ao visualizar anexo");
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        toast.error("Não foi possível gerar link para visualização");
      }
    } catch (error) {
      console.error("Erro ao visualizar anexo:", error);
      toast.error("Erro ao visualizar anexo");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('tarefas-anexos')
        .download(anexo);

      if (error) {
        console.error("Erro ao baixar arquivo:", error);
        toast.error("Erro ao baixar anexo");
        return;
      }

      if (data) {
        const fileName = anexo.split('/').pop() || 'anexo';
        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Arquivo baixado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao baixar anexo:", error);
      toast.error("Erro ao baixar anexo");
    } finally {
      setLoading(false);
    }
  };

  const getFileName = (path: string) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    // Remove o timestamp e hash do nome do arquivo
    const cleanName = fileName.replace(/^\d+_[a-z0-9]+\./, '');
    return cleanName || fileName;
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center" 
        onClick={handleView}
        disabled={loading}
      >
        <Eye className="h-4 w-4 mr-2" />
        {loading ? "Carregando..." : "Visualizar"}
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center" 
        onClick={handleDownload}
        disabled={loading}
      >
        <Download className="h-4 w-4 mr-2" />
        {loading ? "Baixando..." : getFileName(anexo)}
      </Button>
    </div>
  );
};
