import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comunicado } from "@/types/comunicados";
import { useRegistrarCiencia } from "@/hooks/useComunicados";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image as ImageIcon, Download } from "lucide-react";

interface ComunicadoModalProps {
  comunicado: Comunicado;
  open: boolean;
  onCiencia: () => void;
}

const ComunicadoModal: React.FC<ComunicadoModalProps> = ({
  comunicado,
  open,
  onCiencia,
}) => {
  const [loading, setLoading] = useState(false);
  const registrarCiencia = useRegistrarCiencia();

  const handleCiencia = async () => {
    setLoading(true);
    try {
      await registrarCiencia.mutateAsync(comunicado.id);
      onCiencia();
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (url: string) => {
    if (url.includes('comunicados-anexos')) {
      const fileName = url.split('/').pop();
      const { data } = supabase.storage
        .from('comunicados-anexos')
        .getPublicUrl(fileName || '');
      return data.publicUrl;
    }
    return url;
  };

  const isImage = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const isPdf = (fileName: string) => {
    return /\.pdf$/i.test(fileName);
  };

  const renderAnexo = () => {
    if (!comunicado.arquivo_url || !comunicado.arquivo_nome) return null;

    const fileUrl = getFileUrl(comunicado.arquivo_url);
    const fileName = comunicado.arquivo_nome;

    if (isImage(fileName)) {
      return (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Anexo</span>
          </div>
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full h-auto rounded-lg border shadow-sm"
            style={{ maxHeight: '800px' }}
          />
        </div>
      );
    }

    if (isPdf(fileName)) {
      return (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Documento PDF</span>
          </div>
          <iframe
            src={fileUrl}
            className="w-full h-[700px] border rounded-lg shadow-sm"
            title={fileName}
          />
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </a>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">Anexo</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Baixar {fileName}
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {comunicado.titulo}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-8 p-4">
            {comunicado.descricao && (
              <div className="prose max-w-none">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
                  {comunicado.descricao}
                </p>
              </div>
            )}
            
            {renderAnexo()}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleCiencia}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? "Carregando..." : "Ciente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComunicadoModal;