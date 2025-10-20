#!/bin/bash

# Script para corrigir imports da migração GP -> gestao-pessoas

# Corrigir imports de types
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/candidato|from '@/types/gestao-pessoas/candidato|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/ferias|from '@/types/gestao-pessoas/ferias|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/fuel|from '@/types/gestao-pessoas/fuel|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/nf|from '@/types/gestao-pessoas/nf|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/passivos|from '@/types/gestao-pessoas/passivos|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/contrato|from '@/types/gestao-pessoas/contrato|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/dashboard-prestadores|from '@/types/gestao-pessoas/dashboard-prestadores|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/relatorio-prestadores|from '@/types/gestao-pessoas/relatorio-prestadores|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/vaga|from '@/types/gestao-pessoas/vaga|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/solicitacao|from '@/types/gestao-pessoas/solicitacao|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/travel|from '@/types/gestao-pessoas/travel|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/route|from '@/types/gestao-pessoas/route|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/multa|from '@/types/gestao-pessoas/multa|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/relatorio|from '@/types/gestao-pessoas/relatorio|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/data/gestao-pessoas src/contexts/gestao-pessoas src/config/gestao-pessoas src/services/gestao-pessoas src/utils/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/types/sla|from '@/types/gestao-pessoas/sla|g" {} \;

# Corrigir imports de services
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/ChecklistDataService|from '@/services/gestao-pessoas/ChecklistDataService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/RouteCalculationService|from '@/services/gestao-pessoas/RouteCalculationService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/RelatorioExportService|from '@/services/gestao-pessoas/RelatorioExportService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/DashboardPrestadoresService|from '@/services/gestao-pessoas/DashboardPrestadoresService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/RelatorioPrestadoresDataService|from '@/services/gestao-pessoas/RelatorioPrestadoresDataService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/RelatorioPrestadoresExportService|from '@/services/gestao-pessoas/RelatorioPrestadoresExportService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/RelatorioSolicitacoesService|from '@/services/gestao-pessoas/RelatorioSolicitacoesService|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/services/DynamicReportExportService|from '@/services/gestao-pessoas/DynamicReportExportService|g" {} \;

# Corrigir imports de utils
find src/components/gestao-pessoas src/pages/gestao-pessoas src/contexts/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/utils/passivosCalculos|from '@/utils/gestao-pessoas/passivosCalculos|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas src/contexts/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/utils/solicitacaoStatus|from '@/utils/gestao-pessoas/solicitacaoStatus|g" {} \;

# Corrigir imports de data
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockCandidatos|from '@/data/gestao-pessoas/mockCandidatos|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockContratos|from '@/data/gestao-pessoas/mockContratos|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockNotasFiscais|from '@/data/gestao-pessoas/mockNotasFiscais|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockSolicitacoes|from '@/data/gestao-pessoas/mockSolicitacoes|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockTravelDashboard|from '@/data/gestao-pessoas/mockTravelDashboard|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockVagas|from '@/data/gestao-pessoas/mockVagas|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/data/mockVeiculosData|from '@/data/gestao-pessoas/mockVeiculosData|g" {} \;

# Corrigir imports de contexts
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/context/SolicitacoesContext|from '@/contexts/gestao-pessoas/SolicitacoesContext|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/contexts/SolicitacoesContext|from '@/contexts/gestao-pessoas/SolicitacoesContext|g" {} \;

# Corrigir imports de config
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/config/colunas-prestadores|from '@/config/gestao-pessoas/colunas-prestadores|g" {} \;

# Corrigir imports cross-component
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/veiculos/|from '@/components/gestao-pessoas/veiculos/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/nf/|from '@/components/gestao-pessoas/nf/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/ferias/|from '@/components/gestao-pessoas/ferias/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/passivos/|from '@/components/gestao-pessoas/passivos/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/prestadores/|from '@/components/gestao-pessoas/prestadores/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/solicitacao/|from '@/components/gestao-pessoas/solicitacao/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/recrutamento/|from '@/components/gestao-pessoas/recrutamento/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/travel/|from '@/components/gestao-pessoas/travel/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/fuel/|from '@/components/gestao-pessoas/fuel/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/banco-talentos/|from '@/components/gestao-pessoas/banco-talentos/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/demonstrativo/|from '@/components/gestao-pessoas/demonstrativo/|g" {} \;
find src/components/gestao-pessoas src/pages/gestao-pessoas -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s|from ['\"]@/components/alojamento/|from '@/components/gestao-pessoas/alojamento/|g" {} \;

echo "Import fixes completed!"
