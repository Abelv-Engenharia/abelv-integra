import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CCAData {
  id: number;
  codigo: string;
  nome: string;
}

interface UsuarioPrestadorData {
  prestadorPjId: string;
  nomeEmpresa: string;
  nomeRepresentante: string;
  numeroCredorSienge: string;
  funcao: string;
  ccaPrincipal: CCAData | null;
  ccasPermitidas: CCAData[];
}

export const useUsuarioPrestador = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['usuario-prestador', user?.id],
    queryFn: async (): Promise<UsuarioPrestadorData | null> => {
      if (!user?.id) return null;

      // Buscar prestador PJ vinculado ao usuário
      const { data: prestador, error: prestadorError } = await supabase
        .from('prestadores_pj')
        .select('id, razaosocial, nomecompleto, numerocredorsienge, cca_id, cca_codigo, cca_nome')
        .eq('usuario_sistema_id', user.id)
        .eq('ativo', true)
        .single();

      if (prestadorError || !prestador) {
        console.log('Nenhum prestador PJ vinculado ao usuário:', prestadorError);
        return null;
      }

      // Buscar função/cargo do usuário no profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cargo')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar cargo do usuário:', profileError);
      }

      // Buscar CCAs permitidas para o usuário via usuario_ccas
      const { data: usuarioCcas, error: ccasError } = await supabase
        .from('usuario_ccas')
        .select(`
          cca_id,
          ccas (
            id,
            codigo,
            nome
          )
        `)
        .eq('usuario_id', user.id)
        .eq('ativo', true);

      if (ccasError) {
        console.error('Erro ao buscar CCAs do usuário:', ccasError);
      }

      // Formatar CCAs permitidas
      const ccasPermitidas: CCAData[] = (usuarioCcas || [])
        .filter(uc => uc.ccas)
        .map(uc => ({
          id: (uc.ccas as any).id,
          codigo: (uc.ccas as any).codigo,
          nome: (uc.ccas as any).nome
        }));

      // CCA principal do prestador
      const ccaPrincipal = prestador.cca_id && prestador.cca_codigo && prestador.cca_nome
        ? {
            id: prestador.cca_id,
            codigo: prestador.cca_codigo,
            nome: prestador.cca_nome
          }
        : null;

      return {
        prestadorPjId: prestador.id,
        nomeEmpresa: prestador.razaosocial || '',
        nomeRepresentante: prestador.nomecompleto || '',
        numeroCredorSienge: prestador.numerocredorsienge || '',
        funcao: profile?.cargo || '',
        ccaPrincipal,
        ccasPermitidas
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000 // 10 minutos
  });
};
