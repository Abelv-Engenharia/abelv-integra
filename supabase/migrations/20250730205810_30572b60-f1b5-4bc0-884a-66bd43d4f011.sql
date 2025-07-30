-- Adicionar coluna classificacao_ocorrencia_codigo na tabela ocorrencias
ALTER TABLE public.ocorrencias 
ADD COLUMN classificacao_ocorrencia_codigo text;

-- Criar função para atualizar automaticamente o código da classificação
CREATE OR REPLACE FUNCTION update_classificacao_ocorrencia_codigo()
RETURNS TRIGGER AS $$
BEGIN
  -- Se classificacao_ocorrencia foi definida, buscar o código correspondente
  IF NEW.classificacao_ocorrencia IS NOT NULL AND NEW.classificacao_ocorrencia != '' THEN
    SELECT codigo INTO NEW.classificacao_ocorrencia_codigo
    FROM public.classificacoes_ocorrencia
    WHERE nome = NEW.classificacao_ocorrencia AND ativo = true
    LIMIT 1;
  ELSE
    NEW.classificacao_ocorrencia_codigo := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função automaticamente
CREATE TRIGGER trigger_update_classificacao_ocorrencia_codigo
  BEFORE INSERT OR UPDATE OF classificacao_ocorrencia ON public.ocorrencias
  FOR EACH ROW
  EXECUTE FUNCTION update_classificacao_ocorrencia_codigo();

-- Atualizar registros existentes
UPDATE public.ocorrencias 
SET classificacao_ocorrencia_codigo = (
  SELECT codigo 
  FROM public.classificacoes_ocorrencia 
  WHERE nome = ocorrencias.classificacao_ocorrencia AND ativo = true
  LIMIT 1
)
WHERE classificacao_ocorrencia IS NOT NULL AND classificacao_ocorrencia != '';