
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface CCASelectorProps {
  selectedCCAs: number[];
  onChange: (ccaIds: number[]) => void;
}

export const CCASelector = ({ selectedCCAs, onChange }: CCASelectorProps) => {
  const { data: userCCAs, isLoading } = useUserCCAs();

  const handleToggleCCA = (ccaId: number) => {
    if (selectedCCAs.includes(ccaId)) {
      onChange(selectedCCAs.filter(id => id !== ccaId));
    } else {
      onChange([...selectedCCAs, ccaId]);
    }
  };

  const handleSelectAll = () => {
    if (userCCAs) {
      if (selectedCCAs.length === userCCAs.length) {
        onChange([]);
      } else {
        onChange(userCCAs.map(cca => cca.id));
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Carregando CCAs...</div>;
  }

  if (!userCCAs || userCCAs.length === 0) {
    return <div className="text-sm text-gray-500">Nenhum CCA disponível para seu perfil</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all-ccas"
          checked={selectedCCAs.length === userCCAs.length && userCCAs.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all-ccas" className="text-sm font-semibold">
          Selecionar Todos ({userCCAs.length})
        </Label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded p-3 bg-gray-50">
        {userCCAs.map((cca) => (
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
        {selectedCCAs.length} de {userCCAs.length} CCAs selecionados
      </div>
    </div>
  );
};
