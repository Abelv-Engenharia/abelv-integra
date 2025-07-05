
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PdfUploadProps {
  onFileUploaded: (url: string) => void;
  currentFile?: string;
  onFileRemoved?: () => void;
}

export function PdfUpload({ onFileUploaded, currentFile, onFileRemoved }: PdfUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se é um arquivo PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Erro no upload",
        description: "Por favor, selecione apenas arquivos PDF.",
        variant: "destructive",
      });
      return;
    }

    // Verificar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erro no upload",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = 'pdf';
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('relatorios-inspecao-hsa')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('relatorios-inspecao-hsa')
        .getPublicUrl(filePath);

      onFileUploaded(publicUrl);
      
      toast({
        title: "Upload realizado com sucesso",
        description: "O relatório foi anexado à inspeção.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao fazer upload do arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    if (onFileRemoved) {
      onFileRemoved();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Relatório da Inspeção (PDF)</Label>
      
      {currentFile ? (
        <div className="flex items-center gap-2 p-2 border rounded">
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="text-sm flex-1">Relatório anexado</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="pdf-upload"
          />
          <Label
            htmlFor="pdf-upload"
            className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors w-full"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">
              {uploading ? "Fazendo upload..." : "Clique para anexar relatório PDF"}
            </span>
          </Label>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Formatos aceitos: PDF (máximo 10MB)
      </p>
    </div>
  );
}
