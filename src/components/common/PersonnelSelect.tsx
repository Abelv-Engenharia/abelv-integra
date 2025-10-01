import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { UserX } from "lucide-react";

interface Person {
  id: string;
  nome: string;
  funcao?: string;
  matricula?: string;
  ativo?: boolean;
}

interface PersonnelSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  people: Person[];
  disabled?: boolean;
  required?: boolean;
  showInactive?: boolean;
}

export const PersonnelSelect = ({ 
  name, 
  label, 
  placeholder = "Selecione", 
  people,
  disabled = false,
  required = false,
  showInactive = true
}: PersonnelSelectProps) => {
  const { control } = useFormContext();

  // Separar pessoas ativas e inativas
  const activePeople = people.filter(p => p.ativo !== false);
  const inactivePeople = showInactive ? people.filter(p => p.ativo === false) : [];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {activePeople.length > 0 && activePeople.map((person) => (
                <SelectItem key={person.id} value={person.id}>
                  <div className="flex items-center gap-2">
                    <span>{person.nome}</span>
                    {person.funcao && (
                      <span className="text-xs text-muted-foreground">- {person.funcao}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
              
              {inactivePeople.length > 0 && (
                <>
                  {activePeople.length > 0 && (
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1">
                      Inativos
                    </div>
                  )}
                  {inactivePeople.map((person) => (
                    <SelectItem 
                      key={person.id} 
                      value={person.id}
                      className="text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <UserX className="h-3 w-3" />
                        <span>{person.nome}</span>
                        {person.funcao && (
                          <span className="text-xs">- {person.funcao}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
              
              {people.length === 0 && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Nenhuma opção disponível
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
