
export {
  fetchDashboardStats,
  fetchFilteredDashboardStats
} from './ocorrencias/dashboardStatsService';

export {
  fetchOcorrenciasStats
} from './ocorrencias/ocorrenciasStatsService';

export {
  fetchOcorrenciasByTipo
} from './ocorrencias/ocorrenciasByTipoService';

export {
  fetchOcorrenciasByRisco
} from './ocorrencias/ocorrenciasByRiscoService';

export {
  fetchOcorrenciasByEmpresa
} from './ocorrencias/ocorrenciasByEmpresaService';

export {
  fetchOcorrenciasByMonth,
  fetchOcorrenciasTimeline
} from './ocorrencias/ocorrenciasTimelineService';

export {
  fetchParteCorpoData
} from './ocorrencias/parteCorpoService';

export {
  fetchLatestOcorrencias
} from './ocorrencias/latestOcorrenciasService';

// Re-export types
export type {
  DashboardStats,
  OcorrenciasStats,
  OcorrenciasByTipo,
  OcorrenciasByRisco,
  OcorrenciasByEmpresa,
  OcorrenciasTimeline,
  ParteCorpoData
} from './ocorrencias/types';
