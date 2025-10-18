import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { useCCAs } from "@/hooks/useCCAs";
import { useFuncionariosByCCA } from "@/hooks/useFuncionariosByCCA";
import { Button } from "@/components/ui/button";

interface SeletorCCAFuncionariosProps {
  selectedCcaId: number | undefined;
  onCcaChange: (id: number) => void;
  selectedFuncionarioIds: string[];
  onFuncionariosChange: (ids: string[]) => void;
  multiSelect?: boolean;
  required?: boolean;
  label?: string;
}

export const SeletorCCAFuncionarios = ({
  selectedCcaId,
  onCcaChange,
  selectedFuncionarioIds,
  onFuncionariosChange,
  multiSelect = true,
  required = false,
  label = "Seleção de funcionários",
}: SeletorCCAFuncionariosProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ccas = [], isLoading: loadingCCAs } = useCCAs();
  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useFuncionariosByCCA(selectedCcaId);

  const filteredFuncionarios = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.matricula?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFuncionario = (id: string) => {
    if (multiSelect) {
      if (selectedFuncionarioIds.includes(id)) {
        onFuncionariosChange(selectedFuncionarioIds.filter((fid) => fid !== id));
      } else {
        onFuncionariosChange([...selectedFuncionarioIds, id]);
      }
    } else {
      onFuncionariosChange([id]);
    }
  };

  const handleRemoveFuncionario = (id: string) => {
    onFuncionariosChange(selectedFuncionarioIds.filter((fid) => fid !== id));
  };

  const selectedFuncionariosData = funcionarios.filter((f) =>
    selectedFuncionarioIds.includes(f.id)
  );

  const ccaInvalid = required && !selectedCcaId;
  const funcionariosInvalid = required && selectedFuncionarioIds.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          Selecione o CCA e {multiSelect ? "os funcionários" : "o funcionário"} para emissão do documento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção de CCA */}
        <div className="space-y-2">
          <Label>
            Cca
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select
            value={selectedCcaId?.toString()}
            onValueChange={(value) => {
              onCcaChange(parseInt(value));
              onFuncionariosChange([]);
              setSearchTerm("");
            }}
            disabled={loadingCCAs}
          >
            <SelectTrigger className={ccaInvalid ? "border-destructive" : ""}>
              <SelectValue placeholder="Selecione um CCA" />
            </SelectTrigger>
            <SelectContent>
              {ccas.map((cca) => (
                <SelectItem key={cca.id} value={cca.id.toString()}>
                  {cca.codigo} - {cca.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Funcionários Selecionados */}
        {selectedFuncionariosData.length > 0 && (
          <div className="space-y-2">
            <Label>Selecionados ({selectedFuncionariosData.length})</Label>
            <div className="flex flex-wrap gap-2">
              {selectedFuncionariosData.map((func) => (
                <Badge key={func.id} variant="secondary" className="pl-2 pr-1">
                  <span className="mr-1">{func.nome}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveFuncionario(func.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Busca e Lista de Funcionários */}
        {selectedCcaId && (
          <div className="space-y-2">
            <Label>
              {multiSelect ? "Funcionários" : "Funcionário"}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div
              className={`border rounded-md max-h-[300px] overflow-y-auto ${
                funcionariosInvalid ? "border-destructive" : ""
              }`}
            >
              {loadingFuncionarios ? (
                <div className="p-4 text-center text-muted-foreground">Carregando...</div>
              ) : filteredFuncionarios.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum funcionário encontrado
                </div>
              ) : multiSelect ? (
                <div className="p-2 space-y-1">
                  {filteredFuncionarios.map((func) => (
                    <div
                      key={func.id}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => handleToggleFuncionario(func.id)}
                    >
                      <Checkbox
                        checked={selectedFuncionarioIds.includes(func.id)}
                        onCheckedChange={() => handleToggleFuncionario(func.id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={func.foto || undefined} />
                        <AvatarFallback>{func.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{func.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {func.matricula} - {func.funcao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup value={selectedFuncionarioIds[0] || ""}>
                  <div className="p-2 space-y-1">
                    {filteredFuncionarios.map((func) => (
                      <div
                        key={func.id}
                        className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleToggleFuncionario(func.id)}
                      >
                        <RadioGroupItem
                          value={func.id}
                          checked={selectedFuncionarioIds.includes(func.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={func.foto || undefined} />
                          <AvatarFallback>{func.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{func.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {func.matricula} - {func.funcao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
