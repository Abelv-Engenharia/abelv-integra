import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileAttachment } from '@/types/sgq';

interface FileUploadProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  attachmentType: 'evidencia_nc' | 'evidencia_disposicao';
  label: string;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  attachments,
  onAttachmentsChange,
  attachmentType,
  label,
  maxFiles = 10,
  acceptedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;
    
    if (attachments.length + files.length > maxFiles) {
      toast({
        title: "Limite excedido",
        description: `Você pode anexar no máximo ${maxFiles} arquivos`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const newAttachments: FileAttachment[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${attachmentType}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('rnc-attachments')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('rnc-attachments')
          .getPublicUrl(filePath);

        const attachment: FileAttachment = {
          id: fileName,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          attachment_type: attachmentType,
          url: publicUrl
        };

        newAttachments.push(attachment);
      }

      onAttachmentsChange([...attachments, ...newAttachments]);
      
      toast({
        title: "Arquivos enviados",
        description: `${newAttachments.length} arquivo(s) anexado(s) com sucesso`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar os arquivos",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [attachments, attachmentType, maxFiles, onAttachmentsChange, toast]);

  const handleRemoveAttachment = useCallback(async (attachmentId: string) => {
    const attachment = attachments.find(a => a.id === attachmentId);
    if (!attachment) return;

    try {
      const { error } = await supabase.storage
        .from('rnc-attachments')
        .remove([attachment.file_path]);

      if (error) {
        throw error;
      }

      onAttachmentsChange(attachments.filter(a => a.id !== attachmentId));
      
      toast({
        title: "Arquivo removido",
        description: "Arquivo removido com sucesso",
      });
    } catch (error) {
      console.error('Error removing file:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o arquivo",
        variant: "destructive"
      });
    }
  }, [attachments, onAttachmentsChange, toast]);

  const handleDownload = useCallback(async (attachment: FileAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('rnc-attachments')
        .download(attachment.file_path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo",
        variant: "destructive"
      });
    }
  }, [toast]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">
          {attachments.length}/{maxFiles} arquivos
        </span>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <div className="p-6">
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id={`file-upload-${attachmentType}`}
            disabled={uploading || attachments.length >= maxFiles}
          />
          <label
            htmlFor={`file-upload-${attachmentType}`}
            className="flex flex-col items-center justify-center cursor-pointer space-y-2"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {uploading ? 'Enviando arquivos...' : 'Clique para selecionar arquivos'}
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedTypes.join(', ')} • Máximo {maxFiles} arquivos
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(attachment.file_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attachment.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
