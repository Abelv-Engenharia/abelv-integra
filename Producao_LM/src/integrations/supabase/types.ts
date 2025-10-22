export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      distributions: {
        Row: {
          created_at: string
          data_envio: string
          data_recebimento: string | null
          destinatario: string
          document_id: string
          email_destinatario: string | null
          grd_id: string | null
          id: string
          observacoes: string | null
          status: Database["public"]["Enums"]["distribution_status"]
          token_confirmacao: string
        }
        Insert: {
          created_at?: string
          data_envio?: string
          data_recebimento?: string | null
          destinatario: string
          document_id: string
          email_destinatario?: string | null
          grd_id?: string | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["distribution_status"]
          token_confirmacao?: string
        }
        Update: {
          created_at?: string
          data_envio?: string
          data_recebimento?: string | null
          destinatario?: string
          document_id?: string
          email_destinatario?: string | null
          grd_id?: string | null
          id?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["distribution_status"]
          token_confirmacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "distributions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_files: {
        Row: {
          document_id: string
          file_path: string
          file_size: number
          filename: string
          id: string
          mime_type: string
          uploaded_at: string
          version: string
        }
        Insert: {
          document_id: string
          file_path: string
          file_size: number
          filename: string
          id?: string
          mime_type: string
          uploaded_at?: string
          version?: string
        }
        Update: {
          document_id?: string
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          mime_type?: string
          uploaded_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_files_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          cliente: string
          created_at: string
          data_revisao: string
          disciplina: string
          formato: string
          id: string
          numero: string
          numero_abelv: string | null
          observacoes: string | null
          pending_upload: boolean | null
          projeto: string
          responsavel_emissao: string
          responsavel_revisao: string | null
          status: Database["public"]["Enums"]["document_status"]
          tipo: string
          titulo: string
          updated_at: string
          versao_atual: string
        }
        Insert: {
          cliente: string
          created_at?: string
          data_revisao?: string
          disciplina: string
          formato: string
          id?: string
          numero: string
          numero_abelv?: string | null
          observacoes?: string | null
          pending_upload?: boolean | null
          projeto: string
          responsavel_emissao: string
          responsavel_revisao?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tipo: string
          titulo: string
          updated_at?: string
          versao_atual?: string
        }
        Update: {
          cliente?: string
          created_at?: string
          data_revisao?: string
          disciplina?: string
          formato?: string
          id?: string
          numero?: string
          numero_abelv?: string | null
          observacoes?: string | null
          pending_upload?: boolean | null
          projeto?: string
          responsavel_emissao?: string
          responsavel_revisao?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          tipo?: string
          titulo?: string
          updated_at?: string
          versao_atual?: string
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          error_count: number
          errors: string | null
          filename: string
          id: string
          imported_at: string
          success_count: number
          total_rows: number
        }
        Insert: {
          error_count?: number
          errors?: string | null
          filename: string
          id?: string
          imported_at?: string
          success_count?: number
          total_rows?: number
        }
        Update: {
          error_count?: number
          errors?: string | null
          filename?: string
          id?: string
          imported_at?: string
          success_count?: number
          total_rows?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      distribution_status: "enviado" | "recebido" | "confirmado"
      document_status: "elaboracao" | "revisao" | "aprovado" | "obsoleto"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      distribution_status: ["enviado", "recebido", "confirmado"],
      document_status: ["elaboracao", "revisao", "aprovado", "obsoleto"],
    },
  },
} as const
