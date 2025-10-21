-- ========================================
-- MÓDULO: PRESTADORES DE SERVIÇO
-- Estrutura completa do banco de dados
-- ========================================

-- ========================================
-- 1. TABELAS PRINCIPAIS
-- ========================================

-- 1.1 Tabela: prestadores_pj (Cadastro de Pessoa Jurídica)
CREATE TABLE IF NOT EXISTS prestadores_pj (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados da Empresa
  razaosocial text NOT NULL,
  cnpj varchar(18) NOT NULL UNIQUE,
  descricaoatividade text,
  numerocnae varchar(20),
  grauderisco integer CHECK (grauderisco BETWEEN 1 AND 4),
  endereco text,
  telefone varchar(15),
  email text,
  chavepix text,
  numerocredorsienge text,
  
  -- Dados do Representante Legal
  nomecompleto text NOT NULL,
  cpf varchar(14) NOT NULL UNIQUE,
  datanascimento date,
  rg varchar(20),
  registrofuncional text,
  telefonerepresentante varchar(15),
  emailrepresentante text,
  enderecorepresentante text,
  
  -- Condições Financeiras
  servico text,
  valorprestacaoservico decimal(12,2),
  datainiciocontrato date,
  tempocontrato text,
  ajudacusto decimal(10,2),
  auxilioconveniomedico boolean DEFAULT false,
  valorauxilioconveniomedico decimal(10,2),
  ajudaaluguel decimal(10,2),
  valerefeicao decimal(10,2),
  cafemanha boolean DEFAULT false,
  valorcafemanha decimal(10,2),
  cafetarde boolean DEFAULT false,
  valorcafetarde decimal(10,2),
  almoco boolean DEFAULT false,
  valoralmoco decimal(10,2),
  veiculo boolean DEFAULT false,
  detalhesveiculo text,
  celular boolean DEFAULT false,
  alojamento boolean DEFAULT false,
  detalhesalojamento text,
  folgacampo text,
  periodoferias text,
  quantidadediasferias integer,
  
  -- Vinculação e Controle
  cca_id integer NOT NULL,
  cca_codigo text NOT NULL,
  cca_nome text NOT NULL,
  contrato_url text,
  contrato_nome text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- 1.2 Tabela: prestadores_contratos
CREATE TABLE IF NOT EXISTS prestadores_contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  tipo text NOT NULL CHECK (tipo IN ('contrato', 'aditivo', 'distrato')),
  prestador_pj_id uuid NOT NULL,
  prestador_nome text NOT NULL,
  prestador_cpf varchar(14) NOT NULL,
  prestador_cnpj varchar(18) NOT NULL,
  servico text NOT NULL,
  valor decimal(12,2) NOT NULL CHECK (valor > 0),
  dataemissao date NOT NULL,
  datainicio date NOT NULL,
  datafim date NOT NULL CHECK (datafim >= datainicio),
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'encerrado', 'suspenso')),
  empresa text NOT NULL,
  cca_id integer NOT NULL,
  cca_codigo text NOT NULL,
  cca_nome text NOT NULL,
  contrato_url text,
  contrato_nome text,
  observacoes text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- 1.3 Tabela: prestadores_demonstrativos
CREATE TABLE IF NOT EXISTS prestadores_demonstrativos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  prestador_pj_id uuid NOT NULL,
  contrato_id uuid,
  nome text NOT NULL,
  cca_id integer NOT NULL,
  cca_codigo text NOT NULL,
  cca_nome text NOT NULL,
  funcao text NOT NULL,
  nomeempresa text NOT NULL,
  cpf varchar(14) NOT NULL,
  datanascimento date,
  admissao date NOT NULL,
  mes varchar(7) NOT NULL,
  salario decimal(10,2) NOT NULL CHECK (salario >= 0),
  premiacaonexa decimal(10,2) DEFAULT 0,
  ajudacustoobra decimal(10,2) DEFAULT 0,
  multasdescontos decimal(10,2) DEFAULT 0,
  ajudaaluguel decimal(10,2) DEFAULT 0,
  descontoconvenio decimal(10,2) DEFAULT 0,
  reembolsoconvenio decimal(10,2) DEFAULT 0,
  descontoabelvrun decimal(10,2) DEFAULT 0,
  valornf decimal(12,2) NOT NULL CHECK (valornf >= 0),
  valorliquido decimal(12,2) NOT NULL,
  observacoes text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  UNIQUE(prestador_pj_id, mes)
);

