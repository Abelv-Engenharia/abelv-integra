
export {
  fetchDashboardStats,
  fetchFilteredDashboardStats
} from './desvios/dashboardStatsService';

export {
  fetchDesviosByMonthAndRisk
} from './desvios/desviosByMonthAndRiskService';

export {
  fetchDesviosByType
} from './desvios/desviosByTypeService';

export {
  fetchDesviosByMonth
} from './desvios/desviosByMonthService';

export {
  fetchDesviosByRiskLevel
} from './desvios/desviosByRiskLevelService';

// Re-export types
export type {
  DashboardStats
} from './desvios/types';
