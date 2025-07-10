
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

  // Ordenar CCAs do menor para o maior
  const sortedCCAs = [...userCCAs].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  );

  console.log('useCCAs - CCAs disponíveis:', sortedCCAs.length, sortedCCAs.map(c => c.codigo));

  return {
    data: sortedCCAs,
    isLoading,
    error
  };
};
