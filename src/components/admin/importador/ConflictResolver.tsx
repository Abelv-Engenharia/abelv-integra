import { ImportConflict } from '@/types/githubImport';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';

interface ConflictResolverProps {
  conflicts: ImportConflict[];
  onResolutionChange: (conflicts: ImportConflict[]) => void;
}

export function ConflictResolver({ conflicts, onResolutionChange }: ConflictResolverProps) {
  const handleResolutionChange = (index: number, resolution: ImportConflict['resolution']) => {
    const updated = [...conflicts];
    updated[index].resolution = resolution;
    onResolutionChange(updated);
  };

  const handleNewNameChange = (index: number, newName: string) => {
    const updated = [...conflicts];
    updated[index].newName = newName;
    onResolutionChange(updated);
  };

  if (conflicts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum conflito detectado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <h3 className="font-semibold">Conflitos detectados: {conflicts.length}</h3>
      </div>

      {conflicts.map((conflict, index) => (
        <div key={conflict.path} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-sm">{conflict.path}</p>
              <p className="text-xs text-muted-foreground">Arquivo já existe no projeto</p>
            </div>
          </div>

          <RadioGroup
            value={conflict.resolution}
            onValueChange={(value) => handleResolutionChange(index, value as ImportConflict['resolution'])}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="skip" id={`skip-${index}`} />
              <Label htmlFor={`skip-${index}`} className="text-sm cursor-pointer">
                Ignorar (não importar)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overwrite" id={`overwrite-${index}`} />
              <Label htmlFor={`overwrite-${index}`} className="text-sm cursor-pointer">
                Sobrescrever arquivo existente
              </Label>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rename" id={`rename-${index}`} />
                <Label htmlFor={`rename-${index}`} className="text-sm cursor-pointer">
                  Renomear para:
                </Label>
              </div>
              {conflict.resolution === 'rename' && (
                <Input
                  value={conflict.newName || ''}
                  onChange={(e) => handleNewNameChange(index, e.target.value)}
                  placeholder="novo-nome.tsx"
                  className="ml-6"
                />
              )}
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
