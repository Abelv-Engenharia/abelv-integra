
-- Criar tabela para os tipos de inspeção SMS
CREATE TABLE IF NOT EXISTS public.tipos_inspecao_sms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela para os modelos de inspeção SMS
CREATE TABLE IF NOT EXISTS public.modelos_inspecao_sms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  tipo_inspecao_id uuid REFERENCES public.tipos_inspecao_sms(id),
  campos_cabecalho jsonb DEFAULT '[]'::jsonb, -- Array dos campos selecionados para o cabeçalho
  itens_verificacao jsonb DEFAULT '[]'::jsonb, -- Array dos itens a serem verificados
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Adicionar RLS policies para tipos_inspecao_sms
ALTER TABLE public.tipos_inspecao_sms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tipos inspeção - ler (autenticados)" 
  ON public.tipos_inspecao_sms 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Tipos inspeção - gerenciar (admin)" 
  ON public.tipos_inspecao_sms 
  FOR ALL 
  USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true)
  WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Adicionar RLS policies para modelos_inspecao_sms
ALTER TABLE public.modelos_inspecao_sms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modelos inspeção - ler (autenticados)" 
  ON public.modelos_inspecao_sms 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Modelos inspeção - gerenciar (admin)" 
  ON public.modelos_inspecao_sms 
  FOR ALL 
  USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true)
  WITH CHECK (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Inserir alguns tipos básicos de inspeção
INSERT INTO public.tipos_inspecao_sms (nome, descricao) VALUES 
('Inspeção de Segurança Geral', 'Inspeção geral de segurança no trabalho'),
('Inspeção de EPI', 'Verificação do uso correto de equipamentos de proteção individual'),
('Inspeção de Equipamentos', 'Verificação das condições de segurança dos equipamentos'),
('Inspeção de Área', 'Verificação das condições de segurança da área de trabalho')
ON CONFLICT DO NOTHING;
