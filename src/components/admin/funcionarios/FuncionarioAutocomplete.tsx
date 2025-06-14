
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Funcionario } from "@/types/funcionarios";

interface FuncionarioAutocompleteProps {
  funcionarios: Funcionario[];
  onSelect: (funcionario: Funcionario) => void;
  className?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
}

/**
 * Componente de autocomplete que permite busca livre (sem seleção obrigatória).
 * Exibe sugestões mas não obriga selecionar - o valor digitado já filtra a tabela.
 */
export const FuncionarioAutocomplete: React.FC<FuncionarioAutocompleteProps> = ({
  funcionarios,
  onSelect,
  className = "",
  search = "",
  onSearchChange,
}) => {
  const [internalSearch, setInternalSearch] = useState(search);
  const [suggestions, setSuggestions] = useState<Funcionario[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantém sincronizado valor controlado
  useEffect(() => {
    setInternalSearch(search);
  }, [search]);

  useEffect(() => {
    if (internalSearch.trim().length > 0) {
      const filter = internalSearch.toLowerCase();
      setSuggestions(
        funcionarios.filter((f) =>
          f.nome.toLowerCase().includes(filter)
        )
      );
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [internalSearch, funcionarios]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    onSearchChange && onSearchChange(e.target.value);
  };

  // Se clicar em sugestão, atualiza estado e aciona onSearchChange
  const handleSelect = (funcionario: Funcionario) => {
    setInternalSearch(funcionario.nome);
    onSearchChange && onSearchChange(funcionario.nome);
    onSelect(funcionario);
    setOpen(false);
  };

  // fechar lista ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        placeholder="Buscar funcionário pelo nome..."
        value={internalSearch}
        onChange={handleInputChange}
        onFocus={() => internalSearch.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-2 bg-white border rounded max-h-60 overflow-auto shadow-lg">
          {suggestions.map((funcionario) => (
            <li
              key={funcionario.id}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => handleSelect(funcionario)}
            >
              {funcionario.nome}
              <span className="ml-2 text-xs text-muted-foreground">
                ({funcionario.funcao})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