-- 1.4 Tabela: prestadores_notas_fiscais
CREATE TABLE IF NOT EXISTS prestadores_notas_fiscais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL,
  prestador_pj_id uuid NOT NULL,
  contrato_id uuid,
  demonstrativo_id uuid,
  
  -- Dados da Emissão
  nomeempresa text NOT NULL,
  nomerepresentante text NOT NULL,
  periodocontabil varchar(7) NOT NULL,
  cca_id integer NOT NULL,
  cca_codigo text NOT NULL,
  cca_nome text NOT NULL,
  dataemissao date NOT NULL,
  descricaoservico text NOT NULL,
  valor decimal(12,2) NOT NULL CHECK (valor > 0),
  arquivo_url text,
  arquivo_nome text,
  
  -- Dados da Aprovação
  tipodocumento text CHECK (tipodocumento IN ('NFSE', 'NFe', 'NFS', 'Outros') OR tipodocumento IS NULL),
  empresadestino text,
  numerocredor text,
  datavencimento date,
  planofinanceiro text,
  statusaprovacao text DEFAULT 'pendente' CHECK (statusaprovacao IN ('pendente', 'aprovado', 'reprovado')),
  observacoesaprovacao text,
  aprovadopor uuid,
  dataaprovacao timestamp with time zone,
  
  -- Integração Sienge
  status text NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'reprovado', 'erro')),
  dataenviosienge timestamp with time zone,
  mensagemerro text,
  
  -- Controle
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- 1.5 Tabela: prestadores_ferias
CREATE TABLE IF NOT EXISTS prestadores_ferias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_pj_id uuid NOT NULL,
  contrato_id uuid,
  nomeprestador text NOT NULL,
  empresa text NOT NULL,
  funcaocargo text NOT NULL,
  cca_id integer NOT NULL,
  cca_codigo text NOT NULL,
  cca_nome text NOT NULL,
  datainicioferias date NOT NULL,
  periodoaquisitivo text NOT NULL,
  diasferias integer NOT NULL CHECK (diasferias > 0 AND diasferias <= 30),
  responsavelregistro text NOT NULL,
  responsavelregistro_id uuid,
  responsaveldireto text NOT NULL,
  responsaveldireto_id uuid,
  observacoes text,
  anexos text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'solicitado' CHECK (status IN ('solicitado', 'aguardando_aprovacao', 'aprovado', 'em_ferias', 'concluido', 'reprovado')),
  justificativareprovacao text,
  dataaprovacao timestamp with time zone,
  aprovadopor uuid,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- 1.6 Tabela: prestadores_ferias_historico
CREATE TABLE IF NOT EXISTS prestadores_ferias_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ferias_id uuid NOT NULL,
  status text NOT NULL,
  data timestamp with time zone NOT NULL DEFAULT now(),
  usuario text NOT NULL,
  usuario_id uuid,
  observacao text,
  created_at timestamp with time zone DEFAULT now()
);

