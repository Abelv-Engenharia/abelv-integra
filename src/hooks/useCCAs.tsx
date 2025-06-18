
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "./useUserCCAs";

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  ativo: boolean;
}

export const useCCAs = () => {
  const { data: userCCAs, isLoading: isLoadingUserCCAs } = useUserCCAs();

  return useQuery({
    queryKey: ['ccas', userCCAs?.map(cca => cca.id)],
    queryFn: async (): Promise<CCA[]> => {
      // Se ainda está carregando os CCAs do usuário, aguarda
      if (isLoadingUserCCAs) {
        return [];
      }

      // Se o usuário não tem CCAs permitidos, retorna vazio
      if (!userCCAs || userCCAs.length === 0) {
        return [];
      }

      // Retorna apenas os CCAs que o usuário tem acesso
      return userCCAs;
    },
    enabled: !isLoadingUserCCAs && !!userCCAs,
    staleTime: 5 * 60 * 1000,
  });
};
