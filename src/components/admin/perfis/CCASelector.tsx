
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { InlineLoader } from "@/components/common/PageLoader";
import { AlertCircle } from "lucide-react";

interface CCASelectorProps {
  selectedCCAs: number[];
  onSelectionChange: (ccaIds: number[]) => void;
}

export const CCASelector = ({ selectedCCAs, onSelectionChange }: CCASelectorProps) => {
  const { data: userCCAs, isLoading } = useUserCCAs();

  // Ordenar CCAs do menor para o maior
  const sortedCCAs = userCCAs ? [...userCCAs].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  ) : [];

  const handleToggleCCA = (ccaId: number) => {
    if (selectedCCAs.includes(ccaId)) {
      onSelectionChange(selectedCCAs.filter(id => id !== ccaId));
    } else {
      onSelectionChange([...selectedCCAs, ccaId]);
    }
  };

  const handleSelectAll = () => {
    if (sortedCCAs) {
      if (selectedCCAs.length === sortedCCAs.length) {
        onSelectionChange([]);
      } else {
        onSelectionChange(sortedCCAs.map(cca => cca.id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="section-spacing">
        <LoadingSkeleton variant="form" lines={2} />
        <div className="mt-4">
          <InlineLoader text="Carregando CCAs..." size="sm" />
        </div>
      </div>
    );
  }

  if (!sortedCCAs || sortedCCAs.length === 0) {
    return (
      <div className="section-spacing">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-4 border rounded-lg bg-muted/20">
          <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <p className="text-sm sm:text-base font-medium">Nenhum CCA disponível</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Não há CCAs disponíveis para seu perfil no momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="select-all-ccas"
          checked={selectedCCAs.length === sortedCCAs.length && sortedCCAs.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all-ccas" className="text-xs sm:text-sm font-semibold">
          Selecionar Todos ({sortedCCAs.length})
        </Label>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 sm:max-h-48 lg:max-h-64 overflow-y-auto border rounded p-2 sm:p-3 bg-gray-50">
        {sortedCCAs.map((cca) => (
          <div key={cca.id} className="flex items-center space-x-2 min-w-0">
            <Checkbox
              id={`cca-${cca.id}`}
              checked={selectedCCAs.includes(cca.id)}
              onCheckedChange={() => handleToggleCCA(cca.id)}
              className="flex-shrink-0"
            />
            <Label 
              htmlFor={`cca-${cca.id}`} 
              className="text-xs break-words min-w-0 cursor-pointer hover:text-primary transition-colors"
              title={`${cca.codigo} - ${cca.nome}`}
            >
              <span className="block sm:hidden">{cca.codigo}</span>
              <span className="hidden sm:block">{cca.codigo} - {cca.nome}</span>
            </Label>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-center sm:text-left">
        {selectedCCAs.length} de {sortedCCAs.length} CCAs selecionados
      </div>
    </div>
  );
};
