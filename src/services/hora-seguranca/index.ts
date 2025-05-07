
// Export all services from this central file to maintain backward compatibility

export { fetchInspecoesSummary, fetchInspectionsSummary } from './inspecoesSummaryService';
export { fetchRecentInspections } from './recentInspectionsService';
export { fetchInspecoesStats, fetchInspecoesByMonth } from './inspecoesStatsService';
export { fetchInspecoesByTipo } from './inspecoesByTipoService';
export { fetchInspecoesByResponsavel } from './inspecoesByResponsavelService';
export { fetchInspecoesByStatus } from './inspecoesByStatusService';
export { fetchDesviosByInspectionType } from './desviosInspectionService';

// Export all types
export * from './types';
