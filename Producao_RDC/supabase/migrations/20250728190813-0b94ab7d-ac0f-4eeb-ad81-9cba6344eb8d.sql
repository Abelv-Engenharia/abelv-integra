-- Inserir os fluidos específicos solicitados
INSERT INTO public.fluidos (nome, descricao) VALUES 
('ÁGUA GELADA', 'Água refrigerada para sistemas de climatização'),
('CONDENSADO', 'Condensado de vapor para reaproveitamento'),
('VAPOR', 'Vapor de água para aquecimento e processos'),
('ÁGUA POTÁVEL', 'Água tratada para consumo humano'),
('AR COMPRIMIDO', 'Ar pressurizado para sistemas pneumáticos'),
('ESGOTO INDUSTRIAL', 'Efluentes industriais para tratamento'),
('INCÊNDIO', 'Água para sistema de combate a incêndios'),
('DIESEL', 'Combustível diesel para motores e geradores')
ON CONFLICT (nome) DO NOTHING;