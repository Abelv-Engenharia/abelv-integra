
// Export all services from this central file to maintain backward compatibility

export { fetchInspecoesSummary, fetchInspectionsSummary } from './hora-seguranca/inspecoesSummaryService';
export { fetchRecentInspections } from './hora-seguranca/recentInspectionsService';
export { fetchInspecoesStats, fetchInspecoesByMonth } from './hora-seguranca/inspecoesStatsService';
export { fetchInspecoesByTipo } from './hora-seguranca/inspecoesByTipoService';
export { fetchInspecoesByResponsavel } from './hora-seguranca/inspecoesByResponsavelService';
export { fetchInspecoesByStatus } from './hora-seguranca/inspecoesByStatusService';
export { fetchDesviosByInspectionType } from './hora-seguranca/desviosInspectionService';

// Export all types
export type { Inspecao } from './hora-seguranca/types';
export type { InspecoesByStatus } from './hora-seguranca/types';
export type { InspecoesStatsByMonth } from './hora-seguranca/types';
export type { InspecoesByTipo } from './hora-seguranca/types';
export type { InspecoesByResponsavel } from './hora-seguranca/types';
