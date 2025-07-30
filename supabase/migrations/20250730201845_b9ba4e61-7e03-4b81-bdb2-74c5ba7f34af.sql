-- Atualizar apenas perfil Administrador para incluir automaticamente o novo CCA
UPDATE perfis 
SET ccas_permitidas = ccas_permitidas || '[31]'::jsonb
WHERE nome = 'Administrador' 
AND NOT (ccas_permitidas ? '31');

-- Criar função para adicionar CCAs automaticamente apenas ao perfil Administrador
CREATE OR REPLACE FUNCTION add_cca_to_admin_profiles()
RETURNS TRIGGER AS $$
BEGIN
  -- Adicionar o novo CCA apenas ao perfil Administrador
  UPDATE perfis 
  SET ccas_permitidas = ccas_permitidas || jsonb_build_array(NEW.id)
  WHERE nome = 'Administrador' 
  AND NOT (ccas_permitidas ? NEW.id::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar automaticamente quando um CCA é criado
CREATE TRIGGER trigger_add_cca_to_admin_profiles
  AFTER INSERT ON ccas
  FOR EACH ROW
  EXECUTE FUNCTION add_cca_to_admin_profiles();