-- 1.7 Tabela: prestadores_passivos
CREATE TABLE IF NOT EXISTS prestadores_passivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_pj_id uuid NOT NULL,
  contrato_id uuid,
  nomeprestador text NOT NULL,
  empresa text NOT NULL,
  cargo text NOT NULL,
  cca_id integer,
  cca_codigo text,
  cca_nome text,
  salariobase decimal(10,2) NOT NULL CHECK (salariobase > 0),
  dataadmissao date NOT NULL,
  datacorte date NOT NULL,
  saldoferias decimal(12,2) NOT NULL CHECK (saldoferias >= 0),
  decimoterceiro decimal(12,2) NOT NULL CHECK (decimoterceiro >= 0),
  avisopravio decimal(12,2) NOT NULL CHECK (avisopravio >= 0),
  total decimal(12,2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'quitado', 'parcial', 'pendente')),
  observacoes text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

-- 1.8 Tabela: prestadores_passivos_historico
CREATE TABLE IF NOT EXISTS prestadores_passivos_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passivo_id uuid NOT NULL,
  data timestamp with time zone NOT NULL DEFAULT now(),
  usuario text NOT NULL,
  usuario_id uuid,
  campo text NOT NULL,
  valoranterior text NOT NULL,
  valornovo text NOT NULL,
  justificativa text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- 2. ÍNDICES
-- ========================================

-- Índices para prestadores_pj
CREATE INDEX IF NOT EXISTS idx_prestadores_pj_cnpj ON prestadores_pj(cnpj);
CREATE INDEX IF NOT EXISTS idx_prestadores_pj_cpf ON prestadores_pj(cpf);
CREATE INDEX IF NOT EXISTS idx_prestadores_pj_razaosocial ON prestadores_pj(razaosocial);
CREATE INDEX IF NOT EXISTS idx_prestadores_pj_cca ON prestadores_pj(cca_id);
CREATE INDEX IF NOT EXISTS idx_prestadores_pj_ativo ON prestadores_pj(ativo);

-- Índices para prestadores_contratos
CREATE INDEX IF NOT EXISTS idx_contratos_numero ON prestadores_contratos(numero);
CREATE INDEX IF NOT EXISTS idx_contratos_prestador ON prestadores_contratos(prestador_pj_id);
CREATE INDEX IF NOT EXISTS idx_contratos_tipo ON prestadores_contratos(tipo);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON prestadores_contratos(status);
CREATE INDEX IF NOT EXISTS idx_contratos_cca ON prestadores_contratos(cca_id);
CREATE INDEX IF NOT EXISTS idx_contratos_dataemissao ON prestadores_contratos(dataemissao);
CREATE INDEX IF NOT EXISTS idx_contratos_datainicio ON prestadores_contratos(datainicio);
CREATE INDEX IF NOT EXISTS idx_contratos_datafim ON prestadores_contratos(datafim);

-- Índices para prestadores_demonstrativos
CREATE INDEX IF NOT EXISTS idx_demonstrativos_prestador ON prestadores_demonstrativos(prestador_pj_id);
CREATE INDEX IF NOT EXISTS idx_demonstrativos_contrato ON prestadores_demonstrativos(contrato_id);
CREATE INDEX IF NOT EXISTS idx_demonstrativos_cca ON prestadores_demonstrativos(cca_id);
CREATE INDEX IF NOT EXISTS idx_demonstrativos_mes ON prestadores_demonstrativos(mes);
CREATE INDEX IF NOT EXISTS idx_demonstrativos_nome ON prestadores_demonstrativos(nome);
CREATE INDEX IF NOT EXISTS idx_demonstrativos_admissao ON prestadores_demonstrativos(admissao);

-- Índices para prestadores_notas_fiscais
CREATE INDEX IF NOT EXISTS idx_nf_numero ON prestadores_notas_fiscais(numero);
CREATE INDEX IF NOT EXISTS idx_nf_prestador ON prestadores_notas_fiscais(prestador_pj_id);
CREATE INDEX IF NOT EXISTS idx_nf_contrato ON prestadores_notas_fiscais(contrato_id);
CREATE INDEX IF NOT EXISTS idx_nf_demonstrativo ON prestadores_notas_fiscais(demonstrativo_id);
CREATE INDEX IF NOT EXISTS idx_nf_cca ON prestadores_notas_fiscais(cca_id);
CREATE INDEX IF NOT EXISTS idx_nf_periodocontabil ON prestadores_notas_fiscais(periodocontabil);
CREATE INDEX IF NOT EXISTS idx_nf_status ON prestadores_notas_fiscais(status);
CREATE INDEX IF NOT EXISTS idx_nf_statusaprovacao ON prestadores_notas_fiscais(statusaprovacao);
CREATE INDEX IF NOT EXISTS idx_nf_dataemissao ON prestadores_notas_fiscais(dataemissao);

