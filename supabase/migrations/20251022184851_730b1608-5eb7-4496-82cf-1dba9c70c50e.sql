-- Adicionar CNAE 7490199 (Outras atividades profissionais, científicas e técnicas)
INSERT INTO cnae_grau_risco (codigo_cnae, descricao, grau_risco, secao, divisao)
VALUES ('7490199', 'Outras atividades profissionais, científicas e técnicas não especificadas anteriormente', 1, 'M', '74')
ON CONFLICT (codigo_cnae) DO NOTHING;