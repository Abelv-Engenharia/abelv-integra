-- Migration: Adicionar slugs de permissões de Recursos & Benefícios
-- Módulo: Gestão de Pessoas > Recursos & Benefícios

DO $$
DECLARE
  user_record RECORD;
  current_slugs JSONB;
  new_slugs TEXT[] := ARRAY[
    -- Solicitações
    'gestao_pessoas_solicitacoes_dashboard',
    'gestao_pessoas_solicitacoes_criar',
    'gestao_pessoas_solicitacoes_visualizar',
    'gestao_pessoas_solicitacoes_aprovar',
    'gestao_pessoas_solicitacoes_relatorios',
    -- Viagens
    'gestao_pessoas_viagens_dashboard',
    'gestao_pessoas_viagens_cadastrar_fatura',
    'gestao_pessoas_viagens_importar_fatura',
    'gestao_pessoas_viagens_consultar_faturas',
    'gestao_pessoas_viagens_relatorios',
    -- Veículos
    'gestao_pessoas_veiculos_dashboard',
    'gestao_pessoas_veiculos_cadastrar',
    'gestao_pessoas_veiculos_editar',
    'gestao_pessoas_veiculos_visualizar',
    'gestao_pessoas_veiculos_excluir',
    'gestao_pessoas_veiculos_consultas',
    'gestao_pessoas_veiculos_multas_cadastrar',
    'gestao_pessoas_veiculos_multas_visualizar',
    'gestao_pessoas_veiculos_multas_editar',
    'gestao_pessoas_veiculos_condutores_cadastrar',
    'gestao_pessoas_veiculos_condutores_visualizar',
    'gestao_pessoas_veiculos_condutores_editar',
    'gestao_pessoas_veiculos_cartoes_cadastrar',
    'gestao_pessoas_veiculos_cartoes_visualizar',
    'gestao_pessoas_veiculos_pedagios_cadastrar',
    'gestao_pessoas_veiculos_pedagios_visualizar',
    'gestao_pessoas_veiculos_checklists_criar',
    'gestao_pessoas_veiculos_checklists_visualizar',
    'gestao_pessoas_veiculos_abastecimento_gerenciar',
    'gestao_pessoas_veiculos_relatorios'
  ];
  slug TEXT;
BEGIN
  -- Iterar sobre todos os usuários com tipo_usuario = 'administrador'
  FOR user_record IN 
    SELECT id, menus_sidebar 
    FROM profiles 
    WHERE tipo_usuario = 'administrador' AND ativo = true
  LOOP
    current_slugs := COALESCE(user_record.menus_sidebar, '[]'::jsonb);
    
    -- Adicionar cada novo slug se não existir
    FOREACH slug IN ARRAY new_slugs
    LOOP
      IF NOT (current_slugs @> to_jsonb(slug)) THEN
        current_slugs := current_slugs || to_jsonb(slug);
      END IF;
    END LOOP;
    
    -- Atualizar o registro
    UPDATE profiles 
    SET menus_sidebar = current_slugs,
        updated_at = now()
    WHERE id = user_record.id;
  END LOOP;
  
  RAISE NOTICE 'Permissões de Recursos & Benefícios adicionadas com sucesso aos administradores!';
END $$;

-- Criar comentário documentando as permissões
COMMENT ON COLUMN profiles.menus_sidebar IS 
'Array JSONB de slugs de permissões. Slugs de Recursos & Benefícios (Gestão de Pessoas):
- gestao_pessoas_solicitacoes_*: Gerenciamento de solicitações de serviços
- gestao_pessoas_viagens_*: Gestão de viagens corporativas
- gestao_pessoas_veiculos_*: Controle completo da frota de veículos';