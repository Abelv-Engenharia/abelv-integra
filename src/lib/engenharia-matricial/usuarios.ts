// Tipos centralizados para usuários
export type Papel = "EM" | "OBRA" | "CONTROLADORIA" | "ADMIN";
export type Disciplina = "ELETRICA" | "MECANICA" | "AMBAS";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  ativo: boolean;
  disciplinaPreferida?: Disciplina;
  cca?: string; // Número do CCA para solicitantes (OBRA)
  cliente?: string; // Nome do cliente para solicitantes (OBRA)
  criadoEm: string;
  atualizadoEm: string;
}

// Dados iniciais (mock data)
export const mockUsuarios: Usuario[] = [
  {
    id: "1",
    nome: "Elton Silva",
    email: "elton@empresa.com",
    papel: "EM",
    ativo: true,
    disciplinaPreferida: "ELETRICA",
    criadoEm: "2024-01-15",
    atualizadoEm: "2024-03-20"
  },
  {
    id: "2",
    nome: "Ricardo Santos",
    email: "ricardo@empresa.com",
    papel: "EM",
    ativo: true,
    disciplinaPreferida: "MECANICA",
    criadoEm: "2024-01-15",
    atualizadoEm: "2024-03-18"
  },
  {
    id: "3",
    nome: "Maria Oliveira",
    email: "maria@obra.com",
    papel: "OBRA",
    ativo: true,
    cca: "12345",
    cliente: "Brainfarma",
    criadoEm: "2024-02-01",
    atualizadoEm: "2024-03-15"
  },
  {
    id: "4",
    nome: "João Costa",
    email: "joao@controladoria.com",
    papel: "CONTROLADORIA",
    ativo: true,
    criadoEm: "2024-01-20",
    atualizadoEm: "2024-02-28"
  },
  {
    id: "5",
    nome: "Ana Admin",
    email: "ana@admin.com",
    papel: "ADMIN",
    ativo: false,
    criadoEm: "2024-01-10",
    atualizadoEm: "2024-03-22"
  },
  {
    id: "6",
    nome: "Carlos Silva",
    email: "carlos@obra2.com",
    papel: "OBRA",
    ativo: true,
    cca: "67890",
    cliente: "Libbs",
    criadoEm: "2024-02-15",
    atualizadoEm: "2024-03-10"
  }
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
    .filter(usuario => 
      (usuario.papel === "OBRA" || usuario.papel === "EM" || usuario.papel === "ADMIN") && 
      usuario.ativo
    )
    .sort((a, b) => {
      // Ordenar por papel: OBRA primeiro, depois EM, depois ADMIN
      const ordemPapel = { "OBRA": 1, "EM": 2, "ADMIN": 3 };
      if (ordemPapel[a.papel] !== ordemPapel[b.papel]) {
        return ordemPapel[a.papel] - ordemPapel[b.papel];
      }
      // Depois ordenar por nome
      return a.nome.localeCompare(b.nome);
    });
};

// Função para obter lista de CCAs únicos
export const getCCAs = (): string[] => {
  return getUsuarios()
    .filter(usuario => usuario.papel === "OBRA" && usuario.ativo && usuario.cca)
    .map(usuario => usuario.cca!)
    .filter((cca, index, arr) => arr.indexOf(cca) === index)
    .sort((a, b) => parseInt(a) - parseInt(b));
};

// Função para obter clientes únicos baseados nos usuários OBRA
export const getClientes = (): string[] => {
  const usuarios = getUsuarios().filter(usuario => usuario.papel === "OBRA" && usuario.ativo && usuario.cliente);
  
  // Coletar clientes únicos dos usuários OBRA
  const clientesSet = new Set<string>();
  
  usuarios.forEach(usuario => {
    if (usuario.cliente) {
      clientesSet.add(usuario.cliente);
    }
  });
  
  // Adicionar clientes fixos se não existirem
  clientesSet.add("Brainfarma");
  clientesSet.add("Libbs");
  
  return Array.from(clientesSet).sort();
};

// Função para obter label do papel
export const getPapelLabel = (papel: Papel, cca?: string) => {
  switch (papel) {
    case "EM": return "Engenharia Matricial (CCA livre)";
    case "OBRA": return cca ? `Solicitante CCA ${cca}` : "Solicitante";
    case "CONTROLADORIA": return "Controladoria";
    case "ADMIN": return "Administrador (CCA livre)";
    default: return papel;
  }
};