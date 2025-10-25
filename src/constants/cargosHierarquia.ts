export enum CargoHierarquia {
  TECNICO = 1,
  ANALISTA = 2,
  LIDER = 3,
  SUPERVISOR = 4,
  COORDENADOR = 5,
  GERENTE = 6,
  SUPERINTENDENTE = 7,
  DIRETOR = 8
}

export const HIERARQUIA_CARGOS: Record<string, number> = {
  // Técnicos
  "Técnico de Segurança do Trabalho": CargoHierarquia.TECNICO,
  "Técnica de Segurança do Trabalho": CargoHierarquia.TECNICO,
  
  // Analistas
  "Analista de Departamento Pessoal": CargoHierarquia.ANALISTA,
  
  // Líderes
  "Líder de Segurança do Trabalho": CargoHierarquia.LIDER,
  
  // Supervisores
  "Supervisora administrativa": CargoHierarquia.SUPERVISOR,
  
  // Coordenadores
  "Coordenador de SMS": CargoHierarquia.COORDENADOR,
  "Engenheiro de Segurança do Trabalho": CargoHierarquia.COORDENADOR,
  
  // Gerentes
  "Gerente": CargoHierarquia.GERENTE,
  
  // Superintendentes
  "Superintendente": CargoHierarquia.SUPERINTENDENTE,
  
  // Diretores
  "Diretor": CargoHierarquia.DIRETOR,
};

export function getNivelHierarquico(cargo: string): number {
  return HIERARQUIA_CARGOS[cargo] || 0;
}

export function getCargosSuperiores(cargoAtual: string): number[] {
  const nivelAtual = getNivelHierarquico(cargoAtual);
  return Object.values(CargoHierarquia)
    .filter(nivel => typeof nivel === 'number' && nivel > nivelAtual) as number[];
}
