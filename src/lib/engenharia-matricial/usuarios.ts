// Tipos centralizados para usuários
export type Disciplina = "ELETRICA" | "MECANICA" | "AMBAS";
export type Papel = "EM" | "OBRA" | "CONTROLADORIA" | "ADMIN";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  disciplinaPreferida?: Disciplina;
  papel?: Papel;
  ccas?: number[];
}

// Dados iniciais (mock data)
export const mockUsuarios: Usuario[] = [
  {
    id: "1",
    nome: "Elton Silva",
    email: "elton@empresa.com",
    ativo: true,
    disciplinaPreferida: "ELETRICA",
  },
];

// Função para buscar usuários do localStorage ou usar mock
export const getUsuarios = (): Usuario[] => {
  try {
    const saved = localStorage.getItem("admin_usuarios");
    return saved ? (JSON.parse(saved) as Usuario[]) : mockUsuarios;
  } catch {
    return mockUsuarios;
  }
};

// Função para filtrar usuários ativos que podem abrir OS
export const getUsuariosParaOS = (): Usuario[] => {
  return getUsuarios().sort((a, b) => {
    // Depois ordenar por nome
    return a.nome.localeCompare(b.nome);
  });
};

// Função para obter CCAs disponíveis
export const getCCAs = (): number[] => {
  // Mock data - pode ser expandido para buscar do localStorage ou API
  return [1001, 1002, 1003, 1004, 1005];
};

// Função para obter clientes disponíveis
export const getClientes = (): string[] => {
  // Mock data - pode ser expandido para buscar do localStorage ou API
  return ["Cliente A", "Cliente B", "Cliente C", "Cliente D"];
};

// Função para obter label do papel do usuário
export const getPapelLabel = (papel?: Papel, ccas?: number[]): string => {
  if (!papel) return "Sem papel definido";
  
  const papelLabels = {
    EM: "Engenharia Matricial",
    OBRA: ccas && ccas.length > 0 ? `Obra - CCAs: ${ccas.join(", ")}` : "Obra",
    CONTROLADORIA: "Controladoria",
    ADMIN: "Administrador",
  };
  
  return papelLabels[papel] || papel;
};
