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
      almoxarifados: {
        Row: {
          ativo: boolean
          cca_id: number
          created_at: string | null
          endereco: string | null
          id: string
          interno_cliente: boolean
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          cca_id: number
          created_at?: string | null
          endereco?: string | null
          id?: string
          interno_cliente?: boolean
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          cca_id?: number
          created_at?: string | null
          endereco?: string | null
          id?: string
          interno_cliente?: boolean
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "almoxarifados_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
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
      checklists_avaliacao: {
        Row: {
          ativo: boolean
          campos_cabecalho: Json | null
          contexto_uso: string[]
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
          contexto_uso?: string[]
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
          contexto_uso?: string[]
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
      consolidacoes: {
        Row: {
          created_at: string
          created_by: string | null
          data_assinatura_contrato_real: string
          data_entrega_orcamento_executivo_prevista: string
          data_entrega_orcamento_executivo_real: string
          data_termino_contrato_prevista: string
          id: string
          proposta_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_assinatura_contrato_real: string
          data_entrega_orcamento_executivo_prevista: string
          data_entrega_orcamento_executivo_real: string
          data_termino_contrato_prevista: string
          id?: string
          proposta_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_assinatura_contrato_real?: string
          data_entrega_orcamento_executivo_prevista?: string
          data_entrega_orcamento_executivo_real?: string
          data_termino_contrato_prevista?: string
          id?: string
          proposta_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consolidacoes_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: true
            referencedRelation: "propostas_comerciais"
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
      credores: {
        Row: {
          ativo: boolean
          cnpj_cpf: string | null
          created_at: string
          fantasia: string | null
          id: string
          id_sienge: string
          razao: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj_cpf?: string | null
          created_at?: string
          fantasia?: string | null
          id?: string
          id_sienge: string
          razao: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj_cpf?: string | null
          created_at?: string
          fantasia?: string | null
          id?: string
          id_sienge?: string
          razao?: string
          updated_at?: string
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
          encarregado_responsavel_nome: string | null
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
          supervisor_responsavel_nome: string | null
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
          encarregado_responsavel_nome?: string | null
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
          supervisor_responsavel_nome?: string | null
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
          encarregado_responsavel_nome?: string | null
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
          supervisor_responsavel_nome?: string | null
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
      documentacao_gerada: {
        Row: {
          arquivo_nome: string
          arquivo_url: string
          cca_id: number | null
          created_at: string | null
          created_by: string | null
          dados_preenchidos: Json | null
          empresa_id: number | null
          funcionario_id: string | null
          id: string
          modelo_id: string | null
          risco_funcao_id: string | null
          tipo: string
          turma_id: string | null
        }
        Insert: {
          arquivo_nome: string
          arquivo_url: string
          cca_id?: number | null
          created_at?: string | null
          created_by?: string | null
          dados_preenchidos?: Json | null
          empresa_id?: number | null
          funcionario_id?: string | null
          id?: string
          modelo_id?: string | null
          risco_funcao_id?: string | null
          tipo: string
          turma_id?: string | null
        }
        Update: {
          arquivo_nome?: string
          arquivo_url?: string
          cca_id?: number | null
          created_at?: string | null
          created_by?: string | null
          dados_preenchidos?: Json | null
          empresa_id?: number | null
          funcionario_id?: string | null
          id?: string
          modelo_id?: string | null
          risco_funcao_id?: string | null
          tipo?: string
          turma_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentacao_gerada_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_gerada_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_gerada_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_gerada_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "documentacao_modelos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_gerada_risco_funcao_id_fkey"
            columns: ["risco_funcao_id"]
            isOneToOne: false
            referencedRelation: "documentacao_riscos_funcao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_gerada_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "documentacao_turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      documentacao_modelos: {
        Row: {
          arquivo_nome: string
          arquivo_url: string
          ativo: boolean | null
          codigos_disponiveis: Json
          created_at: string | null
          created_by: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
          versao: number | null
        }
        Insert: {
          arquivo_nome: string
          arquivo_url: string
          ativo?: boolean | null
          codigos_disponiveis?: Json
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
          versao?: number | null
        }
        Update: {
          arquivo_nome?: string
          arquivo_url?: string
          ativo?: boolean | null
          codigos_disponiveis?: Json
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
          versao?: number | null
        }
        Relationships: []
      }
      documentacao_riscos_funcao: {
        Row: {
          ativo: boolean | null
          cbo: string | null
          cca_id: number
          created_at: string | null
          created_by: string | null
          descricao_funcao: string
          empresa_id: number
          epis_requeridos: Json | null
          funcao: string
          id: string
          riscos_acidentes: Json | null
          riscos_biologicos: Json | null
          riscos_ergonomicos: Json | null
          riscos_fisicos: Json | null
          riscos_quimicos: Json | null
          tecnico_responsavel_id: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cbo?: string | null
          cca_id: number
          created_at?: string | null
          created_by?: string | null
          descricao_funcao: string
          empresa_id: number
          epis_requeridos?: Json | null
          funcao: string
          id?: string
          riscos_acidentes?: Json | null
          riscos_biologicos?: Json | null
          riscos_ergonomicos?: Json | null
          riscos_fisicos?: Json | null
          riscos_quimicos?: Json | null
          tecnico_responsavel_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cbo?: string | null
          cca_id?: number
          created_at?: string | null
          created_by?: string | null
          descricao_funcao?: string
          empresa_id?: number
          epis_requeridos?: Json | null
          funcao?: string
          id?: string
          riscos_acidentes?: Json | null
          riscos_biologicos?: Json | null
          riscos_ergonomicos?: Json | null
          riscos_fisicos?: Json | null
          riscos_quimicos?: Json | null
          tecnico_responsavel_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentacao_riscos_funcao_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_riscos_funcao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_riscos_funcao_tecnico_responsavel_id_fkey"
            columns: ["tecnico_responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documentacao_turmas: {
        Row: {
          carga_horaria: number
          cca_id: number | null
          created_at: string | null
          created_by: string | null
          data_fim: string | null
          data_inicio: string
          empresa_id: number | null
          id: string
          instrutor: string
          local: string
          nome: string
          observacoes: string | null
          status: string | null
          treinamento_id: string | null
          updated_at: string | null
        }
        Insert: {
          carga_horaria: number
          cca_id?: number | null
          created_at?: string | null
          created_by?: string | null
          data_fim?: string | null
          data_inicio: string
          empresa_id?: number | null
          id?: string
          instrutor: string
          local: string
          nome: string
          observacoes?: string | null
          status?: string | null
          treinamento_id?: string | null
          updated_at?: string | null
        }
        Update: {
          carga_horaria?: number
          cca_id?: number | null
          created_at?: string | null
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string
          empresa_id?: number | null
          id?: string
          instrutor?: string
          local?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          treinamento_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentacao_turmas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_turmas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_turmas_treinamento_id_fkey"
            columns: ["treinamento_id"]
            isOneToOne: false
            referencedRelation: "treinamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      documentacao_turmas_alunos: {
        Row: {
          created_at: string | null
          funcionario_id: string | null
          id: string
          nota: number | null
          observacoes: string | null
          presente: boolean | null
          turma_id: string | null
        }
        Insert: {
          created_at?: string | null
          funcionario_id?: string | null
          id?: string
          nota?: number | null
          observacoes?: string | null
          presente?: boolean | null
          turma_id?: string | null
        }
        Update: {
          created_at?: string | null
          funcionario_id?: string | null
          id?: string
          nota?: number | null
          observacoes?: string | null
          presente?: boolean | null
          turma_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentacao_turmas_alunos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentacao_turmas_alunos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "documentacao_turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      eap_itens: {
        Row: {
          ativo: boolean
          cca_id: number
          codigo: string
          created_at: string
          id: string
          nivel: number
          nome: string
          ordem: number
          parent_codigo: string | null
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cca_id: number
          codigo: string
          created_at?: string
          id?: string
          nivel?: number
          nome: string
          ordem?: number
          parent_codigo?: string | null
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cca_id?: number
          codigo?: string
          created_at?: string
          id?: string
          nivel?: number
          nome?: string
          ordem?: number
          parent_codigo?: string | null
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eap_itens_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eap_itens_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "eap_itens"
            referencedColumns: ["id"]
          },
        ]
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
      empresas_sienge: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          id_sienge: number
          name: string
          tradeName: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          id_sienge: number
          name: string
          tradeName?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          id_sienge?: number
          name?: string
          tradeName?: string | null
        }
        Relationships: []
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
          cca_id: number | null
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
          cca_id?: number | null
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
          cca_id?: number | null
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
        Relationships: [
          {
            foreignKeyName: "extintores_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      faturas_viagens_consolidadas: {
        Row: {
          agencia: string
          cca: string
          created_at: string
          created_by: string | null
          dataemissao: string
          id: string
          numerofatura: string
          pdf_nome: string | null
          pdf_url: string | null
          periodoapuracao: string
          status: string
          updated_at: string
          valortotal: number
        }
        Insert: {
          agencia: string
          cca: string
          created_at?: string
          created_by?: string | null
          dataemissao: string
          id?: string
          numerofatura: string
          pdf_nome?: string | null
          pdf_url?: string | null
          periodoapuracao: string
          status: string
          updated_at?: string
          valortotal?: number
        }
        Update: {
          agencia?: string
          cca?: string
          created_at?: string
          created_by?: string | null
          dataemissao?: string
          id?: string
          numerofatura?: string
          pdf_nome?: string | null
          pdf_url?: string | null
          periodoapuracao?: string
          status?: string
          updated_at?: string
          valortotal?: number
        }
        Relationships: []
      }
      faturas_viagens_integra: {
        Row: {
          agencia: string
          antecedencia: number | null
          cca: string
          centrodecusto: string
          checkin: string | null
          checkout: string | null
          ciaida: string | null
          ciavolta: string | null
          codconta: string | null
          comprador: string
          contafinanceira: string | null
          created_at: string
          created_by: string | null
          datadacompra: string
          dataemissaofat: string
          dentrodapolitica: string
          destino: string
          hospedagem: string | null
          id: string
          motivoevento: string
          numerodefat: string
          observacao: string | null
          origem: string
          possuibagagem: string
          protocolo: string
          quemsolicitouforapolitica: string | null
          tipo: string
          updated_at: string
          valorpago: number
          valorpagodebagagem: number | null
          viajante: string
        }
        Insert: {
          agencia: string
          antecedencia?: number | null
          cca: string
          centrodecusto: string
          checkin?: string | null
          checkout?: string | null
          ciaida?: string | null
          ciavolta?: string | null
          codconta?: string | null
          comprador: string
          contafinanceira?: string | null
          created_at?: string
          created_by?: string | null
          datadacompra: string
          dataemissaofat: string
          dentrodapolitica: string
          destino: string
          hospedagem?: string | null
          id?: string
          motivoevento: string
          numerodefat: string
          observacao?: string | null
          origem: string
          possuibagagem: string
          protocolo: string
          quemsolicitouforapolitica?: string | null
          tipo: string
          updated_at?: string
          valorpago?: number
          valorpagodebagagem?: number | null
          viajante: string
        }
        Update: {
          agencia?: string
          antecedencia?: number | null
          cca?: string
          centrodecusto?: string
          checkin?: string | null
          checkout?: string | null
          ciaida?: string | null
          ciavolta?: string | null
          codconta?: string | null
          comprador?: string
          contafinanceira?: string | null
          created_at?: string
          created_by?: string | null
          datadacompra?: string
          dataemissaofat?: string
          dentrodapolitica?: string
          destino?: string
          hospedagem?: string | null
          id?: string
          motivoevento?: string
          numerodefat?: string
          observacao?: string | null
          origem?: string
          possuibagagem?: string
          protocolo?: string
          quemsolicitouforapolitica?: string | null
          tipo?: string
          updated_at?: string
          valorpago?: number
          valorpagodebagagem?: number | null
          viajante?: string
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
      funcionarios_mensal_snapshot: {
        Row: {
          ano: number
          cca_id: number | null
          created_at: string | null
          funcionarios_ativos: number
          id: string
          mes: number
          total_funcionarios: number
          updated_at: string | null
        }
        Insert: {
          ano: number
          cca_id?: number | null
          created_at?: string | null
          funcionarios_ativos?: number
          id?: string
          mes: number
          total_funcionarios?: number
          updated_at?: string | null
        }
        Update: {
          ano?: number
          cca_id?: number | null
          created_at?: string | null
          funcionarios_ativos?: number
          id?: string
          mes?: number
          total_funcionarios?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_mensal_snapshot_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
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
      info_sienge: {
        Row: {
          id: string
          nfe_sequencial: number
        }
        Insert: {
          id?: string
          nfe_sequencial: number
        }
        Update: {
          id?: string
          nfe_sequencial?: number
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
            foreignKeyName: "fk_inspecoes_responsavel"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          desvio_id: string | null
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
          desvio_id?: string | null
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
          desvio_id?: string | null
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
      metas_anuais: {
        Row: {
          ano: number
          ativo: boolean
          created_at: string
          created_by: string | null
          id: string
          meta_anual: number
          meta_t1: number
          meta_t2: number
          meta_t3: number
          meta_t4: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ano: number
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          meta_anual: number
          meta_t1: number
          meta_t2: number
          meta_t3: number
          meta_t4: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ano?: number
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          id?: string
          meta_anual?: number
          meta_t1?: number
          meta_t2?: number
          meta_t3?: number
          meta_t4?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
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
      nfe_compra: {
        Row: {
          created_at: string
          emissao: string | null
          id: string
          id_credor: string
          id_documento: string
          id_empresa: number
          Movimenbto: string | null
          numero: string
          PC_Abelv: string | null
          PC_Cliente: string | null
          sequencial: number
          titulo: number | null
        }
        Insert: {
          created_at?: string
          emissao?: string | null
          id?: string
          id_credor: string
          id_documento: string
          id_empresa: number
          Movimenbto?: string | null
          numero: string
          PC_Abelv?: string | null
          PC_Cliente?: string | null
          sequencial: number
          titulo?: number | null
        }
        Update: {
          created_at?: string
          emissao?: string | null
          id?: string
          id_credor?: string
          id_documento?: string
          id_empresa?: number
          Movimenbto?: string | null
          numero?: string
          PC_Abelv?: string | null
          PC_Cliente?: string | null
          sequencial?: number
          titulo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nfe_compra_id_credor_fkey"
            columns: ["id_credor"]
            isOneToOne: false
            referencedRelation: "credores"
            referencedColumns: ["id_sienge"]
          },
          {
            foreignKeyName: "nfe_compra_id_documento_fkey"
            columns: ["id_documento"]
            isOneToOne: false
            referencedRelation: "tipos_documentos"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "nfe_compra_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_sienge"
            referencedColumns: ["id_sienge"]
          },
        ]
      }
      nfe_compra_itens: {
        Row: {
          created_at: string
          descricao: string
          id: string
          id_cca_sienge: number
          id_nfe: string | null
          id_unidade: number
          quantidade: number
          unitario: number
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          id_cca_sienge: number
          id_nfe?: string | null
          id_unidade: number
          quantidade: number
          unitario: number
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          id_cca_sienge?: number
          id_nfe?: string | null
          id_unidade?: number
          quantidade?: number
          unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "nfe_compra_itens_id_cca_sienge_fkey"
            columns: ["id_cca_sienge"]
            isOneToOne: false
            referencedRelation: "subcentros_custos"
            referencedColumns: ["id_sienge"]
          },
          {
            foreignKeyName: "nfe_compra_itens_id_nfe_fkey"
            columns: ["id_nfe"]
            isOneToOne: false
            referencedRelation: "nfe_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_compra_itens_id_unidade_fkey"
            columns: ["id_unidade"]
            isOneToOne: false
            referencedRelation: "unidades_medidas"
            referencedColumns: ["codigo"]
          },
        ]
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
      os_anexos: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          nome_arquivo: string
          os_id: string
          tamanho: number | null
          tipo_mime: string | null
          url_arquivo: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo: string
          os_id: string
          tamanho?: number | null
          tipo_mime?: string | null
          url_arquivo: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          nome_arquivo?: string
          os_id?: string
          tamanho?: number | null
          tipo_mime?: string | null
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_anexos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_anexos_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: false
            referencedRelation: "os_engenharia_matricial"
            referencedColumns: ["id"]
          },
        ]
      }
      os_engenharia_matricial: {
        Row: {
          cca_id: number | null
          cliente: string
          competencia: string
          created_at: string
          created_by: string | null
          data_abertura: string
          data_atendimento: string | null
          data_compromissada: string
          data_conclusao: string | null
          data_entrega_real: string | null
          data_fim_prevista: string | null
          data_inicio_prevista: string | null
          descricao: string
          disciplina: string
          disciplinas_envolvidas: string[]
          familia_sao: string
          hh_adicional: number
          hh_planejado: number
          id: string
          justificativa_engenharia: string | null
          numero: string | null
          percentual_saving: number | null
          responsavel_em_id: string | null
          responsavel_obra: string
          sla_status: string
          solicitante_id: string
          solicitante_nome: string
          status: Database["public"]["Enums"]["os_status_enum"]
          updated_at: string
          updated_by: string | null
          valor_engenharia: number | null
          valor_final: number | null
          valor_hora_hh: number
          valor_orcamento: number
          valor_sao: number | null
          valor_suprimentos: number | null
        }
        Insert: {
          cca_id?: number | null
          cliente?: string
          competencia?: string
          created_at?: string
          created_by?: string | null
          data_abertura?: string
          data_atendimento?: string | null
          data_compromissada: string
          data_conclusao?: string | null
          data_entrega_real?: string | null
          data_fim_prevista?: string | null
          data_inicio_prevista?: string | null
          descricao: string
          disciplina: string
          disciplinas_envolvidas?: string[]
          familia_sao: string
          hh_adicional?: number
          hh_planejado?: number
          id?: string
          justificativa_engenharia?: string | null
          numero?: string | null
          percentual_saving?: number | null
          responsavel_em_id?: string | null
          responsavel_obra?: string
          sla_status?: string
          solicitante_id: string
          solicitante_nome: string
          status?: Database["public"]["Enums"]["os_status_enum"]
          updated_at?: string
          updated_by?: string | null
          valor_engenharia?: number | null
          valor_final?: number | null
          valor_hora_hh?: number
          valor_orcamento?: number
          valor_sao?: number | null
          valor_suprimentos?: number | null
        }
        Update: {
          cca_id?: number | null
          cliente?: string
          competencia?: string
          created_at?: string
          created_by?: string | null
          data_abertura?: string
          data_atendimento?: string | null
          data_compromissada?: string
          data_conclusao?: string | null
          data_entrega_real?: string | null
          data_fim_prevista?: string | null
          data_inicio_prevista?: string | null
          descricao?: string
          disciplina?: string
          disciplinas_envolvidas?: string[]
          familia_sao?: string
          hh_adicional?: number
          hh_planejado?: number
          id?: string
          justificativa_engenharia?: string | null
          numero?: string | null
          percentual_saving?: number | null
          responsavel_em_id?: string | null
          responsavel_obra?: string
          sla_status?: string
          solicitante_id?: string
          solicitante_nome?: string
          status?: Database["public"]["Enums"]["os_status_enum"]
          updated_at?: string
          updated_by?: string | null
          valor_engenharia?: number | null
          valor_final?: number | null
          valor_hora_hh?: number
          valor_orcamento?: number
          valor_sao?: number | null
          valor_suprimentos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "os_engenharia_matricial_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_engenharia_matricial_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_engenharia_matricial_responsavel_em_id_fkey"
            columns: ["responsavel_em_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_engenharia_matricial_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_engenharia_matricial_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      os_hh_historico: {
        Row: {
          cca: string
          cliente: string
          created_at: string
          disciplina: string
          hh_apropriado: number
          id: string
          mes: string
          meta_mensal: number
          percentual_meta: number
          status_meta: string
        }
        Insert: {
          cca: string
          cliente: string
          created_at?: string
          disciplina: string
          hh_apropriado: number
          id?: string
          mes: string
          meta_mensal: number
          percentual_meta: number
          status_meta: string
        }
        Update: {
          cca?: string
          cliente?: string
          created_at?: string
          disciplina?: string
          hh_apropriado?: number
          id?: string
          mes?: string
          meta_mensal?: number
          percentual_meta?: number
          status_meta?: string
        }
        Relationships: []
      }
      os_replanejamentos: {
        Row: {
          created_at: string
          data: string
          hh_adicional: number
          id: string
          motivo: string
          nova_data_fim: string
          nova_data_inicio: string
          os_id: string
          usuario_id: string | null
          usuario_nome: string
        }
        Insert: {
          created_at?: string
          data?: string
          hh_adicional: number
          id?: string
          motivo: string
          nova_data_fim: string
          nova_data_inicio: string
          os_id: string
          usuario_id?: string | null
          usuario_nome: string
        }
        Update: {
          created_at?: string
          data?: string
          hh_adicional?: number
          id?: string
          motivo?: string
          nova_data_fim?: string
          nova_data_inicio?: string
          os_id?: string
          usuario_id?: string | null
          usuario_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "os_replanejamentos_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: false
            referencedRelation: "os_engenharia_matricial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_replanejamentos_usuario_id_fkey"
            columns: ["usuario_id"]
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
          telas_liberadas: string[] | null
        }
        Insert: {
          ccas_permitidas?: Json | null
          descricao?: string | null
          id?: number
          nome: string
          permissoes?: Json
          telas_liberadas?: string[] | null
        }
        Update: {
          ccas_permitidas?: Json | null
          descricao?: string | null
          id?: number
          nome?: string
          permissoes?: Json
          telas_liberadas?: string[] | null
        }
        Relationships: []
      }
      personnel_snapshots: {
        Row: {
          cca_info: Json | null
          created_at: string | null
          email: string | null
          empresa_info: Json | null
          funcao: string | null
          id: string
          matricula: string | null
          nome: string
          original_id: string
          person_type: string
          snapshot_date: string | null
          updated_at: string | null
          was_active: boolean | null
        }
        Insert: {
          cca_info?: Json | null
          created_at?: string | null
          email?: string | null
          empresa_info?: Json | null
          funcao?: string | null
          id?: string
          matricula?: string | null
          nome: string
          original_id: string
          person_type: string
          snapshot_date?: string | null
          updated_at?: string | null
          was_active?: boolean | null
        }
        Update: {
          cca_info?: Json | null
          created_at?: string | null
          email?: string | null
          empresa_info?: Json | null
          funcao?: string | null
          id?: string
          matricula?: string | null
          nome?: string
          original_id?: string
          person_type?: string
          snapshot_date?: string | null
          updated_at?: string | null
          was_active?: boolean | null
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
      plano_financeiro: {
        Row: {
          adiantamento: boolean
          ativa: boolean
          conta: string
          created_at: string
          descricao: string
          id: string
          imposto: boolean
          redutora: boolean
          tipoconta: string
          updated_at: string
        }
        Insert: {
          adiantamento: boolean
          ativa: boolean
          conta: string
          created_at?: string
          descricao: string
          id?: string
          imposto: boolean
          redutora: boolean
          tipoconta: string
          updated_at?: string
        }
        Update: {
          adiantamento?: boolean
          ativa?: boolean
          conta?: string
          created_at?: string
          descricao?: string
          id?: string
          imposto?: boolean
          redutora?: boolean
          tipoconta?: string
          updated_at?: string
        }
        Relationships: []
      }
      prestadores_contratos: {
        Row: {
          ativo: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          contrato_nome: string | null
          contrato_url: string | null
          created_at: string | null
          created_by: string | null
          dataemissao: string
          datafim: string
          datainicio: string
          empresa: string
          id: string
          numero: string
          observacoes: string | null
          prestador_cnpj: string
          prestador_cpf: string
          prestador_nome: string
          prestador_pj_id: string
          servico: string
          status: string
          tipo: string
          updated_at: string | null
          updated_by: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          contrato_nome?: string | null
          contrato_url?: string | null
          created_at?: string | null
          created_by?: string | null
          dataemissao: string
          datafim: string
          datainicio: string
          empresa: string
          id?: string
          numero: string
          observacoes?: string | null
          prestador_cnpj: string
          prestador_cpf: string
          prestador_nome: string
          prestador_pj_id: string
          servico: string
          status?: string
          tipo: string
          updated_at?: string | null
          updated_by?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          cca_codigo?: string
          cca_id?: number
          cca_nome?: string
          contrato_nome?: string | null
          contrato_url?: string | null
          created_at?: string | null
          created_by?: string | null
          dataemissao?: string
          datafim?: string
          datainicio?: string
          empresa?: string
          id?: string
          numero?: string
          observacoes?: string | null
          prestador_cnpj?: string
          prestador_cpf?: string
          prestador_nome?: string
          prestador_pj_id?: string
          servico?: string
          status?: string
          tipo?: string
          updated_at?: string | null
          updated_by?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_contratos_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contratos_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "prestadores_pj"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contratos_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "view_prestadores_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_demonstrativos: {
        Row: {
          admissao: string
          ajudaaluguel: number | null
          ajudacustoobra: number | null
          ativo: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          codigo: string
          contrato_id: string | null
          cpf: string
          created_at: string | null
          created_by: string | null
          datanascimento: string | null
          descontoabelvrun: number | null
          descontoconvenio: number | null
          funcao: string
          id: string
          mes: string
          multasdescontos: number | null
          nome: string
          nomeempresa: string
          observacoes: string | null
          premiacaonexa: number | null
          prestador_pj_id: string
          reembolsoconvenio: number | null
          salario: number
          updated_at: string | null
          valorliquido: number
          valornf: number
        }
        Insert: {
          admissao: string
          ajudaaluguel?: number | null
          ajudacustoobra?: number | null
          ativo?: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          codigo: string
          contrato_id?: string | null
          cpf: string
          created_at?: string | null
          created_by?: string | null
          datanascimento?: string | null
          descontoabelvrun?: number | null
          descontoconvenio?: number | null
          funcao: string
          id?: string
          mes: string
          multasdescontos?: number | null
          nome: string
          nomeempresa: string
          observacoes?: string | null
          premiacaonexa?: number | null
          prestador_pj_id: string
          reembolsoconvenio?: number | null
          salario: number
          updated_at?: string | null
          valorliquido: number
          valornf: number
        }
        Update: {
          admissao?: string
          ajudaaluguel?: number | null
          ajudacustoobra?: number | null
          ativo?: boolean | null
          cca_codigo?: string
          cca_id?: number
          cca_nome?: string
          codigo?: string
          contrato_id?: string | null
          cpf?: string
          created_at?: string | null
          created_by?: string | null
          datanascimento?: string | null
          descontoabelvrun?: number | null
          descontoconvenio?: number | null
          funcao?: string
          id?: string
          mes?: string
          multasdescontos?: number | null
          nome?: string
          nomeempresa?: string
          observacoes?: string | null
          premiacaonexa?: number | null
          prestador_pj_id?: string
          reembolsoconvenio?: number | null
          salario?: number
          updated_at?: string | null
          valorliquido?: number
          valornf?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_demonstrativos_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_demonstrativos_contrato"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "prestadores_contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_demonstrativos_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "prestadores_pj"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_demonstrativos_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "view_prestadores_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_ferias: {
        Row: {
          anexos: string[] | null
          aprovadopor: string | null
          ativo: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          contrato_id: string | null
          created_at: string | null
          created_by: string | null
          dataaprovacao: string | null
          datainicioferias: string
          diasferias: number
          empresa: string
          funcaocargo: string
          id: string
          justificativareprovacao: string | null
          nomeprestador: string
          observacoes: string | null
          periodoaquisitivo: string
          prestador_pj_id: string
          responsaveldireto: string
          responsaveldireto_id: string | null
          responsavelregistro: string
          responsavelregistro_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          anexos?: string[] | null
          aprovadopor?: string | null
          ativo?: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          contrato_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dataaprovacao?: string | null
          datainicioferias: string
          diasferias: number
          empresa: string
          funcaocargo: string
          id?: string
          justificativareprovacao?: string | null
          nomeprestador: string
          observacoes?: string | null
          periodoaquisitivo: string
          prestador_pj_id: string
          responsaveldireto: string
          responsaveldireto_id?: string | null
          responsavelregistro: string
          responsavelregistro_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          anexos?: string[] | null
          aprovadopor?: string | null
          ativo?: boolean | null
          cca_codigo?: string
          cca_id?: number
          cca_nome?: string
          contrato_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dataaprovacao?: string | null
          datainicioferias?: string
          diasferias?: number
          empresa?: string
          funcaocargo?: string
          id?: string
          justificativareprovacao?: string | null
          nomeprestador?: string
          observacoes?: string | null
          periodoaquisitivo?: string
          prestador_pj_id?: string
          responsaveldireto?: string
          responsaveldireto_id?: string | null
          responsavelregistro?: string
          responsavelregistro_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_ferias_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ferias_contrato"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "prestadores_contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ferias_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "prestadores_pj"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ferias_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "view_prestadores_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_ferias_historico: {
        Row: {
          created_at: string | null
          data: string
          ferias_id: string
          id: string
          observacao: string | null
          status: string
          usuario: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string
          ferias_id: string
          id?: string
          observacao?: string | null
          status: string
          usuario: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          ferias_id?: string
          id?: string
          observacao?: string | null
          status?: string
          usuario?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_ferias_historico_ferias"
            columns: ["ferias_id"]
            isOneToOne: false
            referencedRelation: "prestadores_ferias"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_notas_fiscais: {
        Row: {
          aprovadopor: string | null
          arquivo_nome: string | null
          arquivo_url: string | null
          ativo: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          contrato_id: string | null
          created_at: string | null
          created_by: string | null
          dataaprovacao: string | null
          dataemissao: string
          dataenviosienge: string | null
          datavencimento: string | null
          demonstrativo_id: string | null
          descricaoservico: string
          empresadestino: string | null
          id: string
          mensagemerro: string | null
          nomeempresa: string
          nomerepresentante: string
          numero: string
          numerocredor: string | null
          observacoesaprovacao: string | null
          periodocontabil: string
          planofinanceiro: string | null
          prestador_pj_id: string
          status: string
          statusaprovacao: string | null
          tipodocumento: string | null
          updated_at: string | null
          updated_by: string | null
          valor: number
        }
        Insert: {
          aprovadopor?: string | null
          arquivo_nome?: string | null
          arquivo_url?: string | null
          ativo?: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          contrato_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dataaprovacao?: string | null
          dataemissao: string
          dataenviosienge?: string | null
          datavencimento?: string | null
          demonstrativo_id?: string | null
          descricaoservico: string
          empresadestino?: string | null
          id?: string
          mensagemerro?: string | null
          nomeempresa: string
          nomerepresentante: string
          numero: string
          numerocredor?: string | null
          observacoesaprovacao?: string | null
          periodocontabil: string
          planofinanceiro?: string | null
          prestador_pj_id: string
          status?: string
          statusaprovacao?: string | null
          tipodocumento?: string | null
          updated_at?: string | null
          updated_by?: string | null
          valor: number
        }
        Update: {
          aprovadopor?: string | null
          arquivo_nome?: string | null
          arquivo_url?: string | null
          ativo?: boolean | null
          cca_codigo?: string
          cca_id?: number
          cca_nome?: string
          contrato_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dataaprovacao?: string | null
          dataemissao?: string
          dataenviosienge?: string | null
          datavencimento?: string | null
          demonstrativo_id?: string | null
          descricaoservico?: string
          empresadestino?: string | null
          id?: string
          mensagemerro?: string | null
          nomeempresa?: string
          nomerepresentante?: string
          numero?: string
          numerocredor?: string | null
          observacoesaprovacao?: string | null
          periodocontabil?: string
          planofinanceiro?: string | null
          prestador_pj_id?: string
          status?: string
          statusaprovacao?: string | null
          tipodocumento?: string | null
          updated_at?: string | null
          updated_by?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_nf_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_nf_contrato"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "prestadores_contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_nf_demonstrativo"
            columns: ["demonstrativo_id"]
            isOneToOne: false
            referencedRelation: "prestadores_demonstrativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_nf_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "prestadores_pj"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_nf_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "view_prestadores_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_passivos: {
        Row: {
          ativo: boolean | null
          avisopravio: number
          cargo: string
          cca_codigo: string | null
          cca_id: number | null
          cca_nome: string | null
          contrato_id: string | null
          created_at: string | null
          created_by: string | null
          dataadmissao: string
          datacorte: string
          decimoterceiro: number
          empresa: string
          id: string
          nomeprestador: string
          observacoes: string | null
          prestador_pj_id: string
          salariobase: number
          saldoferias: number
          status: string
          total: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          ativo?: boolean | null
          avisopravio: number
          cargo: string
          cca_codigo?: string | null
          cca_id?: number | null
          cca_nome?: string | null
          contrato_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dataadmissao: string
          datacorte: string
          decimoterceiro: number
          empresa: string
          id?: string
          nomeprestador: string
          observacoes?: string | null
          prestador_pj_id: string
          salariobase: number
          saldoferias: number
          status?: string
          total: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          ativo?: boolean | null
          avisopravio?: number
          cargo?: string
          cca_codigo?: string | null
          cca_id?: number | null
          cca_nome?: string | null
          contrato_id?: string | null
          created_at?: string | null
          created_by?: string | null
          dataadmissao?: string
          datacorte?: string
          decimoterceiro?: number
          empresa?: string
          id?: string
          nomeprestador?: string
          observacoes?: string | null
          prestador_pj_id?: string
          salariobase?: number
          saldoferias?: number
          status?: string
          total?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_passivos_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_passivos_contrato"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "prestadores_contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_passivos_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "prestadores_pj"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_passivos_prestador"
            columns: ["prestador_pj_id"]
            isOneToOne: false
            referencedRelation: "view_prestadores_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_passivos_historico: {
        Row: {
          campo: string
          created_at: string | null
          data: string
          id: string
          justificativa: string
          passivo_id: string
          usuario: string
          usuario_id: string | null
          valoranterior: string
          valornovo: string
        }
        Insert: {
          campo: string
          created_at?: string | null
          data?: string
          id?: string
          justificativa: string
          passivo_id: string
          usuario: string
          usuario_id?: string | null
          valoranterior: string
          valornovo: string
        }
        Update: {
          campo?: string
          created_at?: string | null
          data?: string
          id?: string
          justificativa?: string
          passivo_id?: string
          usuario?: string
          usuario_id?: string | null
          valoranterior?: string
          valornovo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_passivos_historico_passivo"
            columns: ["passivo_id"]
            isOneToOne: false
            referencedRelation: "prestadores_passivos"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores_pj: {
        Row: {
          ajudaaluguel: number | null
          ajudacusto: number | null
          almoco: boolean | null
          alojamento: boolean | null
          ativo: boolean | null
          auxilioconveniomedico: boolean | null
          cafemanha: boolean | null
          cafetarde: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          celular: boolean | null
          chavepix: string | null
          cnpj: string
          contrato_nome: string | null
          contrato_url: string | null
          cpf: string
          created_at: string | null
          created_by: string | null
          datainiciocontrato: string | null
          datanascimento: string | null
          descricaoatividade: string | null
          detalhesalojamento: string | null
          detalhesveiculo: string | null
          email: string | null
          emailrepresentante: string | null
          endereco: string | null
          enderecorepresentante: string | null
          folgacampo: string | null
          grauderisco: number | null
          id: string
          nomecompleto: string
          numerocnae: string | null
          numerocredorsienge: string | null
          periodoferias: string | null
          quantidadediasferias: number | null
          razaosocial: string
          registrofuncional: string | null
          rg: string | null
          servico: string | null
          telefone: string | null
          telefonerepresentante: string | null
          tempocontrato: string | null
          updated_at: string | null
          updated_by: string | null
          valerefeicao: number | null
          valoralmoco: number | null
          valorauxilioconveniomedico: number | null
          valorcafemanha: number | null
          valorcafetarde: number | null
          valorprestacaoservico: number | null
          veiculo: boolean | null
        }
        Insert: {
          ajudaaluguel?: number | null
          ajudacusto?: number | null
          almoco?: boolean | null
          alojamento?: boolean | null
          ativo?: boolean | null
          auxilioconveniomedico?: boolean | null
          cafemanha?: boolean | null
          cafetarde?: boolean | null
          cca_codigo: string
          cca_id: number
          cca_nome: string
          celular?: boolean | null
          chavepix?: string | null
          cnpj: string
          contrato_nome?: string | null
          contrato_url?: string | null
          cpf: string
          created_at?: string | null
          created_by?: string | null
          datainiciocontrato?: string | null
          datanascimento?: string | null
          descricaoatividade?: string | null
          detalhesalojamento?: string | null
          detalhesveiculo?: string | null
          email?: string | null
          emailrepresentante?: string | null
          endereco?: string | null
          enderecorepresentante?: string | null
          folgacampo?: string | null
          grauderisco?: number | null
          id?: string
          nomecompleto: string
          numerocnae?: string | null
          numerocredorsienge?: string | null
          periodoferias?: string | null
          quantidadediasferias?: number | null
          razaosocial: string
          registrofuncional?: string | null
          rg?: string | null
          servico?: string | null
          telefone?: string | null
          telefonerepresentante?: string | null
          tempocontrato?: string | null
          updated_at?: string | null
          updated_by?: string | null
          valerefeicao?: number | null
          valoralmoco?: number | null
          valorauxilioconveniomedico?: number | null
          valorcafemanha?: number | null
          valorcafetarde?: number | null
          valorprestacaoservico?: number | null
          veiculo?: boolean | null
        }
        Update: {
          ajudaaluguel?: number | null
          ajudacusto?: number | null
          almoco?: boolean | null
          alojamento?: boolean | null
          ativo?: boolean | null
          auxilioconveniomedico?: boolean | null
          cafemanha?: boolean | null
          cafetarde?: boolean | null
          cca_codigo?: string
          cca_id?: number
          cca_nome?: string
          celular?: boolean | null
          chavepix?: string | null
          cnpj?: string
          contrato_nome?: string | null
          contrato_url?: string | null
          cpf?: string
          created_at?: string | null
          created_by?: string | null
          datainiciocontrato?: string | null
          datanascimento?: string | null
          descricaoatividade?: string | null
          detalhesalojamento?: string | null
          detalhesveiculo?: string | null
          email?: string | null
          emailrepresentante?: string | null
          endereco?: string | null
          enderecorepresentante?: string | null
          folgacampo?: string | null
          grauderisco?: number | null
          id?: string
          nomecompleto?: string
          numerocnae?: string | null
          numerocredorsienge?: string | null
          periodoferias?: string | null
          quantidadediasferias?: number | null
          razaosocial?: string
          registrofuncional?: string | null
          rg?: string | null
          servico?: string | null
          telefone?: string | null
          telefonerepresentante?: string | null
          tempocontrato?: string | null
          updated_at?: string | null
          updated_by?: string | null
          valerefeicao?: number | null
          valoralmoco?: number | null
          valorauxilioconveniomedico?: number | null
          valorcafemanha?: number | null
          valorcafetarde?: number | null
          valorprestacaoservico?: number | null
          veiculo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_prestadores_pj_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
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
          ccas_permitidas: Json | null
          created_at: string | null
          departamento: string | null
          email: string
          id: string
          menus_sidebar: Json | null
          nome: string
          permissoes_customizadas: Json | null
          tipo_usuario: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          cargo?: string | null
          ccas_permitidas?: Json | null
          created_at?: string | null
          departamento?: string | null
          email: string
          id: string
          menus_sidebar?: Json | null
          nome: string
          permissoes_customizadas?: Json | null
          tipo_usuario?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          cargo?: string | null
          ccas_permitidas?: Json | null
          created_at?: string | null
          departamento?: string | null
          email?: string
          id?: string
          menus_sidebar?: Json | null
          nome?: string
          permissoes_customizadas?: Json | null
          tipo_usuario?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      propostas_comerciais: {
        Row: {
          cliente: string
          created_at: string
          created_by: string | null
          data_saida_proposta: string
          id: string
          margem_percentual: number
          margem_valor: number
          numero_revisao: number
          obra: string
          orcamento_duplicado: string
          pc: string
          segmento_id: string
          status: string
          updated_at: string
          updated_by: string | null
          valor_venda: number
          vendedor_id: string
        }
        Insert: {
          cliente: string
          created_at?: string
          created_by?: string | null
          data_saida_proposta: string
          id?: string
          margem_percentual?: number
          margem_valor?: number
          numero_revisao?: number
          obra: string
          orcamento_duplicado: string
          pc: string
          segmento_id: string
          status: string
          updated_at?: string
          updated_by?: string | null
          valor_venda?: number
          vendedor_id: string
        }
        Update: {
          cliente?: string
          created_at?: string
          created_by?: string | null
          data_saida_proposta?: string
          id?: string
          margem_percentual?: number
          margem_valor?: number
          numero_revisao?: number
          obra?: string
          orcamento_duplicado?: string
          pc?: string
          segmento_id?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          valor_venda?: number
          vendedor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "propostas_comerciais_segmento_id_fkey"
            columns: ["segmento_id"]
            isOneToOne: false
            referencedRelation: "segmentos_comercial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_comerciais_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores_comercial"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento_candidatos: {
        Row: {
          ativo: boolean | null
          cargo_vaga_pretendida: string
          cca_codigo: string | null
          cca_id: number | null
          cca_nome: string | null
          cidade_estado: string
          cpf: string | null
          created_at: string
          created_by: string | null
          curriculo_nome: string | null
          curriculo_url: string | null
          data_cadastro: string
          data_entrevista: string | null
          data_ultima_atualizacao: string
          email: string
          etapa_processo: string
          faixa_salarial: string | null
          feedback_gestor_rh: string | null
          id: string
          motivo_nao_contratacao: string | null
          nome_completo: string
          observacoes_gerais: string | null
          origem_candidato: string
          possibilidade_reaproveitamento: boolean | null
          responsavel_etapa: string
          responsavel_etapa_id: string | null
          status_candidato: string
          telefone: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cargo_vaga_pretendida: string
          cca_codigo?: string | null
          cca_id?: number | null
          cca_nome?: string | null
          cidade_estado: string
          cpf?: string | null
          created_at?: string
          created_by?: string | null
          curriculo_nome?: string | null
          curriculo_url?: string | null
          data_cadastro?: string
          data_entrevista?: string | null
          data_ultima_atualizacao?: string
          email: string
          etapa_processo?: string
          faixa_salarial?: string | null
          feedback_gestor_rh?: string | null
          id?: string
          motivo_nao_contratacao?: string | null
          nome_completo: string
          observacoes_gerais?: string | null
          origem_candidato: string
          possibilidade_reaproveitamento?: boolean | null
          responsavel_etapa: string
          responsavel_etapa_id?: string | null
          status_candidato?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cargo_vaga_pretendida?: string
          cca_codigo?: string | null
          cca_id?: number | null
          cca_nome?: string | null
          cidade_estado?: string
          cpf?: string | null
          created_at?: string
          created_by?: string | null
          curriculo_nome?: string | null
          curriculo_url?: string | null
          data_cadastro?: string
          data_entrevista?: string | null
          data_ultima_atualizacao?: string
          email?: string
          etapa_processo?: string
          faixa_salarial?: string | null
          feedback_gestor_rh?: string | null
          id?: string
          motivo_nao_contratacao?: string | null
          nome_completo?: string
          observacoes_gerais?: string | null
          origem_candidato?: string
          possibilidade_reaproveitamento?: boolean | null
          responsavel_etapa?: string
          responsavel_etapa_id?: string | null
          status_candidato?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recrutamento_candidatos_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento_etapas_sla: {
        Row: {
          atrasado: boolean | null
          cargo_vaga: string
          created_at: string
          data_conclusao: string | null
          data_inicio: string | null
          descricao: string
          dias_decorridos: number | null
          etapa: string
          id: string
          numero_vaga: string
          objetivo: string
          observacoes: string | null
          ordem: number
          prazo_limite: string | null
          responsavel: string
          sla_dias_uteis: number
          sla_prazo: string
          status: string
          updated_at: string
          vaga_id: string
        }
        Insert: {
          atrasado?: boolean | null
          cargo_vaga: string
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string | null
          descricao: string
          dias_decorridos?: number | null
          etapa: string
          id?: string
          numero_vaga: string
          objetivo: string
          observacoes?: string | null
          ordem: number
          prazo_limite?: string | null
          responsavel: string
          sla_dias_uteis: number
          sla_prazo: string
          status?: string
          updated_at?: string
          vaga_id: string
        }
        Update: {
          atrasado?: boolean | null
          cargo_vaga?: string
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string | null
          descricao?: string
          dias_decorridos?: number | null
          etapa?: string
          id?: string
          numero_vaga?: string
          objetivo?: string
          observacoes?: string | null
          ordem?: number
          prazo_limite?: string | null
          responsavel?: string
          sla_dias_uteis?: number
          sla_prazo?: string
          status?: string
          updated_at?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recrutamento_etapas_sla_vaga"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "recrutamento_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recrutamento_etapas_sla_vaga"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "view_vagas_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento_historico_sla: {
        Row: {
          created_at: string
          data_alteracao: string
          etapa_sla_id: string
          id: string
          observacao: string | null
          status_anterior: string
          status_novo: string
          usuario: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          data_alteracao?: string
          etapa_sla_id: string
          id?: string
          observacao?: string | null
          status_anterior: string
          status_novo: string
          usuario: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          data_alteracao?: string
          etapa_sla_id?: string
          id?: string
          observacao?: string | null
          status_anterior?: string
          status_novo?: string
          usuario?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_recrutamento_historico_sla_etapa"
            columns: ["etapa_sla_id"]
            isOneToOne: false
            referencedRelation: "recrutamento_etapas_sla"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento_vagas: {
        Row: {
          aprovador: string
          aprovador_id: string | null
          area: string
          ativo: boolean | null
          beneficios: string | null
          cargo: string
          cca_codigo: string
          cca_id: number
          cca_nome: string
          created_at: string
          created_by: string | null
          data_aprovacao: string | null
          etapa_atual: string | null
          experiencia_desejada: string
          faixa_salarial: string
          formacao_minima: string
          gestor_responsavel: string
          gestor_responsavel_id: string | null
          hard_skills: string[] | null
          id: string
          jornada_trabalho: string
          justificativa_reprovacao: string | null
          local_trabalho: string
          motivo_abertura: string
          nome_colaborador_substituido: string | null
          numero_vaga: string
          observacoes: string | null
          prazo_mobilizacao: string
          prioridade: string
          setor: string
          soft_skills: string[] | null
          status: string
          status_aprovacao: string
          tipo_contrato: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          aprovador: string
          aprovador_id?: string | null
          area: string
          ativo?: boolean | null
          beneficios?: string | null
          cargo: string
          cca_codigo: string
          cca_id: number
          cca_nome: string
          created_at?: string
          created_by?: string | null
          data_aprovacao?: string | null
          etapa_atual?: string | null
          experiencia_desejada: string
          faixa_salarial: string
          formacao_minima: string
          gestor_responsavel: string
          gestor_responsavel_id?: string | null
          hard_skills?: string[] | null
          id?: string
          jornada_trabalho: string
          justificativa_reprovacao?: string | null
          local_trabalho: string
          motivo_abertura: string
          nome_colaborador_substituido?: string | null
          numero_vaga: string
          observacoes?: string | null
          prazo_mobilizacao: string
          prioridade?: string
          setor: string
          soft_skills?: string[] | null
          status?: string
          status_aprovacao?: string
          tipo_contrato: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          aprovador?: string
          aprovador_id?: string | null
          area?: string
          ativo?: boolean | null
          beneficios?: string | null
          cargo?: string
          cca_codigo?: string
          cca_id?: number
          cca_nome?: string
          created_at?: string
          created_by?: string | null
          data_aprovacao?: string | null
          etapa_atual?: string | null
          experiencia_desejada?: string
          faixa_salarial?: string
          formacao_minima?: string
          gestor_responsavel?: string
          gestor_responsavel_id?: string | null
          hard_skills?: string[] | null
          id?: string
          jornada_trabalho?: string
          justificativa_reprovacao?: string | null
          local_trabalho?: string
          motivo_abertura?: string
          nome_colaborador_substituido?: string | null
          numero_vaga?: string
          observacoes?: string | null
          prazo_mobilizacao?: string
          prioridade?: string
          setor?: string
          soft_skills?: string[] | null
          status?: string
          status_aprovacao?: string
          tipo_contrato?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_recrutamento_vagas_cca"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      recrutamento_vagas_candidatos: {
        Row: {
          candidato_id: string
          created_at: string
          created_by: string | null
          data_aplicacao: string
          data_status_alteracao: string | null
          feedback_entrevista: string | null
          id: string
          motivo_reprovacao: string | null
          nota_triagem: number | null
          observacoes: string | null
          status: string
          updated_at: string
          vaga_id: string
        }
        Insert: {
          candidato_id: string
          created_at?: string
          created_by?: string | null
          data_aplicacao?: string
          data_status_alteracao?: string | null
          feedback_entrevista?: string | null
          id?: string
          motivo_reprovacao?: string | null
          nota_triagem?: number | null
          observacoes?: string | null
          status?: string
          updated_at?: string
          vaga_id: string
        }
        Update: {
          candidato_id?: string
          created_at?: string
          created_by?: string | null
          data_aplicacao?: string
          data_status_alteracao?: string | null
          feedback_entrevista?: string | null
          id?: string
          motivo_reprovacao?: string | null
          nota_triagem?: number | null
          observacoes?: string | null
          status?: string
          updated_at?: string
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_recrutamento_vagas_candidatos_candidato"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "recrutamento_candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recrutamento_vagas_candidatos_candidato"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "view_candidatos_estatisticas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recrutamento_vagas_candidatos_vaga"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "recrutamento_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recrutamento_vagas_candidatos_vaga"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "view_vagas_resumo"
            referencedColumns: ["id"]
          },
        ]
      }
      repositorio_categorias: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          created_by: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      repositorio_documentos: {
        Row: {
          arquivo_nome_original: string
          arquivo_tamanho: number | null
          arquivo_tipo: string | null
          arquivo_url: string
          ativo: boolean | null
          categoria_id: string
          cca_id: number | null
          created_at: string | null
          created_by: string | null
          data_validade: string
          descricao: string | null
          documento_pai_id: string | null
          empresa_id: number | null
          id: string
          nome_arquivo: string
          responsavel_email: string
          responsavel_id: string
          responsavel_nome: string
          status: string | null
          subcategoria_id: string
          tags: string[] | null
          updated_at: string | null
          updated_by: string | null
          versao: number | null
        }
        Insert: {
          arquivo_nome_original: string
          arquivo_tamanho?: number | null
          arquivo_tipo?: string | null
          arquivo_url: string
          ativo?: boolean | null
          categoria_id: string
          cca_id?: number | null
          created_at?: string | null
          created_by?: string | null
          data_validade: string
          descricao?: string | null
          documento_pai_id?: string | null
          empresa_id?: number | null
          id?: string
          nome_arquivo: string
          responsavel_email: string
          responsavel_id: string
          responsavel_nome: string
          status?: string | null
          subcategoria_id: string
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          versao?: number | null
        }
        Update: {
          arquivo_nome_original?: string
          arquivo_tamanho?: number | null
          arquivo_tipo?: string | null
          arquivo_url?: string
          ativo?: boolean | null
          categoria_id?: string
          cca_id?: number | null
          created_at?: string | null
          created_by?: string | null
          data_validade?: string
          descricao?: string | null
          documento_pai_id?: string | null
          empresa_id?: number | null
          id?: string
          nome_arquivo?: string
          responsavel_email?: string
          responsavel_id?: string
          responsavel_nome?: string
          status?: string | null
          subcategoria_id?: string
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          versao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "repositorio_documentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "repositorio_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repositorio_documentos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repositorio_documentos_documento_pai_id_fkey"
            columns: ["documento_pai_id"]
            isOneToOne: false
            referencedRelation: "repositorio_documentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repositorio_documentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repositorio_documentos_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "repositorio_subcategorias"
            referencedColumns: ["id"]
          },
        ]
      }
      repositorio_documentos_acessos: {
        Row: {
          created_at: string | null
          documento_id: string
          id: string
          ip_address: string | null
          tipo_acesso: string | null
          user_agent: string | null
          usuario_id: string
          usuario_nome: string | null
        }
        Insert: {
          created_at?: string | null
          documento_id: string
          id?: string
          ip_address?: string | null
          tipo_acesso?: string | null
          user_agent?: string | null
          usuario_id: string
          usuario_nome?: string | null
        }
        Update: {
          created_at?: string | null
          documento_id?: string
          id?: string
          ip_address?: string | null
          tipo_acesso?: string | null
          user_agent?: string | null
          usuario_id?: string
          usuario_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repositorio_documentos_acessos_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "repositorio_documentos"
            referencedColumns: ["id"]
          },
        ]
      }
      repositorio_subcategorias: {
        Row: {
          ativo: boolean | null
          categoria_id: string
          created_at: string | null
          created_by: string | null
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria_id: string
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repositorio_subcategorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "repositorio_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      segmentos_comercial: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
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
      solicitacoes_dados_especificos: {
        Row: {
          created_at: string
          dados: Json
          id: string
          solicitacao_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dados?: Json
          id?: string
          solicitacao_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dados?: Json
          id?: string
          solicitacao_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_dados_especificos_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: true
            referencedRelation: "solicitacoes_servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_dados_especificos_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: true
            referencedRelation: "v_solicitacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_historico: {
        Row: {
          automatico: boolean | null
          data_mudanca: string
          detalhes: Json | null
          id: string
          motivo: string | null
          solicitacao_id: string
          status_anterior:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          status_novo: Database["public"]["Enums"]["status_solicitacao_enum"]
          usuario_id: string | null
          usuario_nome: string | null
        }
        Insert: {
          automatico?: boolean | null
          data_mudanca?: string
          detalhes?: Json | null
          id?: string
          motivo?: string | null
          solicitacao_id: string
          status_anterior?:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          status_novo: Database["public"]["Enums"]["status_solicitacao_enum"]
          usuario_id?: string | null
          usuario_nome?: string | null
        }
        Update: {
          automatico?: boolean | null
          data_mudanca?: string
          detalhes?: Json | null
          id?: string
          motivo?: string | null
          solicitacao_id?: string
          status_anterior?:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          status_novo?: Database["public"]["Enums"]["status_solicitacao_enum"]
          usuario_id?: string | null
          usuario_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_historico_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_historico_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "v_solicitacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_servicos: {
        Row: {
          aprovado_por_id: string | null
          cca_id: number | null
          comprovante_conclusao: string | null
          concluido_por_id: string | null
          created_at: string
          created_by: string | null
          data_aprovacao: string | null
          data_conclusao: string | null
          data_mudanca_automatica: string | null
          data_solicitacao: string
          estimativa_valor: number | null
          foi_movido_automaticamente: boolean | null
          id: string
          imagem_anexo: string | null
          justificativa_aprovacao: string | null
          justificativa_reprovacao: string | null
          motivo_mudanca_automatica: string | null
          numero_solicitacao: number | null
          observacoes: string | null
          observacoes_conclusao: string | null
          observacoes_gestao: string | null
          prioridade: Database["public"]["Enums"]["prioridade_solicitacao_enum"]
          responsavel_aprovacao_id: string | null
          solicitante_id: string
          solicitante_nome: string
          status: Database["public"]["Enums"]["status_solicitacao_enum"]
          status_anterior:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          tipo_servico: Database["public"]["Enums"]["tipo_servico_enum"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          aprovado_por_id?: string | null
          cca_id?: number | null
          comprovante_conclusao?: string | null
          concluido_por_id?: string | null
          created_at?: string
          created_by?: string | null
          data_aprovacao?: string | null
          data_conclusao?: string | null
          data_mudanca_automatica?: string | null
          data_solicitacao?: string
          estimativa_valor?: number | null
          foi_movido_automaticamente?: boolean | null
          id?: string
          imagem_anexo?: string | null
          justificativa_aprovacao?: string | null
          justificativa_reprovacao?: string | null
          motivo_mudanca_automatica?: string | null
          numero_solicitacao?: number | null
          observacoes?: string | null
          observacoes_conclusao?: string | null
          observacoes_gestao?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_solicitacao_enum"]
          responsavel_aprovacao_id?: string | null
          solicitante_id: string
          solicitante_nome: string
          status?: Database["public"]["Enums"]["status_solicitacao_enum"]
          status_anterior?:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          tipo_servico: Database["public"]["Enums"]["tipo_servico_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          aprovado_por_id?: string | null
          cca_id?: number | null
          comprovante_conclusao?: string | null
          concluido_por_id?: string | null
          created_at?: string
          created_by?: string | null
          data_aprovacao?: string | null
          data_conclusao?: string | null
          data_mudanca_automatica?: string | null
          data_solicitacao?: string
          estimativa_valor?: number | null
          foi_movido_automaticamente?: boolean | null
          id?: string
          imagem_anexo?: string | null
          justificativa_aprovacao?: string | null
          justificativa_reprovacao?: string | null
          motivo_mudanca_automatica?: string | null
          numero_solicitacao?: number | null
          observacoes?: string | null
          observacoes_conclusao?: string | null
          observacoes_gestao?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_solicitacao_enum"]
          responsavel_aprovacao_id?: string | null
          solicitante_id?: string
          solicitante_nome?: string
          status?: Database["public"]["Enums"]["status_solicitacao_enum"]
          status_anterior?:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          tipo_servico?: Database["public"]["Enums"]["tipo_servico_enum"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_servicos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_viajantes: {
        Row: {
          cpf: string
          created_at: string
          data_nascimento: string
          email: string
          id: string
          nome: string
          rg: string
          solicitacao_id: string
          telefone: string
        }
        Insert: {
          cpf: string
          created_at?: string
          data_nascimento: string
          email: string
          id?: string
          nome: string
          rg: string
          solicitacao_id: string
          telefone: string
        }
        Update: {
          cpf?: string
          created_at?: string
          data_nascimento?: string
          email?: string
          id?: string
          nome?: string
          rg?: string
          solicitacao_id?: string
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_viajantes_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_viajantes_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "v_solicitacoes_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      subcentros_custos: {
        Row: {
          cca_id: number
          created_at: string | null
          empresa_sienge_id: string
          faturamento: string
          id: string
          id_sienge: number
          updated_at: string | null
        }
        Insert: {
          cca_id: number
          created_at?: string | null
          empresa_sienge_id: string
          faturamento: string
          id?: string
          id_sienge: number
          updated_at?: string | null
        }
        Update: {
          cca_id?: number
          created_at?: string | null
          empresa_sienge_id?: string
          faturamento?: string
          id?: string
          id_sienge?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcentros_custos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcentros_custos_empresa_sienge_id_fkey"
            columns: ["empresa_sienge_id"]
            isOneToOne: false
            referencedRelation: "empresas_sienge"
            referencedColumns: ["id"]
          },
        ]
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
      tipos_documentos: {
        Row: {
          codigo: string
          created_at: string
          descricao: string
          id: string
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao: string
          id?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string
          id?: string
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
      unidades_medidas: {
        Row: {
          ativo: boolean | null
          codigo: number
          created_at: string | null
          descricao: string
          id: string
          simbolo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: number
          created_at?: string | null
          descricao: string
          id?: string
          simbolo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: number
          created_at?: string | null
          descricao?: string
          id?: string
          simbolo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      usuario_ccas: {
        Row: {
          ativo: boolean | null
          cca_id: number
          created_at: string | null
          id: string
          updated_at: string | null
          usuario_id: string
        }
        Insert: {
          ativo?: boolean | null
          cca_id: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          usuario_id: string
        }
        Update: {
          ativo?: boolean | null
          cca_id?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_ccas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_ccas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      usuarios_engenharia_matricial: {
        Row: {
          ativo: boolean
          created_at: string
          created_by: string | null
          disciplina_preferida: Database["public"]["Enums"]["disciplina_engenharia_matricial"]
          id: string
          updated_at: string
          updated_by: string | null
          usuario_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          disciplina_preferida?: Database["public"]["Enums"]["disciplina_engenharia_matricial"]
          id?: string
          updated_at?: string
          updated_by?: string | null
          usuario_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          disciplina_preferida?: Database["public"]["Enums"]["disciplina_engenharia_matricial"]
          id?: string
          updated_at?: string
          updated_by?: string | null
          usuario_id?: string
        }
        Relationships: []
      }
      veiculos: {
        Row: {
          ativo: boolean
          condutor_principal_id: string | null
          condutor_principal_nome: string
          created_at: string
          created_by: string | null
          data_devolucao: string
          data_retirada: string
          franquia_km: string | null
          id: string
          locadora_id: string | null
          locadora_nome: string | null
          modelo: string
          motivo_devolucao: string | null
          observacoes: string | null
          placa: string
          status: string
          tipo_locacao: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          condutor_principal_id?: string | null
          condutor_principal_nome: string
          created_at?: string
          created_by?: string | null
          data_devolucao: string
          data_retirada: string
          franquia_km?: string | null
          id?: string
          locadora_id?: string | null
          locadora_nome?: string | null
          modelo: string
          motivo_devolucao?: string | null
          observacoes?: string | null
          placa: string
          status?: string
          tipo_locacao: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          condutor_principal_id?: string | null
          condutor_principal_nome?: string
          created_at?: string
          created_by?: string | null
          data_devolucao?: string
          data_retirada?: string
          franquia_km?: string | null
          id?: string
          locadora_id?: string | null
          locadora_nome?: string | null
          modelo?: string
          motivo_devolucao?: string | null
          observacoes?: string | null
          placa?: string
          status?: string
          tipo_locacao?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_condutor_principal_id_fkey"
            columns: ["condutor_principal_id"]
            isOneToOne: false
            referencedRelation: "veiculos_condutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_locadora_id_fkey"
            columns: ["locadora_id"]
            isOneToOne: false
            referencedRelation: "veiculos_locadoras"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos_abastecimentos: {
        Row: {
          centro_custo: string | null
          cidade_estabelecimento: string | null
          condutor_id: string | null
          created_at: string
          created_by: string | null
          data_hora_transacao: string
          data_upload: string
          id: string
          mercadoria: string | null
          modelo_veiculo: string | null
          motorista: string
          nome_estabelecimento: string | null
          numero_cartao: string | null
          placa: string
          quantidade_litros: number | null
          tipo_cartao: string | null
          tipo_mercadoria: string | null
          uf_estabelecimento: string | null
          usuario_responsavel: string | null
          valor: number
          veiculo_id: string | null
        }
        Insert: {
          centro_custo?: string | null
          cidade_estabelecimento?: string | null
          condutor_id?: string | null
          created_at?: string
          created_by?: string | null
          data_hora_transacao: string
          data_upload?: string
          id?: string
          mercadoria?: string | null
          modelo_veiculo?: string | null
          motorista: string
          nome_estabelecimento?: string | null
          numero_cartao?: string | null
          placa: string
          quantidade_litros?: number | null
          tipo_cartao?: string | null
          tipo_mercadoria?: string | null
          uf_estabelecimento?: string | null
          usuario_responsavel?: string | null
          valor: number
          veiculo_id?: string | null
        }
        Update: {
          centro_custo?: string | null
          cidade_estabelecimento?: string | null
          condutor_id?: string | null
          created_at?: string
          created_by?: string | null
          data_hora_transacao?: string
          data_upload?: string
          id?: string
          mercadoria?: string | null
          modelo_veiculo?: string | null
          motorista?: string
          nome_estabelecimento?: string | null
          numero_cartao?: string | null
          placa?: string
          quantidade_litros?: number | null
          tipo_cartao?: string | null
          tipo_mercadoria?: string | null
          uf_estabelecimento?: string | null
          usuario_responsavel?: string | null
          valor?: number
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_abastecimentos_condutor_id_fkey"
            columns: ["condutor_id"]
            isOneToOne: false
            referencedRelation: "veiculos_condutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_abastecimentos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos_cartoes_abastecimento: {
        Row: {
          ativo: boolean
          bandeira: string | null
          condutor_id: string | null
          condutor_nome: string
          created_at: string
          created_by: string | null
          data_validade: string
          id: string
          limite_credito: number | null
          numero_cartao: string
          numero_cartao_hash: string
          observacoes: string | null
          placa: string
          status: string
          tipo_cartao: string
          updated_at: string
          veiculo_id: string | null
          veiculo_modelo: string | null
        }
        Insert: {
          ativo?: boolean
          bandeira?: string | null
          condutor_id?: string | null
          condutor_nome: string
          created_at?: string
          created_by?: string | null
          data_validade: string
          id?: string
          limite_credito?: number | null
          numero_cartao: string
          numero_cartao_hash: string
          observacoes?: string | null
          placa: string
          status?: string
          tipo_cartao: string
          updated_at?: string
          veiculo_id?: string | null
          veiculo_modelo?: string | null
        }
        Update: {
          ativo?: boolean
          bandeira?: string | null
          condutor_id?: string | null
          condutor_nome?: string
          created_at?: string
          created_by?: string | null
          data_validade?: string
          id?: string
          limite_credito?: number | null
          numero_cartao?: string
          numero_cartao_hash?: string
          observacoes?: string | null
          placa?: string
          status?: string
          tipo_cartao?: string
          updated_at?: string
          veiculo_id?: string | null
          veiculo_modelo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_cartoes_abastecimento_condutor_id_fkey"
            columns: ["condutor_id"]
            isOneToOne: false
            referencedRelation: "veiculos_condutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_cartoes_abastecimento_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos_checklists: {
        Row: {
          condutor_id: string | null
          condutor_nome: string
          created_at: string
          created_by: string | null
          data_checklist: string
          data_limite: string | null
          fotos_metadata: Json | null
          hodometro: number | null
          id: string
          marca_modelo: string
          nivel_combustivel: string | null
          observacoes: string | null
          observacoes_detalhadas: string | null
          placa: string
          status: string
          tentativas_cobranca: number
          tipo_operacao: string
          updated_at: string
          veiculo_id: string | null
        }
        Insert: {
          condutor_id?: string | null
          condutor_nome: string
          created_at?: string
          created_by?: string | null
          data_checklist: string
          data_limite?: string | null
          fotos_metadata?: Json | null
          hodometro?: number | null
          id?: string
          marca_modelo: string
          nivel_combustivel?: string | null
          observacoes?: string | null
          observacoes_detalhadas?: string | null
          placa: string
          status?: string
          tentativas_cobranca?: number
          tipo_operacao: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Update: {
          condutor_id?: string | null
          condutor_nome?: string
          created_at?: string
          created_by?: string | null
          data_checklist?: string
          data_limite?: string | null
          fotos_metadata?: Json | null
          hodometro?: number | null
          id?: string
          marca_modelo?: string
          nivel_combustivel?: string | null
          observacoes?: string | null
          observacoes_detalhadas?: string | null
          placa?: string
          status?: string
          tentativas_cobranca?: number
          tipo_operacao?: string
          updated_at?: string
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_checklists_condutor_id_fkey"
            columns: ["condutor_id"]
            isOneToOne: false
            referencedRelation: "veiculos_condutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_checklists_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos_condutores: {
        Row: {
          ativo: boolean
          categoria_cnh: string
          cpf: string
          created_at: string
          created_by: string | null
          id: string
          nome_condutor: string
          observacao: string | null
          pontuacao_atual: number
          status_cnh: string
          termo_anexado_nome: string | null
          termo_anexado_url: string | null
          termo_responsabilidade_assinado: boolean
          updated_at: string
          validade_cnh: string
        }
        Insert: {
          ativo?: boolean
          categoria_cnh: string
          cpf: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_condutor: string
          observacao?: string | null
          pontuacao_atual?: number
          status_cnh?: string
          termo_anexado_nome?: string | null
          termo_anexado_url?: string | null
          termo_responsabilidade_assinado?: boolean
          updated_at?: string
          validade_cnh: string
        }
        Update: {
          ativo?: boolean
          categoria_cnh?: string
          cpf?: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_condutor?: string
          observacao?: string | null
          pontuacao_atual?: number
          status_cnh?: string
          termo_anexado_nome?: string | null
          termo_anexado_url?: string | null
          termo_responsabilidade_assinado?: boolean
          updated_at?: string
          validade_cnh?: string
        }
        Relationships: []
      }
      veiculos_locadoras: {
        Row: {
          ativo: boolean
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      veiculos_multas: {
        Row: {
          comprovante_indicacao_nome: string | null
          comprovante_indicacao_url: string | null
          condutor_infrator_id: string | null
          condutor_infrator_nome: string
          created_at: string
          created_by: string | null
          data_multa: string
          data_notificacao: string | null
          desconto_confirmado: boolean
          documento_notificacao_nome: string | null
          documento_notificacao_url: string | null
          email_condutor: string | null
          email_condutor_enviado_em: string | null
          email_rh_financeiro_enviado_em: string | null
          formulario_preenchido_nome: string | null
          formulario_preenchido_url: string | null
          horario: string
          id: string
          indicado_orgao: string
          locadora_nome: string | null
          local_completo: string | null
          numero_auto_infracao: string
          numero_fatura: string | null
          observacoes_gerais: string | null
          ocorrencia: string
          placa: string
          pontos: number
          responsavel: string | null
          status_multa: string
          titulo_sienge: string | null
          updated_at: string
          valor: number | null
          veiculo_id: string | null
          veiculo_modelo: string | null
        }
        Insert: {
          comprovante_indicacao_nome?: string | null
          comprovante_indicacao_url?: string | null
          condutor_infrator_id?: string | null
          condutor_infrator_nome: string
          created_at?: string
          created_by?: string | null
          data_multa: string
          data_notificacao?: string | null
          desconto_confirmado?: boolean
          documento_notificacao_nome?: string | null
          documento_notificacao_url?: string | null
          email_condutor?: string | null
          email_condutor_enviado_em?: string | null
          email_rh_financeiro_enviado_em?: string | null
          formulario_preenchido_nome?: string | null
          formulario_preenchido_url?: string | null
          horario: string
          id?: string
          indicado_orgao?: string
          locadora_nome?: string | null
          local_completo?: string | null
          numero_auto_infracao: string
          numero_fatura?: string | null
          observacoes_gerais?: string | null
          ocorrencia: string
          placa: string
          pontos: number
          responsavel?: string | null
          status_multa?: string
          titulo_sienge?: string | null
          updated_at?: string
          valor?: number | null
          veiculo_id?: string | null
          veiculo_modelo?: string | null
        }
        Update: {
          comprovante_indicacao_nome?: string | null
          comprovante_indicacao_url?: string | null
          condutor_infrator_id?: string | null
          condutor_infrator_nome?: string
          created_at?: string
          created_by?: string | null
          data_multa?: string
          data_notificacao?: string | null
          desconto_confirmado?: boolean
          documento_notificacao_nome?: string | null
          documento_notificacao_url?: string | null
          email_condutor?: string | null
          email_condutor_enviado_em?: string | null
          email_rh_financeiro_enviado_em?: string | null
          formulario_preenchido_nome?: string | null
          formulario_preenchido_url?: string | null
          horario?: string
          id?: string
          indicado_orgao?: string
          locadora_nome?: string | null
          local_completo?: string | null
          numero_auto_infracao?: string
          numero_fatura?: string | null
          observacoes_gerais?: string | null
          ocorrencia?: string
          placa?: string
          pontos?: number
          responsavel?: string | null
          status_multa?: string
          titulo_sienge?: string | null
          updated_at?: string
          valor?: number | null
          veiculo_id?: string | null
          veiculo_modelo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_multas_condutor_infrator_id_fkey"
            columns: ["condutor_infrator_id"]
            isOneToOne: false
            referencedRelation: "veiculos_condutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_multas_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos_pedagogios_estacionamentos: {
        Row: {
          cca: string | null
          condutor_id: string | null
          condutor_nome: string
          created_at: string
          created_by: string | null
          data_utilizacao: string
          finalidade: string | null
          horario: string
          id: string
          local: string
          observacoes: string | null
          placa: string
          tipo_servico: string
          updated_at: string
          valor: number | null
          veiculo_id: string | null
        }
        Insert: {
          cca?: string | null
          condutor_id?: string | null
          condutor_nome: string
          created_at?: string
          created_by?: string | null
          data_utilizacao: string
          finalidade?: string | null
          horario: string
          id?: string
          local: string
          observacoes?: string | null
          placa: string
          tipo_servico: string
          updated_at?: string
          valor?: number | null
          veiculo_id?: string | null
        }
        Update: {
          cca?: string | null
          condutor_id?: string | null
          condutor_nome?: string
          created_at?: string
          created_by?: string | null
          data_utilizacao?: string
          finalidade?: string | null
          horario?: string
          id?: string
          local?: string
          observacoes?: string | null
          placa?: string
          tipo_servico?: string
          updated_at?: string
          valor?: number | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_pedagogios_estacionamentos_condutor_id_fkey"
            columns: ["condutor_id"]
            isOneToOne: false
            referencedRelation: "veiculos_condutores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_pedagogios_estacionamentos_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      vendedores_comercial: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendedores_comercial_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      viagens_destinatarios_alertas: {
        Row: {
          ativo: boolean
          cca_id: number | null
          created_at: string
          email: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cca_id?: number | null
          created_at?: string
          email: string
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cca_id?: number | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viagens_destinatarios_alertas_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      viagens_orcamentos_cca: {
        Row: {
          ano: number
          cca_id: number
          created_at: string
          created_by: string | null
          gasto_aereo: number
          gasto_hotel: number
          gasto_outros: number
          gasto_rodoviario: number
          id: string
          observacoes: string | null
          orcamento_total: number
          updated_at: string
        }
        Insert: {
          ano: number
          cca_id: number
          created_at?: string
          created_by?: string | null
          gasto_aereo?: number
          gasto_hotel?: number
          gasto_outros?: number
          gasto_rodoviario?: number
          id?: string
          observacoes?: string | null
          orcamento_total?: number
          updated_at?: string
        }
        Update: {
          ano?: number
          cca_id?: number
          created_at?: string
          created_by?: string | null
          gasto_aereo?: number
          gasto_hotel?: number
          gasto_outros?: number
          gasto_rodoviario?: number
          id?: string
          observacoes?: string | null
          orcamento_total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viagens_orcamentos_cca_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      viagens_relatorios_salvos: {
        Row: {
          colunas_selecionadas: string[]
          created_at: string
          filtros: Json
          id: string
          nome: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          colunas_selecionadas?: string[]
          created_at?: string
          filtros?: Json
          id?: string
          nome: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          colunas_selecionadas?: string[]
          created_at?: string
          filtros?: Json
          id?: string
          nome?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_solicitacoes_completas: {
        Row: {
          aprovado_por_id: string | null
          cca_codigo: string | null
          cca_id: number | null
          cca_nome: string | null
          comprovante_conclusao: string | null
          concluido_por_id: string | null
          created_at: string | null
          created_by: string | null
          dados_especificos: Json | null
          data_aprovacao: string | null
          data_conclusao: string | null
          data_mudanca_automatica: string | null
          data_solicitacao: string | null
          estimativa_valor: number | null
          foi_movido_automaticamente: boolean | null
          id: string | null
          imagem_anexo: string | null
          justificativa_aprovacao: string | null
          justificativa_reprovacao: string | null
          motivo_mudanca_automatica: string | null
          observacoes: string | null
          observacoes_conclusao: string | null
          observacoes_gestao: string | null
          prioridade:
            | Database["public"]["Enums"]["prioridade_solicitacao_enum"]
            | null
          responsavel_aprovacao_id: string | null
          solicitante_id: string | null
          solicitante_nome: string | null
          solicitante_nome_profile: string | null
          status: Database["public"]["Enums"]["status_solicitacao_enum"] | null
          status_anterior:
            | Database["public"]["Enums"]["status_solicitacao_enum"]
            | null
          tipo_servico: Database["public"]["Enums"]["tipo_servico_enum"] | null
          total_mudancas_status: number | null
          total_viajantes: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_servicos_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      view_candidatos_estatisticas: {
        Row: {
          cargo_vaga_pretendida: string | null
          cca_codigo: string | null
          data_cadastro: string | null
          data_ultima_atualizacao: string | null
          etapa_processo: string | null
          id: string | null
          nome_completo: string | null
          origem_candidato: string | null
          status_candidato: string | null
          total_aplicacoes: number | null
          total_aprovacoes: number | null
          total_reprovacoes: number | null
        }
        Relationships: []
      }
      view_demonstrativos_mensais: {
        Row: {
          cca_codigo: string | null
          cca_nome: string | null
          mes: string | null
          total_ajuda_aluguel: number | null
          total_desconto_convenio: number | null
          total_liquido: number | null
          total_multas: number | null
          total_nf: number | null
          total_prestadores: number | null
          total_reembolso_convenio: number | null
          total_salarios: number | null
        }
        Relationships: []
      }
      view_prestadores_resumo: {
        Row: {
          ativo: boolean | null
          cca_codigo: string | null
          cca_nome: string | null
          cnpj: string | null
          contratos_ativos: number | null
          cpf: string | null
          created_at: string | null
          ferias_ativas: number | null
          id: string | null
          razaosocial: string | null
          representante: string | null
          total_contratos: number | null
          total_ferias: number | null
          total_nf: number | null
          total_passivos: number | null
          updated_at: string | null
          valor_total_nf: number | null
        }
        Relationships: []
      }
      view_vagas_resumo: {
        Row: {
          candidatos_aprovados: number | null
          cargo: string | null
          cca_codigo: string | null
          cca_nome: string | null
          created_at: string | null
          etapas_atrasadas: number | null
          id: string | null
          numero_vaga: string | null
          prazo_mobilizacao: string | null
          prioridade: string | null
          status: string | null
          status_aprovacao: string | null
          total_candidatos: number | null
          updated_at: string | null
        }
        Relationships: []
      }
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
      calcular_total_passivos_por_cca: {
        Args: { cca_id_param: number }
        Returns: {
          cca_codigo: string
          cca_nome: string
          quantidade_prestadores: number
          total_passivos: number
        }[]
      }
      create_encarregado_snapshot: {
        Args: { p_encarregado_id: string }
        Returns: string
      }
      create_engenheiro_snapshot: {
        Args: { p_engenheiro_id: string }
        Returns: string
      }
      create_funcionario_snapshot: {
        Args: { p_funcionario_id: string }
        Returns: string
      }
      create_supervisor_snapshot: {
        Args: { p_supervisor_id: string }
        Returns: string
      }
      gerar_numero_os: {
        Args: { p_cca_id: number }
        Returns: string
      }
      get_candidatos_por_etapa: {
        Args: { vaga_id_param: string }
        Returns: {
          etapa: string
          quantidade: number
        }[]
      }
      get_condutores_cnh_vencendo: {
        Args: { dias?: number }
        Returns: {
          dias_restantes: number
          id: string
          nome_condutor: string
          validade_cnh: string
        }[]
      }
      get_desvios_by_base_legal: {
        Args: { filtros?: Json }
        Returns: {
          fullname: string
          nome: string
          value: number
        }[]
      }
      get_desvios_by_classification: {
        Args: { filtros?: Json }
        Returns: {
          color: string
          nome: string
          value: number
        }[]
      }
      get_desvios_by_company: {
        Args: { filtros?: Json }
        Returns: {
          nome: string
          value: number
        }[]
      }
      get_desvios_by_discipline: {
        Args: { filtros?: Json }
        Returns: {
          nome: string
          value: number
        }[]
      }
      get_desvios_by_event: {
        Args: { filtros?: Json }
        Returns: {
          nome: string
          value: number
        }[]
      }
      get_desvios_by_processo: {
        Args: { filtros?: Json }
        Returns: {
          nome: string
          value: number
        }[]
      }
      get_desvios_by_type: {
        Args: { filtros?: Json }
        Returns: {
          nome: string
          value: number
        }[]
      }
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
      get_multas_pendentes_notificacao: {
        Args: Record<PropertyKey, never>
        Returns: {
          condutor_infrator_nome: string
          dias_desde_notificacao: number
          id: string
          numero_auto_infracao: string
          placa: string
          status_multa: string
        }[]
      }
      get_nf_pendentes_aprovacao: {
        Args: Record<PropertyKey, never>
        Returns: {
          dataemissao: string
          dias_pendente: number
          nf_id: string
          nomeempresa: string
          numero: string
          valor: number
        }[]
      }
      get_personnel_data: {
        Args: {
          p_person_id: string
          p_person_type: string
          p_prefer_current?: boolean
        }
        Returns: Json
      }
      get_prestadores_contratos_ativos: {
        Args: Record<PropertyKey, never>
        Returns: {
          contrato_id: string
          datafim: string
          dias_restantes: number
          numero: string
          prestador_nome: string
        }[]
      }
      get_prestadores_ferias_proximas: {
        Args: Record<PropertyKey, never>
        Returns: {
          datainicio: string
          dias_restantes: number
          ferias_id: string
          prestador_nome: string
          status: string
        }[]
      }
      get_user_allowed_ccas: {
        Args: { user_id_param: string }
        Returns: number[]
      }
      get_user_permissions: {
        Args: { user_id_param: string }
        Returns: string[]
      }
      get_vagas_atrasadas: {
        Args: Record<PropertyKey, never>
        Returns: {
          cargo: string
          dias_atraso: number
          etapa: string
          numero_vaga: string
          responsavel: string
          vaga_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
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
      replace_in_jsonb_array: {
        Args: { arr: Json; new_val: string; old_val: string }
        Returns: Json
      }
      user_can_manage_funcionarios: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      user_can_manage_solicitacoes: {
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
      app_role: "admin_sistema" | "usuario"
      disciplina_engenharia_matricial: "ELETRICA" | "MECANICA" | "AMBAS"
      medida_aplicada_enum:
        | "ADVERTÊNCIA VERBAL"
        | "ADVERTÊNCIA ESCRITA"
        | "SUSPENSÃO"
        | "DEMISSÃO POR JUSTA CAUSA"
      os_status_enum:
        | "aberta"
        | "em-planejamento"
        | "aguardando-aceite"
        | "em-execucao"
        | "aguardando-aceite-fechamento"
        | "concluida"
        | "cancelada"
        | "rejeitada"
        | "aguardando-aceite-replanejamento"
      prioridade_solicitacao_enum: "baixa" | "media" | "alta"
      status_solicitacao_enum:
        | "pendente"
        | "aprovado"
        | "em_andamento"
        | "aguardando_aprovacao"
        | "concluido"
        | "rejeitado"
      tipo_servico_enum:
        | "voucher_uber"
        | "locacao_veiculo"
        | "cartao_abastecimento"
        | "veloe_go"
        | "passagens"
        | "hospedagem"
        | "logistica"
        | "correios_loggi"
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
      app_role: ["admin_sistema", "usuario"],
      disciplina_engenharia_matricial: ["ELETRICA", "MECANICA", "AMBAS"],
      medida_aplicada_enum: [
        "ADVERTÊNCIA VERBAL",
        "ADVERTÊNCIA ESCRITA",
        "SUSPENSÃO",
        "DEMISSÃO POR JUSTA CAUSA",
      ],
      os_status_enum: [
        "aberta",
        "em-planejamento",
        "aguardando-aceite",
        "em-execucao",
        "aguardando-aceite-fechamento",
        "concluida",
        "cancelada",
        "rejeitada",
        "aguardando-aceite-replanejamento",
      ],
      prioridade_solicitacao_enum: ["baixa", "media", "alta"],
      status_solicitacao_enum: [
        "pendente",
        "aprovado",
        "em_andamento",
        "aguardando_aprovacao",
        "concluido",
        "rejeitado",
      ],
      tipo_servico_enum: [
        "voucher_uber",
        "locacao_veiculo",
        "cartao_abastecimento",
        "veloe_go",
        "passagens",
        "hospedagem",
        "logistica",
        "correios_loggi",
      ],
    },
  },
} as const
