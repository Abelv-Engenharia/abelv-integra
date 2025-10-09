import { useQueryClient } from "@tanstack/react-query";

export const useSubcentroCustoInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateSubcentrosQueries = async (ccaId?: number) => {
    if (ccaId) {
      await queryClient.invalidateQueries({ 
        queryKey: ['subcentros-custos', ccaId] 
      });
    }
    
    // Invalidar também todas as queries de subcentros
    await queryClient.invalidateQueries({ 
      queryKey: ['subcentros-custos'] 
    });
  };

  return { invalidateSubcentrosQueries };
};
