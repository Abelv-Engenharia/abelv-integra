import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type DocumentStatus = 'elaboracao' | 'revisao' | 'aprovado' | 'obsoleto';

export interface SupabaseDocument {
  id: string;
  numero: string;
  numero_abelv?: string;
  titulo: string;
  disciplina: string;
  tipo: string;
  formato: string;
  versao_atual: string;
  data_revisao: string;
  status: DocumentStatus;
  responsavel_emissao: string;
  responsavel_revisao?: string;
  cliente: string;
  projeto: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentFile {
  id: string;
  document_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  version: string;
  uploaded_at: string;
}

export function useSupabaseDocuments() {
  const [documents, setDocuments] = useState<SupabaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments((data || []) as SupabaseDocument[]);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar documentos",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async (document: Omit<SupabaseDocument, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([document])
        .select()
        .single();

      if (error) throw error;
      
      await fetchDocuments(); // Refresh list
      toast({
        title: "Documento criado",
        description: "O documento foi criado com sucesso.",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erro ao criar documento",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateDocument = async (id: string, updates: Partial<SupabaseDocument>) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchDocuments(); // Refresh list
      toast({
        title: "Documento atualizado",
        description: "O documento foi atualizado com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar documento",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchDocuments(); // Refresh list
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao excluir documento",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const uploadFile = async (documentId: string, file: File, version: string = 'R00') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentId}/${version}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: fileRecord, error: dbError } = await supabase
        .from('document_files')
        .insert([{
          document_id: documentId,
          filename: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type,
          version: version
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Arquivo enviado",
        description: "O arquivo foi enviado com sucesso.",
      });

      return fileRecord;
    } catch (err: any) {
      toast({
        title: "Erro ao enviar arquivo",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const getDocumentFiles = async (documentId: string) => {
    try {
      const { data, error } = await supabase
        .from('document_files')
        .select('*')
        .eq('document_id', documentId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      toast({
        title: "Erro ao carregar arquivos",
        description: err.message,
        variant: "destructive"
      });
      return [];
    }
  };

  const getFileUrl = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (err: any) {
      toast({
        title: "Erro ao gerar URL do arquivo",
        description: err.message,
        variant: "destructive"
      });
      return null;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    getDocumentFiles,
    getFileUrl,
    refreshDocuments: fetchDocuments
  };
}