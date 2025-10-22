-- 1. Adicionar coluna modulo para distinguir entre mecânica e elétrica
ALTER TABLE public.atividades_cadastradas 
ADD COLUMN modulo text NOT NULL DEFAULT 'mecanica';

-- 2. Recuperar todas as atividades que foram marcadas como inativas
UPDATE public.atividades_cadastradas 
SET ativo = true 
WHERE ativo = false;

-- 3. Classificar as atividades existentes por módulo
UPDATE public.atividades_cadastradas 
SET modulo = 'mecanica' 
WHERE nome IN ('MEC_EQUIP', 'TUB_AC', 'TUB_AI316/316L', 'TUB_AI304/304L', 'SUP_AI', 'SUP_AC');

-- 4. Inserir atividades específicas da elétrica
INSERT INTO public.atividades_cadastradas (nome, descricao, modulo, ativo) VALUES
('ELE_ELETRO', 'Instalação de eletrocalhas', 'eletrica', true),
('ELE_CABOS', 'Passagem de cabos', 'eletrica', true),
('ELE_PAINEIS', 'Montagem de painéis elétricos', 'eletrica', true),
('ELE_INST', 'Instalação de instrumentos', 'eletrica', true),
('ELE_EQUIP', 'Conexão de equipamentos elétricos', 'eletrica', true),
('ELE_LUMIN', 'Instalação de luminárias', 'eletrica', true),
('ELE_TESTES', 'Testes elétricos e comissionamento', 'eletrica', true),
('ELE_FORÇA', 'Instalação de força e tomadas', 'eletrica', true),
('ELE_ILUMIN', 'Sistema de iluminação', 'eletrica', true),
('ELE_SPDA', 'Sistema de proteção contra descargas atmosféricas', 'eletrica', true),
('ELE_TELECOM', 'Instalação de telecomunicações', 'eletrica', true),
('ELE_AUTO', 'Instalação de automação', 'eletrica', true);