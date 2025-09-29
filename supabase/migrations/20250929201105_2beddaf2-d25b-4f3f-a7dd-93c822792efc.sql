-- Atualizar slugs antigos para novos no campo menus_sidebar (JSONB) da tabela profiles

-- Função para substituir valores em arrays JSONB
CREATE OR REPLACE FUNCTION replace_in_jsonb_array(arr jsonb, old_val text, new_val text)
RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      CASE 
        WHEN elem::text = to_jsonb(old_val)::text THEN to_jsonb(new_val)
        ELSE elem
      END
    )
    FROM jsonb_array_elements(arr) AS elem
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 1. Hora da Segurança - Atualizar slugs inconsistentes
UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'hora_seguranca_inspecoes_cadastro', 'hora_seguranca_cadastro_inspecao')
WHERE menus_sidebar ? 'hora_seguranca_inspecoes_cadastro';

UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'hora_seguranca_inspecoes_acompanhamento', 'hora_seguranca_acompanhamento')
WHERE menus_sidebar ? 'hora_seguranca_inspecoes_acompanhamento';

UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'hora_seguranca_inspecoes_nao_programadas', 'hora_seguranca_cadastro_nao_programada')
WHERE menus_sidebar ? 'hora_seguranca_inspecoes_nao_programadas';

UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'hora_seguranca_inspecao_cadastro_hsa', 'hora_seguranca_cadastro_hsa')
WHERE menus_sidebar ? 'hora_seguranca_inspecao_cadastro_hsa';

UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'hora_seguranca_inspecao_nao_programada_hsa', 'hora_seguranca_nao_programada_hsa')
WHERE menus_sidebar ? 'hora_seguranca_inspecao_nao_programada_hsa';

UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'hora_seguranca_agenda_hsa', 'hora_seguranca_agenda')
WHERE menus_sidebar ? 'hora_seguranca_agenda_hsa';

-- 2. Inspeção SMS - Atualizar slug inconsistente
UPDATE profiles 
SET menus_sidebar = replace_in_jsonb_array(menus_sidebar, 'inspecao_sms_cadastrar', 'inspecao_sms_cadastro')
WHERE menus_sidebar ? 'inspecao_sms_cadastrar';