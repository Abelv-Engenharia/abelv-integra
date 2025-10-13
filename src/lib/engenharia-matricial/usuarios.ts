// Tipos centralizados para usuários
export type Disciplina = "ELETRICA" | "MECANICA" | "AMBAS";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  disciplinaPreferida?: Disciplina;
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
