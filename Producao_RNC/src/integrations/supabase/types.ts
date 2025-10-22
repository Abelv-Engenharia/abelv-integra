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
          data_envio: string | null
          data_recebimento: string | null
          destinatario: string
          document_id: string
          email_destinatario: string | null
          grd_id: string | null
          id: string
          observacoes: string | null
          status: string
          token_confirmacao: string | null
        }
        Insert: {
          data_envio?: string | null
          data_recebimento?: string | null
          destinatario: string
          document_id: string
          email_destinatario?: string | null
          grd_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string
          token_confirmacao?: string | null
        }
        Update: {
          data_envio?: string | null
          data_recebimento?: string | null
          destinatario?: string
          document_id?: string
          email_destinatario?: string | null
          grd_id?: string | null
          id?: string
          observacoes?: string | null
          status?: string
          token_confirmacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributions_grd_id_fkey"
            columns: ["grd_id"]
            isOneToOne: false
            referencedRelation: "grds"
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
          uploaded_at: string | null
          uploaded_by: string | null
          version: string
        }
        Insert: {
          document_id: string
          file_path: string
          file_size: number
          filename: string
          id?: string
          mime_type: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          version?: string
        }
        Update: {
          document_id?: string
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          mime_type?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
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
          created_at: string | null
          data_revisao: string
          disciplina: string
          formato: string
          id: string
          numero: string
          numero_abelv: string | null
          observacoes: string | null
          projeto: string
          responsavel_emissao: string
          responsavel_revisao: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string | null
          versao_atual: string
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data_revisao?: string
          disciplina: string
          formato: string
          id?: string
          numero: string
          numero_abelv?: string | null
          observacoes?: string | null
          projeto: string
          responsavel_emissao: string
          responsavel_revisao?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string | null
          versao_atual?: string
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data_revisao?: string
          disciplina?: string
          formato?: string
          id?: string
          numero?: string
          numero_abelv?: string | null
          observacoes?: string | null
          projeto?: string
          responsavel_emissao?: string
          responsavel_revisao?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string | null
          versao_atual?: string
        }
        Relationships: []
      }
      grd_documents: {
        Row: {
          discriminacao: string
          document_id: string
          grd_id: string
          id: string
          numero_copias: number
          numero_folhas: number
          revisao: string
          tipo_via: string
        }
        Insert: {
          discriminacao: string
          document_id: string
          grd_id: string
          id?: string
          numero_copias?: number
          numero_folhas?: number
          revisao: string
          tipo_via?: string
        }
        Update: {
          discriminacao?: string
          document_id?: string
          grd_id?: string
          id?: string
          numero_copias?: number
          numero_folhas?: number
          revisao?: string
          tipo_via?: string
        }
        Relationships: [
          {
            foreignKeyName: "grd_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grd_documents_grd_id_fkey"
            columns: ["grd_id"]
            isOneToOne: false
            referencedRelation: "grds"
            referencedColumns: ["id"]
          },
        ]
      }
      grd_providencias: {
        Row: {
          aprovar: boolean | null
          arquivar: boolean | null
          assinatura: boolean | null
          comentar: boolean | null
          devolver: boolean | null
          emitir_parecer: boolean | null
          grd_id: string
          id: string
          informacao: boolean | null
          liberado_comentarios: boolean | null
          liberado_construcao: boolean | null
          liberado_detalhamento: boolean | null
          liberado_revisao: boolean | null
          outros: string | null
          revisar: boolean | null
        }
        Insert: {
          aprovar?: boolean | null
          arquivar?: boolean | null
          assinatura?: boolean | null
          comentar?: boolean | null
          devolver?: boolean | null
          emitir_parecer?: boolean | null
          grd_id: string
          id?: string
          informacao?: boolean | null
          liberado_comentarios?: boolean | null
          liberado_construcao?: boolean | null
          liberado_detalhamento?: boolean | null
          liberado_revisao?: boolean | null
          outros?: string | null
          revisar?: boolean | null
        }
        Update: {
          aprovar?: boolean | null
          arquivar?: boolean | null
          assinatura?: boolean | null
          comentar?: boolean | null
          devolver?: boolean | null
          emitir_parecer?: boolean | null
          grd_id?: string
          id?: string
          informacao?: boolean | null
          liberado_comentarios?: boolean | null
          liberado_construcao?: boolean | null
          liberado_detalhamento?: boolean | null
          liberado_revisao?: boolean | null
          outros?: string | null
          revisar?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "grd_providencias_grd_id_fkey"
            columns: ["grd_id"]
            isOneToOne: false
            referencedRelation: "grds"
            referencedColumns: ["id"]
          },
        ]
      }
      grds: {
        Row: {
          cca: string
          created_at: string | null
          data_envio: string
          destinatario: string
          folha: string
          id: string
          numero: string
          observacoes: string | null
          remetente: string
        }
        Insert: {
          cca: string
          created_at?: string | null
          data_envio?: string
          destinatario: string
          folha: string
          id?: string
          numero: string
          observacoes?: string | null
          remetente: string
        }
        Update: {
          cca?: string
          created_at?: string | null
          data_envio?: string
          destinatario?: string
          folha?: string
          id?: string
          numero?: string
          observacoes?: string | null
          remetente?: string
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          error_count: number
          errors: Json | null
          filename: string
          id: string
          imported_at: string | null
          imported_by: string | null
          success_count: number
          total_rows: number
        }
        Insert: {
          error_count?: number
          errors?: Json | null
          filename: string
          id?: string
          imported_at?: string | null
          imported_by?: string | null
          success_count?: number
          total_rows: number
        }
        Update: {
          error_count?: number
          errors?: Json | null
          filename?: string
          id?: string
          imported_at?: string | null
          imported_by?: string | null
          success_count?: number
          total_rows?: number
        }
        Relationships: []
      }
      rnc_attachments: {
        Row: {
          attachment_type: string
          created_at: string
          description: string | null
          disciplina_outros: string | null
          evidence_number: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          rnc_id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          attachment_type: string
          created_at?: string
          description?: string | null
          disciplina_outros?: string | null
          evidence_number?: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          rnc_id: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          attachment_type?: string
          created_at?: string
          description?: string | null
          disciplina_outros?: string | null
          evidence_number?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          rnc_id?: string
          updated_at?: string
          uploaded_by?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
