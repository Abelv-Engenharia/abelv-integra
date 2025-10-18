import { useLocation, Navigate } from 'react-router-dom';
import { ImportSummary as ImportSummaryType } from '@/types/githubImport';
import { ImportSummary } from '@/components/admin/importador/ImportSummary';

export default function ImportadorGitHubResumo() {
  const location = useLocation();
  const summary = location.state?.summary as ImportSummaryType | undefined;

  // Se não há dados de resumo, redireciona para o importador
  if (!summary) {
    return <Navigate to="/admin/importador-github" replace />;
  }

  return <ImportSummary summary={summary} />;
}
