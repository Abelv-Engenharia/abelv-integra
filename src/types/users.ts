
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

// Define the Permissoes interface with all required properties for the system
export interface Permissoes {
  // Sistema baseado em menus hierárquicos
  menus_sidebar: string[]; // Array com todos os menus e submenus permitidos
  
  // Permissões administrativas especiais
  admin_usuarios: boolean;
  admin_perfis: boolean; 
  admin_funcionarios: boolean;
  admin_empresas: boolean;
  admin_ccas: boolean;
  admin_engenheiros: boolean;
  admin_supervisores: boolean;
  admin_hht: boolean;
  admin_templates: boolean;
  admin_metas_indicadores: boolean;
  admin_modelos_inspecao: boolean;
  admin_checklists: boolean;
  admin_importacao_funcionarios: boolean;
  admin_logo: boolean;
  admin_configuracoes: boolean;
  
  // Permissões de ações específicas
  pode_editar: boolean;
  pode_excluir: boolean;
  pode_aprovar: boolean;
  pode_exportar: boolean;
  pode_visualizar_todos_ccas: boolean;
}

export interface Perfil {
  id: number;
  nome: string;
  descricao: string;
  permissoes: Permissoes;
  ccas_permitidas: number[]; // Novo campo para CCAs permitidas
}

// Add JSON type for Supabase compatibility
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Define specific interfaces for dashboard services
export interface InspecoesSummary {
  totalInspecoes: number;
  programadas: number;
  naoProgramadas: number;
  desviosIdentificados: number;
}

export interface OcorrenciasByTipo {
  name: string;
  value: number;
}

export interface OcorrenciasByRisco {
  name: string;
  value: number;
}

export interface OcorrenciasByEmpresa {
  name: string;
  value: number;
}

export interface OcorrenciasStats {
  totalOcorrencias: number;
  ocorrenciasMes: number;
  ocorrenciasPendentes: number;
  riscoPercentage: number;
}

export interface OcorrenciasTimeline {
  month: string;
  ocorrencias: number;
}

export interface ParteCorpoData {
  name: string;
  value: number;
}
