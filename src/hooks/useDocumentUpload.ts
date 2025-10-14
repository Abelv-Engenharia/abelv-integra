import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UploadDocumentData {
  nomearquivo: string;
  categoriaId: string;
  subcategoriaId: string;
  datavalidade: string;
  responsavelEmail: string;
  responsavelNome: string;
  responsavelId: string;
  descricao?: string;
  arquivo: File;
}

export const useDocumentUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UploadDocumentData) => {
      // 1. Upload do arquivo para o storage
      const fileExt = data.arquivo.name.split('.').pop();
      const fileName = `${Date.now()}_${data.nomearquivo}.${fileExt}`;
      const filePath = `${data.categoriaId}/${data.subcategoriaId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('repositorio-documentos')
        .upload(filePath, data.arquivo);

      if (uploadError) throw uploadError;

      // 2. Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('repositorio-documentos')
        .getPublicUrl(filePath);

      // 3. Inserir registro no banco
      const { data: documento, error: dbError } = await supabase
        .from('repositorio_documentos')
        .insert({
          nome_arquivo: data.nomearquivo,
          arquivo_nome_original: data.arquivo.name,
          categoria_id: data.categoriaId,
          subcategoria_id: data.subcategoriaId,
          arquivo_url: publicUrl,
          arquivo_tamanho: data.arquivo.size,
          arquivo_tipo: data.arquivo.type,
          data_validade: data.datavalidade,
          responsavel_email: data.responsavelEmail,
          responsavel_nome: data.responsavelNome,
          responsavel_id: data.responsavelId,
          descricao: data.descricao,
          versao: 1,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return documento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositorio-documentos"] });
      toast({
        title: "Documento enviado com sucesso!",
        description: "O arquivo foi salvo no repositório.",
      });
    },
    onError: (error) => {
      console.error("Erro ao enviar documento:", error);
      toast({
        title: "Erro ao enviar documento",
        description: "Não foi possível salvar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
