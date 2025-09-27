
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUserCCAs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-ccas', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        console.log('Buscando CCAs para usuário:', user.id);
        
        // Buscar CCAs permitidos do novo sistema (profiles.ccas_permitidas)
        const { data: userProfile, error: userProfileError } = await supabase
          .from('profiles')
          .select('ccas_permitidas')
          .eq('id', user.id)
          .single();

        if (userProfileError) {
          console.error("Erro ao buscar perfil do usuário:", userProfileError);
          return [];
        }

        console.log('Perfil do usuário encontrado:', userProfile);

        const ccasPermitidas = userProfile?.ccas_permitidas as number[] || [];
        console.log('CCAs permitidas:', ccasPermitidas);
        
        // Se não tem CCAs específicos, retorna vazio (sem acesso)
        if (!ccasPermitidas || ccasPermitidas.length === 0) {
          console.log('Usuário sem CCAs permitidas');
          return [];
        }

        // Buscar os detalhes dos CCAs permitidos
        const { data: ccas, error: ccasError } = await supabase
          .from('ccas')
          .select('*')
          .in('id', ccasPermitidas)
          .eq('ativo', true)
          .order('nome');

        if (ccasError) {
          console.error("Erro ao buscar CCAs:", ccasError);
          return [];
        }

        console.log('CCAs do usuário:', ccas);
        return ccas || [];
      } catch (error) {
        console.error("Erro ao verificar CCAs do usuário:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos de cache
    gcTime: 15 * 60 * 1000, // 15 minutos antes de garbage collect
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
