-- Adicionar permissões de página aos perfis existentes que têm permissões de solicitações
-- Baseado na lógica de mapeamento: ações → páginas

DO $$
DECLARE
  perfil_record RECORD;
  new_permissions TEXT[];
  added_count INTEGER := 0;
BEGIN
  
  -- Iterar sobre todos os perfis que têm pelo menos uma permissão de solicitações
  FOR perfil_record IN 
    SELECT id, nome, telas_liberadas 
    FROM perfis
    WHERE 'gestao_pessoas_solicitacoes_criar' = ANY(telas_liberadas)
       OR 'gestao_pessoas_solicitacoes_visualizar' = ANY(telas_liberadas)
       OR 'gestao_pessoas_solicitacoes_editar' = ANY(telas_liberadas)
       OR 'gestao_pessoas_solicitacoes_excluir' = ANY(telas_liberadas)
       OR 'gestao_pessoas_solicitacoes_aprovar' = ANY(telas_liberadas)
       OR 'gestao_pessoas_solicitacoes_reprovar' = ANY(telas_liberadas)
  LOOP
    
    new_permissions := perfil_record.telas_liberadas;
    added_count := 0;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Processando perfil: % (ID: %)', perfil_record.nome, perfil_record.id;
    
    -- REGRA 1: Se tem "criar" → adicionar "pagina_minhas"
    IF 'gestao_pessoas_solicitacoes_criar' = ANY(perfil_record.telas_liberadas) THEN
      IF NOT 'gestao_pessoas_solicitacoes_pagina_minhas' = ANY(perfil_record.telas_liberadas) THEN
        new_permissions := array_append(new_permissions, 'gestao_pessoas_solicitacoes_pagina_minhas');
        added_count := added_count + 1;
        RAISE NOTICE '  ✅ Adicionando: gestao_pessoas_solicitacoes_pagina_minhas';
      END IF;
    END IF;
    
    -- REGRA 2: Se tem "visualizar" OU "editar" OU "excluir" → adicionar "pagina_controle"
    IF ('gestao_pessoas_solicitacoes_visualizar' = ANY(perfil_record.telas_liberadas) OR
        'gestao_pessoas_solicitacoes_editar' = ANY(perfil_record.telas_liberadas) OR
        'gestao_pessoas_solicitacoes_excluir' = ANY(perfil_record.telas_liberadas)) THEN
      IF NOT 'gestao_pessoas_solicitacoes_pagina_controle' = ANY(new_permissions) THEN
        new_permissions := array_append(new_permissions, 'gestao_pessoas_solicitacoes_pagina_controle');
        added_count := added_count + 1;
        RAISE NOTICE '  ✅ Adicionando: gestao_pessoas_solicitacoes_pagina_controle';
      END IF;
    END IF;
    
    -- REGRA 3: Se tem "aprovar" OU "reprovar" → adicionar "pagina_aprovacao"
    IF ('gestao_pessoas_solicitacoes_aprovar' = ANY(perfil_record.telas_liberadas) OR
        'gestao_pessoas_solicitacoes_reprovar' = ANY(perfil_record.telas_liberadas)) THEN
      IF NOT 'gestao_pessoas_solicitacoes_pagina_aprovacao' = ANY(new_permissions) THEN
        new_permissions := array_append(new_permissions, 'gestao_pessoas_solicitacoes_pagina_aprovacao');
        added_count := added_count + 1;
        RAISE NOTICE '  ✅ Adicionando: gestao_pessoas_solicitacoes_pagina_aprovacao';
      END IF;
    END IF;
    
    -- Atualizar perfil se houver novas permissões
    IF added_count > 0 THEN
      UPDATE perfis 
      SET telas_liberadas = new_permissions
      WHERE id = perfil_record.id;
      
      RAISE NOTICE '  📝 Perfil atualizado: % novas permissões adicionadas', added_count;
    ELSE
      RAISE NOTICE '  ℹ️  Nenhuma atualização necessária';
    END IF;
    
    RAISE NOTICE '========================================';
    
  END LOOP;
  
  RAISE NOTICE '✅ Migração concluída com sucesso!';
  
END $$;