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
  {
    id: "2",
    nome: "Ricardo Santos",
    email: "ricardo@empresa.com",
    ativo: true,
    disciplinaPreferida: "MECANICA",
  },
  {
    id: "3",
    nome: "Maria Oliveira",
    email: "maria@obra.com",
    ativo: true,
  },
  {
    id: "4",
    nome: "João Costa",
    email: "joao@controladoria.com",
    ativo: true,
  },
  {
    id: "5",
    nome: "Ana Admin",
    email: "ana@admin.com",
    papel: "ADMIN",
    ativo: false,
    criadoEm: "2024-01-10",
    atualizadoEm: "2024-03-22",
  },
  {
    id: "6",
    nome: "Carlos Silva",
    email: "carlos@obra2.com",
    ativo: true,
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
  return getUsuarios()
    .filter(
      (usuario) => (usuario.papel === "OBRA" || usuario.papel === "EM" || usuario.papel === "ADMIN") && usuario.ativo,
    )
    .sort((a, b) => {
      // Ordenar por papel: OBRA primeiro, depois EM, depois ADMIN
      const ordemPapel = { OBRA: 1, EM: 2, ADMIN: 3 };
      if (ordemPapel[a.papel] !== ordemPapel[b.papel]) {
        return ordemPapel[a.papel] - ordemPapel[b.papel];
      }
      // Depois ordenar por nome
      return a.nome.localeCompare(b.nome);
    });
};
