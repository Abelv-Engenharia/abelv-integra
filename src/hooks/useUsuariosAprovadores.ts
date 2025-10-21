import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UsuarioAprovador {
  id: string;
  nome: string;
  cargo: string;
}

export const useUsuariosAprovadores = (ccaId?: number) => {
  return useQuery({
    queryKey: ['usuarios-aprovadores', ccaId],
    queryFn: async () => {
      if (!ccaId) return [];

      try {
        // Primeiro buscar IDs dos usuários vinculados ao CCA
        const { data: usuariosCcaData, error: usuariosCcaError } = await supabase
          .from('usuario_ccas')
          .select('usuario_id')
          .eq('cca_id', ccaId)
          .eq('ativo', true);

        if (usuariosCcaError) {
          console.error('Erro ao buscar usuários do CCA:', usuariosCcaError);
          return [];
        }

        const usuariosIds = usuariosCcaData?.map(uc => uc.usuario_id) || [];
        if (usuariosIds.length === 0) return [];

        // Buscar dados dos usuários
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, cargo')
          .eq('ativo', true)
          .in('id', usuariosIds);

        if (error) {
          console.error('Erro ao buscar usuários aprovadores:', error);
          return [];
        }

        // Filtrar por cargos de supervisão/coordenação/gerência/diretoria
        const usuariosFiltrados = (data || []).filter(usuario => {
          const cargoLower = (usuario.cargo || '').toLowerCase();
          return (
            cargoLower.includes('supervis') ||
            cargoLower.includes('coorden') ||
            cargoLower.includes('gerente') ||
            cargoLower.includes('gerência') ||
            cargoLower.includes('diretor') ||
            cargoLower.includes('diretoria')
          );
        });

        return usuariosFiltrados.sort((a, b) => 
          (a.nome || '').localeCompare(b.nome || '')
        ) as UsuarioAprovador[];
      } catch (error) {
        console.error('Erro ao buscar usuários aprovadores:', error);
        return [];
      }
    },
    enabled: !!ccaId,
    staleTime: 5 * 60 * 1000,
  });
};
