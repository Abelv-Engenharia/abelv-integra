
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const useCCAInvalidation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateAllCCAQueries = async () => {
    // Invalidate all CCA-related queries
    const queriesToInvalidate = [
      ['user-ccas'],
      ['admin-ccas'],
      ['ccas'],
      ['user-ccas', user?.id],
    ];

    // Invalidate specific queries
    for (const queryKey of queriesToInvalidate) {
      await queryClient.invalidateQueries({ queryKey });
    }

    // Invalidate any query that might contain CCA data
    await queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey.some(key => 
          typeof key === 'string' && (
            key.toLowerCase().includes('cca') || 
            key.includes('funcionarios') ||
            key.includes('empresas') ||
            key.includes('engenheiros') ||
            key.includes('supervisores') ||
            key.includes('encarregados') ||
            key.includes('ocorrencias') ||
            key.includes('desvios') ||
            key.includes('treinamentos')
          )
        );
      }
    });

    // Force refetch critical queries for immediate update
    await queryClient.refetchQueries({
      queryKey: ['user-ccas', user?.id]
    });

    await queryClient.refetchQueries({
      queryKey: ['ccas']
    });

    console.log('Todas as queries relacionadas a CCAs foram invalidadas e atualizadas');
  };

  return { invalidateAllCCAQueries };
};
