
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const useCCAInvalidation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateAllCCAQueries = async () => {
    console.log('Iniciando invalidação de todas as queries relacionadas a CCAs...');
    
    try {
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

      // Lista completa de queries específicas para invalidar
      const specificQueries = [
        ['user-ccas'],
        ['admin-ccas'], 
        ['ccas'],
        ['ccas-ativas'],
        ['user-ccas', user?.id],
        ['form-data'],
        ['filtered-form-data'],
        ['processo-treinamento'],
        ['tipo-treinamento'],
        ['funcionarios'],
        ['empresas'],
        ['engenheiros'],
        ['supervisores'],
        ['encarregados']
      ];

      // Invalidar também todas as queries do tipo user-ccas independente do userId
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey && queryKey[0] === 'user-ccas';
        }
      });

      // Invalidar queries específicas
      for (const queryKey of specificQueries) {
        await queryClient.invalidateQueries({ queryKey });
        console.log(`Query invalidada: ${JSON.stringify(queryKey)}`);
      }

      // Invalidar queries com patterns variados
      await queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey;
          if (!queryKey || queryKey.length === 0) return false;
          
          // Invalidar queries de funcionários por CCA
          if (queryKey[0] === 'funcionarios' && queryKey.length > 1) {
            return true;
          }
          
          return false;
        }
      });

      // Refetch imediato das queries críticas para garantir atualização imediata
      await Promise.allSettled([
        queryClient.refetchQueries({ queryKey: ['user-ccas', user?.id] }),
        queryClient.refetchQueries({ queryKey: ['admin-ccas'] }),
        queryClient.refetchQueries({ queryKey: ['ccas'] }),
        queryClient.refetchQueries({ queryKey: ['ccas-ativas'] }),
        queryClient.refetchQueries({ queryKey: ['funcionarios'] }),
        queryClient.refetchQueries({ queryKey: ['empresas'] }),
        // Forçar refetch das queries de user-ccas para todos os usuários
        queryClient.refetchQueries({ 
          predicate: (query) => {
            const queryKey = query.queryKey;
            return queryKey && queryKey[0] === 'user-ccas';
          }
        })
      ]);
      
      console.log('Invalidação concluída. Todas as queries de CCAs foram atualizadas.');
    } catch (error) {
      console.error('Erro durante invalidação de queries:', error);
    }
  };

  return { invalidateAllCCAQueries };
};
