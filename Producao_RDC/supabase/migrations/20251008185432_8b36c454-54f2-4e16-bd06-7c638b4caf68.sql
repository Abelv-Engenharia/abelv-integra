-- Adicionar colunas area_id e disciplina à tabela infraestrutura_eletrica
ALTER TABLE infraestrutura_eletrica 
ADD COLUMN area_id uuid REFERENCES areas_projeto(id),
ADD COLUMN disciplina text;