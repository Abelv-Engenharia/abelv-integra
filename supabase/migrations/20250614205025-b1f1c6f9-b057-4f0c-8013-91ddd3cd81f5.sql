
ALTER TABLE funcionarios
ADD COLUMN data_admissao date;

-- Opcional: preencher data_admissao com NULL nos existentes

-- (Se desejar garantir não nulo no futuro, pode-se ajustar depois)
