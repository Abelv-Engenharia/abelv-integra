import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PermissoesActionsProps {
  permissions: {
    pode_editar: boolean;
    pode_excluir: boolean;
    pode_aprovar: boolean;
    pode_exportar: boolean;
    pode_visualizar_todos_ccas: boolean;
  };
  onPermissionChange: (permission: string, value: boolean) => void;
}

export const PermissoesActions = ({ permissions, onPermissionChange }: PermissoesActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Permissões de Ações
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3 p-4 border rounded-lg">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pode_editar"
                checked={permissions.pode_editar}
                onCheckedChange={(checked) => onPermissionChange('pode_editar', checked as boolean)}
              />
              <Label htmlFor="pode_editar" className="text-sm">
                Pode Editar registros
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pode_excluir"
                checked={permissions.pode_excluir}
                onCheckedChange={(checked) => onPermissionChange('pode_excluir', checked as boolean)}
              />
              <Label htmlFor="pode_excluir" className="text-sm">
                Pode Excluir registros
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pode_aprovar"
                checked={permissions.pode_aprovar}
                onCheckedChange={(checked) => onPermissionChange('pode_aprovar', checked as boolean)}
              />
              <Label htmlFor="pode_aprovar" className="text-sm">
                Pode Aprovar/Autorizar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pode_exportar"
                checked={permissions.pode_exportar}
                onCheckedChange={(checked) => onPermissionChange('pode_exportar', checked as boolean)}
              />
              <Label htmlFor="pode_exportar" className="text-sm">
                Pode Exportar dados
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pode_visualizar_todos_ccas"
                checked={permissions.pode_visualizar_todos_ccas}
                onCheckedChange={(checked) => onPermissionChange('pode_visualizar_todos_ccas', checked as boolean)}
              />
              <Label htmlFor="pode_visualizar_todos_ccas" className="text-sm">
                Pode visualizar todos os CCAs (Admin)
              </Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};