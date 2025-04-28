
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: number
          nome: string
          descricao: string | null
          permissoes: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nome: string
          descricao?: string | null
          permissoes: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nome?: string
          descricao?: string | null
          permissoes?: Json
          created_at?: string
          updated_at?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          email: string
          nome: string
          cargo: string | null
          departamento: string | null
          perfil_id: number | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nome: string
          cargo?: string | null
          departamento?: string | null
          perfil_id?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string
          cargo?: string | null
          departamento?: string | null
          perfil_id?: number | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      funcionarios: {
        Row: {
          id: string
          nome: string
          funcao: string
          matricula: string
          foto: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          funcao: string
          matricula: string
          foto?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          funcao?: string
          matricula?: string
          foto?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      treinamentos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          carga_horaria: number | null
          validade_dias: number | null
          tipo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          carga_horaria?: number | null
          validade_dias?: number | null
          tipo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          carga_horaria?: number | null
          validade_dias?: number | null
          tipo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      treinamentos_normativos: {
        Row: {
          id: string
          funcionario_id: string
          treinamento_id: string
          tipo: string
          data_inicio: string
          data_realizacao: string
          data_validade: string
          certificado_url: string | null
          status: string
          arquivado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          funcionario_id: string
          treinamento_id: string
          tipo: string
          data_inicio: string
          data_realizacao: string
          data_validade: string
          certificado_url?: string | null
          status: string
          arquivado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          funcionario_id?: string
          treinamento_id?: string
          tipo?: string
          data_inicio?: string
          data_realizacao?: string
          data_validade?: string
          certificado_url?: string | null
          status?: string
          arquivado?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      execucao_treinamentos: {
        Row: {
          id: string
          data: string
          mes: number
          ano: number
          cca: string
          processo_treinamento: string
          tipo_treinamento: string
          treinamento_id: string | null
          treinamento_nome: string | null
          carga_horaria: number
          observacoes: string | null
          lista_presenca_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          data: string
          mes: number
          ano: number
          cca: string
          processo_treinamento: string
          tipo_treinamento: string
          treinamento_id?: string | null
          treinamento_nome?: string | null
          carga_horaria: number
          observacoes?: string | null
          lista_presenca_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          data?: string
          mes?: number
          ano?: number
          cca?: string
          processo_treinamento?: string
          tipo_treinamento?: string
          treinamento_id?: string | null
          treinamento_nome?: string | null
          carga_horaria?: number
          observacoes?: string | null
          lista_presenca_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add additional tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
