// Hook para simular usuário ativo
// Em produção, substituir por autenticação real (Supabase Auth)

export interface UsuarioAtivo {
  id: string;
  nome: string;
  email: string;
}

export const useUsuarioAtivo = (): UsuarioAtivo => {
  // Simulação de usuário ativo
  // TODO: Substituir por autenticação real do Supabase
  return {
    id: "1",
    nome: "Carlos Silva - Gestor",
    email: "carlos.silva@empresa.com"
  };
};
