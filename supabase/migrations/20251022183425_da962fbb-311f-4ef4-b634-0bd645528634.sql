-- Criar tabela para armazenar relação CNAE x Grau de Risco (NR-4)
CREATE TABLE IF NOT EXISTS public.cnae_grau_risco (
  codigo_cnae TEXT PRIMARY KEY,
  descricao TEXT NOT NULL,
  grau_risco INTEGER NOT NULL CHECK (grau_risco BETWEEN 1 AND 4),
  secao TEXT,
  divisao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.cnae_grau_risco ENABLE ROW LEVEL SECURITY;

-- Política de leitura para usuários autenticados
CREATE POLICY "CNAE Grau Risco - visualizar (autenticados)"
ON public.cnae_grau_risco
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Política de gerenciamento para administradores
CREATE POLICY "CNAE Grau Risco - gerenciar (admin)"
ON public.cnae_grau_risco
FOR ALL
USING (
  has_role(auth.uid(), 'admin_sistema'::app_role) OR 
  '*' = ANY(get_user_permissions(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'admin_sistema'::app_role) OR 
  '*' = ANY(get_user_permissions(auth.uid()))
);

-- Criar índice para performance
CREATE INDEX idx_cnae_grau_risco_codigo ON public.cnae_grau_risco(codigo_cnae);
CREATE INDEX idx_cnae_grau_risco_grau ON public.cnae_grau_risco(grau_risco);

-- Inserir dados de exemplo (alguns CNAEs comuns da construção civil)
INSERT INTO public.cnae_grau_risco (codigo_cnae, descricao, grau_risco, secao, divisao) VALUES
('4120400', 'Construção de edifícios', 3, 'F', '41'),
('4211101', 'Construção de rodovias e ferrovias', 4, 'F', '42'),
('4212000', 'Construção de obras de arte especiais', 4, 'F', '42'),
('4213800', 'Obras de urbanização - ruas, praças e calçadas', 3, 'F', '42'),
('4221901', 'Construção de barragens e represas para geração de energia elétrica', 4, 'F', '42'),
('4222701', 'Construção de redes de abastecimento de água', 3, 'F', '42'),
('4223500', 'Construção de redes de transportes por dutos, exceto para água e esgoto', 4, 'F', '42'),
('4291000', 'Obras portuárias, marítimas e fluviais', 4, 'F', '42'),
('4292801', 'Montagem de estruturas metálicas', 4, 'F', '42'),
('4299501', 'Construção de instalações esportivas e recreativas', 3, 'F', '42'),
('4311801', 'Demolição de edifícios e outras estruturas', 4, 'F', '43'),
('4312600', 'Perfurações e sondagens', 4, 'F', '43'),
('4313400', 'Obras de terraplenagem', 4, 'F', '43'),
('4319300', 'Serviços de preparação do terreno não especificados anteriormente', 3, 'F', '43'),
('4321500', 'Instalação e manutenção elétrica', 3, 'F', '43'),
('4322301', 'Instalações hidráulicas, sanitárias e de gás', 3, 'F', '43'),
('4329101', 'Instalação de painéis publicitários', 3, 'F', '43'),
('4330401', 'Impermeabilização em obras de engenharia civil', 3, 'F', '43'),
('4391600', 'Obras de fundações', 4, 'F', '43'),
('4399101', 'Administração de obras', 2, 'F', '43'),
('6201501', 'Desenvolvimento de programas de computador sob encomenda', 1, 'J', '62'),
('6202300', 'Desenvolvimento e licenciamento de programas de computador customizáveis', 1, 'J', '62'),
('6203100', 'Desenvolvimento e licenciamento de programas de computador não customizáveis', 1, 'J', '62'),
('7112000', 'Serviços de engenharia', 2, 'M', '71'),
('7490104', 'Atividades de intermediação e agenciamento de serviços e negócios em geral', 1, 'M', '74'),
('8511200', 'Educação infantil - creche', 2, 'P', '85'),
('8512100', 'Educação infantil - pré-escola', 2, 'P', '85'),
('8513900', 'Ensino fundamental', 2, 'P', '85'),
('8520100', 'Ensino médio', 2, 'P', '85'),
('8599699', 'Outras atividades de ensino não especificadas anteriormente', 2, 'P', '85')
ON CONFLICT (codigo_cnae) DO NOTHING;

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_cnae_grau_risco_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cnae_grau_risco_updated_at
BEFORE UPDATE ON public.cnae_grau_risco
FOR EACH ROW
EXECUTE FUNCTION update_cnae_grau_risco_updated_at();