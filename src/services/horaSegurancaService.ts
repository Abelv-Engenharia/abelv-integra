
// Re-export all from the hora-seguranca module for backward compatibility
export {
  fetchInspecoesByStatus,
  fetchInspecoesByTipo,
  fetchInspecoesByResponsavel,
  fetchInspecoesSummary,
  fetchInspectionsSummary,
  fetchRecentInspections,
  fetchInspecoesStatsByMonth,
  fetchInspecoesStats,
  fetchInspecoesByMonth,
  fetchDesviosByInspectionType
} from './hora-seguranca';

export type {
  InspecoesSummary,
  InspecoesByTipo,
  InspecoesByStatus,
  InspecoesByResponsavel,
  InspecoesStats,
  RecentInspection
} from './hora-seguranca/types';
