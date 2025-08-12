export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agente_causador: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          record_id: string | null
          table_name: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
          created_at: string | null
          id: number
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: number
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: number
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      classificacoes_ocorrencia: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes_emails: {
        Row: {
          anexo_url: string | null
          assunto: string
          ativo: boolean
          cca_id: number | null
          criado_em: string
          destinatarios: string[]
          dia_semana: string | null
          hora_envio: string
          id: string
          mensagem: string
          periodicidade: string
          periodo_dias: number | null
          relatorio_id: string | null
          tipo_relatorio: string | null
          updated_at: string
        }
        Insert: {
          anexo_url?: string | null
          assunto: string
          ativo?: boolean
          cca_id?: number | null
          criado_em?: string
          destinatarios: string[]
          dia_semana?: string | null
          hora_envio: string
          id?: string
          mensagem: string
          periodicidade: string
          periodo_dias?: number | null
          relatorio_id?: string | null
          tipo_relatorio?: string | null
          updated_at?: string
        }
        Update: {
          anexo_url?: string | null
          assunto?: string
          ativo?: boolean
          cca_id?: number | null
          criado_em?: string
          destinatarios?: string[]
          dia_semana?: string | null
          hora_envio?: string
          id?: string
          mensagem?: string
          periodicidade?: string
          periodo_dias?: number | null
          relatorio_id?: string | null
          tipo_relatorio?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_emails_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      controle_opcoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      desvios_completos: {
        Row: {
          acao_imediata: string | null
          acoes: Json | null
          base_legal_opcao_id: number | null
          causa_provavel_id: number | null
          cca_id: number | null
          classificacao_risco: string | null
          controle: number | null
          created_at: string | null
          data_desvio: string
          descricao_desvio: string
          deteccao: number | null
          disciplina_id: number | null
          efeito_falha: number | null
          empresa_id: number | null
          encarregado_responsavel_id: string | null
          engenheiro_responsavel_id: string | null
          evento_identificado_id: number | null
          exposicao: number | null
          funcionarios_envolvidos: Json | null
          hora_desvio: string | null
          id: string
          imagem_url: string | null
          impacto: number | null
          local: string
          prazo_conclusao: string | null
          probabilidade: number | null
          processo_id: number | null
          responsavel_id: string | null
          severidade: number | null
          situacao: string | null
          status: string | null
          supervisor_responsavel_id: string | null
          tipo_registro_id: number | null
          updated_at: string | null
        }
        Insert: {
          acao_imediata?: string | null
          acoes?: Json | null
          base_legal_opcao_id?: number | null
          causa_provavel_id?: number | null
          cca_id?: number | null
          classificacao_risco?: string | null
          controle?: number | null
          created_at?: string | null
          data_desvio: string
          descricao_desvio: string
          deteccao?: number | null
          disciplina_id?: number | null
          efeito_falha?: number | null
          empresa_id?: number | null
          encarregado_responsavel_id?: string | null
          engenheiro_responsavel_id?: string | null
          evento_identificado_id?: number | null
          exposicao?: number | null
          funcionarios_envolvidos?: Json | null
          hora_desvio?: string | null
          id?: string
          imagem_url?: string | null
          impacto?: number | null
          local: string
          prazo_conclusao?: string | null
          probabilidade?: number | null
          processo_id?: number | null
          responsavel_id?: string | null
          severidade?: number | null
          situacao?: string | null
          status?: string | null
          supervisor_responsavel_id?: string | null
          tipo_registro_id?: number | null
          updated_at?: string | null
        }
        Update: {
          acao_imediata?: string | null
          acoes?: Json | null
          base_legal_opcao_id?: number | null
          causa_provavel_id?: number | null
          cca_id?: number | null
          classificacao_risco?: string | null
          controle?: number | null
          created_at?: string | null
          data_desvio?: string
          descricao_desvio?: string
          deteccao?: number | null
          disciplina_id?: number | null
          efeito_falha?: number | null
          empresa_id?: number | null
          encarregado_responsavel_id?: string | null
          engenheiro_responsavel_id?: string | null
          evento_identificado_id?: number | null
          exposicao?: number | null
          funcionarios_envolvidos?: Json | null
          hora_desvio?: string | null
          id?: string
          imagem_url?: string | null
          impacto?: number | null
          local?: string
          prazo_conclusao?: string | null
          probabilidade?: number | null
          processo_id?: number | null
          responsavel_id?: string | null
          severidade?: number | null
          situacao?: string | null
          status?: string | null
          supervisor_responsavel_id?: string | null
          tipo_registro_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "desvios_completos_base_legal_opcao_id_fkey"
            columns: ["base_legal_opcao_id"]
            isOneToOne: false
            referencedRelation: "base_legal_opcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_causa_provavel_id_fkey"
            columns: ["causa_provavel_id"]
            isOneToOne: false
            referencedRelation: "causas_provaveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_encarregado_responsavel_id_fkey"
            columns: ["encarregado_responsavel_id"]
            isOneToOne: false
            referencedRelation: "encarregados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_engenheiro_responsavel_id_fkey"
            columns: ["engenheiro_responsavel_id"]
            isOneToOne: false
            referencedRelation: "engenheiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_evento_identificado_id_fkey"
            columns: ["evento_identificado_id"]
            isOneToOne: false
            referencedRelation: "eventos_identificados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_supervisor_responsavel_id_fkey"
            columns: ["supervisor_responsavel_id"]
            isOneToOne: false
            referencedRelation: "supervisores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "desvios_completos_tipo_registro_id_fkey"
            columns: ["tipo_registro_id"]
            isOneToOne: false
            referencedRelation: "tipos_registro"
            referencedColumns: ["id"]
          },
        ]
      }
      deteccao_opcoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
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
      efeito_falha_opcoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      emails_pendentes: {
        Row: {
          anexos: Json | null
          assunto: string
          corpo: string
          criado_em: string
          destinatario: string
          enviado: boolean
          id: string
          tentativas: number
          updated_at: string
        }
        Insert: {
          anexos?: Json | null
          assunto: string
          corpo: string
          criado_em?: string
          destinatario: string
          enviado?: boolean
          id?: string
          tentativas?: number
          updated_at?: string
        }
        Update: {
          anexos?: Json | null
          assunto?: string
          corpo?: string
          criado_em?: string
          destinatario?: string
          enviado?: boolean
          id?: string
          tentativas?: number
          updated_at?: string
        }
        Relationships: []
      }
      empresa_ccas: {
        Row: {
          cca_id: number
          created_at: string | null
          empresa_id: number
          id: string
        }
        Insert: {
          cca_id: number
          created_at?: string | null
          empresa_id: number
          id?: string
        }
        Update: {
          cca_id?: number
          created_at?: string | null
          empresa_id?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_ccas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_ccas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cca_id: number | null
          cnpj: string
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cca_id?: number | null
          cnpj: string
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cca_id?: number | null
          cnpj?: string
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      encarregado_ccas: {
        Row: {
          cca_id: number
          created_at: string | null
          encarregado_id: string
          id: string
        }
        Insert: {
          cca_id: number
          created_at?: string | null
          encarregado_id: string
          id?: string
        }
        Update: {
          cca_id?: number
          created_at?: string | null
          encarregado_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encarregado_ccas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encarregado_ccas_encarregado_id_fkey"
            columns: ["encarregado_id"]
            isOneToOne: false
            referencedRelation: "encarregados"
            referencedColumns: ["id"]
          },
        ]
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
      engenheiro_ccas: {
        Row: {
          cca_id: number
          created_at: string | null
          engenheiro_id: string
          id: string
        }
        Insert: {
          cca_id: number
          created_at?: string | null
          engenheiro_id: string
          id?: string
        }
        Update: {
          cca_id?: number
          created_at?: string | null
          engenheiro_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engenheiro_ccas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engenheiro_ccas_engenheiro_id_fkey"
            columns: ["engenheiro_id"]
            isOneToOne: false
            referencedRelation: "engenheiros"
            referencedColumns: ["id"]
          },
        ]
      }
      engenheiros: {
        Row: {
          ativo: boolean | null
          cca_id: number | null
          email: string | null
          funcao: string
          id: string
          matricula: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cca_id?: number | null
          email?: string | null
          funcao: string
          id?: string
          matricula?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cca_id?: number | null
          email?: string | null
          funcao?: string
          id?: string
          matricula?: string | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "engenheiros_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
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
      execucao_hsa: {
        Row: {
          ano: number
          cca_id: number
          created_at: string | null
          data: string
          desvios_identificados: number
          funcao: string | null
          id: string
          inspecao_programada: string | null
          mes: number
          observacao: string | null
          relatorio_url: string | null
          responsavel_inspecao: string
          status: string
          updated_at: string | null
        }
        Insert: {
          ano: number
          cca_id: number
          created_at?: string | null
          data: string
          desvios_identificados?: number
          funcao?: string | null
          id?: string
          inspecao_programada?: string | null
          mes: number
          observacao?: string | null
          relatorio_url?: string | null
          responsavel_inspecao: string
          status: string
          updated_at?: string | null
        }
        Update: {
          ano?: number
          cca_id?: number
          created_at?: string | null
          data?: string
          desvios_identificados?: number
          funcao?: string | null
          id?: string
          inspecao_programada?: string | null
          mes?: number
          observacao?: string | null
          relatorio_url?: string | null
          responsavel_inspecao?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "execucao_hsa_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      execucao_treinamentos: {
        Row: {
          ano: number
          carga_horaria: number
          cca: string
          cca_id: number | null
          created_at: string | null
          data: string
          efetivo_mod: number | null
          efetivo_moi: number | null
          horas_totais: number | null
          id: string
          lista_presenca_url: string | null
          mes: number
          observacoes: string | null
          processo_treinamento: string
          processo_treinamento_id: string | null
          tipo_treinamento: string
          tipo_treinamento_id: string | null
          treinamento_id: string | null
          treinamento_nome: string | null
          updated_at: string | null
        }
        Insert: {
          ano: number
          carga_horaria: number
          cca: string
          cca_id?: number | null
          created_at?: string | null
          data: string
          efetivo_mod?: number | null
          efetivo_moi?: number | null
          horas_totais?: number | null
          id?: string
          lista_presenca_url?: string | null
          mes: number
          observacoes?: string | null
          processo_treinamento: string
          processo_treinamento_id?: string | null
          tipo_treinamento: string
          tipo_treinamento_id?: string | null
          treinamento_id?: string | null
          treinamento_nome?: string | null
          updated_at?: string | null
        }
        Update: {
          ano?: number
          carga_horaria?: number
          cca?: string
          cca_id?: number | null
          created_at?: string | null
          data?: string
          efetivo_mod?: number | null
          efetivo_moi?: number | null
          horas_totais?: number | null
          id?: string
          lista_presenca_url?: string | null
          mes?: number
          observacoes?: string | null
          processo_treinamento?: string
          processo_treinamento_id?: string | null
          tipo_treinamento?: string
          tipo_treinamento_id?: string | null
          treinamento_id?: string | null
          treinamento_nome?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "execucao_treinamentos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execucao_treinamentos_processo_treinamento_id_fkey"
            columns: ["processo_treinamento_id"]
            isOneToOne: false
            referencedRelation: "processo_treinamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execucao_treinamentos_tipo_treinamento_id_fkey"
            columns: ["tipo_treinamento_id"]
            isOneToOne: false
            referencedRelation: "tipo_treinamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execucao_treinamentos_treinamento_id_fkey"
            columns: ["treinamento_id"]
            isOneToOne: false
            referencedRelation: "treinamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      exposicao_opcoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      funcionario_supervisores: {
        Row: {
          created_at: string
          funcionario_id: string
          id: string
          supervisor_id: string
        }
        Insert: {
          created_at?: string
          funcionario_id: string
          id?: string
          supervisor_id: string
        }
        Update: {
          created_at?: string
          funcionario_id?: string
          id?: string
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "funcionario_supervisores_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funcionario_supervisores_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          ativo: boolean | null
          cca_id: number | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          foto: string | null
          funcao: string
          id: string
          matricula: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cca_id?: number | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          foto?: string | null
          funcao: string
          id?: string
          matricula: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cca_id?: number | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          foto?: string | null
          funcao?: string
          id?: string
          matricula?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      horas_trabalhadas: {
        Row: {
          ano: number
          cca_id: number
          created_at: string
          horas_trabalhadas: number
          id: string
          mes: number
          observacoes: string | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          ano: number
          cca_id: number
          created_at?: string
          horas_trabalhadas: number
          id?: string
          mes: number
          observacoes?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          ano?: number
          cca_id?: number
          created_at?: string
          horas_trabalhadas?: number
          id?: string
          mes?: number
          observacoes?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horas_trabalhadas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      idsms_indicadores: {
        Row: {
          ano: number
          cca_id: number
          created_at: string
          data: string
          id: string
          mes: number
          motivo: string | null
          resultado: number
          tipo: string
          updated_at: string
        }
        Insert: {
          ano: number
          cca_id: number
          created_at?: string
          data: string
          id?: string
          mes: number
          motivo?: string | null
          resultado: number
          tipo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          cca_id?: number
          created_at?: string
          data?: string
          id?: string
          mes?: number
          motivo?: string | null
          resultado?: number
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "idsms_indicadores_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      impacto_opcoes: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      inspecoes_sms: {
        Row: {
          cca_id: number | null
          created_at: string
          dados_preenchidos: Json
          data_inspecao: string
          id: string
          local: string
          modelo_id: string
          observacoes: string | null
          pdf_gerado_url: string | null
          responsavel_id: string
          status: string
          tem_nao_conformidade: boolean
          updated_at: string
        }
        Insert: {
          cca_id?: number | null
          created_at?: string
          dados_preenchidos?: Json
          data_inspecao: string
          id?: string
          local: string
          modelo_id: string
          observacoes?: string | null
          pdf_gerado_url?: string | null
          responsavel_id: string
          status?: string
          tem_nao_conformidade?: boolean
          updated_at?: string
        }
        Update: {
          cca_id?: number | null
          created_at?: string
          dados_preenchidos?: Json
          data_inspecao?: string
          id?: string
          local?: string
          modelo_id?: string
          observacoes?: string | null
          pdf_gerado_url?: string | null
          responsavel_id?: string
          status?: string
          tem_nao_conformidade?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspecoes_sms_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspecoes_sms_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "modelos_inspecao_sms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspecoes_sms_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lateralidade: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lista_treinamentos_normativos: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
          validade_dias: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
          validade_dias?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
          validade_dias?: number | null
        }
        Relationships: []
      }
      logs_importacao_execucao_treinamentos: {
        Row: {
          created_at: string
          data_importacao: string
          detalhes_erro: string | null
          id: string
          nome_arquivo: string | null
          registros_atualizados: number
          registros_com_erro: number
          registros_criados: number
          status: string
          total_registros: number
          usuario_id: string
        }
        Insert: {
          created_at?: string
          data_importacao?: string
          detalhes_erro?: string | null
          id?: string
          nome_arquivo?: string | null
          registros_atualizados?: number
          registros_com_erro?: number
          registros_criados?: number
          status?: string
          total_registros?: number
          usuario_id: string
        }
        Update: {
          created_at?: string
          data_importacao?: string
          detalhes_erro?: string | null
          id?: string
          nome_arquivo?: string | null
          registros_atualizados?: number
          registros_com_erro?: number
          registros_criados?: number
          status?: string
          total_registros?: number
          usuario_id?: string
        }
        Relationships: []
      }
      logs_importacao_funcionarios: {
        Row: {
          created_at: string
          data_importacao: string
          detalhes_erro: string | null
          id: string
          nome_arquivo: string | null
          registros_atualizados: number
          registros_com_erro: number
          registros_criados: number
          status: string
          total_registros: number
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          data_importacao?: string
          detalhes_erro?: string | null
          id?: string
          nome_arquivo?: string | null
          registros_atualizados?: number
          registros_com_erro?: number
          registros_criados?: number
          status?: string
          total_registros?: number
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          data_importacao?: string
          detalhes_erro?: string | null
          id?: string
          nome_arquivo?: string | null
          registros_atualizados?: number
          registros_com_erro?: number
          registros_criados?: number
          status?: string
          total_registros?: number
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_importacao_funcionarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medidas_disciplinares: {
        Row: {
          ano: string
          cca_id: number | null
          created_at: string | null
          data: string
          funcionario_id: string | null
          id: string
          medida: Database["public"]["Enums"]["medida_aplicada_enum"]
          mes: string
          motivo: string | null
          pdf_url: string | null
        }
        Insert: {
          ano: string
          cca_id?: number | null
          created_at?: string | null
          data: string
          funcionario_id?: string | null
          id?: string
          medida: Database["public"]["Enums"]["medida_aplicada_enum"]
          mes: string
          motivo?: string | null
          pdf_url?: string | null
        }
        Update: {
          ano?: string
          cca_id?: number | null
          created_at?: string | null
          data?: string
          funcionario_id?: string | null
          id?: string
          medida?: Database["public"]["Enums"]["medida_aplicada_enum"]
          mes?: string
          motivo?: string | null
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medidas_disciplinares_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medidas_disciplinares_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      metas_indicadores: {
        Row: {
          ano: number
          created_at: string
          id: string
          meta_taxa_frequencia_ac_cpd: number
          meta_taxa_frequencia_ac_spd: number
          meta_taxa_gravidade: number
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          id?: string
          meta_taxa_frequencia_ac_cpd?: number
          meta_taxa_frequencia_ac_spd?: number
          meta_taxa_gravidade?: number
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          id?: string
          meta_taxa_frequencia_ac_cpd?: number
          meta_taxa_frequencia_ac_spd?: number
          meta_taxa_gravidade?: number
          updated_at?: string
        }
        Relationships: []
      }
      modelos_inspecao_sms: {
        Row: {
          arquivo_modelo_url: string
          ativo: boolean
          campos_substituicao: Json
          created_at: string
          id: string
          nome: string
          tipo_inspecao_id: string
          updated_at: string
        }
        Insert: {
          arquivo_modelo_url: string
          ativo?: boolean
          campos_substituicao?: Json
          created_at?: string
          id?: string
          nome: string
          tipo_inspecao_id: string
          updated_at?: string
        }
        Update: {
          arquivo_modelo_url?: string
          ativo?: boolean
          campos_substituicao?: Json
          created_at?: string
          id?: string
          nome?: string
          tipo_inspecao_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modelos_inspecao_sms_tipo_inspecao_id_fkey"
            columns: ["tipo_inspecao_id"]
            isOneToOne: false
            referencedRelation: "tipos_inspecao_sms"
            referencedColumns: ["id"]
          },
        ]
      }
      natureza_lesao: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          created_at: string
          id: string
          lida: boolean
          mensagem: string
          tarefa_id: string | null
          tipo: string
          titulo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lida?: boolean
          mensagem: string
          tarefa_id?: string | null
          tipo?: string
          titulo: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lida?: boolean
          mensagem?: string
          tarefa_id?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          acoes: Json | null
          agente_causador: string | null
          ano: number | null
          arquivo_cat: string | null
          arquivo_licoes_aprendidas: string | null
          cca: string
          cid: string | null
          classificacao_ocorrencia: string | null
          classificacao_ocorrencia_codigo: string | null
          classificacao_risco: string
          colaboradores_acidentados: Json | null
          controle: string | null
          created_at: string | null
          data: string
          descricao: string | null
          descricao_ocorrencia: string | null
          deteccao: string | null
          dias_debitados: number | null
          dias_perdidos: number | null
          disciplina: string
          efeito_falha: string | null
          empresa: string
          encarregado_responsavel: string | null
          engenheiro_responsavel: string | null
          exposicao: string | null
          hora: string | null
          houve_afastamento: string | null
          id: string
          impacto: string | null
          informe_preliminar: string | null
          investigacao_realizada: string | null
          lateralidade: string | null
          licoes_aprendidas_enviada: string | null
          medidas_tomadas: string | null
          mes: number | null
          natureza_lesao: string | null
          numero_cat: string | null
          parte_corpo_atingida: string | null
          partes_corpo_afetadas: string[] | null
          probabilidade: number | null
          relatorio_analise: string | null
          responsavel_id: string | null
          severidade: number | null
          situacao_geradora: string | null
          status: string
          supervisor_responsavel: string | null
          tipo_evento: string | null
          tipo_ocorrencia: string
          updated_at: string | null
        }
        Insert: {
          acoes?: Json | null
          agente_causador?: string | null
          ano?: number | null
          arquivo_cat?: string | null
          arquivo_licoes_aprendidas?: string | null
          cca: string
          cid?: string | null
          classificacao_ocorrencia?: string | null
          classificacao_ocorrencia_codigo?: string | null
          classificacao_risco: string
          colaboradores_acidentados?: Json | null
          controle?: string | null
          created_at?: string | null
          data?: string
          descricao?: string | null
          descricao_ocorrencia?: string | null
          deteccao?: string | null
          dias_debitados?: number | null
          dias_perdidos?: number | null
          disciplina: string
          efeito_falha?: string | null
          empresa: string
          encarregado_responsavel?: string | null
          engenheiro_responsavel?: string | null
          exposicao?: string | null
          hora?: string | null
          houve_afastamento?: string | null
          id?: string
          impacto?: string | null
          informe_preliminar?: string | null
          investigacao_realizada?: string | null
          lateralidade?: string | null
          licoes_aprendidas_enviada?: string | null
          medidas_tomadas?: string | null
          mes?: number | null
          natureza_lesao?: string | null
          numero_cat?: string | null
          parte_corpo_atingida?: string | null
          partes_corpo_afetadas?: string[] | null
          probabilidade?: number | null
          relatorio_analise?: string | null
          responsavel_id?: string | null
          severidade?: number | null
          situacao_geradora?: string | null
          status: string
          supervisor_responsavel?: string | null
          tipo_evento?: string | null
          tipo_ocorrencia: string
          updated_at?: string | null
        }
        Update: {
          acoes?: Json | null
          agente_causador?: string | null
          ano?: number | null
          arquivo_cat?: string | null
          arquivo_licoes_aprendidas?: string | null
          cca?: string
          cid?: string | null
          classificacao_ocorrencia?: string | null
          classificacao_ocorrencia_codigo?: string | null
          classificacao_risco?: string
          colaboradores_acidentados?: Json | null
          controle?: string | null
          created_at?: string | null
          data?: string
          descricao?: string | null
          descricao_ocorrencia?: string | null
          deteccao?: string | null
          dias_debitados?: number | null
          dias_perdidos?: number | null
          disciplina?: string
          efeito_falha?: string | null
          empresa?: string
          encarregado_responsavel?: string | null
          engenheiro_responsavel?: string | null
          exposicao?: string | null
          hora?: string | null
          houve_afastamento?: string | null
          id?: string
          impacto?: string | null
          informe_preliminar?: string | null
          investigacao_realizada?: string | null
          lateralidade?: string | null
          licoes_aprendidas_enviada?: string | null
          medidas_tomadas?: string | null
          mes?: number | null
          natureza_lesao?: string | null
          numero_cat?: string | null
          parte_corpo_atingida?: string | null
          partes_corpo_afetadas?: string[] | null
          probabilidade?: number | null
          relatorio_analise?: string | null
          responsavel_id?: string | null
          severidade?: number | null
          situacao_geradora?: string | null
          status?: string
          supervisor_responsavel?: string | null
          tipo_evento?: string | null
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
      parte_corpo_atingida: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      perfis: {
        Row: {
          ccas_permitidas: Json | null
          descricao: string | null
          id: number
          nome: string
          permissoes: Json
        }
        Insert: {
          ccas_permitidas?: Json | null
          descricao?: string | null
          id?: number
          nome: string
          permissoes?: Json
        }
        Update: {
          ccas_permitidas?: Json | null
          descricao?: string | null
          id?: number
          nome?: string
          permissoes?: Json
        }
        Relationships: []
      }
      pgr_medidas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string
          eficacia: string | null
          id: string
          plano_id: string | null
          prazo: string | null
          responsavel_id: string | null
          risco_id: string | null
          status: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao: string
          eficacia?: string | null
          id?: string
          plano_id?: string | null
          prazo?: string | null
          responsavel_id?: string | null
          risco_id?: string | null
          status?: string
          tipo: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string
          eficacia?: string | null
          id?: string
          plano_id?: string | null
          prazo?: string | null
          responsavel_id?: string | null
          risco_id?: string | null
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "pgr_medidas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "pgr_planos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pgr_medidas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pgr_planos: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      processo_treinamento: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
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
          ativo: boolean
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
          ativo?: boolean
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
          ativo?: boolean
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
      situacao_geradora: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supervisor_ccas: {
        Row: {
          cca_id: number
          created_at: string | null
          id: string
          supervisor_id: string
        }
        Insert: {
          cca_id: number
          created_at?: string | null
          id?: string
          supervisor_id: string
        }
        Update: {
          cca_id?: number
          created_at?: string | null
          id?: string
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supervisor_ccas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supervisor_ccas_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisores"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisores: {
        Row: {
          ativo: boolean | null
          cca_id: number | null
          email: string | null
          funcao: string
          id: string
          matricula: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cca_id?: number | null
          email?: string | null
          funcao: string
          id?: string
          matricula?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cca_id?: number | null
          email?: string | null
          funcao?: string
          id?: string
          matricula?: string | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "supervisores_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          anexo: string | null
          cca: string
          configuracao: Json
          created_at: string | null
          criado_por: string
          data_cadastro: string | null
          data_conclusao: string | null
          data_real_conclusao: string | null
          descricao: string
          id: string
          iniciada: boolean | null
          observacoes_progresso: string | null
          observacoes_reprovacao: string | null
          responsavel_id: string | null
          status: string
          tipo_cca: string
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          anexo?: string | null
          cca: string
          configuracao?: Json
          created_at?: string | null
          criado_por: string
          data_cadastro?: string | null
          data_conclusao?: string | null
          data_real_conclusao?: string | null
          descricao: string
          id?: string
          iniciada?: boolean | null
          observacoes_progresso?: string | null
          observacoes_reprovacao?: string | null
          responsavel_id?: string | null
          status: string
          tipo_cca: string
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          anexo?: string | null
          cca?: string
          configuracao?: Json
          created_at?: string | null
          criado_por?: string
          data_cadastro?: string | null
          data_conclusao?: string | null
          data_real_conclusao?: string | null
          descricao?: string
          id?: string
          iniciada?: boolean | null
          observacoes_progresso?: string | null
          observacoes_reprovacao?: string | null
          responsavel_id?: string | null
          status?: string
          tipo_cca?: string
          titulo?: string | null
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
      tipo_inspecao_hsa: {
        Row: {
          ativo: boolean
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tipo_medida_disciplinar: {
        Row: {
          ativo: boolean
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean
          id?: number
          nome?: string
        }
        Relationships: []
      }
      tipo_treinamento: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tipos_evento: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tipos_inspecao_sms: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipos_ocorrencia: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
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
            referencedRelation: "lista_treinamentos_normativos"
            referencedColumns: ["id"]
          },
        ]
      }
      tutoriais: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
          usuario_id: string | null
          video_url: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
          usuario_id?: string | null
          video_url: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
          usuario_id?: string | null
          video_url?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          dark_mode: boolean | null
          email_notifications: boolean | null
          id: string
          language: string | null
          sms_notifications: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
            isOneToOne: true
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
      get_hht_by_cca: {
        Args: Record<PropertyKey, never>
        Returns: {
          cca_id: number
          codigo: string
          nome: string
          total_horas: number
        }[]
      }
      get_hht_by_month: {
        Args: Record<PropertyKey, never>
        Returns: {
          mes: number
          ano: number
          total_horas: number
        }[]
      }
      get_user_allowed_ccas: {
        Args: { user_id_param: string }
        Returns: Json
      }
      get_user_permissions: {
        Args: { user_id_param: string }
        Returns: Json
      }
      log_audit_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_table_name?: string
          p_record_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      populate_missing_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      processar_configuracoes_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_can_manage_funcionarios: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      user_is_supervisor_of: {
        Args: { _user_id: string; _funcionario_id: string }
        Returns: boolean
      }
    }
    Enums: {
      medida_aplicada_enum:
        | "ADVERTÊNCIA VERBAL"
        | "ADVERTÊNCIA ESCRITA"
        | "SUSPENSÃO"
        | "DEMISSÃO POR JUSTA CAUSA"
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
      medida_aplicada_enum: [
        "ADVERTÊNCIA VERBAL",
        "ADVERTÊNCIA ESCRITA",
        "SUSPENSÃO",
        "DEMISSÃO POR JUSTA CAUSA",
      ],
    },
  },
} as const
