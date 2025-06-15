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
      encarregados: {
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
            foreignKeyName: "encarregados_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
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
      funcionarios: {
        Row: {
          ativo: boolean | null
          cca_id: number | null
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
          data_cadastro: string | null
          data_conclusao: string | null
          data_real_conclusao: string | null
          descricao: string
          id: string
          iniciada: boolean | null
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
          data_cadastro?: string | null
          data_conclusao?: string | null
          data_real_conclusao?: string | null
          descricao: string
          id?: string
          iniciada?: boolean | null
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
          data_cadastro?: string | null
          data_conclusao?: string | null
          data_real_conclusao?: string | null
          descricao?: string
          id?: string
          iniciada?: boolean | null
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
