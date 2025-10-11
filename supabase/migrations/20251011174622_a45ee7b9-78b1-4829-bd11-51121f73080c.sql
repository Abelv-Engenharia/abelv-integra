-- Remover políticas duplicadas/problemáticas de extintores
DROP POLICY IF EXISTS "Usuários com permissão podem atualizar extintores" ON extintores;
DROP POLICY IF EXISTS "Usuários podem atualizar extintores" ON extintores;
DROP POLICY IF EXISTS "Usuários com permissão podem inserir extintores" ON extintores;
DROP POLICY IF EXISTS "Usuários podem inserir extintores" ON extintores;

-- Criar política consistente para UPDATE
CREATE POLICY "Extintores - atualizar (autenticados com permissão)"
ON extintores
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'admin_sistema') OR
    'extintores_edicao' = ANY(get_user_permissions(auth.uid())) OR
    '*' = ANY(get_user_permissions(auth.uid()))
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'admin_sistema') OR
    'extintores_edicao' = ANY(get_user_permissions(auth.uid())) OR
    '*' = ANY(get_user_permissions(auth.uid()))
  )
);

-- Criar política consistente para INSERT
CREATE POLICY "Extintores - criar (autenticados com permissão)"
ON extintores
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'admin_sistema') OR
    'extintores_cadastro' = ANY(get_user_permissions(auth.uid())) OR
    '*' = ANY(get_user_permissions(auth.uid()))
  )
);

-- Criar política para DELETE (hard delete)
CREATE POLICY "Extintores - deletar (autenticados com permissão)"
ON extintores
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    has_role(auth.uid(), 'admin_sistema') OR
    'extintores_edicao' = ANY(get_user_permissions(auth.uid())) OR
    '*' = ANY(get_user_permissions(auth.uid()))
  )
);