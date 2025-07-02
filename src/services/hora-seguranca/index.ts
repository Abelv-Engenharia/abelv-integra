
export { fetchInspecoesSummary } from './inspecoesSummaryService';
export { fetchRecentInspections } from './recentInspectionsService';
export { fetchInspecoesByStatus } from './inspecoesByStatusService';
export { fetchInspecoesByMonth } from './inspecoesByMonthService';
export { fetchInspecoesByResponsavel } from './inspecoesByResponsavelService';
export { fetchDesviosByResponsavel } from './desviosByResponsavelService';
export { fetchDesviosByInspectionType } from './desviosInspectionService';
export { fetchInspecoesByCCA } from './inspecoesByCCAService';
export { fetchHorasTrabalhadasByMonth } from './horasTrabalhadasService';

export type {
  InspecoesSummary,
  InspecaoRecentData,
  HorasTrabalhadasData,
  HorasTrabalhadasByMonth,
  InspecoesByStatus,
  InspecoesByMonth,
  InspecoesByResponsavel,
  DesviosByResponsavel,
  DesviosByInspectionType,
  InspecoesByCCA
} from './types';
