
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

// Form schema using zod
export const searchFormSchema = z.object({
  search: z.string().optional(),
});

export const userFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  perfil: z.string().min(1, "Selecione um perfil"),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
export type UserFormValues = z.infer<typeof userFormSchema>;
