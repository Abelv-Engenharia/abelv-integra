-- Remover a constraint de check que limita as disciplinas a valores fixos
ALTER TABLE public.desenhos_eletrica 
DROP CONSTRAINT IF EXISTS desenhos_eletrica_disciplina_check;

-- A coluna disciplina agora aceita qualquer valor text, será validado pela tabela disciplinas_eletricas