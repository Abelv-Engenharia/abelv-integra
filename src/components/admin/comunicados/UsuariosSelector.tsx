import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Profile {
  id: string;
  nome: string;
  email: string;
}

interface UsuariosSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const UsuariosSelector: React.FC<UsuariosSelectorProps> = ({ selectedIds, onChange }) => {
  const [busca, setBusca] = useState("");

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .order('nome');

      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  const usuariosFiltrados = usuarios.filter(usuario => {
    if (!busca) return true;
    const searchLower = busca.toLowerCase();
    return (
      usuario.nome?.toLowerCase().includes(searchLower) ||
      usuario.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleToggle = (userId: string) => {
    if (selectedIds.includes(userId)) {
      onChange(selectedIds.filter(id => id !== userId));
    } else {
      onChange([...selectedIds, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === usuariosFiltrados.length) {
      onChange([]);
    } else {
      onChange(usuariosFiltrados.map(u => u.id));
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando usuários...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={selectedIds.length === usuariosFiltrados.length && usuariosFiltrados.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all" className="font-normal cursor-pointer">
          Selecionar todos ({usuariosFiltrados.length})
        </Label>
      </div>

      <ScrollArea className="h-[300px] border rounded-lg p-4">
        <div className="space-y-3">
          {usuariosFiltrados.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              Nenhum usuário encontrado
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} className="flex items-start space-x-3">
                <Checkbox
                  id={usuario.id}
                  checked={selectedIds.includes(usuario.id)}
                  onCheckedChange={() => handleToggle(usuario.id)}
                />
                <Label
                  htmlFor={usuario.id}
                  className="flex-1 font-normal cursor-pointer"
                >
                  <div className="font-medium">{usuario.nome || 'Sem nome'}</div>
                  <div className="text-sm text-muted-foreground">{usuario.email}</div>
                </Label>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="text-sm text-muted-foreground">
        {selectedIds.length} usuário(s) selecionado(s)
      </div>
    </div>
  );
};
