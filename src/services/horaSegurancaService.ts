
// Re-export all from the hora-seguranca module for backward compatibility
export {
  fetchInspecoesByTipo,
  fetchInspecoesByResponsavel,
  fetchInspecoesSummary,
  fetchInspecoesStats,
  fetchInspecoesByStatus,
  fetchInspecoesByMonth,
  fetchRecentInspections,
  fetchDesviosByInspectionType,
  fetchHHTByMonth,
  fetchHHTByCCA,
  createHorasTrabalhadas
} from './hora-seguranca';

export type {
  InspecoesSummary,
  InspecoesByTipo,
  InspecoesByStatus,
  InspecoesByResponsavel,
  InspecoesStats,
  RecentInspection
} from './hora-seguranca/types';
