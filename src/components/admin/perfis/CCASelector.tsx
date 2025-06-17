
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCCAs } from "@/hooks/useCCAs";

interface CCASelectorProps {
  selectedCCAs: number[];
  onSelectionChange: (ccaIds: number[]) => void;
}

export const CCASelector = ({ selectedCCAs, onSelectionChange }: CCASelectorProps) => {
  const { data: ccas, isLoading } = useCCAs();

  const handleToggleCCA = (ccaId: number) => {
    if (selectedCCAs.includes(ccaId)) {
      onSelectionChange(selectedCCAs.filter(id => id !== ccaId));
    } else {
      onSelectionChange([...selectedCCAs, ccaId]);
    }
  };

  const handleSelectAll = () => {
    if (ccas) {
      if (selectedCCAs.length === ccas.length) {
        onSelectionChange([]);
      } else {
        onSelectionChange(ccas.map(cca => cca.id));
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Carregando CCAs...</div>;
  }

  if (!ccas || ccas.length === 0) {
    return <div className="text-sm text-gray-500">Nenhum CCA disponível</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all-ccas"
          checked={selectedCCAs.length === ccas.length && ccas.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all-ccas" className="text-sm font-semibold">
          Selecionar Todos ({ccas.length})
        </Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded p-3 bg-gray-50">
        {ccas.map((cca) => (
          <div key={cca.id} className="flex items-center space-x-2">
            <Checkbox
              id={`cca-${cca.id}`}
              checked={selectedCCAs.includes(cca.id)}
              onCheckedChange={() => handleToggleCCA(cca.id)}
            />
            <Label htmlFor={`cca-${cca.id}`} className="text-xs">
              {cca.codigo} - {cca.nome}
            </Label>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500">
        {selectedCCAs.length} de {ccas.length} CCAs selecionados
      </div>
    </div>
  );
};
