import { supabase } from "@/integrations/supabase/client";
import { Comunicado, ComunicadoCiencia } from "@/types/comunicados";

export const comunicadosService = {
  // Buscar comunicados ativos para o usuário
  async getComunicadosAtivos(): Promise<Comunicado[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    // Buscar CCAs do usuário
    const { data: usuarioCcas } = await supabase
      .from('usuario_ccas')
      .select('cca_id')
      .eq('usuario_id', user.user.id)
      .eq('ativo', true);
    
    const ccasDoUsuario = usuarioCcas?.map(uc => uc.cca_id) || [];

    const { data, error } = await supabase
      .from('comunicados')
      .select('*')
      .eq('ativo', true)
      .lte('data_inicio', new Date().toISOString().split('T')[0])
      .gte('data_fim', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filtrar por público-alvo
    const comunicadosFiltrados = (data as Comunicado[]).filter(comunicado => {
      const { tipo, cca_id, usuarios_ids } = comunicado.publico_alvo;
      
      if (tipo === 'todos') return true;
      
      if (tipo === 'cca') {
        return cca_id && ccasDoUsuario.includes(cca_id);
      }
      
      if (tipo === 'usuarios') {
        return usuarios_ids && usuarios_ids.includes(user.user.id);
      }
      
      return false;
    });

    return comunicadosFiltrados;
  },

  // Buscar comunicados pendentes (sem ciência)
  async getComunicadosPendentes(): Promise<Comunicado[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    // Buscar CCAs do usuário
    const { data: usuarioCcas } = await supabase
      .from('usuario_ccas')
      .select('cca_id')
      .eq('usuario_id', user.user.id)
      .eq('ativo', true);
    
    const ccasDoUsuario = usuarioCcas?.map(uc => uc.cca_id) || [];

    // Buscar todos os comunicados ativos
    const { data: comunicados, error: comunicadosError } = await supabase
      .from('comunicados')
      .select('*')
      .eq('ativo', true)
      .lte('data_inicio', new Date().toISOString().split('T')[0])
      .gte('data_fim', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false });

    if (comunicadosError) throw comunicadosError;

    // Buscar ciências do usuário
    const { data: ciencias, error: cienciasError } = await supabase
      .from('comunicados_ciencia')
      .select('comunicado_id')
      .eq('usuario_id', user.user.id);

    if (cienciasError) throw cienciasError;

    // Filtrar por público-alvo
    const comunicadosFiltradosPorAlvo = (comunicados as Comunicado[]).filter(comunicado => {
      const { tipo, cca_id, usuarios_ids } = comunicado.publico_alvo;
      
      if (tipo === 'todos') return true;
      
      if (tipo === 'cca') {
        return cca_id && ccasDoUsuario.includes(cca_id);
      }
      
      if (tipo === 'usuarios') {
        return usuarios_ids && usuarios_ids.includes(user.user.id);
      }
      
      return false;
    });

    // Filtrar comunicados sem ciência
    const comunicadosComCiencia = new Set(ciencias?.map(c => c.comunicado_id) || []);
    const comunicadosPendentes = comunicadosFiltradosPorAlvo.filter(
      comunicado => !comunicadosComCiencia.has(comunicado.id)
    );

    return comunicadosPendentes;
  },

  // Registrar ciência de um comunicado
  async registrarCiencia(comunicadoId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('comunicados_ciencia')
      .insert({
        comunicado_id: comunicadoId,
        usuario_id: user.user.id
      });

    if (error) throw error;
  },

  // Criar comunicado (admin)
  async criarComunicado(comunicado: Omit<Comunicado, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<Comunicado> {
    const { data, error } = await supabase
      .from('comunicados')
      .insert(comunicado)
      .select()
      .single();

    if (error) throw error;
    return data as Comunicado;
  },

  // Atualizar comunicado (admin)
  async atualizarComunicado(id: string, comunicado: Partial<Comunicado>): Promise<Comunicado> {
    const { data, error } = await supabase
      .from('comunicados')
      .update(comunicado)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Comunicado;
  },

  // Excluir comunicado (admin)
  async excluirComunicado(id: string): Promise<void> {
    const { error } = await supabase
      .from('comunicados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Buscar todos os comunicados (admin)
  async getComunicados(): Promise<Comunicado[]> {
    const { data, error } = await supabase
      .from('comunicados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Comunicado[]) || [];
  },

  // Buscar comunicado por ID
  async getComunicadoPorId(id: string): Promise<Comunicado> {
    const { data, error } = await supabase
      .from('comunicados')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Comunicado;
  },

  // Buscar ciências de um comunicado (admin)
  async getCienciasComunicado(comunicadoId: string): Promise<ComunicadoCiencia[]> {
    // Primeiro buscar todas as ciências do comunicado
    const { data: cienciasData, error: cienciasError } = await supabase
      .from('comunicados_ciencia')
      .select('*')
      .eq('comunicado_id', comunicadoId)
      .order('data_ciencia', { ascending: false });

    if (cienciasError) {
      console.error('Erro ao buscar ciências:', cienciasError);
      throw cienciasError;
    }

    console.log('Ciências encontradas:', cienciasData);

    if (!cienciasData || cienciasData.length === 0) {
      return [];
    }

    // Buscar os perfis dos usuários
    const userIds = cienciasData.map(c => c.usuario_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome, email')
      .in('id', userIds);

    if (profilesError) {
      console.error('Erro ao buscar profiles:', profilesError);
      throw profilesError;
    }

    console.log('Profiles encontrados:', profiles);

    // Mapear os dados combinando ciências com profiles
    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const resultado = cienciasData.map(ciencia => ({
      ...ciencia,
      profiles: profilesMap.get(ciencia.usuario_id) || { nome: 'Usuário não encontrado', email: 'N/A' }
    })) as ComunicadoCiencia[];

    console.log('Resultado final:', resultado);
    return resultado;
  },

  // Upload de arquivo anexo
  async uploadAnexo(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('comunicados-anexos')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('comunicados-anexos')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  // Excluir arquivo anexo
  async excluirAnexo(url: string): Promise<void> {
    const fileName = url.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from('comunicados-anexos')
      .remove([fileName]);

    if (error) throw error;
  }
};