-- Criar política RLS para permitir que gestores de solicitações vejam todos os vínculos usuario_ccas
CREATE POLICY "Gestores podem ver todos os vínculos usuario_ccas"
ON public.usuario_ccas
FOR SELECT
USING (
  'gestao_pessoas_solicitacoes_visualizar'::text = ANY(public.get_user_permissions(auth.uid()))
  OR 'gestao_pessoas_solicitacoes_editar'::text = ANY(public.get_user_permissions(auth.uid()))
  OR 'gestao_pessoas_solicitacoes_aprovar'::text = ANY(public.get_user_permissions(auth.uid()))
  OR 'gestao_pessoas_solicitacoes_pagina_controle'::text = ANY(public.get_user_permissions(auth.uid()))
);