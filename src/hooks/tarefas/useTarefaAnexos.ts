import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface TarefaAnexo {
  id: string;
  tarefa_id: string;
  nome_original: string;
  nome_arquivo: string;
  tamanho: number | null;
  tipo_arquivo: string | null;
  created_at: string;
  created_by: string | null;
}

export function useTarefaAnexos(tarefaId: string | undefined) {
  const [anexos, setAnexos] = useState<TarefaAnexo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const carregarAnexos = async () => {
    if (!tarefaId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tarefas_anexos')
        .select('*')
        .eq('tarefa_id', tarefaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnexos(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar anexos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anexos da tarefa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAnexos();
  }, [tarefaId]);

  const gerarNomeArquivo = (nomeOriginal: string, tituloTarefa: string) => {
    const agora = new Date();
    const mes = format(agora, "MM");
    const ano = format(agora, "yyyy");
    
    // Limpar o título da tarefa para usar como nome do arquivo
    const tituloLimpo = tituloTarefa
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '_') // Substitui espaços por underscore
      .substring(0, 50); // Limita o tamanho
    
    const extensao = nomeOriginal.split('.').pop();
    return `${tituloLimpo}_${mes}_${ano}.${extensao}`;
  };

  const adicionarAnexo = async (arquivo: File, tituloTarefa: string) => {
    if (!tarefaId) {
      toast({
        title: "Erro",
        description: "ID da tarefa não encontrado.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Gerar nome do arquivo personalizado
      const nomePersonalizado = gerarNomeArquivo(arquivo.name, tituloTarefa);
      const nomeUnico = `${tarefaId}/${Date.now()}_${nomePersonalizado}`;

      // Upload do arquivo para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('tarefas-anexos')
        .upload(nomeUnico, arquivo);

      if (uploadError) throw uploadError;

      // Inserir registro na tabela de anexos
      const { error: insertError } = await supabase
        .from('tarefas_anexos')
        .insert({
          tarefa_id: tarefaId,
          nome_original: arquivo.name,
          nome_arquivo: nomeUnico,
          tamanho: arquivo.size,
          tipo_arquivo: arquivo.type,
          // created_by será definido automaticamente pelo trigger
        });

      if (insertError) {
        // Se falhou ao inserir, remover o arquivo do storage
        await supabase.storage.from('tarefas-anexos').remove([nomeUnico]);
        throw insertError;
      }

      // Recarregar lista de anexos
      await carregarAnexos();
      
      toast({
        title: "Anexo adicionado",
        description: "Arquivo anexado com sucesso à tarefa.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao adicionar anexo:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível anexar o arquivo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removerAnexo = async (anexoId: string, nomeArquivo: string) => {
    try {
      // Remover arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('tarefas-anexos')
        .remove([nomeArquivo]);

      if (storageError) throw storageError;

      // Remover registro da tabela
      const { error: deleteError } = await supabase
        .from('tarefas_anexos')
        .delete()
        .eq('id', anexoId);

      if (deleteError) throw deleteError;

      // Atualizar lista local
      setAnexos(anexos.filter(anexo => anexo.id !== anexoId));
      
      toast({
        title: "Anexo removido",
        description: "Arquivo removido com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao remover anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o anexo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const visualizarAnexo = async (nomeArquivo: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('tarefas-anexos')
        .download(nomeArquivo);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      return url;
    } catch (error: any) {
      console.error("Erro ao visualizar anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível visualizar o arquivo.",
        variant: "destructive",
      });
      return null;
    }
  };

  const baixarAnexo = async (anexo: TarefaAnexo) => {
    try {
      const { data, error } = await supabase.storage
        .from('tarefas-anexos')
        .download(anexo.nome_arquivo);

      if (error) throw error;

      // Usar o nome original para o download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = anexo.nome_original;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download concluído",
        description: "Arquivo baixado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao baixar anexo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  };

  return {
    anexos,
    loading,
    adicionarAnexo,
    removerAnexo,
    visualizarAnexo,
    baixarAnexo,
    carregarAnexos,
  };
}