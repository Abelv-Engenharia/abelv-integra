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
      alertas_esocial: {
        Row: {
          cca_id: number | null
          created_at: string | null
          data_referencia: string
          descricao: string
          empresa_id: number | null
          evento: string
          evento_id: string | null
          funcionario_id: string | null
          funcionario_nome: string | null
          id: string
          notificado_em: string | null
          prazo_envio: string | null
          resolvido_em: string | null
          status: string | null
          tipo_alerta: string
          updated_at: string | null
        }
        Insert: {
          cca_id?: number | null
          created_at?: string | null
          data_referencia: string
          descricao: string
          empresa_id?: number | null
          evento: string
          evento_id?: string | null
          funcionario_id?: string | null
          funcionario_nome?: string | null
          id?: string
          notificado_em?: string | null
          prazo_envio?: string | null
          resolvido_em?: string | null
          status?: string | null
          tipo_alerta: string
          updated_at?: string | null
        }
        Update: {
          cca_id?: number | null
          created_at?: string | null
          data_referencia?: string
          descricao?: string
          empresa_id?: number | null
          evento?: string
          evento_id?: string | null
          funcionario_id?: string | null
          funcionario_nome?: string | null
          id?: string
          notificado_em?: string | null
          prazo_envio?: string | null
          resolvido_em?: string | null
          status?: string | null
          tipo_alerta?: string
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
      auditoria_exports: {
        Row: {
          arquivo_url: string | null
          created_at: string
          evento: string
          filtros_json: Json
          formato: string
          id: string
          quantidade: number
          tabela: string
          usuario_id: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          evento: string
          filtros_json?: Json
          formato: string
          id?: string
          quantidade?: number
          tabela: string
          usuario_id: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          evento?: string
          filtros_json?: Json
          formato?: string
          id?: string
          quantidade?: number
          tabela?: string
          usuario_id?: string
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
      checklists_avaliacao: {
        Row: {
          ativo: boolean
          campos_cabecalho: Json | null
          created_at: string
          descricao: string | null
          id: string
          itens_avaliacao: Json | null
          nome: string
          requer_assinatura: boolean | null
          secoes: Json | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          campos_cabecalho?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          itens_avaliacao?: Json | null
          nome: string
          requer_assinatura?: boolean | null
          secoes?: Json | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          campos_cabecalho?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          itens_avaliacao?: Json | null
          nome?: string
          requer_assinatura?: boolean | null
          secoes?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      cid10_aux: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          codigo: string
          created_at: string | null
          descricao: string
          id: string
          updated_at: string | null
          versao: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          codigo: string
          created_at?: string | null
          descricao: string
          id?: string
          updated_at?: string | null
          versao?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: string
          updated_at?: string | null
          versao?: string | null
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
      comunicados: {
        Row: {
          arquivo_nome: string | null
          arquivo_url: string | null
          ativo: boolean
          created_at: string
          created_by: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          id: string
          publico_alvo: Json
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          id?: string
          publico_alvo?: Json
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          id?: string
          publico_alvo?: Json
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      comunicados_ciencia: {
        Row: {
          comunicado_id: string
          created_at: string
          data_ciencia: string
          id: string
          usuario_id: string
        }
        Insert: {
          comunicado_id: string
          created_at?: string
          data_ciencia?: string
          id?: string
          usuario_id: string
        }
        Update: {
          comunicado_id?: string
          created_at?: string
          data_ciencia?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicados_ciencia_comunicado_id_fkey"
            columns: ["comunicado_id"]
            isOneToOne: false
            referencedRelation: "comunicados"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracao_notificacoes: {
        Row: {
          app_cat_pendente: boolean | null
          app_s2220_prazo: boolean | null
          app_s2240_exposicao: boolean | null
          ativo: boolean | null
          created_at: string | null
          email_cat_pendente: boolean | null
          email_s2220_prazo: boolean | null
          email_s2240_exposicao: boolean | null
          emails_adicionais: string[] | null
          horario_notificacao: string | null
          id: string
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          app_cat_pendente?: boolean | null
          app_s2220_prazo?: boolean | null
          app_s2240_exposicao?: boolean | null
          ativo?: boolean | null
          created_at?: string | null
          email_cat_pendente?: boolean | null
          email_s2220_prazo?: boolean | null
          email_s2240_exposicao?: boolean | null
          emails_adicionais?: string[] | null
          horario_notificacao?: string | null
          id?: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          app_cat_pendente?: boolean | null
          app_s2220_prazo?: boolean | null
          app_s2240_exposicao?: boolean | null
          ativo?: boolean | null
          created_at?: string | null
          email_cat_pendente?: boolean | null
          email_s2220_prazo?: boolean | null
          email_s2240_exposicao?: boolean | null
          emails_adicionais?: string[] | null
          horario_notificacao?: string | null
          id?: string
          updated_at?: string | null
          usuario_id?: string | null
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
          prazo_conclusao: string | null
          probabilidade: number | null
          processo_id: number | null
          responsavel_id: string | null
          responsavel_inspecao: string
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
          prazo_conclusao?: string | null
          probabilidade?: number | null
          processo_id?: number | null
          responsavel_id?: string | null
          responsavel_inspecao: string
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
          prazo_conclusao?: string | null
          probabilidade?: number | null
          processo_id?: number | null
          responsavel_id?: string | null
          responsavel_inspecao?: string
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
      epis_catalogo: {
        Row: {
          ativo: boolean | null
          ca_numero: string
          created_at: string | null
          descricao: string
          fabricante: string | null
          id: string
          norma_referencia: string | null
          situacao: string | null
          tipo: string
          updated_at: string | null
          validade_ca: string | null
          versao: string | null
        }
        Insert: {
          ativo?: boolean | null
          ca_numero: string
          created_at?: string | null
          descricao: string
          fabricante?: string | null
          id?: string
          norma_referencia?: string | null
          situacao?: string | null
          tipo: string
          updated_at?: string | null
          validade_ca?: string | null
          versao?: string | null
        }
        Update: {
          ativo?: boolean | null
          ca_numero?: string
          created_at?: string | null
          descricao?: string
          fabricante?: string | null
          id?: string
          norma_referencia?: string | null
          situacao?: string | null
          tipo?: string
          updated_at?: string | null
          validade_ca?: string | null
          versao?: string | null
        }
        Relationships: []
      }
      esocial_config: {
        Row: {
          ambiente: string
          ativo: boolean
          certificado_cnpj: string | null
          certificado_configurado: boolean | null
          certificado_nome: string | null
          certificado_url: string | null
          certificado_validade_fim: string | null
          certificado_validade_inicio: string | null
          created_at: string
          empresa_id: number
          id: string
          inscricao_numero: string
          inscricao_tipo: number
          transmissor_numero: string
          transmissor_tipo: number
          updated_at: string
          versao_processo: string
        }
        Insert: {
          ambiente?: string
          ativo?: boolean
          certificado_cnpj?: string | null
          certificado_configurado?: boolean | null
          certificado_nome?: string | null
          certificado_url?: string | null
          certificado_validade_fim?: string | null
          certificado_validade_inicio?: string | null
          created_at?: string
          empresa_id: number
          id?: string
          inscricao_numero: string
          inscricao_tipo?: number
          transmissor_numero: string
          transmissor_tipo?: number
          updated_at?: string
          versao_processo?: string
        }
        Update: {
          ambiente?: string
          ativo?: boolean
          certificado_cnpj?: string | null
          certificado_configurado?: boolean | null
          certificado_nome?: string | null
          certificado_url?: string | null
          certificado_validade_fim?: string | null
          certificado_validade_inicio?: string | null
          created_at?: string
          empresa_id?: number
          id?: string
          inscricao_numero?: string
          inscricao_tipo?: number
          transmissor_numero?: string
          transmissor_tipo?: number
          updated_at?: string
          versao_processo?: string
        }
        Relationships: [
          {
            foreignKeyName: "esocial_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      esocial_envios: {
        Row: {
          ambiente: string
          codigo_retorno: string | null
          created_at: string
          evento: string
          evento_id: string
          id: string
          mensagem_retorno: string | null
          protocolo_envio: string | null
          proxima_tentativa: string | null
          recibo: string | null
          status: string
          tentativas: number
          updated_at: string
          usuario_id: string
          xml_assinado: string | null
          xml_gerado: string
          xml_retorno: string | null
        }
        Insert: {
          ambiente?: string
          codigo_retorno?: string | null
          created_at?: string
          evento: string
          evento_id: string
          id?: string
          mensagem_retorno?: string | null
          protocolo_envio?: string | null
          proxima_tentativa?: string | null
          recibo?: string | null
          status?: string
          tentativas?: number
          updated_at?: string
          usuario_id: string
          xml_assinado?: string | null
          xml_gerado: string
          xml_retorno?: string | null
        }
        Update: {
          ambiente?: string
          codigo_retorno?: string | null
          created_at?: string
          evento?: string
          evento_id?: string
          id?: string
          mensagem_retorno?: string | null
          protocolo_envio?: string | null
          proxima_tentativa?: string | null
          recibo?: string | null
          status?: string
          tentativas?: number
          updated_at?: string
          usuario_id?: string
          xml_assinado?: string | null
          xml_gerado?: string
          xml_retorno?: string | null
        }
        Relationships: []
      }
      esocial_s2210_cat: {
        Row: {
          agente_causador: number
          cca_id: number | null
          cid_principal: string
          cnpj_local_acidente: string | null
          cod_cnes: string | null
          cpf: string
          created_at: string | null
          created_by: string | null
          crm_medico: string | null
          data_acidente: string
          data_atendimento: string | null
          data_envio: string | null
          data_obito: string | null
          dsc_complementar: string | null
          dsc_lesao: string
          dsc_local: string | null
          duracao_tratamento: number | null
          empresa_id: number | null
          especificacao_local: string | null
          funcionario_id: string | null
          hora_acidente: string
          hora_atendimento: string | null
          houve_atestado: boolean | null
          houve_morte: boolean | null
          id: string
          indica_afastamento: boolean | null
          indica_internacao: boolean | null
          iniciativa_cat: string | null
          local_acidente: string
          matricula: string
          natureza_lesao: number
          nome_medico: string | null
          nome_trabalhador: string
          observacoes: string | null
          parte_corpo_atingida: number
          protocolo_envio: string | null
          recibo_envio: string | null
          situacao_geradora: string
          status_envio: string | null
          tipo_acidente: string
          tipo_local: string
          uf_crm: string | null
          updated_at: string | null
          updated_by: string | null
          xml_enviado: string | null
          xml_retorno: string | null
        }
        Insert: {
          agente_causador: number
          cca_id?: number | null
          cid_principal: string
          cnpj_local_acidente?: string | null
          cod_cnes?: string | null
          cpf: string
          created_at?: string | null
          created_by?: string | null
          crm_medico?: string | null
          data_acidente: string
          data_atendimento?: string | null
          data_envio?: string | null
          data_obito?: string | null
          dsc_complementar?: string | null
          dsc_lesao: string
          dsc_local?: string | null
          duracao_tratamento?: number | null
          empresa_id?: number | null
          especificacao_local?: string | null
          funcionario_id?: string | null
          hora_acidente: string
          hora_atendimento?: string | null
          houve_atestado?: boolean | null
          houve_morte?: boolean | null
          id?: string
          indica_afastamento?: boolean | null
          indica_internacao?: boolean | null
          iniciativa_cat?: string | null
          local_acidente: string
          matricula: string
          natureza_lesao: number
          nome_medico?: string | null
          nome_trabalhador: string
          observacoes?: string | null
          parte_corpo_atingida: number
          protocolo_envio?: string | null
          recibo_envio?: string | null
          situacao_geradora: string
          status_envio?: string | null
          tipo_acidente: string
          tipo_local: string
          uf_crm?: string | null
          updated_at?: string | null
          updated_by?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Update: {
          agente_causador?: number
          cca_id?: number | null
          cid_principal?: string
          cnpj_local_acidente?: string | null
          cod_cnes?: string | null
          cpf?: string
          created_at?: string | null
          created_by?: string | null
          crm_medico?: string | null
          data_acidente?: string
          data_atendimento?: string | null
          data_envio?: string | null
          data_obito?: string | null
          dsc_complementar?: string | null
          dsc_lesao?: string
          dsc_local?: string | null
          duracao_tratamento?: number | null
          empresa_id?: number | null
          especificacao_local?: string | null
          funcionario_id?: string | null
          hora_acidente?: string
          hora_atendimento?: string | null
          houve_atestado?: boolean | null
          houve_morte?: boolean | null
          id?: string
          indica_afastamento?: boolean | null
          indica_internacao?: boolean | null
          iniciativa_cat?: string | null
          local_acidente?: string
          matricula?: string
          natureza_lesao?: number
          nome_medico?: string | null
          nome_trabalhador?: string
          observacoes?: string | null
          parte_corpo_atingida?: number
          protocolo_envio?: string | null
          recibo_envio?: string | null
          situacao_geradora?: string
          status_envio?: string | null
          tipo_acidente?: string
          tipo_local?: string
          uf_crm?: string | null
          updated_at?: string | null
          updated_by?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esocial_s2210_cat_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2210_cat_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2210_cat_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      esocial_s2220_exames: {
        Row: {
          cca_id: number | null
          cpf: string
          cpf_medico: string | null
          created_at: string | null
          created_by: string | null
          crm_medico: string
          data_envio: string | null
          data_exame: string
          data_fim_restricao: string | null
          data_inicio_restricao: string | null
          data_retorno_trabalho: string | null
          descricao_restricao: string | null
          empresa_id: number | null
          exames_complementares: Json | null
          funcionario_id: string | null
          id: string
          indica_retorno_trabalho: boolean | null
          matricula: string
          nome_medico: string
          nome_trabalhador: string
          observacoes: string | null
          prazo_envio: string | null
          protocolo_envio: string | null
          recibo_envio: string | null
          resultado_aso: string
          status_envio: string | null
          tipo_exame: string
          uf_crm: string
          updated_at: string | null
          updated_by: string | null
          xml_enviado: string | null
          xml_retorno: string | null
        }
        Insert: {
          cca_id?: number | null
          cpf: string
          cpf_medico?: string | null
          created_at?: string | null
          created_by?: string | null
          crm_medico: string
          data_envio?: string | null
          data_exame: string
          data_fim_restricao?: string | null
          data_inicio_restricao?: string | null
          data_retorno_trabalho?: string | null
          descricao_restricao?: string | null
          empresa_id?: number | null
          exames_complementares?: Json | null
          funcionario_id?: string | null
          id?: string
          indica_retorno_trabalho?: boolean | null
          matricula: string
          nome_medico: string
          nome_trabalhador: string
          observacoes?: string | null
          prazo_envio?: string | null
          protocolo_envio?: string | null
          recibo_envio?: string | null
          resultado_aso: string
          status_envio?: string | null
          tipo_exame: string
          uf_crm: string
          updated_at?: string | null
          updated_by?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Update: {
          cca_id?: number | null
          cpf?: string
          cpf_medico?: string | null
          created_at?: string | null
          created_by?: string | null
          crm_medico?: string
          data_envio?: string | null
          data_exame?: string
          data_fim_restricao?: string | null
          data_inicio_restricao?: string | null
          data_retorno_trabalho?: string | null
          descricao_restricao?: string | null
          empresa_id?: number | null
          exames_complementares?: Json | null
          funcionario_id?: string | null
          id?: string
          indica_retorno_trabalho?: boolean | null
          matricula?: string
          nome_medico?: string
          nome_trabalhador?: string
          observacoes?: string | null
          prazo_envio?: string | null
          protocolo_envio?: string | null
          recibo_envio?: string | null
          resultado_aso?: string
          status_envio?: string | null
          tipo_exame?: string
          uf_crm?: string
          updated_at?: string | null
          updated_by?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esocial_s2220_exames_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2220_exames_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2220_exames_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      esocial_s2230_afastamentos: {
        Row: {
          anexos: Json | null
          cca_id: number | null
          codigo_cid: string | null
          cpf: string
          created_at: string | null
          created_by: string | null
          crm_medico: string | null
          data_envio: string | null
          data_fim_afastamento: string | null
          data_inicio_afastamento: string
          descricao_motivo: string | null
          empresa_id: number | null
          especie_beneficio: string | null
          funcionario_id: string | null
          id: string
          matricula: string
          motivo_afastamento: number
          nome_medico: string | null
          nome_trabalhador: string
          numero_beneficio: string | null
          observacoes: string | null
          origem_s2210_id: string | null
          protocolo_envio: string | null
          recibo_envio: string | null
          status_envio: string | null
          uf_crm: string | null
          updated_at: string | null
          updated_by: string | null
          xml_enviado: string | null
          xml_retorno: string | null
        }
        Insert: {
          anexos?: Json | null
          cca_id?: number | null
          codigo_cid?: string | null
          cpf: string
          created_at?: string | null
          created_by?: string | null
          crm_medico?: string | null
          data_envio?: string | null
          data_fim_afastamento?: string | null
          data_inicio_afastamento: string
          descricao_motivo?: string | null
          empresa_id?: number | null
          especie_beneficio?: string | null
          funcionario_id?: string | null
          id?: string
          matricula: string
          motivo_afastamento: number
          nome_medico?: string | null
          nome_trabalhador: string
          numero_beneficio?: string | null
          observacoes?: string | null
          origem_s2210_id?: string | null
          protocolo_envio?: string | null
          recibo_envio?: string | null
          status_envio?: string | null
          uf_crm?: string | null
          updated_at?: string | null
          updated_by?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Update: {
          anexos?: Json | null
          cca_id?: number | null
          codigo_cid?: string | null
          cpf?: string
          created_at?: string | null
          created_by?: string | null
          crm_medico?: string | null
          data_envio?: string | null
          data_fim_afastamento?: string | null
          data_inicio_afastamento?: string
          descricao_motivo?: string | null
          empresa_id?: number | null
          especie_beneficio?: string | null
          funcionario_id?: string | null
          id?: string
          matricula?: string
          motivo_afastamento?: number
          nome_medico?: string | null
          nome_trabalhador?: string
          numero_beneficio?: string | null
          observacoes?: string | null
          origem_s2210_id?: string | null
          protocolo_envio?: string | null
          recibo_envio?: string | null
          status_envio?: string | null
          uf_crm?: string | null
          updated_at?: string | null
          updated_by?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esocial_s2230_afastamentos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2230_afastamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2230_afastamentos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2230_afastamentos_origem_s2210_id_fkey"
            columns: ["origem_s2210_id"]
            isOneToOne: false
            referencedRelation: "esocial_s2210_cat"
            referencedColumns: ["id"]
          },
        ]
      }
      esocial_s2240_exposicoes: {
        Row: {
          agente_nocivo_tabela24: number
          ativo: boolean | null
          cca_id: number | null
          cpf: string
          created_at: string | null
          created_by: string | null
          data_envio: string | null
          data_fim_exposicao: string | null
          data_inicio_exposicao: string
          descricao_agente: string | null
          descricao_epc: string | null
          empresa_id: number | null
          epc_eficaz: boolean | null
          epi_json: Json | null
          funcionario_id: string | null
          id: string
          intensidade_concentracao: number | null
          matricula: string
          nome_trabalhador: string
          observacao_aposentadoria: string | null
          observacoes: string | null
          possivel_aposentadoria_especial: boolean | null
          protocolo_envio: string | null
          recibo_envio: string | null
          responsavel_tecnico_conselho: string | null
          responsavel_tecnico_cpf: string | null
          responsavel_tecnico_nit: string | null
          responsavel_tecnico_nome: string
          responsavel_tecnico_numero_registro: string | null
          responsavel_tecnico_uf_conselho: string | null
          status_envio: string | null
          tecnica_utilizada: string | null
          unidade_medida: string | null
          updated_at: string | null
          updated_by: string | null
          versao: number | null
          versao_anterior_id: string | null
          xml_enviado: string | null
          xml_retorno: string | null
        }
        Insert: {
          agente_nocivo_tabela24: number
          ativo?: boolean | null
          cca_id?: number | null
          cpf: string
          created_at?: string | null
          created_by?: string | null
          data_envio?: string | null
          data_fim_exposicao?: string | null
          data_inicio_exposicao: string
          descricao_agente?: string | null
          descricao_epc?: string | null
          empresa_id?: number | null
          epc_eficaz?: boolean | null
          epi_json?: Json | null
          funcionario_id?: string | null
          id?: string
          intensidade_concentracao?: number | null
          matricula: string
          nome_trabalhador: string
          observacao_aposentadoria?: string | null
          observacoes?: string | null
          possivel_aposentadoria_especial?: boolean | null
          protocolo_envio?: string | null
          recibo_envio?: string | null
          responsavel_tecnico_conselho?: string | null
          responsavel_tecnico_cpf?: string | null
          responsavel_tecnico_nit?: string | null
          responsavel_tecnico_nome: string
          responsavel_tecnico_numero_registro?: string | null
          responsavel_tecnico_uf_conselho?: string | null
          status_envio?: string | null
          tecnica_utilizada?: string | null
          unidade_medida?: string | null
          updated_at?: string | null
          updated_by?: string | null
          versao?: number | null
          versao_anterior_id?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Update: {
          agente_nocivo_tabela24?: number
          ativo?: boolean | null
          cca_id?: number | null
          cpf?: string
          created_at?: string | null
          created_by?: string | null
          data_envio?: string | null
          data_fim_exposicao?: string | null
          data_inicio_exposicao?: string
          descricao_agente?: string | null
          descricao_epc?: string | null
          empresa_id?: number | null
          epc_eficaz?: boolean | null
          epi_json?: Json | null
          funcionario_id?: string | null
          id?: string
          intensidade_concentracao?: number | null
          matricula?: string
          nome_trabalhador?: string
          observacao_aposentadoria?: string | null
          observacoes?: string | null
          possivel_aposentadoria_especial?: boolean | null
          protocolo_envio?: string | null
          recibo_envio?: string | null
          responsavel_tecnico_conselho?: string | null
          responsavel_tecnico_cpf?: string | null
          responsavel_tecnico_nit?: string | null
          responsavel_tecnico_nome?: string
          responsavel_tecnico_numero_registro?: string | null
          responsavel_tecnico_uf_conselho?: string | null
          status_envio?: string | null
          tecnica_utilizada?: string | null
          unidade_medida?: string | null
          updated_at?: string | null
          updated_by?: string | null
          versao?: number | null
          versao_anterior_id?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esocial_s2240_exposicoes_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2240_exposicoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2240_exposicoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esocial_s2240_exposicoes_versao_anterior_id_fkey"
            columns: ["versao_anterior_id"]
            isOneToOne: false
            referencedRelation: "esocial_s2240_exposicoes"
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
      extintores: {
        Row: {
          ativo: boolean | null
          capacidade: string
          codigo: string
          created_at: string | null
          data_fabricacao: string | null
          data_vencimento: string | null
          fabricante: string | null
          id: string
          localizacao: string
          observacoes: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          capacidade: string
          codigo: string
          created_at?: string | null
          data_fabricacao?: string | null
          data_vencimento?: string | null
          fabricante?: string | null
          id?: string
          localizacao: string
          observacoes?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          capacidade?: string
          codigo?: string
          created_at?: string | null
          data_fabricacao?: string | null
          data_vencimento?: string | null
          fabricante?: string | null
          id?: string
          localizacao?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string | null
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
          funcao_id: string | null
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
          funcao_id?: string | null
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
          funcao_id?: string | null
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
          {
            foreignKeyName: "funcionarios_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "funcoes"
            referencedColumns: ["id"]
          },
        ]
      }
      funcoes: {
        Row: {
          ativo: boolean | null
          cbo_codigo: string | null
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cbo_codigo?: string | null
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cbo_codigo?: string | null
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      gse_groups: {
        Row: {
          cca_id: number | null
          codigo: string
          created_at: string | null
          data_fim_vigencia: string | null
          data_inicio_vigencia: string
          descricao: string | null
          empresa_id: number
          id: string
          nome: string
          responsavel_tecnico_json: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cca_id?: number | null
          codigo: string
          created_at?: string | null
          data_fim_vigencia?: string | null
          data_inicio_vigencia: string
          descricao?: string | null
          empresa_id: number
          id?: string
          nome: string
          responsavel_tecnico_json?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cca_id?: number | null
          codigo?: string
          created_at?: string | null
          data_fim_vigencia?: string | null
          data_inicio_vigencia?: string
          descricao?: string | null
          empresa_id?: number
          id?: string
          nome?: string
          responsavel_tecnico_json?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gse_groups_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gse_groups_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      gse_groups_agentes: {
        Row: {
          agente_tabela24: number
          atividade: string | null
          classificacao_risco: string | null
          created_at: string | null
          fonte_geradora: string | null
          gse_id: string
          id: string
          intensidade_dose: number | null
          jornada_exposicao: number | null
          limite_tolerancia: number | null
          observacoes: string | null
          tecnica_avaliacao: string | null
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          agente_tabela24: number
          atividade?: string | null
          classificacao_risco?: string | null
          created_at?: string | null
          fonte_geradora?: string | null
          gse_id: string
          id?: string
          intensidade_dose?: number | null
          jornada_exposicao?: number | null
          limite_tolerancia?: number | null
          observacoes?: string | null
          tecnica_avaliacao?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          agente_tabela24?: number
          atividade?: string | null
          classificacao_risco?: string | null
          created_at?: string | null
          fonte_geradora?: string | null
          gse_id?: string
          id?: string
          intensidade_dose?: number | null
          jornada_exposicao?: number | null
          limite_tolerancia?: number | null
          observacoes?: string | null
          tecnica_avaliacao?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gse_groups_agentes_agente_tabela24_fkey"
            columns: ["agente_tabela24"]
            isOneToOne: false
            referencedRelation: "tabela24_agentes_nocivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gse_groups_agentes_gse_id_fkey"
            columns: ["gse_id"]
            isOneToOne: false
            referencedRelation: "gse_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      gse_groups_epc: {
        Row: {
          created_at: string | null
          descricao: string
          eficacia: boolean | null
          gse_id: string
          id: string
          observacoes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao: string
          eficacia?: boolean | null
          gse_id: string
          id?: string
          observacoes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string
          eficacia?: boolean | null
          gse_id?: string
          id?: string
          observacoes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gse_groups_epc_gse_id_fkey"
            columns: ["gse_id"]
            isOneToOne: false
            referencedRelation: "gse_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      gse_groups_epi: {
        Row: {
          ca_numero: string | null
          ca_validade: string | null
          created_at: string | null
          descricao: string
          eficacia: boolean | null
          epi_id: string | null
          gse_id: string
          higienizacao: boolean | null
          id: string
          observacoes: string | null
          treinamento: boolean | null
          updated_at: string | null
          uso_adequado: boolean | null
        }
        Insert: {
          ca_numero?: string | null
          ca_validade?: string | null
          created_at?: string | null
          descricao: string
          eficacia?: boolean | null
          epi_id?: string | null
          gse_id: string
          higienizacao?: boolean | null
          id?: string
          observacoes?: string | null
          treinamento?: boolean | null
          updated_at?: string | null
          uso_adequado?: boolean | null
        }
        Update: {
          ca_numero?: string | null
          ca_validade?: string | null
          created_at?: string | null
          descricao?: string
          eficacia?: boolean | null
          epi_id?: string | null
          gse_id?: string
          higienizacao?: boolean | null
          id?: string
          observacoes?: string | null
          treinamento?: boolean | null
          updated_at?: string | null
          uso_adequado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "gse_groups_epi_epi_id_fkey"
            columns: ["epi_id"]
            isOneToOne: false
            referencedRelation: "epis_catalogo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gse_groups_epi_gse_id_fkey"
            columns: ["gse_id"]
            isOneToOne: false
            referencedRelation: "gse_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      gse_groups_funcoes: {
        Row: {
          created_at: string | null
          escopo: string | null
          funcao_id: string
          gse_id: string
          id: string
          updated_at: string | null
          vigencia_fim: string | null
          vigencia_inicio: string
        }
        Insert: {
          created_at?: string | null
          escopo?: string | null
          funcao_id: string
          gse_id: string
          id?: string
          updated_at?: string | null
          vigencia_fim?: string | null
          vigencia_inicio: string
        }
        Update: {
          created_at?: string | null
          escopo?: string | null
          funcao_id?: string
          gse_id?: string
          id?: string
          updated_at?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string
        }
        Relationships: [
          {
            foreignKeyName: "gse_groups_funcoes_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "funcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gse_groups_funcoes_gse_id_fkey"
            columns: ["gse_id"]
            isOneToOne: false
            referencedRelation: "gse_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      gse_materialized_map: {
        Row: {
          consolidado_json: Json | null
          created_at: string | null
          funcionario_id: string
          generated_at: string | null
          gse_id: string
          id: string
          snapshot_hash: string
          updated_at: string | null
          vigencia_fim: string | null
          vigencia_inicio: string
        }
        Insert: {
          consolidado_json?: Json | null
          created_at?: string | null
          funcionario_id: string
          generated_at?: string | null
          gse_id: string
          id?: string
          snapshot_hash: string
          updated_at?: string | null
          vigencia_fim?: string | null
          vigencia_inicio: string
        }
        Update: {
          consolidado_json?: Json | null
          created_at?: string | null
          funcionario_id?: string
          generated_at?: string | null
          gse_id?: string
          id?: string
          snapshot_hash?: string
          updated_at?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string
        }
        Relationships: [
          {
            foreignKeyName: "gse_materialized_map_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gse_materialized_map_gse_id_fkey"
            columns: ["gse_id"]
            isOneToOne: false
            referencedRelation: "gse_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      gse_overrides_colab: {
        Row: {
          created_at: string | null
          funcionario_id: string
          gse_id: string | null
          id: string
          motivo: string
          payload_json: Json
          tipo_override: string
          updated_at: string | null
          vigencia_fim: string | null
          vigencia_inicio: string
        }
        Insert: {
          created_at?: string | null
          funcionario_id: string
          gse_id?: string | null
          id?: string
          motivo: string
          payload_json: Json
          tipo_override: string
          updated_at?: string | null
          vigencia_fim?: string | null
          vigencia_inicio: string
        }
        Update: {
          created_at?: string | null
          funcionario_id?: string
          gse_id?: string | null
          id?: string
          motivo?: string
          payload_json?: Json
          tipo_override?: string
          updated_at?: string | null
          vigencia_fim?: string | null
          vigencia_inicio?: string
        }
        Relationships: [
          {
            foreignKeyName: "gse_overrides_colab_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gse_overrides_colab_gse_id_fkey"
            columns: ["gse_id"]
            isOneToOne: false
            referencedRelation: "gse_groups"
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
      inspecoes_extintores: {
        Row: {
          checklist_id: string
          created_at: string | null
          dados_preenchidos: Json
          data_inspecao: string
          extintor_id: string
          id: string
          observacoes: string | null
          responsavel_id: string
          status: string
          tem_nao_conformidade: boolean | null
          updated_at: string | null
        }
        Insert: {
          checklist_id: string
          created_at?: string | null
          dados_preenchidos?: Json
          data_inspecao: string
          extintor_id: string
          id?: string
          observacoes?: string | null
          responsavel_id: string
          status?: string
          tem_nao_conformidade?: boolean | null
          updated_at?: string | null
        }
        Update: {
          checklist_id?: string
          created_at?: string | null
          dados_preenchidos?: Json
          data_inspecao?: string
          extintor_id?: string
          id?: string
          observacoes?: string | null
          responsavel_id?: string
          status?: string
          tem_nao_conformidade?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspecoes_extintores_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists_avaliacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspecoes_extintores_extintor_id_fkey"
            columns: ["extintor_id"]
            isOneToOne: false
            referencedRelation: "extintores"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "checklists_avaliacao"
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
      logs_importacao_hsa: {
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
      paginas_favoritas: {
        Row: {
          created_at: string
          icone: string | null
          id: string
          nome_pagina: string
          updated_at: string
          url_pagina: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          icone?: string | null
          id?: string
          nome_pagina: string
          updated_at?: string
          url_pagina: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          icone?: string | null
          id?: string
          nome_pagina?: string
          updated_at?: string
          url_pagina?: string
          usuario_id?: string
        }
        Relationships: []
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
      tabela13_parte_corpo: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string
          id: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao: string
          id: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      tabela17_natureza_lesao: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string
          id: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao: string
          id: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      tabela18_motivos_afastamento: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string
          id: number
          tipo: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao: string
          id: number
          tipo?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: number
          tipo?: string | null
        }
        Relationships: []
      }
      tabela24_agentes_nocivos: {
        Row: {
          aposentadoria_especial: boolean | null
          ativo: boolean | null
          categoria: string | null
          codigo: string
          created_at: string | null
          descricao: string
          id: number
          tempo_exposicao_anos: number | null
        }
        Insert: {
          aposentadoria_especial?: boolean | null
          ativo?: boolean | null
          categoria?: string | null
          codigo: string
          created_at?: string | null
          descricao: string
          id: number
          tempo_exposicao_anos?: number | null
        }
        Update: {
          aposentadoria_especial?: boolean | null
          ativo?: boolean | null
          categoria?: string | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: number
          tempo_exposicao_anos?: number | null
        }
        Relationships: []
      }
      tabela27_exames_complementares: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          descricao: string
          id: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          descricao: string
          id: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: number
        }
        Relationships: []
      }
      tarefa_observacoes: {
        Row: {
          created_at: string
          id: string
          observacao: string
          tarefa_id: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          observacao: string
          tarefa_id: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          observacao?: string
          tarefa_id?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefa_observacoes_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
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
      tarefas_anexos: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          nome_arquivo: string
          nome_original: string
          tamanho: number | null
          tarefa_id: string
          tipo_arquivo: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo: string
          nome_original: string
          tamanho?: number | null
          tarefa_id: string
          tipo_arquivo?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo?: string
          nome_original?: string
          tamanho?: number | null
          tarefa_id?: string
          tipo_arquivo?: string | null
        }
        Relationships: []
      }
      tarefas_responsaveis: {
        Row: {
          created_at: string
          id: string
          responsavel_id: string
          tarefa_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          responsavel_id: string
          tarefa_id: string
        }
        Update: {
          created_at?: string
          id?: string
          responsavel_id?: string
          tarefa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_responsaveis_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_responsaveis_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
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
      vw_heatmap_funcao_agente: {
        Row: {
          agente_nocivo: string | null
          funcao: string | null
          media_intensidade: number | null
          quantidade_expostos: number | null
        }
        Relationships: []
      }
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
          ano: number
          mes: number
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
          p_action: string
          p_details?: Json
          p_record_id?: string
          p_table_name?: string
          p_user_id: string
        }
        Returns: undefined
      }
      materialize_gse_to_funcionarios: {
        Args: { p_funcionario_id?: string; p_gse_id?: string }
        Returns: Json
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
        Args: { _funcionario_id: string; _user_id: string }
        Returns: boolean
      }
      verificar_alertas_diarios: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
