import { useAuth } from "@/contexts/AuthContext";

export interface UsuarioAtivo {
  id: string;
  nome: string;
  email: string;
}

export const useUsuarioAtivo = (): UsuarioAtivo => {
  const { user } = useAuth();
  
  // Se houver usuário autenticado, retornar seus dados
  if (user) {
    return {
      id: user.id,
      nome: user.user_metadata?.full_name || user.email?.split('@')[0] || "Usuário",
      email: user.email || ""
    };
  }
  
  // Fallback caso não haja autenticação (não deveria acontecer)
  return {
    id: "temp-user-id",
    nome: "Usuário Temporário",
    email: "temp@email.com"
  };
};
