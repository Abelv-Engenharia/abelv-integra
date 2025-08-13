
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AuthUserStatusSelectProps {
  onChange: (status: string) => void;
}

export const AuthUserStatusSelect = ({ onChange }: AuthUserStatusSelectProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        Filtrar por Status
      </label>
      <Select defaultValue="todos" onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="confirmed">Confirmados</SelectItem>
          <SelectItem value="unconfirmed">Pendentes</SelectItem>
          <SelectItem value="blocked">Bloqueados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
