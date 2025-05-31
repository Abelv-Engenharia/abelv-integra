
// Re-export functions from the new modular structure
export { fetchDashboardStats } from './api/basicStatsService';
export { fetchFilteredDashboardStats } from './api/filteredStatsService';

// Re-export types
export type { DashboardStats, FilterParams } from './types/dashboardTypes';
