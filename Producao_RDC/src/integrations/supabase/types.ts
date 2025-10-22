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
      areas_projeto: {
        Row: {
          ativo: boolean
          ccas_ids: string[] | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          ccas_ids?: string[] | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          ccas_ids?: string[] | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      atividades_cadastradas: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          modulo: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          modulo?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          modulo?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      atividades_principais: {
        Row: {
          atividade_cadastrada_id: string
          created_at: string
          equipe: Json
          horas_informadas: number
          horas_totais: number
          id: string
          nome_atividade: string
          relatorio_id: string
          total_pessoas: number
          updated_at: string
        }
        Insert: {
          atividade_cadastrada_id: string
          created_at?: string
          equipe?: Json
          horas_informadas?: number
          horas_totais?: number
          id?: string
          nome_atividade: string
          relatorio_id: string
          total_pessoas?: number
          updated_at?: string
        }
        Update: {
          atividade_cadastrada_id?: string
          created_at?: string
          equipe?: Json
          horas_informadas?: number
          horas_totais?: number
          id?: string
          nome_atividade?: string
          relatorio_id?: string
          total_pessoas?: number
          updated_at?: string
        }
        Relationships: []
      }
      atividades_principais_eletrica: {
        Row: {
          atividade_cadastrada_id: string
          created_at: string
          equipe: Json
          horas_informadas: number
          horas_totais: number
          id: string
          nome_atividade: string
          relatorio_id: string
          total_pessoas: number
          updated_at: string
        }
        Insert: {
          atividade_cadastrada_id: string
          created_at?: string
          equipe?: Json
          horas_informadas?: number
          horas_totais?: number
          id?: string
          nome_atividade: string
          relatorio_id: string
          total_pessoas?: number
          updated_at?: string
        }
        Update: {
          atividade_cadastrada_id?: string
          created_at?: string
          equipe?: Json
          horas_informadas?: number
          horas_totais?: number
          id?: string
          nome_atividade?: string
          relatorio_id?: string
          total_pessoas?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividades_principais_eletrica_atividade_cadastrada_id_fkey"
            columns: ["atividade_cadastrada_id"]
            isOneToOne: false
            referencedRelation: "atividades_cadastradas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_principais_eletrica_relatorio_id_fkey"
            columns: ["relatorio_id"]
            isOneToOne: false
            referencedRelation: "relatorios_eletrica"
            referencedColumns: ["id"]
          },
        ]
      }
      cabos_eletrica: {
        Row: {
          area_id: string | null
          ativo: boolean
          circuito: string | null
          created_at: string
          dimensao: string | null
          disciplina: string
          id: string
          ponto_destino: string | null
          ponto_origem: string | null
          sub_area: string | null
          tipo_cabo: string
          tipo_condutor: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          circuito?: string | null
          created_at?: string
          dimensao?: string | null
          disciplina?: string
          id?: string
          ponto_destino?: string | null
          ponto_origem?: string | null
          sub_area?: string | null
          tipo_cabo: string
          tipo_condutor: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          circuito?: string | null
          created_at?: string
          dimensao?: string | null
          disciplina?: string
          id?: string
          ponto_destino?: string | null
          ponto_origem?: string | null
          sub_area?: string | null
          tipo_cabo?: string
          tipo_condutor?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cabos_eletrica_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      ccas: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          id: string
          localizacao: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          id?: string
          localizacao?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          id?: string
          localizacao?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      desenhos_eletrica: {
        Row: {
          area_id: string | null
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string | null
          disciplina: string
          id: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          disciplina: string
          id?: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          disciplina?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "desenhos_eletrica_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplinas_eletricas: {
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
      encarregados: {
        Row: {
          ativo: boolean
          cargo: string | null
          cca_id: string | null
          created_at: string
          email: string | null
          equipe: Json | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cargo?: string | null
          cca_id?: string | null
          created_at?: string
          email?: string | null
          equipe?: Json | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cargo?: string | null
          cca_id?: string | null
          created_at?: string
          email?: string | null
          equipe?: Json | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
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
      encarregados_eletrica: {
        Row: {
          ativo: boolean
          cargo: string | null
          cca_id: string | null
          created_at: string
          email: string | null
          equipe: Json | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cargo?: string | null
          cca_id?: string | null
          created_at?: string
          email?: string | null
          equipe?: Json | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cargo?: string | null
          cca_id?: string | null
          created_at?: string
          email?: string | null
          equipe?: Json | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "encarregados_eletrica_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos_eletricos: {
        Row: {
          area_id: string | null
          ativo: boolean
          created_at: string
          descricao: string | null
          disciplina: string
          id: string
          tag: string
          tipo_equipamento: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          disciplina: string
          id?: string
          tag: string
          tipo_equipamento: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          disciplina?: string
          id?: string
          tag?: string
          tipo_equipamento?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipamentos_eletricos_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos_mecanicos: {
        Row: {
          area_id: string | null
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          tag: string
          tipo_equipamento: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          tag: string
          tipo_equipamento: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          tag?: string
          tipo_equipamento?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_equipamentos_mecanicos_area"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      fluidos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      informacoes_suporte: {
        Row: {
          created_at: string
          id: string
          observacoes: string | null
          peso_kg: number | null
          quantidade: number
          relatorio_atividade_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          observacoes?: string | null
          peso_kg?: number | null
          quantidade?: number
          relatorio_atividade_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          observacoes?: string | null
          peso_kg?: number | null
          quantidade?: number
          relatorio_atividade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "informacoes_suporte_relatorio_atividade_id_fkey"
            columns: ["relatorio_atividade_id"]
            isOneToOne: false
            referencedRelation: "relatorios_atividades"
            referencedColumns: ["id"]
          },
        ]
      }
      infraestrutura_eletrica: {
        Row: {
          area_id: string | null
          ativo: boolean
          created_at: string
          descricao: string | null
          desenho_id: string | null
          dimensao: string | null
          disciplina: string | null
          id: string
          tipo_infraestrutura_id: string | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          desenho_id?: string | null
          dimensao?: string | null
          disciplina?: string | null
          id?: string
          tipo_infraestrutura_id?: string | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          desenho_id?: string | null
          dimensao?: string | null
          disciplina?: string | null
          id?: string
          tipo_infraestrutura_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "infraestrutura_eletrica_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "infraestrutura_eletrica_desenho_id_fkey"
            columns: ["desenho_id"]
            isOneToOne: false
            referencedRelation: "desenhos_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "infraestrutura_eletrica_tipo_infraestrutura_id_fkey"
            columns: ["tipo_infraestrutura_id"]
            isOneToOne: false
            referencedRelation: "tipos_infraestrutura_eletrica"
            referencedColumns: ["id"]
          },
        ]
      }
      instrumentos_eletrica: {
        Row: {
          area_id: string | null
          ativo: boolean
          created_at: string
          descricao: string | null
          desenho_id: string | null
          fluido_id: string | null
          id: string
          linha_id: string | null
          tag: string
          tipo_instrumento: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          desenho_id?: string | null
          fluido_id?: string | null
          id?: string
          linha_id?: string | null
          tag: string
          tipo_instrumento: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          desenho_id?: string | null
          fluido_id?: string | null
          id?: string
          linha_id?: string | null
          tag?: string
          tipo_instrumento?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instrumentos_eletrica_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instrumentos_eletrica_desenho_id_fkey"
            columns: ["desenho_id"]
            isOneToOne: false
            referencedRelation: "desenhos_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instrumentos_eletrica_fluido_id_fkey"
            columns: ["fluido_id"]
            isOneToOne: false
            referencedRelation: "fluidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instrumentos_eletrica_linha_id_fkey"
            columns: ["linha_id"]
            isOneToOne: false
            referencedRelation: "linhas"
            referencedColumns: ["id"]
          },
        ]
      }
      juntas: {
        Row: {
          created_at: string
          DN: number | null
          id: string
          Junta: string
          linha_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          DN?: number | null
          id?: string
          Junta: string
          linha_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          DN?: number | null
          id?: string
          Junta?: string
          linha_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "juntas_linha_id_fkey"
            columns: ["linha_id"]
            isOneToOne: false
            referencedRelation: "linhas"
            referencedColumns: ["id"]
          },
        ]
      }
      linhas: {
        Row: {
          created_at: string
          fluido_id: string | null
          id: string
          nome_linha: string
          tipo_material: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fluido_id?: string | null
          id?: string
          nome_linha: string
          tipo_material?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fluido_id?: string | null
          id?: string
          nome_linha?: string
          tipo_material?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "linhas_fluido_id_fkey"
            columns: ["fluido_id"]
            isOneToOne: false
            referencedRelation: "fluidos"
            referencedColumns: ["id"]
          },
        ]
      }
      luminarias_eletrica: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          desenho_id: string | null
          id: string
          tag: string
          tipo_luminaria: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          desenho_id?: string | null
          id?: string
          tag: string
          tipo_luminaria: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          desenho_id?: string | null
          id?: string
          tag?: string
          tipo_luminaria?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "luminarias_eletrica_desenho_id_fkey"
            columns: ["desenho_id"]
            isOneToOne: false
            referencedRelation: "desenhos_eletrica"
            referencedColumns: ["id"]
          },
        ]
      }
      parametros_tubulacao: {
        Row: {
          atividade: string
          created_at: string
          descricao: string | null
          id: string
          tipo_material: string
          updated_at: string
          valor_base: number
        }
        Insert: {
          atividade: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo_material: string
          updated_at?: string
          valor_base: number
        }
        Update: {
          atividade?: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo_material?: string
          updated_at?: string
          valor_base?: number
        }
        Relationships: []
      }
      registro_atividades: {
        Row: {
          ajudante: number | null
          created_at: string
          detalhamento_atividade: string | null
          encanador: number | null
          etapa_producao: string | null
          fluido: string | null
          id: string
          mecanico_ajustador: number | null
          mecanico_montador: number | null
          meio_oficial: number | null
          numero_junta: string[] | null
          numero_linha: string | null
          quantidade_horas: number | null
          registro_diario_id: string | null
          soldador: number | null
          tag_valvula: string | null
        }
        Insert: {
          ajudante?: number | null
          created_at?: string
          detalhamento_atividade?: string | null
          encanador?: number | null
          etapa_producao?: string | null
          fluido?: string | null
          id?: string
          mecanico_ajustador?: number | null
          mecanico_montador?: number | null
          meio_oficial?: number | null
          numero_junta?: string[] | null
          numero_linha?: string | null
          quantidade_horas?: number | null
          registro_diario_id?: string | null
          soldador?: number | null
          tag_valvula?: string | null
        }
        Update: {
          ajudante?: number | null
          created_at?: string
          detalhamento_atividade?: string | null
          encanador?: number | null
          etapa_producao?: string | null
          fluido?: string | null
          id?: string
          mecanico_ajustador?: number | null
          mecanico_montador?: number | null
          meio_oficial?: number | null
          numero_junta?: string[] | null
          numero_linha?: string | null
          quantidade_horas?: number | null
          registro_diario_id?: string | null
          soldador?: number | null
          tag_valvula?: string | null
        }
        Relationships: []
      }
      registro_atividades_eletrica: {
        Row: {
          area_id: string | null
          atividade_principal_id: string
          cabo_id: string | null
          created_at: string
          desenho_id: string | null
          detalhamento_atividade: string | null
          dimensao_infra: string | null
          disciplina: string | null
          equipamento_id: string | null
          etapa_cabos: Json | null
          etapa_luminaria: Json | null
          etapa_producao: string | null
          fluido_id: string | null
          id: string
          instrumento_id: string | null
          linha_id: string | null
          luminaria_id: string | null
          metragem: string | null
          observacoes: string | null
          ponto_destino: string | null
          ponto_origem: string | null
          quantidade: string | null
          quantidade_montada: string | null
          tipo_atividade: string
          tipo_equipamento: string | null
          tipo_infraestrutura_id: string | null
          tipo_instrumento: string | null
          tipo_luminaria: string | null
        }
        Insert: {
          area_id?: string | null
          atividade_principal_id: string
          cabo_id?: string | null
          created_at?: string
          desenho_id?: string | null
          detalhamento_atividade?: string | null
          dimensao_infra?: string | null
          disciplina?: string | null
          equipamento_id?: string | null
          etapa_cabos?: Json | null
          etapa_luminaria?: Json | null
          etapa_producao?: string | null
          fluido_id?: string | null
          id?: string
          instrumento_id?: string | null
          linha_id?: string | null
          luminaria_id?: string | null
          metragem?: string | null
          observacoes?: string | null
          ponto_destino?: string | null
          ponto_origem?: string | null
          quantidade?: string | null
          quantidade_montada?: string | null
          tipo_atividade: string
          tipo_equipamento?: string | null
          tipo_infraestrutura_id?: string | null
          tipo_instrumento?: string | null
          tipo_luminaria?: string | null
        }
        Update: {
          area_id?: string | null
          atividade_principal_id?: string
          cabo_id?: string | null
          created_at?: string
          desenho_id?: string | null
          detalhamento_atividade?: string | null
          dimensao_infra?: string | null
          disciplina?: string | null
          equipamento_id?: string | null
          etapa_cabos?: Json | null
          etapa_luminaria?: Json | null
          etapa_producao?: string | null
          fluido_id?: string | null
          id?: string
          instrumento_id?: string | null
          linha_id?: string | null
          luminaria_id?: string | null
          metragem?: string | null
          observacoes?: string | null
          ponto_destino?: string | null
          ponto_origem?: string | null
          quantidade?: string | null
          quantidade_montada?: string | null
          tipo_atividade?: string
          tipo_equipamento?: string | null
          tipo_infraestrutura_id?: string | null
          tipo_instrumento?: string | null
          tipo_luminaria?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_atividades_eletrica_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_atividade_principal_id_fkey"
            columns: ["atividade_principal_id"]
            isOneToOne: false
            referencedRelation: "atividades_principais_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_cabo_id_fkey"
            columns: ["cabo_id"]
            isOneToOne: false
            referencedRelation: "cabos_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_desenho_id_fkey"
            columns: ["desenho_id"]
            isOneToOne: false
            referencedRelation: "desenhos_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos_eletricos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_fluido_id_fkey"
            columns: ["fluido_id"]
            isOneToOne: false
            referencedRelation: "fluidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_instrumento_id_fkey"
            columns: ["instrumento_id"]
            isOneToOne: false
            referencedRelation: "instrumentos_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_linha_id_fkey"
            columns: ["linha_id"]
            isOneToOne: false
            referencedRelation: "linhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_luminaria_id_fkey"
            columns: ["luminaria_id"]
            isOneToOne: false
            referencedRelation: "luminarias_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividades_eletrica_tipo_infraestrutura_id_fkey"
            columns: ["tipo_infraestrutura_id"]
            isOneToOne: false
            referencedRelation: "tipos_infraestrutura_eletrica"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_atividades: {
        Row: {
          atividade: string
          atividade_principal_id: string | null
          created_at: string
          detalhes_equipe: Json
          fluido_id: string | null
          horas_informadas: number
          horas_totais: number
          id: string
          juntas_ids: string[] | null
          linha_id: string | null
          relatorio_id: string
          tag_valvula: string | null
          total_pessoas_equipe: number
          updated_at: string
        }
        Insert: {
          atividade: string
          atividade_principal_id?: string | null
          created_at?: string
          detalhes_equipe: Json
          fluido_id?: string | null
          horas_informadas: number
          horas_totais: number
          id?: string
          juntas_ids?: string[] | null
          linha_id?: string | null
          relatorio_id: string
          tag_valvula?: string | null
          total_pessoas_equipe: number
          updated_at?: string
        }
        Update: {
          atividade?: string
          atividade_principal_id?: string | null
          created_at?: string
          detalhes_equipe?: Json
          fluido_id?: string | null
          horas_informadas?: number
          horas_totais?: number
          id?: string
          juntas_ids?: string[] | null
          linha_id?: string | null
          relatorio_id?: string
          tag_valvula?: string | null
          total_pessoas_equipe?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_atividades_atividade_principal_id_fkey"
            columns: ["atividade_principal_id"]
            isOneToOne: false
            referencedRelation: "atividades_principais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_atividades_fluido_id_fkey"
            columns: ["fluido_id"]
            isOneToOne: false
            referencedRelation: "fluidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_atividades_linha_id_fkey"
            columns: ["linha_id"]
            isOneToOne: false
            referencedRelation: "linhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_atividades_relatorio_id_fkey"
            columns: ["relatorio_id"]
            isOneToOne: false
            referencedRelation: "relatorios_mecanica"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_eletrica: {
        Row: {
          anotacoes_gerais: string | null
          cca_id: string | null
          comentarios: string | null
          condicao_descricao: string | null
          condicoes_climaticas: Json | null
          created_at: string
          data: string
          encarregado_id: string | null
          id: string
          indice_pluviometrico: string | null
          localizacao: string | null
          localizacao_id: string | null
          projeto: string
          responsavel: string | null
          updated_at: string
        }
        Insert: {
          anotacoes_gerais?: string | null
          cca_id?: string | null
          comentarios?: string | null
          condicao_descricao?: string | null
          condicoes_climaticas?: Json | null
          created_at?: string
          data: string
          encarregado_id?: string | null
          id?: string
          indice_pluviometrico?: string | null
          localizacao?: string | null
          localizacao_id?: string | null
          projeto: string
          responsavel?: string | null
          updated_at?: string
        }
        Update: {
          anotacoes_gerais?: string | null
          cca_id?: string | null
          comentarios?: string | null
          condicao_descricao?: string | null
          condicoes_climaticas?: Json | null
          created_at?: string
          data?: string
          encarregado_id?: string | null
          id?: string
          indice_pluviometrico?: string | null
          localizacao?: string | null
          localizacao_id?: string | null
          projeto?: string
          responsavel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_eletrica_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_eletrica_encarregado_id_fkey"
            columns: ["encarregado_id"]
            isOneToOne: false
            referencedRelation: "encarregados_eletrica"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_eletrica_localizacao_id_fkey"
            columns: ["localizacao_id"]
            isOneToOne: false
            referencedRelation: "areas_projeto"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_mecanica: {
        Row: {
          anotacoes_gerais: string | null
          cca_id: string | null
          comentarios: string | null
          condicao_descricao: string | null
          condicoes_climaticas: Json | null
          created_at: string
          data: string
          encarregado_id: string | null
          id: string
          indice_pluviometrico: string | null
          localizacao: string | null
          localizacao_id: string | null
          projeto: string
          responsavel: string | null
          updated_at: string
        }
        Insert: {
          anotacoes_gerais?: string | null
          cca_id?: string | null
          comentarios?: string | null
          condicao_descricao?: string | null
          condicoes_climaticas?: Json | null
          created_at?: string
          data: string
          encarregado_id?: string | null
          id?: string
          indice_pluviometrico?: string | null
          localizacao?: string | null
          localizacao_id?: string | null
          projeto: string
          responsavel?: string | null
          updated_at?: string
        }
        Update: {
          anotacoes_gerais?: string | null
          cca_id?: string | null
          comentarios?: string | null
          condicao_descricao?: string | null
          condicoes_climaticas?: Json | null
          created_at?: string
          data?: string
          encarregado_id?: string | null
          id?: string
          indice_pluviometrico?: string | null
          localizacao?: string | null
          localizacao_id?: string | null
          projeto?: string
          responsavel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_mecanica_cca_id_fkey"
            columns: ["cca_id"]
            isOneToOne: false
            referencedRelation: "ccas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_mecanica_encarregado_id_fkey"
            columns: ["encarregado_id"]
            isOneToOne: false
            referencedRelation: "encarregados"
            referencedColumns: ["id"]
          },
        ]
      }
      status_juntas: {
        Row: {
          atividade: string
          created_at: string
          data_atividade: string
          id: string
          junta_id: string
          relatorio_atividade_id: string | null
        }
        Insert: {
          atividade: string
          created_at?: string
          data_atividade?: string
          id?: string
          junta_id: string
          relatorio_atividade_id?: string | null
        }
        Update: {
          atividade?: string
          created_at?: string
          data_atividade?: string
          id?: string
          junta_id?: string
          relatorio_atividade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_juntas_junta_id_fkey"
            columns: ["junta_id"]
            isOneToOne: false
            referencedRelation: "juntas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_juntas_relatorio_atividade_id_fkey"
            columns: ["relatorio_atividade_id"]
            isOneToOne: false
            referencedRelation: "relatorios_atividades"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_infraestrutura_eletrica: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          dimensoes_padrao: Json | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          dimensoes_padrao?: Json | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          dimensoes_padrao?: Json | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      valvulas: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          fluido_id: string | null
          id: string
          linha_id: string | null
          tag: string
          tipo_valvula: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          fluido_id?: string | null
          id?: string
          linha_id?: string | null
          tag: string
          tipo_valvula: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          fluido_id?: string | null
          id?: string
          linha_id?: string | null
          tag?: string
          tipo_valvula?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_valvulas_fluido"
            columns: ["fluido_id"]
            isOneToOne: false
            referencedRelation: "fluidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_valvulas_linha"
            columns: ["linha_id"]
            isOneToOne: false
            referencedRelation: "linhas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      array_remove: {
        Args: { p_array: string[]; p_element: string }
        Returns: string[]
      }
      calculate_total_dn: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_dn: number
        }[]
      }
      check_sync_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          last_sync_check: string
          orphaned_status_count: number
          relatorios_atividades_count: number
          status_juntas_count: number
        }[]
      }
      excluir_registro_completo: {
        Args: { p_relatorio_id: string }
        Returns: string
      }
      manual_sync_all_status_juntas: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "user"
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
      user_role: ["admin", "manager", "user"],
    },
  },
} as const
