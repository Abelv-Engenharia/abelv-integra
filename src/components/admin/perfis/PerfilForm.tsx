
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Perfil, Permissoes } from "@/types/users";
import { getAllMenusSidebar } from "@/services/perfisService";
import { CCASelector } from "./CCASelector";

interface PerfilFormProps {
  initialData: {
    nome: string;
    descricao: string;
    permissoes: Permissoes;
    ccas_permitidas: number[];
  };
  onCancel: () => void;
  onSave: (nome: string, descricao: string, permissoes: Permissoes, ccas_permitidas: number[]) => void;
  loading: boolean;
}

export const PerfilForm = ({ initialData, onCancel, onSave, loading }: PerfilFormProps) => {
  const [nome, setNome] = useState<string>(initialData.nome);
  const [descricao, setDescricao] = useState<string>(initialData.descricao);
  const [ccasPermitidas, setCcasPermitidas] = useState<number[]>(initialData.ccas_permitidas || []);
  const [menusSelecionados, setMenusSelecionados] = useState<string[]>(
    initialData.permissoes.menus_sidebar || []
  );

  // Obter menus definidos globalmente
  const menusSidebar = getAllMenusSidebar();

  // Handler para seleção dos menus da sidebar
  const handleToggleSidebarMenu = (menu: string) => {
    setMenusSelecionados(prev => {
      if (prev.includes(menu)) {
        return prev.filter((m) => m !== menu);
      } else {
        return [...prev, menu];
      }
    });
  };

  const handleSave = () => {
    // Criar objeto de permissões simplificado baseado apenas nos menus selecionados
    const permissoes: Permissoes = {
      // Definir valores padrão para compatibilidade
      desvios: false,
      treinamentos: false,
      ocorrencias: false,
      tarefas: false,
      relatorios: false,
      hora_seguranca: false,
      medidas_disciplinares: false,
      admin_usuarios: false,
      admin_perfis: false,
      admin_funcionarios: false,
      admin_hht: false,
      admin_templates: false,
      admin_empresas: false,
      admin_supervisores: false,
      admin_engenheiros: false,
      admin_ccas: false,
      idsms_dashboard: false,
      idsms_formularios: false,
      pode_editar_desvios: false,
      pode_excluir_desvios: false,
      pode_editar_ocorrencias: false,
      pode_excluir_ocorrencias: false,
      pode_editar_treinamentos: false,
      pode_excluir_treinamentos: false,
      pode_editar_tarefas: false,
      pode_excluir_tarefas: false,
      pode_aprovar_tarefas: false,
      pode_visualizar_relatorios_completos: false,
      pode_exportar_dados: false,
      menus_sidebar: menusSelecionados
    };

    onSave(nome, descricao, permissoes, ccasPermitidas);
  };

  return (
    <div className="section-spacing max-h-[70vh] overflow-y-auto">
      <div className="form-grid mb-4 sm:mb-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm sm:text-base">Nome</Label>
          <Input 
            id="nome" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Nome do perfil"
            className="text-sm sm:text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descricao" className="text-sm sm:text-base">Descrição</Label>
          <Input 
            id="descricao" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
            placeholder="Descrição do perfil"
            className="text-sm sm:text-base"
          />
        </div>
      </div>

      {/* CCAs Permitidas */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-red-700">CCAs Permitidas</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Selecione quais CCAs este perfil pode visualizar e editar
        </p>
        <CCASelector
          selectedCCAs={ccasPermitidas}
          onSelectionChange={setCcasPermitidas}
        />
      </div>

      {/* Menus da Sidebar */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-orange-700">Menus e Itens da Sidebar</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Selecione os menus e submenus da sidebar que este perfil pode visualizar/acessar
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto border p-2 rounded bg-orange-50">
          {menusSidebar.map((menu) => (
            <SidebarMenuCheckbox
              key={menu}
              id={menu}
              label={menu}
              checked={menusSelecionados.includes(menu)}
              onChange={() => handleToggleSidebarMenu(menu)}
            />
          ))}
        </div>
      </div>

      <div className="button-group-end pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancelar</Button>
        <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

interface SidebarMenuCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

const SidebarMenuCheckbox = ({ id, label, checked, onChange }: SidebarMenuCheckboxProps) => (
  <div className="flex items-center space-x-2 min-w-0">
    <Checkbox 
      id={id + "-sidebar"} 
      checked={checked}
      onCheckedChange={onChange}
    />
    <Label htmlFor={id + "-sidebar"} className="text-xs break-words min-w-0">{label}</Label>
  </div>
);
