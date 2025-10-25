import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getNivelHierarquico } from "@/constants/cargosHierarquia";

export const useResponsaveisSuperiores = (ccaId: number | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['responsaveis-superiores', ccaId, user?.id],
    queryFn: async () => {
      if (!ccaId || !user?.id) return [];

      // Buscar cargo do usuário atual
      const { data: usuarioAtual, error: usuarioError } = await supabase
        .from('profiles')
        .select('cargo')
        .eq('id', user.id)
        .single();

      if (usuarioError || !usuarioAtual?.cargo) {
        console.error('Erro ao buscar cargo do usuário:', usuarioError);
        return [];
      }

      const nivelAtual = getNivelHierarquico(usuarioAtual.cargo);

      // Buscar usuários ativos
      const { data: usuarios, error: usuariosError } = await supabase
        .from('profiles')
        .select('id, nome, email, cargo')
        .eq('ativo', true)
        .neq('id', user.id);

      if (usuariosError) {
        console.error('Erro ao buscar usuários:', usuariosError);
        return [];
      }

      // Buscar usuários do mesmo CCA
      const { data: usuariosCca, error: ccaError } = await supabase
        .from('usuario_ccas')
        .select('usuario_id')
        .eq('cca_id', ccaId)
        .eq('ativo', true);

      if (ccaError) {
        console.error('Erro ao buscar CCAs dos usuários:', ccaError);
        return [];
      }

      const usuariosIdsCca = usuariosCca.map(uc => uc.usuario_id);

      // Filtrar usuários com cargo superior no mesmo CCA
      return usuarios
        .filter(u => 
          u.cargo && 
          usuariosIdsCca.includes(u.id) &&
          getNivelHierarquico(u.cargo) > nivelAtual
        )
        .sort((a, b) => a.nome.localeCompare(b.nome));
    },
    enabled: !!ccaId && !!user?.id,
    staleTime: 5 * 60 * 1000
  });
};
