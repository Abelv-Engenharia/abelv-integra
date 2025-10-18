import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DependencyDiff } from '@/types/githubImport';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DependencyAnalyzerProps {
  diff: DependencyDiff;
  selectedDeps: Set<string>;
  onSelectionChange: (deps: Set<string>) => void;
}

export function DependencyAnalyzer({ diff, selectedDeps, onSelectionChange }: DependencyAnalyzerProps) {
  const handleToggle = (pkg: string, checked: boolean) => {
    const newSelected = new Set(selectedDeps);
    if (checked) {
      newSelected.add(pkg);
    } else {
      newSelected.delete(pkg);
    }
    onSelectionChange(newSelected);
  };

  const renderDependencyRow = (pkg: string, version: string, type: 'missing' | 'outdated') => (
    <div key={pkg} className="flex items-center justify-between py-2 px-3 hover:bg-accent rounded-sm">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={selectedDeps.has(pkg)}
          onCheckedChange={(checked) => handleToggle(pkg, checked as boolean)}
        />
        <Package className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{pkg}</span>
      </div>
      <div className="flex items-center gap-2">
        {type === 'missing' && (
          <Badge variant="destructive">Ausente</Badge>
        )}
        {type === 'outdated' && (
          <Badge variant="secondary">Desatualizada</Badge>
        )}
        <span className="text-sm text-muted-foreground">{version}</span>
      </div>
    </div>
  );

  const hasMissing = Object.keys(diff.missing).length > 0;
  const hasOutdated = Object.keys(diff.outdated).length > 0;

  return (
    <div className="space-y-4">
      {hasMissing && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold">Dependências ausentes</h3>
            <Badge variant="outline">{Object.keys(diff.missing).length}</Badge>
          </div>
          <div className="border rounded-lg divide-y">
            {Object.entries(diff.missing).map(([pkg, version]) =>
              renderDependencyRow(pkg, version, 'missing')
            )}
          </div>
        </div>
      )}

      {hasOutdated && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="font-semibold">Dependências desatualizadas</h3>
            <Badge variant="outline">{Object.keys(diff.outdated).length}</Badge>
          </div>
          <div className="border rounded-lg divide-y">
            {Object.entries(diff.outdated).map(([pkg, versions]) =>
              renderDependencyRow(pkg, versions.available, 'outdated')
            )}
          </div>
        </div>
      )}

      {!hasMissing && !hasOutdated && (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
          <p>Todas as dependências estão instaladas</p>
        </div>
      )}

      {selectedDeps.size > 0 && (
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm font-medium mb-2">Comando de instalação:</p>
          <code className="text-xs bg-background p-2 rounded block overflow-x-auto">
            npm install {Array.from(selectedDeps).join(' ')}
          </code>
        </div>
      )}
    </div>
  );
}
