-- Adicionar foreign keys para as tabelas
ALTER TABLE public.equipamentos_mecanicos 
ADD CONSTRAINT fk_equipamentos_mecanicos_area 
FOREIGN KEY (area_id) REFERENCES public.areas_projeto(id);

ALTER TABLE public.valvulas 
ADD CONSTRAINT fk_valvulas_linha 
FOREIGN KEY (linha_id) REFERENCES public.linhas(id);

ALTER TABLE public.valvulas 
ADD CONSTRAINT fk_valvulas_fluido 
FOREIGN KEY (fluido_id) REFERENCES public.fluidos(id);