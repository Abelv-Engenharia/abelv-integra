-- FASE 3: Tabela de template de documentos para checklist dinâmico
CREATE TABLE checklist_documentos_template (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_documento text NOT NULL UNIQUE,
  nome_exibicao text NOT NULL,
  categoria text NOT NULL,
  obrigatorio_padrao boolean DEFAULT true,
  prazo_dias integer NOT NULL,
  condicional boolean DEFAULT false,
  condicao_tipo text,
  condicao_valores jsonb,
  upload_multiplo boolean DEFAULT false,
  instrucoes text,
  visivel_candidato boolean DEFAULT true,
  formato_aceito text DEFAULT 'PDF/JPG/PNG',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inserir dados base
INSERT INTO checklist_documentos_template (tipo_documento, nome_exibicao, categoria, prazo_dias, obrigatorio_padrao, visivel_candidato, formato_aceito, instrucoes) VALUES
  ('RG_CNH', 'RG ou CNH (frente e verso)', 'identificacao', 0, true, true, 'PDF/JPG/PNG', 'Fotografe o documento em local bem iluminado, sem reflexos'),
  ('CPF', 'CPF (se não constar no RG)', 'identificacao', 0, true, true, 'PDF/JPG/PNG', 'Escaneie ou fotografe o documento completo'),
  ('CTPS', 'CTPS Digital', 'identificacao', 3, true, true, 'PDF/JPG/PNG', 'Fotografe a página com foto e a última página de contrato'),
  ('PIS_NIS', 'PIS/NIS', 'identificacao', 3, false, true, 'PDF/JPG/PNG', 'Número pode estar na CTPS'),
  ('CARTAO_SUS', 'Cartão SUS', 'saude', 3, true, true, 'PDF/JPG/PNG', 'Frente e verso do cartão'),
  ('CARTEIRA_VACINACAO', 'Carteira de Vacinação', 'saude', 7, false, true, 'PDF/JPG/PNG', 'Todas as páginas com vacinas aplicadas'),
  ('COMPROVANTE_ENDERECO', 'Comprovante de Residência (≤ 90 dias)', 'endereco', 1, true, true, 'PDF/JPG/PNG', 'Conta de luz, água ou telefone recente'),
  ('TITULO_ELEITOR', 'Título de Eleitor', 'identificacao', 3, true, true, 'PDF/JPG/PNG', 'Frente e verso do título'),
  ('RESERVISTA', 'Certificado de Reservista', 'identificacao', 3, false, true, 'PDF/JPG/PNG', 'Se aplicável (masculino)'),
  ('HISTORICO_ESCOLAR', 'Histórico Escolar', 'certificacoes', 3, true, true, 'PDF/JPG/PNG', 'Diploma ou histórico escolar'),
  ('DADOS_BANCARIOS', 'Dados Bancários (CLT)', 'bancario', 3, false, true, 'PDF/JPG/PNG', 'Comprovante de conta ou app bancário'),
  ('FOTO_3X4', 'Foto 3x4 ou selfie (fundo claro)', 'foto', 1, false, true, 'JPG/PNG', 'Fundo branco ou claro, sem óculos escuros'),
  ('CONTRATO_EXPERIENCIA', 'Contrato de Experiência', 'contrato', 30, true, false, 'PDF', 'Documento gerado internamente'),
  ('FICHA_REGISTRO', 'Ficha de Registro', 'contrato', 6, true, false, 'PDF', 'Documento gerado internamente'),
  ('ASO', 'ASO Admissional', 'saude', 3, true, false, 'PDF', 'Integrar com BRMED; fallback upload manual'),
  ('TERMOS_INTERNOS', 'Termos Internos', 'contrato', 0, false, false, 'PDF', 'Documentos internos da empresa'),
  ('ESOCIAL', 'eSocial', 'contrato', 0, false, false, 'PDF', 'Registro no eSocial');

-- Inserir documentos condicionais
INSERT INTO checklist_documentos_template (tipo_documento, nome_exibicao, categoria, prazo_dias, obrigatorio_padrao, condicional, condicao_tipo, condicao_valores, visivel_candidato, formato_aceito, instrucoes) VALUES
  ('CERTIDAO_CASAMENTO', 'Certidão de Casamento + RG/CPF do Cônjuge', 'identificacao', 3, false, true, 'estado_civil', '["casado"]', true, 'PDF/JPG/PNG', 'Se aplicável'),
  ('DOCUMENTOS_DEPENDENTES', 'Documentos de Dependentes', 'identificacao', 3, false, true, 'tem_dependentes', '[true]', true, 'PDF/JPG/PNG', 'RG e CPF de cada dependente'),
  ('CERT_ELETRICISTA', 'Certificado de Eletricista', 'certificacoes', 3, false, true, 'funcao', '["Eletricista", "Eletricista Montador", "Eletricista Industrial"]', true, 'PDF', 'Certificado técnico'),
  ('CERT_NR10', 'Certificado NR10', 'certificacoes', 3, false, true, 'funcao', '["Eletricista", "Eletricista Montador", "Eletricista Industrial"]', true, 'PDF', 'Certificado de NR10'),
  ('PRORROGACAO_EXPERIENCIA', 'Prorrogação de Experiência', 'contrato', 50, false, true, 'prorrogacao_existente', '[true]', false, 'PDF', 'Se houver prorrogação registrada');

-- Habilitar RLS
ALTER TABLE checklist_documentos_template ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de templates para todos" 
  ON checklist_documentos_template FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de templates para todos" 
  ON checklist_documentos_template FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de templates para todos" 
  ON checklist_documentos_template FOR UPDATE USING (true);

-- FASE 4: Trigger de sincronização reversa
CREATE OR REPLACE FUNCTION sync_validacao_from_efetivo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.validacao_admissao_id IS NOT NULL THEN
    UPDATE validacao_admissao
    SET 
      funcao = NEW.funcao,
      cca_codigo = NEW.cca_codigo,
      cca_nome = NEW.cca_nome,
      updated_at = now()
    WHERE id = NEW.validacao_admissao_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_sync_validacao_from_efetivo
  AFTER UPDATE ON colaboradores_efetivo
  FOR EACH ROW
  EXECUTE FUNCTION sync_validacao_from_efetivo();

-- FASE 5: Tabela de documentos enviados
CREATE TABLE documentos_enviados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  validacao_admissao_id uuid REFERENCES validacao_admissao(id) ON DELETE CASCADE,
  tipo_documento text NOT NULL,
  arquivo_nome text NOT NULL,
  arquivo_url text NOT NULL,
  arquivo_tamanho integer,
  arquivo_tipo text,
  data_upload timestamptz DEFAULT now(),
  usuario_upload text,
  status_validacao text DEFAULT 'pendente',
  observacoes text,
  ilegivel boolean DEFAULT false,
  data_regularizacao timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documentos_enviados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de documentos para todos" 
  ON documentos_enviados FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de documentos para todos" 
  ON documentos_enviados FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de documentos para todos" 
  ON documentos_enviados FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de documentos para todos" 
  ON documentos_enviados FOR DELETE USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_checklist_documentos_template_updated_at
  BEFORE UPDATE ON checklist_documentos_template
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentos_enviados_updated_at
  BEFORE UPDATE ON documentos_enviados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();