-- Índices para prestadores_ferias
CREATE INDEX IF NOT EXISTS idx_ferias_prestador ON prestadores_ferias(prestador_pj_id);
CREATE INDEX IF NOT EXISTS idx_ferias_contrato ON prestadores_ferias(contrato_id);
CREATE INDEX IF NOT EXISTS idx_ferias_cca ON prestadores_ferias(cca_id);
CREATE INDEX IF NOT EXISTS idx_ferias_status ON prestadores_ferias(status);
CREATE INDEX IF NOT EXISTS idx_ferias_datainicio ON prestadores_ferias(datainicioferias);
CREATE INDEX IF NOT EXISTS idx_ferias_periodoaquisitivo ON prestadores_ferias(periodoaquisitivo);

-- Índices para prestadores_ferias_historico
CREATE INDEX IF NOT EXISTS idx_ferias_historico_ferias ON prestadores_ferias_historico(ferias_id);
CREATE INDEX IF NOT EXISTS idx_ferias_historico_data ON prestadores_ferias_historico(data);
CREATE INDEX IF NOT EXISTS idx_ferias_historico_usuario ON prestadores_ferias_historico(usuario_id);

-- Índices para prestadores_passivos
CREATE INDEX IF NOT EXISTS idx_passivos_prestador ON prestadores_passivos(prestador_pj_id);
CREATE INDEX IF NOT EXISTS idx_passivos_contrato ON prestadores_passivos(contrato_id);
CREATE INDEX IF NOT EXISTS idx_passivos_cca ON prestadores_passivos(cca_id);
CREATE INDEX IF NOT EXISTS idx_passivos_status ON prestadores_passivos(status);
CREATE INDEX IF NOT EXISTS idx_passivos_datacorte ON prestadores_passivos(datacorte);
CREATE INDEX IF NOT EXISTS idx_passivos_dataadmissao ON prestadores_passivos(dataadmissao);

-- Índices para prestadores_passivos_historico
CREATE INDEX IF NOT EXISTS idx_passivos_historico_passivo ON prestadores_passivos_historico(passivo_id);
CREATE INDEX IF NOT EXISTS idx_passivos_historico_data ON prestadores_passivos_historico(data);
CREATE INDEX IF NOT EXISTS idx_passivos_historico_usuario ON prestadores_passivos_historico(usuario_id);

-- ========================================
-- 3. FOREIGN KEYS
-- ========================================

-- Foreign Keys para prestadores_pj
ALTER TABLE prestadores_pj ADD CONSTRAINT fk_prestadores_pj_cca
  FOREIGN KEY (cca_id) REFERENCES ccas(id) ON DELETE RESTRICT;

-- Foreign Keys para prestadores_contratos
ALTER TABLE prestadores_contratos ADD CONSTRAINT fk_contratos_prestador
  FOREIGN KEY (prestador_pj_id) REFERENCES prestadores_pj(id) ON DELETE RESTRICT;
ALTER TABLE prestadores_contratos ADD CONSTRAINT fk_contratos_cca
  FOREIGN KEY (cca_id) REFERENCES ccas(id) ON DELETE RESTRICT;

-- Foreign Keys para prestadores_demonstrativos
ALTER TABLE prestadores_demonstrativos ADD CONSTRAINT fk_demonstrativos_prestador
  FOREIGN KEY (prestador_pj_id) REFERENCES prestadores_pj(id) ON DELETE RESTRICT;
