
// This file is deprecated and exists only for backward compatibility
// Import and re-export all functions from the new modular structure

import {
  fetchInspecoesSummary,
  fetchInspectionsSummary,
  fetchRecentInspections,
  fetchInspecoesStats,
  fetchInspecoesByMonth,
  fetchInspecoesByTipo,
  fetchInspecoesByResponsavel,
  fetchInspecoesByStatus,
  fetchDesviosByInspectionType,
  // Types
  Inspecao,
  InspecoesByStatus,
  InspecoesStatsByMonth,
  InspecoesByTipo,
  InspecoesByResponsavel,
} from './hora-seguranca';

// Re-export everything
export {
  fetchInspecoesSummary,
  fetchInspectionsSummary,
  fetchRecentInspections,
  fetchInspecoesStats,
  fetchInspecoesByMonth,
  fetchInspecoesByTipo,
  fetchInspecoesByResponsavel,
  fetchInspecoesByStatus,
  fetchDesviosByInspectionType,
  // Types
  Inspecao,
  InspecoesByStatus,
  InspecoesStatsByMonth,
  InspecoesByTipo,
  InspecoesByResponsavel,
};
