import { supabase } from "@/integrations/supabase/client";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";

interface NotaFiscalCreate {
  prestadorPjId: string;
  nomeEmpresa: string;
  nomeRepresentante: string;
  periodoContabil: string;
  ccaId: number;
  ccaCodigo: string;
  ccaNome: string;
  numero: string;
  dataEmissao: string;
  descricaoServico: string;
  valor: number;
  arquivo: File;
}

export const notasFiscaisService = {
  async criar(data: NotaFiscalCreate): Promise<NotaFiscal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Upload do arquivo para storage
    const timestamp = Date.now();
    const fileName = `${timestamp}_${data.arquivo.name}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('notas-fiscais')
      .upload(filePath, data.arquivo, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError);
      throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
    }

    // Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from('notas-fiscais')
      .getPublicUrl(filePath);

    // Inserir registro no banco
    const { data: notaFiscal, error: insertError } = await supabase
      .from('prestadores_notas_fiscais')
      .insert({
        prestador_pj_id: data.prestadorPjId,
        nomeempresa: data.nomeEmpresa,
        nomerepresentante: data.nomeRepresentante,
        periodocontabil: data.periodoContabil,
        cca_id: data.ccaId,
        cca_codigo: data.ccaCodigo,
        cca_nome: data.ccaNome,
        numero: data.numero,
        dataemissao: data.dataEmissao,
        descricaoservico: data.descricaoServico,
        valor: data.valor,
        arquivo_url: publicUrl,
        arquivo_nome: data.arquivo.name,
        status: 'Enviado',
        created_by: user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao inserir NF:', insertError);
      // Tentar remover o arquivo do storage em caso de erro
      await supabase.storage.from('notas-fiscais').remove([filePath]);
      throw new Error(`Erro ao salvar nota fiscal: ${insertError.message}`);
    }

    return {
      id: notaFiscal.id,
      numero: notaFiscal.numero,
      nomeempresa: notaFiscal.nomeempresa,
      nomerepresentante: notaFiscal.nomerepresentante,
      periodocontabil: notaFiscal.periodocontabil,
      cca: notaFiscal.cca_codigo,
      dataemissao: notaFiscal.dataemissao,
      descricaoservico: notaFiscal.descricaoservico,
      valor: notaFiscal.valor,
      arquivo: null,
      arquivonome: notaFiscal.arquivo_nome,
      status: notaFiscal.status as any,
      criadoem: notaFiscal.created_at,
      dataenviosienge: notaFiscal.dataenviosienge || undefined
    };
  },

  async listar(): Promise<NotaFiscal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from('prestadores_notas_fiscais')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar NFs:', error);
      throw new Error(`Erro ao listar notas fiscais: ${error.message}`);
    }

    return (data || []).map(nf => ({
      id: nf.id,
      numero: nf.numero,
      nomeempresa: nf.nomeempresa,
      nomerepresentante: nf.nomerepresentante,
      periodocontabil: nf.periodocontabil,
      cca: nf.cca_codigo,
      dataemissao: nf.dataemissao,
      descricaoservico: nf.descricaoservico,
      valor: nf.valor,
      arquivo: null,
      arquivonome: nf.arquivo_nome,
      status: nf.status as any,
      criadoem: nf.created_at,
      dataenviosienge: nf.dataenviosienge || undefined,
      mensagemerro: nf.mensagemerro || undefined
    }));
  }
};
