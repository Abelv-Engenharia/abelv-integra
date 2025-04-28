
-- Enable Row Level Security on all tables
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinamentos_normativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE execucao_treinamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE desvios ENABLE ROW LEVEL SECURITY;
ALTER TABLE desvios_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE desvios_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocorrencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocorrencias_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocorrencias_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE registro_hht ENABLE ROW LEVEL SECURITY;
ALTER TABLE opcoes ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read public data
CREATE POLICY "Authenticated users can read all public data" 
  ON opcoes FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policies for usuarios table
CREATE POLICY "Users can read their own profile" 
  ON usuarios FOR SELECT 
  TO authenticated 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can read all user profiles" 
  ON usuarios FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM usuarios u
    JOIN perfis p ON u.perfil_id = p.id
    WHERE u.id::text = auth.uid()::text AND p.permissoes->>'admin_usuarios' = 'true'
  ));

-- Similar policies for other tables, giving appropriate access based on profile permissions
CREATE POLICY "Admin users can manage treinamentos" 
  ON treinamentos FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM usuarios u
    JOIN perfis p ON u.perfil_id = p.id
    WHERE u.id::text = auth.uid()::text AND p.permissoes->>'treinamentos' = 'true'
  ));

CREATE POLICY "Admin users can manage funcionarios" 
  ON funcionarios FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM usuarios u
    JOIN perfis p ON u.perfil_id = p.id
    WHERE u.id::text = auth.uid()::text AND p.permissoes->>'admin_funcionarios' = 'true'
  ));

-- Read-only policies for regular users
CREATE POLICY "All authenticated users can read treinamentos" 
  ON treinamentos FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "All authenticated users can read funcionarios" 
  ON funcionarios FOR SELECT 
  TO authenticated 
  USING (true);

-- More specific policies can be added as needed based on application requirements
