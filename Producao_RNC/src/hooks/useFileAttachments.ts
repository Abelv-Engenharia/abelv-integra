import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileAttachment } from '@/types/rnc';
import { useToast } from '@/hooks/use-toast';

export const useFileAttachments = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    rncId: string,
    attachmentType: 'evidencia_nc' | 'evidencia_disposicao',
    description?: string,
    evidenceNumber?: number
  ): Promise<FileAttachment | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${attachmentType}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('rnc-attachments')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('rnc-attachments')
        .getPublicUrl(filePath);

      // Save attachment record to database
      const { data, error } = await supabase
        .from('rnc_attachments')
        .insert({
          rnc_id: rncId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          attachment_type: attachmentType,
          description: description,
          evidence_number: evidenceNumber
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        file_name: data.file_name,
        file_path: data.file_path,
        file_size: data.file_size,
        file_type: data.file_type,
        attachment_type: data.attachment_type as 'evidencia_nc' | 'evidencia_disposicao',
        uploaded_by: data.uploaded_by,
        url: publicUrl,
        description: data.description,
        evidence_number: data.evidence_number
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteFile = async (attachment: FileAttachment): Promise<boolean> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('rnc-attachments')
        .remove([attachment.file_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('rnc_attachments')
        .delete()
        .eq('id', attachment.id);

      if (dbError) {
        throw dbError;
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o arquivo",
        variant: "destructive"
      });
      return false;
    }
  };

  const getAttachmentsByRNC = async (rncId: string): Promise<FileAttachment[]> => {
    try {
      const { data, error } = await supabase
        .from('rnc_attachments')
        .select('*')
        .eq('rnc_id', rncId);

      if (error) {
        throw error;
      }

      return data.map((attachment: any) => ({
        id: attachment.id,
        file_name: attachment.file_name,
        file_path: attachment.file_path,
        file_size: attachment.file_size,
        file_type: attachment.file_type,
        attachment_type: attachment.attachment_type as 'evidencia_nc' | 'evidencia_disposicao',
        uploaded_by: attachment.uploaded_by,
        url: supabase.storage.from('rnc-attachments').getPublicUrl(attachment.file_path).data.publicUrl,
        description: attachment.description,
        evidence_number: attachment.evidence_number
      }));
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  };

  const downloadFile = async (filePath: string, fileName: string): Promise<void> => {
    try {
      const { data, error } = await supabase.storage
        .from('rnc-attachments')
        .download(filePath);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
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
  };

  return {
    uploading,
    uploadFile,
    deleteFile,
    getAttachmentsByRNC,
    downloadFile
  };
};