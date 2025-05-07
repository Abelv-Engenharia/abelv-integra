import { z } from "zod";

export interface User {
  id: number | string;
  nome: string;
  email: string;
  perfil: string;
  status: string;
}

export interface Profile {
  id: number;
  nome: string;
}

// Auth User representa um usuário do Supabase Auth
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  email_confirmed_at?: string;
  banned_until?: string;
}

// Form schema using zod
export const searchFormSchema = z.object({
  search: z.string().optional(),
});

export const userFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  perfil: z.string().min(1, "Selecione um perfil"),
});

// Schema para criação de novo usuário Auth
export const authUserCreateSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  perfil: z.string().min(1, "Selecione um perfil"),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
export type UserFormValues = z.infer<typeof userFormSchema>;
export type AuthUserCreateValues = z.infer<typeof authUserCreateSchema>;

// Define the Permissoes interface with required properties
export interface Permissoes {
  desvios: boolean;
  treinamentos: boolean;
  ocorrencias: boolean;
  tarefas: boolean;
  relatorios: boolean;
  hora_seguranca: boolean;
  medidas_disciplinares: boolean;
  admin_usuarios: boolean;
  admin_perfis: boolean;
  admin_funcionarios: boolean;
  admin_hht: boolean;
  admin_templates: boolean;
}

export interface Perfil {
  id: number;
  nome: string;
  descricao: string;
  permissoes: Permissoes;
}
