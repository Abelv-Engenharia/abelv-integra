-- 1. Alterar tipo da coluna id_credor de INTEGER para VARCHAR (se ainda não foi)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'estoque_movimentacoes_entradas' 
    AND column_name = 'id_credor' 
    AND data_type != 'character varying'
  ) THEN
    ALTER TABLE estoque_movimentacoes_entradas 
    ALTER COLUMN id_credor TYPE VARCHAR USING id_credor::VARCHAR;
  END IF;
END $$;

-- 2. Criar Foreign Key para credores (se não existe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_estoque_movimentacoes_entradas_credor'
  ) THEN
    ALTER TABLE estoque_movimentacoes_entradas
    ADD CONSTRAINT fk_estoque_movimentacoes_entradas_credor
    FOREIGN KEY (id_credor) REFERENCES credores(id_sienge);
  END IF;
END $$;

-- 3. Criar Foreign Key para empresas_sienge (se não existe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_estoque_movimentacoes_entradas_empresa'
  ) THEN
    ALTER TABLE estoque_movimentacoes_entradas
    ADD CONSTRAINT fk_estoque_movimentacoes_entradas_empresa
    FOREIGN KEY (id_empresa) REFERENCES empresas_sienge(id_sienge);
  END IF;
END $$;

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_credor 
ON estoque_movimentacoes_entradas(id_credor);

CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_empresa 
ON estoque_movimentacoes_entradas(id_empresa);

CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_entradas_documento 
ON estoque_movimentacoes_entradas(id_documento);