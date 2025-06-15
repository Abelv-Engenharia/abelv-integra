
-- 1. Buscar o ID do perfil "Administrador"
WITH perfil_admin AS (
  SELECT id FROM perfis WHERE nome ILIKE 'Admin%'
),
usuario AS (
  SELECT id FROM profiles WHERE email = 'luis.ribeiro@abelv.com.br'
)
INSERT INTO usuario_perfis (usuario_id, perfil_id)
SELECT usuario.id, perfil_admin.id
FROM usuario, perfil_admin
ON CONFLICT (usuario_id)
DO UPDATE SET perfil_id = EXCLUDED.perfil_id;
