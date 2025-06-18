
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

  return {
    data: userCCAs,
    isLoading,
    error
  };
};
