
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StatusTarefaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusTarefaSelector = ({ value, onChange }: StatusTarefaSelectorProps) => {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange}
      className="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
        <RadioGroupItem value="programada" id="programada" />
        <Label htmlFor="programada" className="flex flex-1 cursor-pointer">Programada</Label>
      </div>
      
      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
        <RadioGroupItem value="pendente" id="pendente" />
        <Label htmlFor="pendente" className="flex flex-1 cursor-pointer">Pendente</Label>
      </div>
      
      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
        <RadioGroupItem value="em-andamento" id="em-andamento" />
        <Label htmlFor="em-andamento" className="flex flex-1 cursor-pointer">Em andamento</Label>
      </div>
      
      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors">
        <RadioGroupItem value="concluida" id="concluida" />
        <Label htmlFor="concluida" className="flex flex-1 cursor-pointer">Concluída</Label>
      </div>
    </RadioGroup>
  );
};

export default StatusTarefaSelector;
