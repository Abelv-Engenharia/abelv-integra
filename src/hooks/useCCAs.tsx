
import { useUserCCAs } from "./useUserCCAs";

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  ativo: boolean;
}

export const useCCAs = () => {
  const { data: userCCAs = [], isLoading, error } = useUserCCAs();

  console.log('useCCAs - CCAs disponíveis:', userCCAs.length, userCCAs.map(c => c.codigo));

  return {
    data: userCCAs,
    isLoading,
    error
  };
};
