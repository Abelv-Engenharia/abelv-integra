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
      alertas_medicao_aluguel: {
        Row: {
          cca_codigo: string
          competencia: string
          contrato_id: string
          created_at: string | null
          data_medicao: string | null
          data_referencia: string
          id: string
          medicao_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          cca_codigo: string
          competencia: string
          contrato_id: string
          created_at?: string | null
          data_medicao?: string | null
          data_referencia: string
          id?: string
          medicao_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          cca_codigo?: string
          competencia?: string
          contrato_id?: string
          created_at?: string | null
          data_medicao?: string | null
          data_referencia?: string
          id?: string
          medicao_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alertas_medicao_aluguel_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos_alojamento"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas_medicao_transporte: {
        Row: {
          ano_referencia: number
          cca_codigo: string
          created_at: string
          data_envio: string | null
          data_referencia: string
          destinatarios: string[] | null
          id: string
          mes_referencia: string
          status: string
          updated_at: string
        }
        Insert: {
          ano_referencia: number
          cca_codigo: string
          created_at?: string
          data_envio?: string | null
          data_referencia: string
          destinatarios?: string[] | null
          id?: string
          mes_referencia: string
          status?: string
          updated_at?: string
        }
        Update: {
          ano_referencia?: number
          cca_codigo?: string
          created_at?: string
          data_envio?: string | null
          data_referencia?: string
          destinatarios?: string[] | null
          id?: string
          mes_referencia?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      analises_contratuais: {
        Row: {
          alertas_ativos: Json | null
          anexos: Json | null
          aprovado_custo_engenheiro: boolean | null
          bairro: string
          bloco_atual: string | null
          capacidade_total: number | null
          caucao: number | null
          cca_codigo: string | null
          cep: string
          checklist_foro: boolean | null
          checklist_manutencao: boolean | null
          checklist_reajuste: boolean | null
          checklist_seguro: boolean | null
          checklist_vistoria_nr24: boolean | null
          cidade: string
          clausula_multa: string | null
          clausulas_selecionadas: Json | null
          complemento: string | null
          conta_poupanca: string | null
          contrato_criado: boolean | null
          contrato_definitivo_id: string | null
          contrato_pdf_url: string
          cpf_proprietario: string | null
          created_at: string | null
          custo_unitario: number | null
          data_assinatura: string | null
          data_criacao_contrato: string | null
          data_criacao_contrato_definitivo: string | null
          data_envio_validacao: string | null
          data_fim_contrato: string
          data_fim_obra: string | null
          data_inicio_contrato: string
          data_inicio_obra: string | null
          despesas_adicionais: string | null
          destinatario_principal_email: string | null
          destinatario_principal_nome: string | null
          destinatarios_validacao: Json | null
          dia_vencimento: number
          distancia_obra: number | null
          email_assinatura: string | null
          email_validacao_adm: string | null
          email_validacao_custos: string | null
          email_validacao_documentacao: string | null
          email_validacao_financeiro: string | null
          email_validacao_fotos: string | null
          email_validacao_super: string | null
          emails_adicionais: string | null
          forma_pagamento: string
          fornecedor_cnpj: string
          fornecedor_contato: string | null
          fornecedor_email: string | null
          fornecedor_id: string | null
          fornecedor_nome: string
          fotos_imovel: Json | null
          gestor_responsavel: string | null
          id: string
          imobiliaria: string | null
          ir_aliquota: number | null
          ir_base_calculo: number | null
          ir_parcela_deduzir: number | null
          ir_valor_retido: number | null
          logradouro: string
          meses_caucao: number | null
          multa_rescisoria_percentual: number | null
          nome_cliente: string | null
          nome_projeto: string | null
          nome_proprietario: string
          numero: string
          numero_contrato: string
          numero_moradores: number | null
          observacao_adm: string | null
          observacao_financeiro: string | null
          observacao_gestor: string | null
          observacao_super: string | null
          observacoes_clausulas: string | null
          observacoes_imovel: string | null
          particularidades: string | null
          prazo_contratual: number | null
          quantidade_quartos: number | null
          responsavel_analise: string
          resumo_pdf_url: string | null
          status: string | null
          status_adm: string | null
          status_financeiro: string | null
          status_geral: string | null
          status_gestor: string | null
          status_super: string | null
          tem_condominio: boolean | null
          tem_ir: boolean | null
          tem_seguro_predial: boolean | null
          tem_taxa_lixo: boolean | null
          tem_vistoria: boolean | null
          texto_conclusao: string | null
          tipo_alojamento: string | null
          tipo_locador: string | null
          tipo_pagamento: string | null
          tipo_pagamento_detalhado: string | null
          uf: string
          updated_at: string | null
          usar_fotos_validacao: boolean | null
          validado_adm_em: string | null
          validado_adm_por: string | null
          validado_financeiro_em: string | null
          validado_financeiro_por: string | null
          validado_gestor_em: string | null
          validado_gestor_por: string | null
          validado_super_em: string | null
          validado_super_por: string | null
          valor_liquido_pagar: number | null
          valor_mensal: number
          valor_mensal_liquido: number | null
          valor_por_morador: number | null
          valor_total_contrato: number | null
          vistoria_pdf_url: string | null
        }
        Insert: {
          alertas_ativos?: Json | null
          anexos?: Json | null
          aprovado_custo_engenheiro?: boolean | null
          bairro: string
          bloco_atual?: string | null
          capacidade_total?: number | null
          caucao?: number | null
          cca_codigo?: string | null
          cep: string
          checklist_foro?: boolean | null
          checklist_manutencao?: boolean | null
          checklist_reajuste?: boolean | null
          checklist_seguro?: boolean | null
          checklist_vistoria_nr24?: boolean | null
          cidade: string
          clausula_multa?: string | null
          clausulas_selecionadas?: Json | null
          complemento?: string | null
          conta_poupanca?: string | null
          contrato_criado?: boolean | null
          contrato_definitivo_id?: string | null
          contrato_pdf_url: string
          cpf_proprietario?: string | null
          created_at?: string | null
          custo_unitario?: number | null
          data_assinatura?: string | null
          data_criacao_contrato?: string | null
          data_criacao_contrato_definitivo?: string | null
          data_envio_validacao?: string | null
          data_fim_contrato: string
          data_fim_obra?: string | null
          data_inicio_contrato: string
          data_inicio_obra?: string | null
          despesas_adicionais?: string | null
          destinatario_principal_email?: string | null
          destinatario_principal_nome?: string | null
          destinatarios_validacao?: Json | null
          dia_vencimento: number
          distancia_obra?: number | null
          email_assinatura?: string | null
          email_validacao_adm?: string | null
          email_validacao_custos?: string | null
          email_validacao_documentacao?: string | null
          email_validacao_financeiro?: string | null
          email_validacao_fotos?: string | null
          email_validacao_super?: string | null
          emails_adicionais?: string | null
          forma_pagamento: string
          fornecedor_cnpj: string
          fornecedor_contato?: string | null
          fornecedor_email?: string | null
          fornecedor_id?: string | null
          fornecedor_nome: string
          fotos_imovel?: Json | null
          gestor_responsavel?: string | null
          id?: string
          imobiliaria?: string | null
          ir_aliquota?: number | null
          ir_base_calculo?: number | null
          ir_parcela_deduzir?: number | null
          ir_valor_retido?: number | null
          logradouro: string
          meses_caucao?: number | null
          multa_rescisoria_percentual?: number | null
          nome_cliente?: string | null
          nome_projeto?: string | null
          nome_proprietario: string
          numero: string
          numero_contrato: string
          numero_moradores?: number | null
          observacao_adm?: string | null
          observacao_financeiro?: string | null
          observacao_gestor?: string | null
          observacao_super?: string | null
          observacoes_clausulas?: string | null
          observacoes_imovel?: string | null
          particularidades?: string | null
          prazo_contratual?: number | null
          quantidade_quartos?: number | null
          responsavel_analise: string
          resumo_pdf_url?: string | null
          status?: string | null
          status_adm?: string | null
          status_financeiro?: string | null
          status_geral?: string | null
          status_gestor?: string | null
          status_super?: string | null
          tem_condominio?: boolean | null
          tem_ir?: boolean | null
          tem_seguro_predial?: boolean | null
          tem_taxa_lixo?: boolean | null
          tem_vistoria?: boolean | null
          texto_conclusao?: string | null
          tipo_alojamento?: string | null
          tipo_locador?: string | null
          tipo_pagamento?: string | null
          tipo_pagamento_detalhado?: string | null
          uf: string
          updated_at?: string | null
          usar_fotos_validacao?: boolean | null
          validado_adm_em?: string | null
          validado_adm_por?: string | null
          validado_financeiro_em?: string | null
          validado_financeiro_por?: string | null
          validado_gestor_em?: string | null
          validado_gestor_por?: string | null
          validado_super_em?: string | null
          validado_super_por?: string | null
          valor_liquido_pagar?: number | null
          valor_mensal: number
          valor_mensal_liquido?: number | null
          valor_por_morador?: number | null
          valor_total_contrato?: number | null
          vistoria_pdf_url?: string | null
        }
        Update: {
          alertas_ativos?: Json | null
          anexos?: Json | null
          aprovado_custo_engenheiro?: boolean | null
          bairro?: string
          bloco_atual?: string | null
          capacidade_total?: number | null
          caucao?: number | null
          cca_codigo?: string | null
          cep?: string
          checklist_foro?: boolean | null
          checklist_manutencao?: boolean | null
          checklist_reajuste?: boolean | null
          checklist_seguro?: boolean | null
          checklist_vistoria_nr24?: boolean | null
          cidade?: string
          clausula_multa?: string | null
          clausulas_selecionadas?: Json | null
          complemento?: string | null
          conta_poupanca?: string | null
          contrato_criado?: boolean | null
          contrato_definitivo_id?: string | null
          contrato_pdf_url?: string
          cpf_proprietario?: string | null
          created_at?: string | null
          custo_unitario?: number | null
          data_assinatura?: string | null
          data_criacao_contrato?: string | null
          data_criacao_contrato_definitivo?: string | null
          data_envio_validacao?: string | null
          data_fim_contrato?: string
          data_fim_obra?: string | null
          data_inicio_contrato?: string
          data_inicio_obra?: string | null
          despesas_adicionais?: string | null
          destinatario_principal_email?: string | null
          destinatario_principal_nome?: string | null
          destinatarios_validacao?: Json | null
          dia_vencimento?: number
          distancia_obra?: number | null
          email_assinatura?: string | null
          email_validacao_adm?: string | null
          email_validacao_custos?: string | null
          email_validacao_documentacao?: string | null
          email_validacao_financeiro?: string | null
          email_validacao_fotos?: string | null
          email_validacao_super?: string | null
          emails_adicionais?: string | null
          forma_pagamento?: string
          fornecedor_cnpj?: string
          fornecedor_contato?: string | null
          fornecedor_email?: string | null
          fornecedor_id?: string | null
          fornecedor_nome?: string
          fotos_imovel?: Json | null
          gestor_responsavel?: string | null
          id?: string
          imobiliaria?: string | null
          ir_aliquota?: number | null
          ir_base_calculo?: number | null
          ir_parcela_deduzir?: number | null
          ir_valor_retido?: number | null
          logradouro?: string
          meses_caucao?: number | null
          multa_rescisoria_percentual?: number | null
          nome_cliente?: string | null
          nome_projeto?: string | null
          nome_proprietario?: string
          numero?: string
          numero_contrato?: string
          numero_moradores?: number | null
          observacao_adm?: string | null
          observacao_financeiro?: string | null
          observacao_gestor?: string | null
          observacao_super?: string | null
          observacoes_clausulas?: string | null
          observacoes_imovel?: string | null
          particularidades?: string | null
          prazo_contratual?: number | null
          quantidade_quartos?: number | null
          responsavel_analise?: string
          resumo_pdf_url?: string | null
          status?: string | null
          status_adm?: string | null
          status_financeiro?: string | null
          status_geral?: string | null
          status_gestor?: string | null
          status_super?: string | null
          tem_condominio?: boolean | null
          tem_ir?: boolean | null
          tem_seguro_predial?: boolean | null
          tem_taxa_lixo?: boolean | null
          tem_vistoria?: boolean | null
          texto_conclusao?: string | null
          tipo_alojamento?: string | null
          tipo_locador?: string | null
          tipo_pagamento?: string | null
          tipo_pagamento_detalhado?: string | null
          uf?: string
          updated_at?: string | null
          usar_fotos_validacao?: boolean | null
          validado_adm_em?: string | null
          validado_adm_por?: string | null
          validado_financeiro_em?: string | null
          validado_financeiro_por?: string | null
          validado_gestor_em?: string | null
          validado_gestor_por?: string | null
          validado_super_em?: string | null
          validado_super_por?: string | null
          valor_liquido_pagar?: number | null
          valor_mensal?: number
          valor_mensal_liquido?: number | null
          valor_por_morador?: number | null
          valor_total_contrato?: number | null
          vistoria_pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analises_contratuais_contrato_definitivo_id_fkey"
            columns: ["contrato_definitivo_id"]
            isOneToOne: false
            referencedRelation: "contratos_alojamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analises_contratuais_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores_alojamento"
            referencedColumns: ["id"]
          },
        ]
      }
      aprovacoes_analise: {
        Row: {
          acao: string
          analise_id: string | null
          aprovador: string
          bloco: string
          comentario: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          acao: string
          analise_id?: string | null
          aprovador: string
          bloco: string
          comentario?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          acao?: string
          analise_id?: string | null
          aprovador?: string
          bloco?: string
          comentario?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aprovacoes_analise_analise_id_fkey"
            columns: ["analise_id"]
            isOneToOne: false
            referencedRelation: "analises_contratuais"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria_contratos: {
        Row: {
          acao: string
          area: string
          contrato_id: string | null
          id: string
          observacao: string | null
          timestamp: string | null
          usuario: string
        }
        Insert: {
          acao: string
          area: string
          contrato_id?: string | null
          id?: string
          observacao?: string | null
          timestamp?: string | null
          usuario: string
        }
        Update: {
          acao?: string
          area?: string
          contrato_id?: string | null
          id?: string
          observacao?: string | null
          timestamp?: string | null
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_contratos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "analises_contratuais"
            referencedColumns: ["id"]
          },
        ]
      }
      caucoes: {
        Row: {
          agencia: string | null
          aprovado_por: string | null
          arquivo_pdf_unificado_url: string | null
          banco: string | null
          centro_custo: string
          comprovante_pagamento_url: string | null
          conta: string | null
          conta_financeira: string
          contrato_id: string
          created_at: string
          data_aprovacao: string | null
          data_emissao: string
          data_pagamento: string | null
          data_vencimento: string
          forma_pagamento: string
          id: string
          motivo_reprovacao: string | null
          observacoes: string | null
          operacao: string | null
          status: string
          tipo_documento: string
          titulo_sienge: string | null
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          aprovado_por?: string | null
          arquivo_pdf_unificado_url?: string | null
          banco?: string | null
          centro_custo: string
          comprovante_pagamento_url?: string | null
          conta?: string | null
          conta_financeira: string
          contrato_id: string
          created_at?: string
          data_aprovacao?: string | null
          data_emissao: string
          data_pagamento?: string | null
          data_vencimento: string
          forma_pagamento: string
          id?: string
          motivo_reprovacao?: string | null
          observacoes?: string | null
          operacao?: string | null
          status?: string
          tipo_documento: string
          titulo_sienge?: string | null
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          aprovado_por?: string | null
          arquivo_pdf_unificado_url?: string | null
          banco?: string | null
          centro_custo?: string
          comprovante_pagamento_url?: string | null
          conta?: string | null
          conta_financeira?: string
          contrato_id?: string
          created_at?: string
          data_aprovacao?: string | null
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento?: string
          forma_pagamento?: string
          id?: string
          motivo_reprovacao?: string | null
          observacoes?: string | null
          operacao?: string | null
          status?: string
          tipo_documento?: string
          titulo_sienge?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "caucoes_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos_alojamento"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_documentos_template: {
        Row: {
          categoria: string
          condicao_tipo: string | null
          condicao_valores: Json | null
          condicional: boolean | null
          created_at: string | null
          formato_aceito: string | null
          id: string
          instrucoes: string | null
          nome_exibicao: string
          obrigatorio_padrao: boolean | null
          prazo_dias: number
          tipo_documento: string
          updated_at: string | null
          upload_multiplo: boolean | null
          visivel_candidato: boolean | null
        }
        Insert: {
          categoria: string
          condicao_tipo?: string | null
          condicao_valores?: Json | null
          condicional?: boolean | null
          created_at?: string | null
          formato_aceito?: string | null
          id?: string
          instrucoes?: string | null
          nome_exibicao: string
          obrigatorio_padrao?: boolean | null
          prazo_dias: number
          tipo_documento: string
          updated_at?: string | null
          upload_multiplo?: boolean | null
          visivel_candidato?: boolean | null
        }
        Update: {
          categoria?: string
          condicao_tipo?: string | null
          condicao_valores?: Json | null
          condicional?: boolean | null
          created_at?: string | null
          formato_aceito?: string | null
          id?: string
          instrucoes?: string | null
          nome_exibicao?: string
          obrigatorio_padrao?: boolean | null
          prazo_dias?: number
          tipo_documento?: string
          updated_at?: string | null
          upload_multiplo?: boolean | null
          visivel_candidato?: boolean | null
        }
        Relationships: []
      }
      colaboradores_efetivo: {
        Row: {
          cca_codigo: string | null
          cca_nome: string | null
          classificacao: string
          cpf: string
          created_at: string | null
          data_admissao: string | null
          data_inclusao: string | null
          disciplina: string
          empresa: string
          funcao: string
          id: string
          nome: string
          sienge_funcional_id: string | null
          status: string
          tipo_colaborador: string
          updated_at: string | null
          validacao_admissao_id: string | null
        }
        Insert: {
          cca_codigo?: string | null
          cca_nome?: string | null
          classificacao?: string
          cpf: string
          created_at?: string | null
          data_admissao?: string | null
          data_inclusao?: string | null
          disciplina: string
          empresa: string
          funcao: string
          id?: string
          nome: string
          sienge_funcional_id?: string | null
          status?: string
          tipo_colaborador: string
          updated_at?: string | null
          validacao_admissao_id?: string | null
        }
        Update: {
          cca_codigo?: string | null
          cca_nome?: string | null
          classificacao?: string
          cpf?: string
          created_at?: string | null
          data_admissao?: string | null
          data_inclusao?: string | null
          disciplina?: string
          empresa?: string
          funcao?: string
          id?: string
          nome?: string
          sienge_funcional_id?: string | null
          status?: string
          tipo_colaborador?: string
          updated_at?: string | null
          validacao_admissao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_efetivo_validacao_admissao_id_fkey"
            columns: ["validacao_admissao_id"]
            isOneToOne: true
            referencedRelation: "validacao_admissao"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos_alojamento: {
        Row: {
          agencia: string
          analise_contratual_id: string | null
          arquivo_pdf_url: string | null
          bairro: string
          banco: string
          cca_codigo: string | null
          cep: string
          codigo: string
          complemento: string | null
          conta_corrente: string
          cpf_cnpj_favorecido: string
          cpf_cnpj_proprietario: string
          created_at: string
          data_assinatura: string
          data_pagamento_garantia: string | null
          dia_vencimento_aluguel: number | null
          distancia_obra: number
          favorecido: string
          fim_locacao: string
          forma_pagamento: string
          forma_pagamento_aluguel: string | null
          id: string
          inicio_locacao: string
          logradouro: string
          lotacao_atual: number
          lotacao_maxima: number
          meses_caucao: number | null
          multa_contratual: number
          municipio: string
          nome: string
          numero_sequencial: number | null
          observacoes: string | null
          operacao: string | null
          possui_caucao: boolean | null
          proprietario: string
          qtde_quartos: number
          status: string
          tem_ir: boolean | null
          tipo_alojamento: string | null
          tipo_chave_pix: string | null
          tipo_garantia: string
          tipo_imovel: string
          tipo_proprietario: string
          uf: string
          updated_at: string
          valor_aluguel: number
          valor_caucao: number
          valor_caucao_previsto: number | null
          valor_garantia: number | null
          valor_ir: number | null
          vigencia_contrato: number
        }
        Insert: {
          agencia: string
          analise_contratual_id?: string | null
          arquivo_pdf_url?: string | null
          bairro: string
          banco: string
          cca_codigo?: string | null
          cep: string
          codigo: string
          complemento?: string | null
          conta_corrente: string
          cpf_cnpj_favorecido: string
          cpf_cnpj_proprietario: string
          created_at?: string
          data_assinatura: string
          data_pagamento_garantia?: string | null
          dia_vencimento_aluguel?: number | null
          distancia_obra?: number
          favorecido: string
          fim_locacao: string
          forma_pagamento: string
          forma_pagamento_aluguel?: string | null
          id?: string
          inicio_locacao: string
          logradouro: string
          lotacao_atual?: number
          lotacao_maxima: number
          meses_caucao?: number | null
          multa_contratual?: number
          municipio: string
          nome: string
          numero_sequencial?: number | null
          observacoes?: string | null
          operacao?: string | null
          possui_caucao?: boolean | null
          proprietario: string
          qtde_quartos: number
          status?: string
          tem_ir?: boolean | null
          tipo_alojamento?: string | null
          tipo_chave_pix?: string | null
          tipo_garantia?: string
          tipo_imovel: string
          tipo_proprietario: string
          uf: string
          updated_at?: string
          valor_aluguel: number
          valor_caucao: number
          valor_caucao_previsto?: number | null
          valor_garantia?: number | null
          valor_ir?: number | null
          vigencia_contrato: number
        }
        Update: {
          agencia?: string
          analise_contratual_id?: string | null
          arquivo_pdf_url?: string | null
          bairro?: string
          banco?: string
          cca_codigo?: string | null
          cep?: string
          codigo?: string
          complemento?: string | null
          conta_corrente?: string
          cpf_cnpj_favorecido?: string
          cpf_cnpj_proprietario?: string
          created_at?: string
          data_assinatura?: string
          data_pagamento_garantia?: string | null
          dia_vencimento_aluguel?: number | null
          distancia_obra?: number
          favorecido?: string
          fim_locacao?: string
          forma_pagamento?: string
          forma_pagamento_aluguel?: string | null
          id?: string
          inicio_locacao?: string
          logradouro?: string
          lotacao_atual?: number
          lotacao_maxima?: number
          meses_caucao?: number | null
          multa_contratual?: number
          municipio?: string
          nome?: string
          numero_sequencial?: number | null
          observacoes?: string | null
          operacao?: string | null
          possui_caucao?: boolean | null
          proprietario?: string
          qtde_quartos?: number
          status?: string
          tem_ir?: boolean | null
          tipo_alojamento?: string | null
          tipo_chave_pix?: string | null
          tipo_garantia?: string
          tipo_imovel?: string
          tipo_proprietario?: string
          uf?: string
          updated_at?: string
          valor_aluguel?: number
          valor_caucao?: number
          valor_caucao_previsto?: number | null
          valor_garantia?: number | null
          valor_ir?: number | null
          vigencia_contrato?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_alojamento_analise_contratual_id_fkey"
            columns: ["analise_contratual_id"]
            isOneToOne: false
            referencedRelation: "analises_contratuais"
            referencedColumns: ["id"]
          },
        ]
      }
      controle_diario: {
        Row: {
          cca_codigo: string | null
          colaborador_id: string | null
          competencia: string | null
          created_at: string | null
          data: string
          id: string
          observacao: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          cca_codigo?: string | null
          colaborador_id?: string | null
          competencia?: string | null
          created_at?: string | null
          data: string
          id?: string
          observacao?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          cca_codigo?: string | null
          colaborador_id?: string | null
          competencia?: string | null
          created_at?: string | null
          data?: string
          id?: string
          observacao?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "controle_diario_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores_efetivo"
            referencedColumns: ["id"]
          },
        ]
      }
      destinatarios_aprovacao: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          emails: string[]
          id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          emails: string[]
          id?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          emails?: string[]
          id?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      destinatarios_transporte: {
        Row: {
          ativo: boolean | null
          cca_codigo: string
          created_at: string
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          cca_codigo: string
          created_at?: string
          email: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          cca_codigo?: string
          created_at?: string
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      documentos_enviados: {
        Row: {
          arquivo_nome: string
          arquivo_tamanho: number | null
          arquivo_tipo: string | null
          arquivo_url: string
          created_at: string | null
          data_regularizacao: string | null
          data_upload: string | null
          id: string
          ilegivel: boolean | null
          observacoes: string | null
          status_validacao: string | null
          tipo_documento: string
          updated_at: string | null
          usuario_upload: string | null
          validacao_admissao_id: string | null
        }
        Insert: {
          arquivo_nome: string
          arquivo_tamanho?: number | null
          arquivo_tipo?: string | null
          arquivo_url: string
          created_at?: string | null
          data_regularizacao?: string | null
          data_upload?: string | null
          id?: string
          ilegivel?: boolean | null
          observacoes?: string | null
          status_validacao?: string | null
          tipo_documento: string
          updated_at?: string | null
          usuario_upload?: string | null
          validacao_admissao_id?: string | null
        }
        Update: {
          arquivo_nome?: string
          arquivo_tamanho?: number | null
          arquivo_tipo?: string | null
          arquivo_url?: string
          created_at?: string | null
          data_regularizacao?: string | null
          data_upload?: string | null
          id?: string
          ilegivel?: boolean | null
          observacoes?: string | null
          status_validacao?: string | null
          tipo_documento?: string
          updated_at?: string | null
          usuario_upload?: string | null
          validacao_admissao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_enviados_validacao_admissao_id_fkey"
            columns: ["validacao_admissao_id"]
            isOneToOne: false
            referencedRelation: "validacao_admissao"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores_alojamento: {
        Row: {
          cnpj: string
          contato_nome: string | null
          created_at: string
          endereco: string
          id: string
          nome: string
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          cnpj: string
          contato_nome?: string | null
          created_at?: string
          endereco: string
          id?: string
          nome: string
          status?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          cnpj?: string
          contato_nome?: string | null
          created_at?: string
          endereco?: string
          id?: string
          nome?: string
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      fornecedores_transporte: {
        Row: {
          capacidade: number | null
          ccas: string[] | null
          cnpj: string
          contato: string | null
          contrato: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          tipos_transporte: string[] | null
          updated_at: string
          valor_base: number | null
          vigencia_fim: string | null
          vigencia_inicio: string | null
        }
        Insert: {
          capacidade?: number | null
          ccas?: string[] | null
          cnpj: string
          contato?: string | null
          contrato?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          tipos_transporte?: string[] | null
          updated_at?: string
          valor_base?: number | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Update: {
          capacidade?: number | null
          ccas?: string[] | null
          cnpj?: string
          contato?: string | null
          contrato?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          tipos_transporte?: string[] | null
          updated_at?: string
          valor_base?: number | null
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Relationships: []
      }
      log_envio_dp: {
        Row: {
          anexos: Json | null
          assunto: string | null
          data_hora: string | null
          destinatarios_cc: string[] | null
          destinatarios_para: string[] | null
          id: string
          mensagem_erro: string | null
          status: string | null
          usuario_nome: string
          validacao_id: string | null
        }
        Insert: {
          anexos?: Json | null
          assunto?: string | null
          data_hora?: string | null
          destinatarios_cc?: string[] | null
          destinatarios_para?: string[] | null
          id?: string
          mensagem_erro?: string | null
          status?: string | null
          usuario_nome: string
          validacao_id?: string | null
        }
        Update: {
          anexos?: Json | null
          assunto?: string | null
          data_hora?: string | null
          destinatarios_cc?: string[] | null
          destinatarios_para?: string[] | null
          id?: string
          mensagem_erro?: string | null
          status?: string | null
          usuario_nome?: string
          validacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_envio_dp_validacao_id_fkey"
            columns: ["validacao_id"]
            isOneToOne: false
            referencedRelation: "validacao_admissao"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_alertas_validacao: {
        Row: {
          analise_id: string | null
          bloco: string
          created_at: string | null
          detalhes: Json | null
          emails_enviados: string
          id: string
          status: string
        }
        Insert: {
          analise_id?: string | null
          bloco: string
          created_at?: string | null
          detalhes?: Json | null
          emails_enviados: string
          id?: string
          status: string
        }
        Update: {
          analise_id?: string | null
          bloco?: string
          created_at?: string | null
          detalhes?: Json | null
          emails_enviados?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_alertas_validacao_analise_id_fkey"
            columns: ["analise_id"]
            isOneToOne: false
            referencedRelation: "analises_contratuais"
            referencedColumns: ["id"]
          },
        ]
      }
      medicoes_alimentacao: {
        Row: {
          anexo_nf_nome: string | null
          anexo_nf_url: string | null
          anexo_xml_nome: string | null
          anexo_xml_url: string | null
          cca: string
          cnpj: string | null
          created_at: string
          dados_nf: Json | null
          dados_sienge: Json | null
          data_emissao: string | null
          fornecedor: string
          id: string
          itens: Json
          numero_medicao: string
          numero_titulo: string | null
          observacoes: string | null
          periodo: string
          prazo_pagamento: string | null
          situacao_sienge: string | null
          status: string
          status_integracao: string
          titulo_sienge: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          anexo_nf_nome?: string | null
          anexo_nf_url?: string | null
          anexo_xml_nome?: string | null
          anexo_xml_url?: string | null
          cca: string
          cnpj?: string | null
          created_at?: string
          dados_nf?: Json | null
          dados_sienge?: Json | null
          data_emissao?: string | null
          fornecedor: string
          id?: string
          itens?: Json
          numero_medicao: string
          numero_titulo?: string | null
          observacoes?: string | null
          periodo: string
          prazo_pagamento?: string | null
          situacao_sienge?: string | null
          status?: string
          status_integracao?: string
          titulo_sienge?: string | null
          updated_at?: string
          valor_total?: number
        }
        Update: {
          anexo_nf_nome?: string | null
          anexo_nf_url?: string | null
          anexo_xml_nome?: string | null
          anexo_xml_url?: string | null
          cca?: string
          cnpj?: string | null
          created_at?: string
          dados_nf?: Json | null
          dados_sienge?: Json | null
          data_emissao?: string | null
          fornecedor?: string
          id?: string
          itens?: Json
          numero_medicao?: string
          numero_titulo?: string | null
          observacoes?: string | null
          periodo?: string
          prazo_pagamento?: string | null
          situacao_sienge?: string | null
          status?: string
          status_integracao?: string
          titulo_sienge?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: []
      }
      medicoes_aluguel: {
        Row: {
          anexos: Json
          colaboradores: Json
          competencia: string
          contrato_id: string
          created_at: string
          dados_sienge: Json | null
          data_envio: string | null
          data_fim: string | null
          data_inicio: string | null
          dias_aluguel: number
          empresa: string | null
          id: string
          numero_medicao: string
          numero_titulo: string | null
          obra: string
          observacoes: string | null
          situacao_sienge: string | null
          status: string
          titulo_sienge: string | null
          updated_at: string
          validador_responsavel: string | null
          valor_diaria: number | null
          valor_total: number
          vencimento: string | null
        }
        Insert: {
          anexos?: Json
          colaboradores?: Json
          competencia: string
          contrato_id: string
          created_at?: string
          dados_sienge?: Json | null
          data_envio?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          dias_aluguel?: number
          empresa?: string | null
          id?: string
          numero_medicao: string
          numero_titulo?: string | null
          obra: string
          observacoes?: string | null
          situacao_sienge?: string | null
          status?: string
          titulo_sienge?: string | null
          updated_at?: string
          validador_responsavel?: string | null
          valor_diaria?: number | null
          valor_total?: number
          vencimento?: string | null
        }
        Update: {
          anexos?: Json
          colaboradores?: Json
          competencia?: string
          contrato_id?: string
          created_at?: string
          dados_sienge?: Json | null
          data_envio?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          dias_aluguel?: number
          empresa?: string | null
          id?: string
          numero_medicao?: string
          numero_titulo?: string | null
          obra?: string
          observacoes?: string | null
          situacao_sienge?: string | null
          status?: string
          titulo_sienge?: string | null
          updated_at?: string
          validador_responsavel?: string | null
          valor_diaria?: number | null
          valor_total?: number
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medicoes_aluguel_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos_alojamento"
            referencedColumns: ["id"]
          },
        ]
      }
      medicoes_hospedagem: {
        Row: {
          anexos: Json
          colaboradores: Json
          competencia: string
          created_at: string
          dados_sienge: Json | null
          data_envio: string | null
          data_fim: string | null
          data_inicio: string | null
          dias_hospedagem: number
          empresa: string | null
          fornecedor_cpf_cnpj: string
          fornecedor_endereco: string | null
          fornecedor_nome: string
          fornecedor_telefone: string | null
          fornecedor_tipo: string
          id: string
          numero_medicao: string
          numero_titulo: string | null
          obra: string
          observacoes: string | null
          situacao_sienge: string | null
          status: string
          titulo_sienge: string | null
          updated_at: string
          validador_responsavel: string | null
          valor_diaria: number
          valor_total: number
          vencimento: string | null
        }
        Insert: {
          anexos?: Json
          colaboradores?: Json
          competencia: string
          created_at?: string
          dados_sienge?: Json | null
          data_envio?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          dias_hospedagem: number
          empresa?: string | null
          fornecedor_cpf_cnpj: string
          fornecedor_endereco?: string | null
          fornecedor_nome: string
          fornecedor_telefone?: string | null
          fornecedor_tipo: string
          id?: string
          numero_medicao: string
          numero_titulo?: string | null
          obra: string
          observacoes?: string | null
          situacao_sienge?: string | null
          status?: string
          titulo_sienge?: string | null
          updated_at?: string
          validador_responsavel?: string | null
          valor_diaria: number
          valor_total: number
          vencimento?: string | null
        }
        Update: {
          anexos?: Json
          colaboradores?: Json
          competencia?: string
          created_at?: string
          dados_sienge?: Json | null
          data_envio?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          dias_hospedagem?: number
          empresa?: string | null
          fornecedor_cpf_cnpj?: string
          fornecedor_endereco?: string | null
          fornecedor_nome?: string
          fornecedor_telefone?: string | null
          fornecedor_tipo?: string
          id?: string
          numero_medicao?: string
          numero_titulo?: string | null
          obra?: string
          observacoes?: string | null
          situacao_sienge?: string | null
          status?: string
          titulo_sienge?: string | null
          updated_at?: string
          validador_responsavel?: string | null
          valor_diaria?: number
          valor_total?: number
          vencimento?: string | null
        }
        Relationships: []
      }
      medicoes_transporte: {
        Row: {
          anexo_nf_nome: string | null
          anexo_nf_url: string | null
          anexo_xml_nome: string | null
          anexo_xml_url: string | null
          cca: string
          cnpj: string | null
          created_at: string
          dados_nf: Json | null
          dados_sienge: Json | null
          data_emissao: string | null
          fornecedor: string
          id: string
          itens: Json
          numero_medicao: string
          numero_nf: string | null
          numero_sienge: string | null
          observacoes: string | null
          periodo: string
          prazo_pagamento: string | null
          situacao_sienge: string | null
          status: string
          status_integracao: string
          titulo_sienge: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          anexo_nf_nome?: string | null
          anexo_nf_url?: string | null
          anexo_xml_nome?: string | null
          anexo_xml_url?: string | null
          cca: string
          cnpj?: string | null
          created_at?: string
          dados_nf?: Json | null
          dados_sienge?: Json | null
          data_emissao?: string | null
          fornecedor: string
          id?: string
          itens?: Json
          numero_medicao: string
          numero_nf?: string | null
          numero_sienge?: string | null
          observacoes?: string | null
          periodo: string
          prazo_pagamento?: string | null
          situacao_sienge?: string | null
          status?: string
          status_integracao?: string
          titulo_sienge?: string | null
          updated_at?: string
          valor_total?: number
        }
        Update: {
          anexo_nf_nome?: string | null
          anexo_nf_url?: string | null
          anexo_xml_nome?: string | null
          anexo_xml_url?: string | null
          cca?: string
          cnpj?: string | null
          created_at?: string
          dados_nf?: Json | null
          dados_sienge?: Json | null
          data_emissao?: string | null
          fornecedor?: string
          id?: string
          itens?: Json
          numero_medicao?: string
          numero_nf?: string | null
          numero_sienge?: string | null
          observacoes?: string | null
          periodo?: string
          prazo_pagamento?: string | null
          situacao_sienge?: string | null
          status?: string
          status_integracao?: string
          titulo_sienge?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: []
      }
      nydhus_ccas: {
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
      nydhus_funcoes: {
        Row: {
          ativo: boolean | null
          cbo: string
          created_at: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cbo: string
          created_at?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cbo?: string
          created_at?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_obra_acesso: {
        Row: {
          cca_codigo: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          cca_codigo: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          cca_codigo?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_obra_acesso_cca_codigo_fkey"
            columns: ["cca_codigo"]
            isOneToOne: false
            referencedRelation: "nydhus_ccas"
            referencedColumns: ["codigo"]
          },
        ]
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
        Relationships: []
      }
      validacao_admissao: {
        Row: {
          admissao_ok: boolean | null
          ajuda_ok: boolean | null
          aposentado: string | null
          aso_liberado: boolean | null
          aso_ok: boolean | null
          aso_pdf_url: string | null
          aso_upload_at: string | null
          bairro: string | null
          calendario_feriados: Json | null
          cbo: string | null
          cca_codigo: string | null
          cca_nome: string | null
          celular: string | null
          cep: string | null
          chave_pix: string | null
          cidade: string | null
          cnh: string | null
          cnh_categoria: string | null
          cnh_emissao: string | null
          cnh_estado_emissor: string | null
          cnh_primeira_habilitacao: string | null
          cnh_situacao: string | null
          cnh_vencimento: string | null
          complemento: string | null
          cpf: string
          created_at: string | null
          ctps: string | null
          ctps_data_emissao: string | null
          ctps_estado_emissor: string | null
          ctps_serie: string | null
          curso: string | null
          dados_ok: boolean | null
          data_admissao: string | null
          data_aso_liberado: string | null
          data_envio: string | null
          data_nascimento: string | null
          destinatarios_cc: string[] | null
          destinatarios_para: string[] | null
          dias_calculados: number | null
          email_alternativo: string | null
          email_principal: string | null
          enviado: boolean | null
          estado_civil: string | null
          estado_nascimento: string | null
          funcao: string | null
          genero: string | null
          grau_instrucao: string | null
          havera_ajuda: boolean | null
          id: string
          jornada: string | null
          logradouro: string | null
          nacionalidade: string | null
          naturalidade_cidade: string | null
          naturalidade_uf: string | null
          nec_auditiva: boolean | null
          nec_fisica: boolean | null
          nec_intelectual: boolean | null
          nec_mental: boolean | null
          nec_observacoes: string | null
          nec_reabilitado: boolean | null
          nec_visual: boolean | null
          nome_completo: string
          nome_mae: string | null
          nome_pai: string | null
          nome_social: string | null
          numero: string | null
          nydhus_pessoa_id: string | null
          nydhus_sync_at: string | null
          observacoes_dp: string | null
          pais: string | null
          periodo_fim: string | null
          periodo_inicio: string | null
          pis: string | null
          pis_data_emissao: string | null
          planilha_xlsx_url: string | null
          raca: string | null
          regime: string | null
          regra_ajuda: string | null
          regra_dias: number | null
          reservista: string | null
          rg: string | null
          rg_data_emissao: string | null
          rg_orgao_emissor: string | null
          salario_mensal: number | null
          salario_projetado: number | null
          sexo: string | null
          sienge_funcional_id: string | null
          sienge_pessoa_id: string | null
          sienge_sync_at: string | null
          somar_dias_uteis: boolean | null
          sus: string | null
          telefone_comercial: string | null
          telefone_residencial: string | null
          tipo_ajuda: string | null
          tipo_sanguineo: string | null
          titulo_cidade: string | null
          titulo_eleitor: string | null
          titulo_estado: string | null
          titulo_secao: string | null
          titulo_zona: string | null
          total_ajuda: number | null
          tratamento: string | null
          uf: string | null
          updated_at: string | null
          usuario_envio: string | null
          valor_dia_ajuda: number | null
          valor_hora: number | null
        }
        Insert: {
          admissao_ok?: boolean | null
          ajuda_ok?: boolean | null
          aposentado?: string | null
          aso_liberado?: boolean | null
          aso_ok?: boolean | null
          aso_pdf_url?: string | null
          aso_upload_at?: string | null
          bairro?: string | null
          calendario_feriados?: Json | null
          cbo?: string | null
          cca_codigo?: string | null
          cca_nome?: string | null
          celular?: string | null
          cep?: string | null
          chave_pix?: string | null
          cidade?: string | null
          cnh?: string | null
          cnh_categoria?: string | null
          cnh_emissao?: string | null
          cnh_estado_emissor?: string | null
          cnh_primeira_habilitacao?: string | null
          cnh_situacao?: string | null
          cnh_vencimento?: string | null
          complemento?: string | null
          cpf: string
          created_at?: string | null
          ctps?: string | null
          ctps_data_emissao?: string | null
          ctps_estado_emissor?: string | null
          ctps_serie?: string | null
          curso?: string | null
          dados_ok?: boolean | null
          data_admissao?: string | null
          data_aso_liberado?: string | null
          data_envio?: string | null
          data_nascimento?: string | null
          destinatarios_cc?: string[] | null
          destinatarios_para?: string[] | null
          dias_calculados?: number | null
          email_alternativo?: string | null
          email_principal?: string | null
          enviado?: boolean | null
          estado_civil?: string | null
          estado_nascimento?: string | null
          funcao?: string | null
          genero?: string | null
          grau_instrucao?: string | null
          havera_ajuda?: boolean | null
          id?: string
          jornada?: string | null
          logradouro?: string | null
          nacionalidade?: string | null
          naturalidade_cidade?: string | null
          naturalidade_uf?: string | null
          nec_auditiva?: boolean | null
          nec_fisica?: boolean | null
          nec_intelectual?: boolean | null
          nec_mental?: boolean | null
          nec_observacoes?: string | null
          nec_reabilitado?: boolean | null
          nec_visual?: boolean | null
          nome_completo: string
          nome_mae?: string | null
          nome_pai?: string | null
          nome_social?: string | null
          numero?: string | null
          nydhus_pessoa_id?: string | null
          nydhus_sync_at?: string | null
          observacoes_dp?: string | null
          pais?: string | null
          periodo_fim?: string | null
          periodo_inicio?: string | null
          pis?: string | null
          pis_data_emissao?: string | null
          planilha_xlsx_url?: string | null
          raca?: string | null
          regime?: string | null
          regra_ajuda?: string | null
          regra_dias?: number | null
          reservista?: string | null
          rg?: string | null
          rg_data_emissao?: string | null
          rg_orgao_emissor?: string | null
          salario_mensal?: number | null
          salario_projetado?: number | null
          sexo?: string | null
          sienge_funcional_id?: string | null
          sienge_pessoa_id?: string | null
          sienge_sync_at?: string | null
          somar_dias_uteis?: boolean | null
          sus?: string | null
          telefone_comercial?: string | null
          telefone_residencial?: string | null
          tipo_ajuda?: string | null
          tipo_sanguineo?: string | null
          titulo_cidade?: string | null
          titulo_eleitor?: string | null
          titulo_estado?: string | null
          titulo_secao?: string | null
          titulo_zona?: string | null
          total_ajuda?: number | null
          tratamento?: string | null
          uf?: string | null
          updated_at?: string | null
          usuario_envio?: string | null
          valor_dia_ajuda?: number | null
          valor_hora?: number | null
        }
        Update: {
          admissao_ok?: boolean | null
          ajuda_ok?: boolean | null
          aposentado?: string | null
          aso_liberado?: boolean | null
          aso_ok?: boolean | null
          aso_pdf_url?: string | null
          aso_upload_at?: string | null
          bairro?: string | null
          calendario_feriados?: Json | null
          cbo?: string | null
          cca_codigo?: string | null
          cca_nome?: string | null
          celular?: string | null
          cep?: string | null
          chave_pix?: string | null
          cidade?: string | null
          cnh?: string | null
          cnh_categoria?: string | null
          cnh_emissao?: string | null
          cnh_estado_emissor?: string | null
          cnh_primeira_habilitacao?: string | null
          cnh_situacao?: string | null
          cnh_vencimento?: string | null
          complemento?: string | null
          cpf?: string
          created_at?: string | null
          ctps?: string | null
          ctps_data_emissao?: string | null
          ctps_estado_emissor?: string | null
          ctps_serie?: string | null
          curso?: string | null
          dados_ok?: boolean | null
          data_admissao?: string | null
          data_aso_liberado?: string | null
          data_envio?: string | null
          data_nascimento?: string | null
          destinatarios_cc?: string[] | null
          destinatarios_para?: string[] | null
          dias_calculados?: number | null
          email_alternativo?: string | null
          email_principal?: string | null
          enviado?: boolean | null
          estado_civil?: string | null
          estado_nascimento?: string | null
          funcao?: string | null
          genero?: string | null
          grau_instrucao?: string | null
          havera_ajuda?: boolean | null
          id?: string
          jornada?: string | null
          logradouro?: string | null
          nacionalidade?: string | null
          naturalidade_cidade?: string | null
          naturalidade_uf?: string | null
          nec_auditiva?: boolean | null
          nec_fisica?: boolean | null
          nec_intelectual?: boolean | null
          nec_mental?: boolean | null
          nec_observacoes?: string | null
          nec_reabilitado?: boolean | null
          nec_visual?: boolean | null
          nome_completo?: string
          nome_mae?: string | null
          nome_pai?: string | null
          nome_social?: string | null
          numero?: string | null
          nydhus_pessoa_id?: string | null
          nydhus_sync_at?: string | null
          observacoes_dp?: string | null
          pais?: string | null
          periodo_fim?: string | null
          periodo_inicio?: string | null
          pis?: string | null
          pis_data_emissao?: string | null
          planilha_xlsx_url?: string | null
          raca?: string | null
          regime?: string | null
          regra_ajuda?: string | null
          regra_dias?: number | null
          reservista?: string | null
          rg?: string | null
          rg_data_emissao?: string | null
          rg_orgao_emissor?: string | null
          salario_mensal?: number | null
          salario_projetado?: number | null
          sexo?: string | null
          sienge_funcional_id?: string | null
          sienge_pessoa_id?: string | null
          sienge_sync_at?: string | null
          somar_dias_uteis?: boolean | null
          sus?: string | null
          telefone_comercial?: string | null
          telefone_residencial?: string | null
          tipo_ajuda?: string | null
          tipo_sanguineo?: string | null
          titulo_cidade?: string | null
          titulo_eleitor?: string | null
          titulo_estado?: string | null
          titulo_secao?: string | null
          titulo_zona?: string | null
          total_ajuda?: number | null
          tratamento?: string | null
          uf?: string | null
          updated_at?: string | null
          usuario_envio?: string | null
          valor_dia_ajuda?: number | null
          valor_hora?: number | null
        }
        Relationships: []
      }
      vistorias_alojamento: {
        Row: {
          contrato_id: string
          created_at: string
          data: string
          documento_anexo: string | null
          id: string
          observacoes: string | null
          registro_fotografico: Json | null
          responsavel: string
          tipo: string
          updated_at: string
        }
        Insert: {
          contrato_id: string
          created_at?: string
          data: string
          documento_anexo?: string | null
          id?: string
          observacoes?: string | null
          registro_fotografico?: Json | null
          responsavel: string
          tipo: string
          updated_at?: string
        }
        Update: {
          contrato_id?: string
          created_at?: string
          data?: string
          documento_anexo?: string | null
          id?: string
          observacoes?: string | null
          registro_fotografico?: Json | null
          responsavel?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vistorias_alojamento_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos_alojamento"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_obras: {
        Args: { _user_id: string }
        Returns: string[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      obter_proximo_numero_alojamento: {
        Args: { p_cca_codigo: string; p_tipo_alojamento: string }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "supervisor_adm" | "adm_obra"
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
      app_role: ["admin", "supervisor_adm", "adm_obra"],
    },
  },
} as const