ALTER TABLE prestadores_demonstrativos ADD CONSTRAINT fk_demonstrativos_contrato
  FOREIGN KEY (contrato_id) REFERENCES prestadores_contratos(id) ON DELETE SET NULL;
ALTER TABLE prestadores_demonstrativos ADD CONSTRAINT fk_demonstrativos_cca
  FOREIGN KEY (cca_id) REFERENCES ccas(id) ON DELETE RESTRICT;

-- Foreign Keys para prestadores_notas_fiscais
ALTER TABLE prestadores_notas_fiscais ADD CONSTRAINT fk_nf_prestador
  FOREIGN KEY (prestador_pj_id) REFERENCES prestadores_pj(id) ON DELETE RESTRICT;
ALTER TABLE prestadores_notas_fiscais ADD CONSTRAINT fk_nf_contrato
  FOREIGN KEY (contrato_id) REFERENCES prestadores_contratos(id) ON DELETE SET NULL;
ALTER TABLE prestadores_notas_fiscais ADD CONSTRAINT fk_nf_demonstrativo
  FOREIGN KEY (demonstrativo_id) REFERENCES prestadores_demonstrativos(id) ON DELETE SET NULL;
ALTER TABLE prestadores_notas_fiscais ADD CONSTRAINT fk_nf_cca
  FOREIGN KEY (cca_id) REFERENCES ccas(id) ON DELETE RESTRICT;

-- Foreign Keys para prestadores_ferias
ALTER TABLE prestadores_ferias ADD CONSTRAINT fk_ferias_prestador
  FOREIGN KEY (prestador_pj_id) REFERENCES prestadores_pj(id) ON DELETE RESTRICT;
ALTER TABLE prestadores_ferias ADD CONSTRAINT fk_ferias_contrato
  FOREIGN KEY (contrato_id) REFERENCES prestadores_contratos(id) ON DELETE SET NULL;
ALTER TABLE prestadores_ferias ADD CONSTRAINT fk_ferias_cca
  FOREIGN KEY (cca_id) REFERENCES ccas(id) ON DELETE RESTRICT;

-- Foreign Keys para prestadores_ferias_historico
ALTER TABLE prestadores_ferias_historico ADD CONSTRAINT fk_ferias_historico_ferias
  FOREIGN KEY (ferias_id) REFERENCES prestadores_ferias(id) ON DELETE CASCADE;

-- Foreign Keys para prestadores_passivos
ALTER TABLE prestadores_passivos ADD CONSTRAINT fk_passivos_prestador
  FOREIGN KEY (prestador_pj_id) REFERENCES prestadores_pj(id) ON DELETE RESTRICT;
ALTER TABLE prestadores_passivos ADD CONSTRAINT fk_passivos_contrato
  FOREIGN KEY (contrato_id) REFERENCES prestadores_contratos(id) ON DELETE SET NULL;
ALTER TABLE prestadores_passivos ADD CONSTRAINT fk_passivos_cca
  FOREIGN KEY (cca_id) REFERENCES ccas(id) ON DELETE SET NULL;

-- Foreign Keys para prestadores_passivos_historico
ALTER TABLE prestadores_passivos_historico ADD CONSTRAINT fk_passivos_historico_passivo
  FOREIGN KEY (passivo_id) REFERENCES prestadores_passivos(id) ON DELETE CASCADE;

-- ========================================
-- 4. FUNCTIONS
-- ========================================

-- Function: sync_prestador_cca_data
CREATE OR REPLACE FUNCTION sync_prestador_cca_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.cca_id IS NOT NULL THEN
    SELECT codigo, nome INTO NEW.cca_codigo, NEW.cca_nome
    FROM ccas
    WHERE id = NEW.cca_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: sync_contrato_cca_data
CREATE OR REPLACE FUNCTION sync_contrato_cca_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.cca_id IS NOT NULL THEN
    SELECT codigo, nome INTO NEW.cca_codigo, NEW.cca_nome
    FROM ccas
    WHERE id = NEW.cca_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: registrar_historico_ferias
