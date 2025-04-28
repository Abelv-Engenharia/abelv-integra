
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  funcionariosService,
  treinamentosService,
  treinamentosNormativosService,
  execucaoTreinamentosService 
} from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Funcionario, Treinamento, TreinamentoNormativo, ExecucaoTreinamento } from '@/types/treinamentos';

// Hook for funcionarios
export const useFuncionarios = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['funcionarios'],
    queryFn: () => funcionariosService.getAll(),
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erro ao carregar funcionários',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
};

export const useFuncionario = (id: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['funcionarios', id],
    queryFn: () => funcionariosService.getById(id),
    enabled: !!id,
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erro ao carregar funcionário',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
};

export const useCreateFuncionario = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (funcionario: Omit<Funcionario, 'id'>) => funcionariosService.create(funcionario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast({
        title: 'Funcionário criado com sucesso',
        description: 'O funcionário foi adicionado ao sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar funcionário',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateFuncionario = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, funcionario }: { id: string, funcionario: Partial<Funcionario> }) => 
      funcionariosService.update(id, funcionario),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      queryClient.invalidateQueries({ queryKey: ['funcionarios', data.id] });
      toast({
        title: 'Funcionário atualizado com sucesso',
        description: 'Os dados do funcionário foram atualizados.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar funcionário',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

// Hook for treinamentos
export const useTreinamentos = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['treinamentos'],
    queryFn: () => treinamentosService.getAll(),
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erro ao carregar treinamentos',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
};

export const useCreateTreinamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (treinamento: Omit<Treinamento, 'id'>) => treinamentosService.create(treinamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos'] });
      toast({
        title: 'Treinamento criado com sucesso',
        description: 'O treinamento foi adicionado ao sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar treinamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

// Hook for treinamentos normativos
export const useTreinamentosNormativos = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['treinamentos-normativos'],
    queryFn: () => treinamentosNormativosService.getAll(),
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erro ao carregar treinamentos normativos',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
};

export const useTreinamentosNormativosByFuncionario = (funcionarioId: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['treinamentos-normativos', funcionarioId],
    queryFn: () => treinamentosNormativosService.getByFuncionarioId(funcionarioId),
    enabled: !!funcionarioId,
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erro ao carregar treinamentos normativos',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
};

export const useCreateTreinamentoNormativo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (treinamento: Omit<TreinamentoNormativo, 'id'>) => 
      treinamentosNormativosService.create(treinamento),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['treinamentos-normativos'] });
      queryClient.invalidateQueries({ 
        queryKey: ['treinamentos-normativos', data.funcionarioId] 
      });
      toast({
        title: 'Treinamento normativo registrado com sucesso',
        description: 'O registro de treinamento foi adicionado ao sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao registrar treinamento normativo',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

// Hook for execucao de treinamentos
export const useExecucaoTreinamentos = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['execucao-treinamentos'],
    queryFn: () => execucaoTreinamentosService.getAll(),
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erro ao carregar execução de treinamentos',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
};

export const useCreateExecucaoTreinamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (execucao: Omit<ExecucaoTreinamento, 'id'>) => 
      execucaoTreinamentosService.create(execucao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['execucao-treinamentos'] });
      toast({
        title: 'Execução de treinamento registrada com sucesso',
        description: 'O registro de execução foi adicionado ao sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao registrar execução de treinamento',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

// Add hooks for other entities (desvios, ocorrencias, etc.) following the same pattern
