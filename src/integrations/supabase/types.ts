export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      base_legal_opcoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      causas_provaveis: {
        Row: {
          ativo: boolean | null
          codigo: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      ccas: {
        Row: {
          ativo: boolean | null
          codigo: string
          id: number
          nome: string
          tipo: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          id?: number
          nome: string
          tipo: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          id?: number
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      desvios: {
        Row: {
          acao_imediata: string | null
          classificacao: string
          created_at: string | null
          data: string
          descricao: string
          id: string
          imagem_url: string | null
          local: string
          prazo: string | null
          responsavel_id: string | null
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          acao_imediata?: string | null
          classificacao: string
          created_at?: string | null
          data?: string
          descricao: string
          id?: string
          imagem_url?: string | null
          local: string
          prazo?: string | null
          responsavel_id?: string | null
          status: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          acao_imediata?: string | null
          classificacao?: string
          created_at?: string | null
          data?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          local?: string
          prazo?: string | null
          responsavel_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "desvios_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplinas: {
        Row: {
          ativo: boolean | null
          codigo: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cnpj: string
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cnpj: string
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string
          id?: number
          nome?: string
        }
        Relationships: []
      }
      encarregados: {
        Row: {
          ativo: boolean | null
          email: string | null
          funcao: string
          id: string
          matricula: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          email?: string | null
          funcao: string
          id?: string
          matricula?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean | null
          email?: string | null
          funcao?: string
          id?: string
          matricula?: string | null
          nome?: string
        }
        Relationships: []
      }
      engenheiros: {
        Row: {
          ativo: boolean | null
          email: string | null
          funcao: string
          id: string
          matricula: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          email?: string | null
          funcao: string
          id?: string
          matricula?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean | null
          email?: string | null
          funcao?: string
          id?: string
          matricula?: string | null
          nome?: string
        }
        Relationships: []
      }
      eventos_identificados: {
        Row: {
          ativo: boolean | null
          codigo: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      execucao_treinamentos: {
        Row: {
          ano: number
          carga_horaria: number
          cca: string
          created_at: string | null
          data: string
          id: string
          lista_presenca_url: string | null
          mes: number
          observacoes: string | null
          processo_treinamento: string
          tipo_treinamento: string
          treinamento_id: string | null
          treinamento_nome: string | null
          updated_at: string | null
        }
        Insert: {
          ano: number
          carga_horaria: number
          cca: string
          created_at?: string | null
          data: string
          id?: string
          lista_presenca_url?: string | null
          mes: number
          observacoes?: string | null
          processo_treinamento: string
          tipo_treinamento: string
          treinamento_id?: string | null
          treinamento_nome?: string | null
          updated_at?: string | null
        }
        Update: {
          ano?: number
          carga_horaria?: number
          cca?: string
          created_at?: string | null
          data?: string
          id?: string
          lista_presenca_url?: string | null
          mes?: number
          observacoes?: string | null
          processo_treinamento?: string
          tipo_treinamento?: string
          treinamento_id?: string | null
          treinamento_nome?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "execucao_treinamentos_treinamento_id_fkey"
            columns: ["treinamento_id"]
            isOneToOne: false
            referencedRelation: "treinamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          foto: string | null
          funcao: string
          id: string
          matricula: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          foto?: string | null
          funcao: string
          id?: string
          matricula: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          foto?: string | null
          funcao?: string
          id?: string
          matricula?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ocorrencias: {
        Row: {
          cca: string
          classificacao_risco: string
          created_at: string | null
          data: string
          descricao: string | null
          disciplina: string
          empresa: string
          id: string
          medidas_tomadas: string | null
          partes_corpo_afetadas: string[] | null
          responsavel_id: string | null
          status: string
          tipo_ocorrencia: string
          updated_at: string | null
        }
        Insert: {
          cca: string
          classificacao_risco: string
          created_at?: string | null
          data?: string
          descricao?: string | null
          disciplina: string
          empresa: string
          id?: string
          medidas_tomadas?: string | null
          partes_corpo_afetadas?: string[] | null
          responsavel_id?: string | null
          status: string
          tipo_ocorrencia: string
          updated_at?: string | null
        }
        Update: {
          cca?: string
          classificacao_risco?: string
          created_at?: string | null
          data?: string
          descricao?: string | null
          disciplina?: string
          empresa?: string
          id?: string
          medidas_tomadas?: string | null
          partes_corpo_afetadas?: string[] | null
          responsavel_id?: string | null
          status?: string
          tipo_ocorrencia?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          descricao: string | null
          id: number
          nome: string
          permissoes: Json
        }
        Insert: {
          descricao?: string | null
          id?: number
          nome: string
          permissoes?: Json
        }
        Update: {
          descricao?: string | null
          id?: number
          nome?: string
          permissoes?: Json
        }
        Relationships: []
      }
      processos: {
        Row: {
          ativo: boolean | null
          codigo: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string | null
          departamento: string | null
          email: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string | null
          departamento?: string | null
          email: string
          id: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string | null
          departamento?: string | null
          email?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supervisores: {
        Row: {
          ativo: boolean | null
          email: string | null
          funcao: string
          id: string
          matricula: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          email?: string | null
          funcao: string
          id?: string
          matricula?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean | null
          email?: string | null
          funcao?: string
          id?: string
          matricula?: string | null
          nome?: string
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          anexo: string | null
          cca: string
          configuracao: Json
          created_at: string | null
          data_cadastro: string | null
          data_conclusao: string | null
          descricao: string
          id: string
          iniciada: boolean | null
          responsavel_id: string | null
          status: string
          tipo_cca: string
          updated_at: string | null
        }
        Insert: {
          anexo?: string | null
          cca: string
          configuracao?: Json
          created_at?: string | null
          data_cadastro?: string | null
          data_conclusao?: string | null
          descricao: string
          id?: string
          iniciada?: boolean | null
          responsavel_id?: string | null
          status: string
          tipo_cca: string
          updated_at?: string | null
        }
        Update: {
          anexo?: string | null
          cca?: string
          configuracao?: Json
          created_at?: string | null
          data_cadastro?: string | null
          data_conclusao?: string | null
          descricao?: string
          id?: string
          iniciada?: boolean | null
          responsavel_id?: string | null
          status?: string
          tipo_cca?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_registro: {
        Row: {
          ativo: boolean | null
          codigo: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      treinamentos: {
        Row: {
          carga_horaria: number | null
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          validade_dias: number | null
        }
        Insert: {
          carga_horaria?: number | null
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          validade_dias?: number | null
        }
        Update: {
          carga_horaria?: number | null
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          validade_dias?: number | null
        }
        Relationships: []
      }
      treinamentos_normativos: {
        Row: {
          arquivado: boolean | null
          certificado_url: string | null
          created_at: string | null
          data_realizacao: string
          data_validade: string
          funcionario_id: string
          id: string
          status: string
          tipo: string
          treinamento_id: string
          updated_at: string | null
        }
        Insert: {
          arquivado?: boolean | null
          certificado_url?: string | null
          created_at?: string | null
          data_realizacao: string
          data_validade: string
          funcionario_id: string
          id?: string
          status: string
          tipo: string
          treinamento_id: string
          updated_at?: string | null
        }
        Update: {
          arquivado?: boolean | null
          certificado_url?: string | null
          created_at?: string | null
          data_realizacao?: string
          data_validade?: string
          funcionario_id?: string
          id?: string
          status?: string
          tipo?: string
          treinamento_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_normativos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_normativos_treinamento_id_fkey"
            columns: ["treinamento_id"]
            isOneToOne: false
            referencedRelation: "treinamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario_perfis: {
        Row: {
          id: string
          perfil_id: number
          usuario_id: string
        }
        Insert: {
          id?: string
          perfil_id: number
          usuario_id: string
        }
        Update: {
          id?: string
          perfil_id?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_perfis_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_perfis_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