CREATE OR REPLACE FUNCTION registrar_historico_ferias()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO prestadores_ferias_historico (
      ferias_id, status, usuario, usuario_id, observacao
    ) VALUES (
      NEW.id,
      NEW.status,
      COALESCE(current_setting('app.current_user_name', true), 'Sistema'),
      auth.uid(),
      NEW.observacoes
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Function: registrar_historico_passivos
CREATE OR REPLACE FUNCTION registrar_historico_passivos()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO prestadores_passivos_historico (
      passivo_id, usuario, usuario_id, campo, valoranterior, valornovo, justificativa
    ) VALUES (
      NEW.id,
      COALESCE(current_setting('app.current_user_name', true), 'Sistema'),
      auth.uid(),
      'status',
      OLD.status,
      NEW.status,
      COALESCE(NEW.observacoes, 'Atualização automática')
    );
  END IF;
  
  IF OLD.total IS DISTINCT FROM NEW.total THEN
    INSERT INTO prestadores_passivos_historico (
      passivo_id, usuario, usuario_id, campo, valoranterior, valornovo, justificativa
    ) VALUES (
      NEW.id,
      COALESCE(current_setting('app.current_user_name', true), 'Sistema'),
      auth.uid(),
      'total',
      OLD.total::text,
      NEW.total::text,
      COALESCE(NEW.observacoes, 'Atualização de valor')
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- ========================================
-- 5. TRIGGERS
-- ========================================

-- Triggers para prestadores_pj
CREATE TRIGGER update_prestadores_pj_updated_at
  BEFORE UPDATE ON prestadores_pj
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER sync_prestadores_pj_cca
  BEFORE INSERT OR UPDATE ON prestadores_pj
  FOR EACH ROW
  EXECUTE FUNCTION sync_prestador_cca_data();

-- Triggers para prestadores_contratos
CREATE TRIGGER update_prestadores_contratos_updated_at
  BEFORE UPDATE ON prestadores_contratos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER sync_prestadores_contratos_cca
  BEFORE INSERT OR UPDATE ON prestadores_contratos
  FOR EACH ROW
  EXECUTE FUNCTION sync_contrato_cca_data();

-- Triggers para prestadores_demonstrativos
CREATE TRIGGER update_prestadores_demonstrativos_updated_at
  BEFORE UPDATE ON prestadores_demonstrativos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para prestadores_notas_fiscais
CREATE TRIGGER update_prestadores_notas_fiscais_updated_at
  BEFORE UPDATE ON prestadores_notas_fiscais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para prestadores_ferias
CREATE TRIGGER update_prestadores_ferias_updated_at
  BEFORE UPDATE ON prestadores_ferias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_registrar_historico_ferias
  AFTER UPDATE ON prestadores_ferias
  FOR EACH ROW
  EXECUTE FUNCTION registrar_historico_ferias();

-- Triggers para prestadores_passivos
CREATE TRIGGER update_prestadores_passivos_updated_at
  BEFORE UPDATE ON prestadores_passivos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_registrar_historico_passivos
  AFTER UPDATE ON prestadores_passivos
  FOR EACH ROW
  EXECUTE FUNCTION registrar_historico_passivos();

-- ========================================
-- 6. RLS (Row Level Security)
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE prestadores_pj ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_demonstrativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_ferias_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_passivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestadores_passivos_historico ENABLE ROW LEVEL SECURITY;

-- Políticas para prestadores_pj
CREATE POLICY "prestadores_pj_select_policy" ON prestadores_pj
  FOR SELECT USING (true);

CREATE POLICY "prestadores_pj_insert_policy" ON prestadores_pj
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prestadores_pj_update_policy" ON prestadores_pj
  FOR UPDATE USING (true);

CREATE POLICY "prestadores_pj_delete_policy" ON prestadores_pj
  FOR DELETE USING (true);

-- Políticas para prestadores_contratos
CREATE POLICY "prestadores_contratos_select_policy" ON prestadores_contratos
  FOR SELECT USING (true);

CREATE POLICY "prestadores_contratos_insert_policy" ON prestadores_contratos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prestadores_contratos_update_policy" ON prestadores_contratos
  FOR UPDATE USING (true);

CREATE POLICY "prestadores_contratos_delete_policy" ON prestadores_contratos
  FOR DELETE USING (true);

-- Políticas para prestadores_demonstrativos
CREATE POLICY "prestadores_demonstrativos_select_policy" ON prestadores_demonstrativos
  FOR SELECT USING (true);

CREATE POLICY "prestadores_demonstrativos_insert_policy" ON prestadores_demonstrativos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prestadores_demonstrativos_update_policy" ON prestadores_demonstrativos
  FOR UPDATE USING (true);

CREATE POLICY "prestadores_demonstrativos_delete_policy" ON prestadores_demonstrativos
  FOR DELETE USING (true);

-- Políticas para prestadores_notas_fiscais
CREATE POLICY "prestadores_notas_fiscais_select_policy" ON prestadores_notas_fiscais
  FOR SELECT USING (true);

CREATE POLICY "prestadores_notas_fiscais_insert_policy" ON prestadores_notas_fiscais
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prestadores_notas_fiscais_update_policy" ON prestadores_notas_fiscais
  FOR UPDATE USING (true);

CREATE POLICY "prestadores_notas_fiscais_delete_policy" ON prestadores_notas_fiscais
  FOR DELETE USING (true);

-- Políticas para prestadores_ferias
CREATE POLICY "prestadores_ferias_select_policy" ON prestadores_ferias
  FOR SELECT USING (true);

CREATE POLICY "prestadores_ferias_insert_policy" ON prestadores_ferias
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prestadores_ferias_update_policy" ON prestadores_ferias
  FOR UPDATE USING (true);

CREATE POLICY "prestadores_ferias_delete_policy" ON prestadores_ferias
  FOR DELETE USING (true);

-- Políticas para prestadores_ferias_historico
CREATE POLICY "prestadores_ferias_historico_select_policy" ON prestadores_ferias_historico
  FOR SELECT USING (true);

CREATE POLICY "prestadores_ferias_historico_insert_policy" ON prestadores_ferias_historico
  FOR INSERT WITH CHECK (true);

-- Políticas para prestadores_passivos
CREATE POLICY "prestadores_passivos_select_policy" ON prestadores_passivos
  FOR SELECT USING (true);

CREATE POLICY "prestadores_passivos_insert_policy" ON prestadores_passivos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prestadores_passivos_update_policy" ON prestadores_passivos
  FOR UPDATE USING (true);

CREATE POLICY "prestadores_passivos_delete_policy" ON prestadores_passivos
  FOR DELETE USING (true);

-- Políticas para prestadores_passivos_historico
CREATE POLICY "prestadores_passivos_historico_select_policy" ON prestadores_passivos_historico
  FOR SELECT USING (true);

CREATE POLICY "prestadores_passivos_historico_insert_policy" ON prestadores_passivos_historico
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 7. STORAGE BUCKET
-- ========================================

-- Criar bucket para documentos dos prestadores
INSERT INTO storage.buckets (id, name, public)
VALUES ('prestadores-documentos', 'prestadores-documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para prestadores-documentos
CREATE POLICY "Permitir leitura de documentos de prestadores"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'prestadores-documentos');

CREATE POLICY "Permitir upload de documentos de prestadores"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'prestadores-documentos' 
    AND (storage.extension(name) = ANY(ARRAY['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xml']))
  );

CREATE POLICY "Permitir atualização de documentos de prestadores"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'prestadores-documentos');

CREATE POLICY "Permitir exclusão de documentos de prestadores"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'prestadores-documentos');