-- Corrigir permissões administrativas do perfil Administrador
UPDATE public.perfis 
SET permissoes = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(permissoes, '{admin_usuarios}', 'true'::jsonb),
                '{admin_perfis}', 'true'::jsonb
              ),
              '{admin_funcionarios}', 'true'::jsonb
            ),
            '{admin_empresas}', 'true'::jsonb
          ),
          '{admin_ccas}', 'true'::jsonb
        ),
        '{admin_engenheiros}', 'true'::jsonb
      ),
      '{admin_supervisores}', 'true'::jsonb
    ),
    '{admin_hht}', 'true'::jsonb
  ),
  '{admin_templates}', 'true'::jsonb
)
WHERE nome = 'Administrador';

-- Também corrigir outras permissões essenciais para admin
UPDATE public.perfis 
SET permissoes = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(permissoes, '{idsms_dashboard}', 'true'::jsonb),
                  '{idsms_formularios}', 'true'::jsonb
                ),
                '{desvios}', 'true'::jsonb
              ),
              '{treinamentos}', 'true'::jsonb
            ),
            '{hora_seguranca}', 'true'::jsonb
          ),
          '{medidas_disciplinares}', 'true'::jsonb
        ),
        '{ocorrencias}', 'true'::jsonb
      ),
      '{tarefas}', 'true'::jsonb
    ),
    '{relatorios}', 'true'::jsonb
  ),
  '{pode_exportar_dados}', 'true'::jsonb
)
WHERE nome = 'Administrador';