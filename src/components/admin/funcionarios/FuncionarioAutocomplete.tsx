
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Funcionario } from "@/types/funcionarios";

interface FuncionarioAutocompleteProps {
  funcionarios: Funcionario[];
  onSelect: (funcionario: Funcionario) => void;
  className?: string;
}

export const FuncionarioAutocomplete: React.FC<FuncionarioAutocompleteProps> = ({
  funcionarios,
  onSelect,
  className = "",
}) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Funcionario[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.trim().length > 0) {
      const filter = search.toLowerCase();
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
  }, [search, funcionarios]);

  const handleSelect = (funcionario: Funcionario) => {
    setSearch(funcionario.nome);
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => search.length > 0 && setOpen(true)}
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
