import React from 'react';
import { VistoriasTab } from '@/components/alojamento/VistoriasTab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function VistoriasAlojamento() {
  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vistorias de Alojamento</h1>
            <p className="text-muted-foreground">Controle e gerencie vistorias de acomodações</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Selecione CCA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cca001">CCA 001 - Projeto Alpha</SelectItem>
                <SelectItem value="cca002">CCA 002 - Projeto Beta</SelectItem>
                <SelectItem value="cca003">CCA 003 - Projeto Gamma</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              className="w-full sm:w-[200px]"
              placeholder="Data início"
            />
            
            <Input
              type="date"
              className="w-full sm:w-[200px]"
              placeholder="Data fim"
            />
            
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
                <SelectItem value="periodica">Periódica</SelectItem>
                <SelectItem value="corretiva">Corretiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <VistoriasTab />
      </div>
    </div>
  );
}