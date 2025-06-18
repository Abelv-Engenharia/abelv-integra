
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
        // Buscar o perfil do usuário e seus CCAs permitidos
        const { data: userPerfil, error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .select(`
            perfil_id,
            perfis (
              ccas_permitidas
            )
          `)
          .eq('usuario_id', user.id)
          .single();

        if (userPerfilError) {
          console.error("Erro ao buscar perfil do usuário:", userPerfilError);
          return [];
        }

        const ccasPermitidas = userPerfil?.perfis?.ccas_permitidas as number[] || [];
        
        // Se não tem CCAs específicos, retorna vazio (sem acesso)
        if (!ccasPermitidas || ccasPermitidas.length === 0) {
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

        return ccas || [];
      } catch (error) {
        console.error("Erro ao verificar CCAs do usuário:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000
  });
};
