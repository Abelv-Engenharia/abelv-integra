
// Re-export all services
export { fetchInspecoesByStatus } from './inspecoesByStatusService';
export { fetchInspecoesByTipo } from './inspecoesByTipoService';
export { fetchInspecoesByResponsavel } from './inspecoesByResponsavelService';
export { fetchInspecoesSummary, fetchInspectionsSummary } from './inspecoesSummaryService';
export { fetchRecentInspections } from './recentInspectionsService';
export { fetchInspecoesStatsByMonth, fetchInspecoesStats, fetchInspecoesByMonth } from './inspecoesStatsService';
export { fetchDesviosByInspectionType } from './desviosInspectionService';

// Re-export types
export type * from './types';
