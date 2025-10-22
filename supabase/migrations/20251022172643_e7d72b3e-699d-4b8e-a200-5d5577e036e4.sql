-- Criar tabela para histórico de cálculos de rotas
CREATE TABLE veiculos_calculos_rotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id UUID REFERENCES veiculos(id) ON DELETE CASCADE,
  placa VARCHAR(8) NOT NULL,
  modelo TEXT NOT NULL,
  cartao_id UUID REFERENCES veiculos_cartoes_abastecimento(id) ON DELETE SET NULL,
  
  -- Configurações do cálculo
  consumo_km_l DECIMAL(5,2) NOT NULL,
  preco_combustivel_litro DECIMAL(10,2) NOT NULL,
  tipo_combustivel TEXT NOT NULL,
  margem_seguranca_pct INTEGER NOT NULL,
  dias_uteis INTEGER NOT NULL,
  frequencia_diaria INTEGER NOT NULL,
  
  -- Endereços
  endereco_base_nome TEXT NOT NULL,
  endereco_base TEXT NOT NULL,
  endereco_obra_nome TEXT NOT NULL,
  endereco_obra TEXT NOT NULL,
  
  -- Resultados da rota principal
  rota_principal JSONB NOT NULL,
  
  -- Trajetos adicionais
  trajetos_adicionais JSONB DEFAULT '[]'::jsonb,
  
  -- Totalizadores
  distancia_total_mensal_km DECIMAL(10,2) NOT NULL,
  litros_necessarios DECIMAL(10,2) NOT NULL,
  custo_estimado_base DECIMAL(10,2) NOT NULL,
  valor_margem_seguranca DECIMAL(10,2) NOT NULL,
  custo_estimado_com_margem DECIMAL(10,2) NOT NULL,
  
  -- Comparação com cartão
  limite_atual_cartao DECIMAL(10,2),
  diferenca_limite DECIMAL(10,2),
  percentual_diferenca DECIMAL(5,2),
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX idx_calculos_rotas_veiculo ON veiculos_calculos_rotas(veiculo_id);
CREATE INDEX idx_calculos_rotas_data ON veiculos_calculos_rotas(created_at DESC);

-- RLS
ALTER TABLE veiculos_calculos_rotas ENABLE ROW LEVEL SECURITY;

-- Usuários autenticados podem visualizar cálculos
CREATE POLICY "calculos_rotas_select" ON veiculos_calculos_rotas
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Usuários com permissão podem criar
CREATE POLICY "calculos_rotas_insert" ON veiculos_calculos_rotas
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      'veiculos_cadastro' = ANY(get_user_permissions(auth.uid()))
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

-- Usuários com permissão podem atualizar
CREATE POLICY "calculos_rotas_update" ON veiculos_calculos_rotas
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      'veiculos_cadastro' = ANY(get_user_permissions(auth.uid()))
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );

-- Usuários com permissão podem deletar
CREATE POLICY "calculos_rotas_delete" ON veiculos_calculos_rotas
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND (
      'veiculos_cadastro' = ANY(get_user_permissions(auth.uid()))
      OR '*' = ANY(get_user_permissions(auth.uid()))
      OR has_role(auth.uid(), 'admin_sistema'::app_role)
    )
  );