
// Re-export all functions from hora-seguranca services
export { fetchInspecoesSummary } from './inspecoesSummaryService';
export { fetchInspecoesByTipo } from './inspecoesByTipoService';
export { fetchInspecoesStats } from './inspecoesStatsService';
export { fetchInspecoesByResponsavel } from './inspecoesByResponsavelService';
export { fetchDesviosByInspectionType } from './desviosInspectionService';
export { fetchHHTByMonth, fetchHHTByCCA, createHorasTrabalhadas } from './horasTrabalhadasService';
export { fetchInspecoesByStatus } from './inspecoesByStatusService';
export { fetchInspecoesByMonth } from './inspecoesByMonthService';
export { fetchRecentInspections } from './recentInspectionsService';

// Export types
export * from './types';
