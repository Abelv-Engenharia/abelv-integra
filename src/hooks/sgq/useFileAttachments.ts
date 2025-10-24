import { supabase } from '@/integrations/supabase/client';
import { FileAttachment } from '@/types/sgq';

export const useFileAttachments = () => {
  const uploadFile = async (
    file: File,
    rncId: string,
    attachmentType: 'evidencia_nc' | 'evidencia_disposicao',
    description?: string,
    evidenceNumber?: number
  ): Promise<FileAttachment> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${rncId}/${attachmentType}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('rnc-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Gerar URL assinada válida por 1 ano (31536000 segundos)
    const { data: signedUrlData } = await supabase.storage
      .from('rnc-attachments')
      .createSignedUrl(filePath, 31536000);

    const attachment: FileAttachment = {
      id: fileName,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      attachment_type: attachmentType,
      url: signedUrlData?.signedUrl,
      description,
      evidence_number: evidenceNumber
    };

    return attachment;
  };

  const deleteFile = async (attachment: FileAttachment): Promise<boolean> => {
    const { error } = await supabase.storage
      .from('rnc-attachments')
      .remove([attachment.file_path]);

    return !error;
  };

  const downloadFile = async (filePath: string, fileName: string): Promise<void> => {
    const { data, error } = await supabase.storage
      .from('rnc-attachments')
      .download(filePath);

    if (error) throw error;

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    uploadFile,
    deleteFile,
    downloadFile
  };
};
