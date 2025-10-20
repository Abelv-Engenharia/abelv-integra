-- Fase 1: Extensão do Banco de Dados
-- Adicionar campos de validação à tabela analises_contratuais

-- Campos de validação Financeiro
ALTER TABLE public.analises_contratuais 
ADD COLUMN status_financeiro text DEFAULT 'pendente',
ADD COLUMN observacao_financeiro text,
ADD COLUMN validado_financeiro_por text,
ADD COLUMN validado_financeiro_em timestamp with time zone;

-- Campos de validação ADM
ALTER TABLE public.analises_contratuais 
ADD COLUMN status_adm text DEFAULT 'pendente',
ADD COLUMN observacao_adm text,
ADD COLUMN validado_adm_por text,
ADD COLUMN validado_adm_em timestamp with time zone;

-- Campos de validação Gestor
ALTER TABLE public.analises_contratuais 
ADD COLUMN status_gestor text DEFAULT 'pendente',
ADD COLUMN observacao_gestor text,
ADD COLUMN validado_gestor_por text,
ADD COLUMN validado_gestor_em timestamp with time zone;

-- Campos de validação Superintendência
ALTER TABLE public.analises_contratuais 
ADD COLUMN status_super text DEFAULT 'pendente',
ADD COLUMN observacao_super text,
ADD COLUMN validado_super_por text,
ADD COLUMN validado_super_em timestamp with time zone;

-- Campo de status geral
ALTER TABLE public.analises_contratuais 
ADD COLUMN status_geral text DEFAULT 'em_analise';

-- Campos para fotos e cláusulas
ALTER TABLE public.analises_contratuais 
ADD COLUMN fotos_imovel jsonb DEFAULT '[]'::jsonb,
ADD COLUMN usar_fotos_validacao boolean DEFAULT false,
ADD COLUMN clausulas_selecionadas jsonb DEFAULT '[]'::jsonb;

-- Criar tabela de auditoria
CREATE TABLE IF NOT EXISTS public.auditoria_contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid REFERENCES public.analises_contratuais(id) ON DELETE CASCADE,
  usuario text NOT NULL,
  area text NOT NULL,
  acao text NOT NULL,
  observacao text,
  timestamp timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.auditoria_contratos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura de auditoria
CREATE POLICY "Permitir leitura de auditoria para todos"
ON public.auditoria_contratos
FOR SELECT
USING (true);

-- Política para permitir inserção de auditoria
CREATE POLICY "Permitir inserção de auditoria para todos"
ON public.auditoria_contratos
FOR INSERT
WITH CHECK (true);