
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const useCCAInvalidation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateAllCCAQueries = async () => {
    console.log('Iniciando invalidação de todas as queries relacionadas a CCAs...');
    
    // Invalidar todas as queries que podem conter dados de CCAs
    await queryClient.invalidateQueries({ 
      predicate: (query) => {
        const queryKey = query.queryKey;
        if (!queryKey || queryKey.length === 0) return false;
        
        const keyString = JSON.stringify(queryKey).toLowerCase();
        return keyString.includes('cca') || 
               keyString.includes('user-ccas') ||
               keyString.includes('admin-ccas') ||
               keyString.includes('ccas') ||
               keyString.includes('funcionarios') ||
               keyString.includes('empresas') ||
               keyString.includes('engenheiros') ||
               keyString.includes('supervisores') ||
               keyString.includes('encarregados') ||
               keyString.includes('form-data') ||
               keyString.includes('filtered-form-data');
      }
    });

    // Invalidar queries específicas importantes
    const specificQueries = [
      ['user-ccas'],
      ['admin-ccas'], 
      ['ccas'],
      ['user-ccas', user?.id],
      ['form-data'],
      ['filtered-form-data']
    ];

    for (const queryKey of specificQueries) {
      await queryClient.invalidateQueries({ queryKey });
      console.log(`Query invalidada: ${JSON.stringify(queryKey)}`);
    }

    // Refetch imediato das queries críticas
    await queryClient.refetchQueries({ queryKey: ['user-ccas', user?.id] });
    await queryClient.refetchQueries({ queryKey: ['admin-ccas'] });
    
    console.log('Invalidação concluída. Todas as queries de CCAs foram atualizadas.');
  };

  return { invalidateAllCCAQueries };
};
