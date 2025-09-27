
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

// Tipos para o novo sistema de permissões diretas
export type TipoUsuario = 'administrador' | 'usuario';

export interface PermissoesCustomizadas {
  // Módulos principais
  desvios?: boolean;
  treinamentos?: boolean;
  ocorrencias?: boolean;
  tarefas?: boolean;
  relatorios?: boolean;
  hora_seguranca?: boolean;
  medidas_disciplinares?: boolean;
  
  // Administração
  admin_usuarios?: boolean;
  admin_perfis?: boolean;
  admin_funcionarios?: boolean;
  admin_hht?: boolean;
  admin_templates?: boolean;
  admin_empresas?: boolean;
  admin_supervisores?: boolean;
  admin_engenheiros?: boolean;
  admin_ccas?: boolean;
  
  // IDSMS
  idsms_dashboard?: boolean;
  idsms_formularios?: boolean;
  
  // Configurações específicas de permissões
  pode_editar_desvios?: boolean;
  pode_excluir_desvios?: boolean;
  pode_editar_ocorrencias?: boolean;
  pode_excluir_ocorrencias?: boolean;
  pode_editar_treinamentos?: boolean;
  pode_excluir_treinamentos?: boolean;
  pode_editar_tarefas?: boolean;
  pode_excluir_tarefas?: boolean;
  pode_aprovar_tarefas?: boolean;
  pode_visualizar_relatorios_completos?: boolean;
  pode_exportar_dados?: boolean;
}

// Interface atualizada para perfil de usuário com permissões diretas
export interface UserProfileDirect {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  cargo?: string;
  departamento?: string;
  tipo_usuario: TipoUsuario;
  permissoes_customizadas: PermissoesCustomizadas;
  ccas_permitidas: number[];
  menus_sidebar: string[];
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

// Schema para criação de novo usuário Auth (sistema antigo - manter compatibilidade)
export const authUserCreateSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  perfil: z.string().min(1, "Selecione um perfil"),
});

// Schema para criação de usuário com permissões diretas
export const authUserCreateDirectSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  tipo_usuario: z.enum(['administrador', 'usuario']),
  permissoes_customizadas: z.record(z.boolean()).optional(),
  ccas_permitidas: z.array(z.number()).optional(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
export type UserFormValues = z.infer<typeof userFormSchema>;
export type AuthUserCreateValues = z.infer<typeof authUserCreateSchema>;
export type AuthUserCreateDirectValues = z.infer<typeof authUserCreateDirectSchema>;

// Define the Permissoes interface with all required properties for the system
export interface Permissoes {
  // Módulos principais
  desvios: boolean;
  treinamentos: boolean;
  ocorrencias: boolean;
  tarefas: boolean;
  relatorios: boolean;
  hora_seguranca: boolean;
  medidas_disciplinares: boolean;
  
  // Administração
  admin_usuarios: boolean;
  admin_perfis: boolean;
  admin_funcionarios: boolean;
  admin_hht: boolean;
  admin_templates: boolean;
  admin_empresas: boolean;
  admin_supervisores: boolean;
  admin_engenheiros: boolean;
  admin_ccas: boolean;
  
  // IDSMS
  idsms_dashboard: boolean;
  idsms_formularios: boolean;
  
  // Configurações específicas de permissões
  pode_editar_desvios: boolean;
  pode_excluir_desvios: boolean;
  pode_editar_ocorrencias: boolean;
  pode_excluir_ocorrencias: boolean;
  pode_editar_treinamentos: boolean;
  pode_excluir_treinamentos: boolean;
  pode_editar_tarefas: boolean;
  pode_excluir_tarefas: boolean;
  pode_aprovar_tarefas: boolean;
  pode_visualizar_relatorios_completos: boolean;
  pode_exportar_dados: boolean;

  // Novidade: definição explícita dos menus/submenus visíveis para esse perfil
  menus_sidebar?: string[]; // Ex: ['dashboard', 'desvios', 'tarefas-minhas', ...]  
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
