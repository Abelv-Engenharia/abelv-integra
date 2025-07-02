
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { toast } from "sonner";

interface TarefaAnexoProps {
  anexo: string;
  onView?: () => void;
}

export const TarefaAnexo: React.FC<TarefaAnexoProps> = ({ anexo, onView }) => {
  const handleView = () => {
    if (onView) {
      onView();
    } else {
      // Implementação básica para visualização
      toast.info(`Visualizando anexo: ${anexo}`);
      console.log("Tentando visualizar anexo:", anexo);
    }
  };

  const handleDownload = () => {
    // Por enquanto, apenas log do arquivo
    // Em produção, isso deveria baixar o arquivo ou gerar um signed URL
    toast.info(`Baixando anexo: ${anexo}`);
    console.log("Tentando baixar anexo:", anexo);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="flex items-center" onClick={handleView}>
        <Eye className="h-4 w-4 mr-2" />
        Visualizar
      </Button>
      <Button variant="outline" className="flex items-center" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />
        {anexo}
      </Button>
    </div>
  );
};
