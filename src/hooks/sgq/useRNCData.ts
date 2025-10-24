import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RNC, FileAttachment } from '@/types/sgq';
import { useAuth } from '@/contexts/AuthContext';

export const useRNCData = () => {
  const [rncs, setRncs] = useState<RNC[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRNCs();
  }, []);

  const fetchRNCs = async () => {
    try {
      const { data, error } = await supabase
        .from('rncs')
        .select(`
          *,
          ccas!cca_id (
            codigo
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear os dados para o formato RNC
      const mappedData: RNC[] = (data || []).map((item: any) => ({
        ...item,
        cca: item.ccas?.codigo || '',
        anexos_evidencias_nc: [],
        anexos_evidencia_disposicao: []
      }));

      setRncs(mappedData);
    } catch (error) {
      console.error('Erro ao buscar RNCs:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachments = async (
    rncId: string,
    attachments: FileAttachment[],
    attachmentType: 'evidencia_nc' | 'evidencia_disposicao'
  ) => {
    for (const attachment of attachments) {
      // Se já tem URL, significa que já foi feito upload (no componente EvidenceUpload)
      if (attachment.url) {
        // Criar registro na tabela rnc_attachments
        const { error: dbError } = await supabase
          .from('rnc_attachments')
          .insert({
            rnc_id: rncId,
            file_name: attachment.file_name,
            file_path: attachment.file_path,
            file_size: attachment.file_size,
            file_type: attachment.file_type,
            attachment_type: attachmentType,
            description: attachment.description,
            evidence_number: attachment.evidence_number,
            uploaded_by: user?.id
          });

        if (dbError) {
          console.error('Erro ao criar registro de anexo:', dbError);
        }
      }
    }
  };

  const createRNC = async (rncData: Omit<RNC, 'id' | 'created_at' | 'updated_at'>): Promise<RNC> => {
    try {
      // Buscar o ID do CCA pelo código
      const { data: ccaData } = await supabase
        .from('ccas')
        .select('id')
        .eq('codigo', rncData.cca)
        .single();

      // Preparar os dados para inserção
      // Converter strings vazias em null para campos de data
      const insertData = {
        numero: rncData.numero,
        data: rncData.data || null,
        cca_id: ccaData?.id,
        emitente: rncData.emitente,
        setor_projeto: rncData.setor_projeto || null,
        detectado_por: rncData.detectado_por || null,
        periodo_melhoria: rncData.periodo_melhoria || null,
        data_emissao: rncData.data_emissao,
        previsao_fechamento: rncData.previsao_fechamento || null,
        origem: rncData.origem,
        prioridade: rncData.prioridade,
        disciplina: rncData.disciplina,
        disciplina_outros: rncData.disciplina_outros || null,
        descricao_nc: rncData.descricao_nc,
        evidencias_nc: rncData.evidencias_nc || null,
        disposicao: rncData.disposicao,
        empresa_disposicao: rncData.empresa_disposicao || null,
        responsavel_disposicao: rncData.responsavel_disposicao || null,
        data_disposicao: rncData.data_disposicao || null,
        prazo_disposicao: rncData.prazo_disposicao || null,
        analise_disposicao: rncData.analise_disposicao || null,
        status: rncData.status,
        created_by: user?.id
      };

      // Inserir RNC
      const { data, error } = await supabase
        .from('rncs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Upload de anexos se existirem
      if (rncData.anexos_evidencias_nc?.length) {
        await uploadAttachments(data.id, rncData.anexos_evidencias_nc, 'evidencia_nc');
      }
      if (rncData.anexos_evidencia_disposicao?.length) {
        await uploadAttachments(data.id, rncData.anexos_evidencia_disposicao, 'evidencia_disposicao');
      }

      // Atualizar lista local
      await fetchRNCs();

      return {
        ...data,
        cca: rncData.cca,
        anexos_evidencias_nc: rncData.anexos_evidencias_nc || [],
        anexos_evidencia_disposicao: rncData.anexos_evidencia_disposicao || []
      } as RNC;
    } catch (error) {
      console.error('Erro ao criar RNC:', error);
      throw error;
    }
  };

  const updateRNC = async (id: string, rncData: Omit<RNC, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    try {
      // Buscar o ID do CCA pelo código
      const { data: ccaData } = await supabase
        .from('ccas')
        .select('id')
        .eq('codigo', rncData.cca)
        .single();

      // Preparar os dados para atualização
      const updateData = {
        numero: rncData.numero,
        data: rncData.data || null,
        cca_id: ccaData?.id,
        emitente: rncData.emitente,
        setor_projeto: rncData.setor_projeto || null,
        detectado_por: rncData.detectado_por || null,
        periodo_melhoria: rncData.periodo_melhoria || null,
        data_emissao: rncData.data_emissao,
        previsao_fechamento: rncData.previsao_fechamento || null,
        origem: rncData.origem,
        prioridade: rncData.prioridade,
        disciplina: rncData.disciplina,
        disciplina_outros: rncData.disciplina_outros || null,
        descricao_nc: rncData.descricao_nc,
        evidencias_nc: rncData.evidencias_nc || null,
        disposicao: rncData.disposicao,
        empresa_disposicao: rncData.empresa_disposicao || null,
        responsavel_disposicao: rncData.responsavel_disposicao || null,
        data_disposicao: rncData.data_disposicao || null,
        prazo_disposicao: rncData.prazo_disposicao || null,
        analise_disposicao: rncData.analise_disposicao || null,
        status: rncData.status
      };

      const { error } = await supabase
        .from('rncs')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Upload de novos anexos se existirem
      if (rncData.anexos_evidencias_nc?.length) {
        await uploadAttachments(id, rncData.anexos_evidencias_nc, 'evidencia_nc');
      }
      if (rncData.anexos_evidencia_disposicao?.length) {
        await uploadAttachments(id, rncData.anexos_evidencia_disposicao, 'evidencia_disposicao');
      }

      await fetchRNCs();
    } catch (error) {
      console.error('Erro ao atualizar RNC:', error);
      throw error;
    }
  };

  const getRNC = async (id: string): Promise<RNC | null> => {
    try {
      const { data, error } = await supabase
        .from('rncs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Buscar anexos
      const { data: attachments } = await supabase
        .from('rnc_attachments')
        .select('*')
        .eq('rnc_id', id);

      // Gerar URLs assinadas para os anexos
      const attachmentsWithUrls = await Promise.all(
        (attachments || []).map(async (att) => {
          const { data: signedUrlData } = await supabase.storage
            .from('rnc-attachments')
            .createSignedUrl(att.file_path, 31536000); // 1 ano
          
          return {
            ...att,
            url: signedUrlData?.signedUrl
          };
        })
      );

      // Buscar código do CCA
      const { data: ccaData } = await supabase
        .from('ccas')
        .select('codigo')
        .eq('id', data.cca_id)
        .single();

      // Mapear anexos para o tipo FileAttachment
      const mapAttachment = (att: any): FileAttachment => ({
        id: att.id,
        file_name: att.file_name,
        file_path: att.file_path,
        file_size: att.file_size,
        file_type: att.file_type,
        attachment_type: att.attachment_type as 'evidencia_nc' | 'evidencia_disposicao',
        description: att.description,
        evidence_number: att.evidence_number,
        uploaded_by: att.uploaded_by,
        url: att.url
      });

      return {
        ...data,
        cca: ccaData?.codigo || '',
        anexos_evidencias_nc: attachmentsWithUrls?.filter(a => a.attachment_type === 'evidencia_nc').map(mapAttachment) || [],
        anexos_evidencia_disposicao: attachmentsWithUrls?.filter(a => a.attachment_type === 'evidencia_disposicao').map(mapAttachment) || []
      } as RNC;
    } catch (error) {
      console.error('Erro ao buscar RNC:', error);
      return null;
    }
  };

  const closeRNC = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('rncs')
        .update({
          status: 'fechada',
          data_fechamento: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchRNCs();
    } catch (error) {
      console.error('Erro ao fechar RNC:', error);
      throw error;
    }
  };

  return {
    rncs,
    loading,
    createRNC,
    updateRNC,
    getRNC,
    closeRNC
  };
};
