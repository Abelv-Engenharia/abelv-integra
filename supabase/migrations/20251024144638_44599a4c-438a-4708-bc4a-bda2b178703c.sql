-- 1. Criar bucket de storage para anexos de RNC
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rnc-attachments', 'rnc-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar tabela para anexos de RNC
CREATE TABLE IF NOT EXISTS public.rnc_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  attachment_type TEXT NOT NULL CHECK (attachment_type IN ('evidencia_nc', 'evidencia_disposicao')),
  description TEXT,
  evidence_number INTEGER,
  disciplina_outros TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Criar tabela principal de RNCs
CREATE TABLE IF NOT EXISTS public.rncs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  data DATE,
  cca_id INTEGER REFERENCES public.ccas(id),
  emitente TEXT NOT NULL,
  setor_projeto TEXT,
  detectado_por TEXT,
  periodo_melhoria TEXT,
  data_emissao DATE NOT NULL,
  previsao_fechamento DATE,
  
  -- Origem
  origem TEXT NOT NULL CHECK (origem IN ('interna', 'cliente', 'fornecedor', 'terceiro')),
  
  -- Priorização
  prioridade TEXT NOT NULL CHECK (prioridade IN ('critica', 'moderada', 'leve')),
  
  -- Disciplina/Setor (armazenado como array JSON)
  disciplina JSONB NOT NULL DEFAULT '[]'::jsonb,
  disciplina_outros TEXT,
  
  -- Descrições
  descricao_nc TEXT NOT NULL,
  evidencias_nc TEXT,
  
  -- Disposição
  disposicao JSONB NOT NULL DEFAULT '[]'::jsonb,
  empresa_disposicao TEXT,
  responsavel_disposicao TEXT,
  data_disposicao DATE,
  prazo_disposicao DATE,
  analise_disposicao TEXT,
  
  -- Análise da disposição
  eficacia TEXT CHECK (eficacia IN ('eficaz', 'nao_eficaz', 'nova_nc')),
  evidencia_disposicao TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'fechada')),
  data_fechamento DATE,
  
  -- Aprovações
  aprovacao_emitente BOOLEAN,
  aprovacao_qualidade BOOLEAN,
  aprovacao_cliente BOOLEAN,
  
  -- Auditoria
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Adicionar referência na tabela de anexos para RNCs
ALTER TABLE public.rnc_attachments
ADD COLUMN IF NOT EXISTS rnc_id UUID REFERENCES public.rncs(id) ON DELETE CASCADE;

-- 5. Habilitar RLS nas tabelas
ALTER TABLE public.rnc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rncs ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para anexos
CREATE POLICY "Anexos RNC - visualizar (autenticados)" 
ON public.rnc_attachments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anexos RNC - criar (autenticados)" 
ON public.rnc_attachments 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anexos RNC - atualizar próprios (autenticados)" 
ON public.rnc_attachments 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Anexos RNC - deletar próprios (autenticados)" 
ON public.rnc_attachments 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- 7. Políticas RLS para RNCs
CREATE POLICY "RNCs - visualizar (autenticados)"
ON public.rncs
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "RNCs - criar (autenticados)"
ON public.rncs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "RNCs - atualizar (autenticados)"
ON public.rncs
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "RNCs - deletar (autenticados)"
ON public.rncs
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- 8. Políticas de storage para anexos
CREATE POLICY "Storage RNC - visualizar anexos (autenticados)" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'rnc-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Storage RNC - upload anexos (autenticados)" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'rnc-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Storage RNC - atualizar anexos (autenticados)" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'rnc-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Storage RNC - deletar anexos (autenticados)" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'rnc-attachments' AND auth.uid() IS NOT NULL);

-- 9. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_rncs_cca_id ON public.rncs(cca_id);
CREATE INDEX IF NOT EXISTS idx_rncs_status ON public.rncs(status);
CREATE INDEX IF NOT EXISTS idx_rncs_data_emissao ON public.rncs(data_emissao);
CREATE INDEX IF NOT EXISTS idx_rncs_prioridade ON public.rncs(prioridade);
CREATE INDEX IF NOT EXISTS idx_rncs_created_by ON public.rncs(created_by);
CREATE INDEX IF NOT EXISTS idx_rnc_attachments_rnc_id ON public.rnc_attachments(rnc_id);

-- 10. Triggers para atualizar updated_at
CREATE TRIGGER update_rncs_updated_at
BEFORE UPDATE ON public.rncs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rnc_attachments_updated_at
BEFORE UPDATE ON public.rnc_attachments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Comentários para documentação
COMMENT ON TABLE public.rncs IS 'Registros de Não Conformidade (RNC) do Sistema de Gestão da Qualidade';
COMMENT ON COLUMN public.rncs.numero IS 'Número único da RNC';
COMMENT ON COLUMN public.rncs.origem IS 'Origem da não conformidade: interna, cliente, fornecedor ou terceiro';
COMMENT ON COLUMN public.rncs.prioridade IS 'Prioridade da RNC: critica, moderada ou leve';
COMMENT ON COLUMN public.rncs.disciplina IS 'Array de disciplinas/setores envolvidos';
COMMENT ON COLUMN public.rncs.disposicao IS 'Array de ações de disposição tomadas';
COMMENT ON COLUMN public.rncs.status IS 'Status da RNC: aberta ou fechada';