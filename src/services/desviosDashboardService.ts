
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

export {
  fetchDesviosByDiscipline
} from './desvios/desviosByDisciplineService';

export {
  fetchDesviosByEvent
} from './desvios/desviosByEventService';

export {
  fetchDesviosByCompany
} from './desvios/desviosByCompanyService';

export {
  fetchDesviosByClassification
} from './desvios/desviosByClassificationService';

// Re-export types
export type {
  DashboardStats
} from './desvios/types';
