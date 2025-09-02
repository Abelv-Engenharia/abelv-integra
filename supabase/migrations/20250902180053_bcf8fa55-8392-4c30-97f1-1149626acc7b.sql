-- Criar tabela para armazenar extintores cadastrados
CREATE TABLE public.extintores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR NOT NULL UNIQUE,
  tipo VARCHAR NOT NULL,
  capacidade VARCHAR NOT NULL,
  fabricante VARCHAR,
  data_fabricacao DATE,
  data_vencimento DATE,
  localizacao VARCHAR NOT NULL,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.extintores ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Usuários podem visualizar extintores" 
ON public.extintores 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários com permissão podem inserir extintores" 
ON public.extintores 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários com permissão podem atualizar extintores" 
ON public.extintores 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin podem excluir extintores" 
ON public.extintores 
FOR DELETE 
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_extintores_updated_at
BEFORE UPDATE ON public.extintores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela para inspeções de extintores
CREATE TABLE public.inspecoes_extintores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  extintor_id UUID NOT NULL REFERENCES public.extintores(id) ON DELETE CASCADE,
  checklist_id UUID NOT NULL REFERENCES public.checklists_avaliacao(id),
  responsavel_id UUID NOT NULL,
  data_inspecao DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'concluida',
  tem_nao_conformidade BOOLEAN DEFAULT false,
  dados_preenchidos JSONB NOT NULL DEFAULT '{}',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para inspeções de extintores
ALTER TABLE public.inspecoes_extintores ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para inspeções
CREATE POLICY "Usuários podem visualizar inspeções de extintores" 
ON public.inspecoes_extintores 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem criar inspeções de extintores" 
ON public.inspecoes_extintores 
FOR INSERT 
WITH CHECK (auth.uid() = responsavel_id);

CREATE POLICY "Usuários podem atualizar suas inspeções de extintores" 
ON public.inspecoes_extintores 
FOR UPDATE 
USING (auth.uid() = responsavel_id);

CREATE POLICY "Admin podem excluir inspeções de extintores" 
ON public.inspecoes_extintores 
FOR DELETE 
USING (((get_user_permissions(auth.uid()) ->> 'admin_funcionarios'::text))::boolean = true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_inspecoes_extintores_updated_at
BEFORE UPDATE ON public.inspecoes_extintores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();