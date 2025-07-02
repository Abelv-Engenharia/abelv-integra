
export { fetchInspecoesSummary } from './inspecoesSummaryService';
export { fetchRecentInspections } from './recentInspectionsService';
export { fetchInspecoesByStatus } from './inspecoesByStatusService';
export { fetchInspecoesByMonth } from './inspecoesByMonthService';
export { fetchInspecoesByResponsavel } from './inspecoesByResponsavelService';
export { fetchDesviosByResponsavel } from './desviosByResponsavelService';
export { fetchDesviosByInspectionType } from './desviosInspectionService';
export { fetchInspecoesByCCA } from './inspecoesByCCAService';
export { 
  fetchHorasTrabalhadasByMonth, 
  fetchHHTByMonth, 
  fetchHHTByCCA, 
  createHorasTrabalhadas 
} from './horasTrabalhadasService';
export { fetchInspecoesByTipo } from './inspecoesByTipoService';
export { fetchInspecoesStats } from './inspecoesStatsService';

export type {
  InspecoesSummary,
  InspecaoRecentData,
  RecentInspection,
  HorasTrabalhadasData,
  HorasTrabalhadasByMonth,
  InspecoesByStatus,
  InspecoesByTipo,
  InspecoesStats,
  InspecoesByMonth,
  InspecoesByResponsavel,
  DesviosByResponsavel,
  DesviosByInspectionType,
  InspecoesByCCA
} from './types';
