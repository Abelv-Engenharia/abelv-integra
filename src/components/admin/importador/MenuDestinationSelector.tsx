import { useState } from 'react';
import { MenuDestination } from '@/types/githubImport';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FolderGit2, Menu, Boxes, Shield, Users, Package, Wrench, Briefcase, List } from 'lucide-react';

interface MenuDestinationSelectorProps {
  value: MenuDestination;
  onChange: (destination: MenuDestination) => void;
}

const existingSections = [
  { value: 'admin' as const, label: 'Administração', icon: 'List' },
  { value: 'gestao-sms' as const, label: 'Gestão SMS', icon: 'Shield' },
  { value: 'tarefas' as const, label: 'Tarefas', icon: 'Menu' },
  { value: 'seguranca' as const, label: 'Segurança', icon: 'Shield' },
  { value: 'apoio-geral' as const, label: 'Apoio Geral', icon: 'Boxes' },
  { value: 'suprimentos' as const, label: 'Suprimentos', icon: 'Package' },
  { value: 'engenharia-matricial' as const, label: 'Engenharia Matricial', icon: 'Wrench' },
  { value: 'comercial' as const, label: 'Comercial', icon: 'Briefcase' },
];

const iconOptions = [
  { value: 'FolderGit2', label: '📦 FolderGit2', component: FolderGit2 },
  { value: 'Menu', label: '📋 Menu', component: Menu },
  { value: 'Boxes', label: '📦 Boxes', component: Boxes },
  { value: 'Shield', label: '🛡️ Shield', component: Shield },
  { value: 'Users', label: '👥 Users', component: Users },
  { value: 'Package', label: '📦 Package', component: Package },
  { value: 'Wrench', label: '🔧 Wrench', component: Wrench },
  { value: 'Briefcase', label: '💼 Briefcase', component: Briefcase },
];

export function MenuDestinationSelector({ value, onChange }: MenuDestinationSelectorProps) {
  const handleTypeChange = (type: 'existing' | 'new') => {
    if (type === 'existing') {
      onChange({
        type: 'existing',
        existingSection: 'admin',
      });
    } else {
      onChange({
        type: 'new',
        newSectionName: '',
        newSectionIcon: 'FolderGit2',
      });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Onde adicionar as páginas importadas?</Label>
        
        <RadioGroup
          value={value.type}
          onValueChange={(v) => handleTypeChange(v as 'existing' | 'new')}
          className="space-y-3"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="existing" className="cursor-pointer">
                Adicionar em menu existente
              </Label>
              {value.type === 'existing' && (
                <Select
                  value={value.existingSection}
                  onValueChange={(section) => onChange({ ...value, existingSection: section as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingSections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="new" id="new" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="new" className="cursor-pointer">
                Criar novo menu expansível
              </Label>
              {value.type === 'new' && (
                <div className="space-y-3 pl-6">
                  <div>
                    <Label htmlFor="menu-name" className="text-sm">Nome do menu</Label>
                    <Input
                      id="menu-name"
                      value={value.newSectionName || ''}
                      onChange={(e) => onChange({ ...value, newSectionName: e.target.value })}
                      placeholder="Ex: GitHub Pages"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="menu-icon" className="text-sm">Ícone</Label>
                    <Select
                      value={value.newSectionIcon || 'FolderGit2'}
                      onValueChange={(icon) => onChange({ ...value, newSectionIcon: icon })}
                    >
                      <SelectTrigger id="menu-icon" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
}
