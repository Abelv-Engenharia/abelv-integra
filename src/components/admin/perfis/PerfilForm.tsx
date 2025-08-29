
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Perfil, Permissoes } from "@/types/users";
import { getMenusHierarchy, MenuItem, MenuSection } from "@/services/perfisService";
import { CCASelector } from "./CCASelector";
import { PermissoesActions } from "./PermissoesActions";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [permissoesAcoes, setPermissoesAcoes] = useState({
    pode_editar: initialData.permissoes.pode_editar ?? true,
    pode_excluir: initialData.permissoes.pode_excluir ?? true,
    pode_aprovar: initialData.permissoes.pode_aprovar ?? false,
    pode_exportar: initialData.permissoes.pode_exportar ?? true,
    pode_visualizar_todos_ccas: initialData.permissoes.pode_visualizar_todos_ccas ?? false
  });

  // Obter estrutura hierárquica de menus atualizada
  const menusHierarchy = getMenusHierarchy();

  // Handler para expandir/colapsar seções
  const handleToggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  // Handler para seleção completa de menu principal (com todos os submenus)
  const handleToggleMainMenu = (item: MenuItem) => {
    if (item.submenus) {
      const allSubmenus = item.submenus.map(sub => sub.key);
      const allSelected = allSubmenus.every(key => menusSelecionados.includes(key));
      
      if (allSelected) {
        // Remover todos os submenus
        setMenusSelecionados(prev => prev.filter(menu => !allSubmenus.includes(menu)));
      } else {
        // Adicionar todos os submenus
        setMenusSelecionados(prev => {
          const newMenus = [...prev];
          allSubmenus.forEach(key => {
            if (!newMenus.includes(key)) {
              newMenus.push(key);
            }
          });
          return newMenus;
        });
      }
    } else {
      // Menu simples sem submenus
      handleToggleSidebarMenu(item.key);
    }
  };

  // Handler para seleção individual de submenu
  const handleToggleSidebarMenu = (menu: string) => {
    setMenusSelecionados(prev => {
      if (prev.includes(menu)) {
        return prev.filter((m) => m !== menu);
      } else {
        return [...prev, menu];
      }
    });
  };

  // Verificar se um menu principal está totalmente selecionado
  const isMainMenuSelected = (item: MenuItem) => {
    if (item.submenus) {
      return item.submenus.every(sub => menusSelecionados.includes(sub.key));
    }
    return menusSelecionados.includes(item.key);
  };

  // Verificar se um menu principal está parcialmente selecionado
  const isMainMenuPartiallySelected = (item: MenuItem) => {
    if (item.submenus) {
      const selectedCount = item.submenus.filter(sub => menusSelecionados.includes(sub.key)).length;
      return selectedCount > 0 && selectedCount < item.submenus.length;
    }
    return false;
  };

  const handlePermissionChange = (permission: string, value: boolean) => {
    setPermissoesAcoes(prev => ({
      ...prev,
      [permission]: value
    }));
  };

  const handleSave = () => {
    // Determinar permissões administrativas baseadas nos menus selecionados
    const permissoes: Permissoes = {
      menus_sidebar: menusSelecionados,
      
      // Permissões administrativas baseadas nos menus selecionados
      admin_usuarios: menusSelecionados.includes('adm_usuarios'),
      admin_perfis: menusSelecionados.includes('adm_perfis'),
      admin_funcionarios: menusSelecionados.includes('adm_funcionarios'),
      admin_empresas: menusSelecionados.includes('adm_empresas'),
      admin_ccas: menusSelecionados.includes('adm_ccas'),
      admin_engenheiros: menusSelecionados.includes('adm_engenheiros'),
      admin_supervisores: menusSelecionados.includes('adm_supervisores'),
      admin_hht: menusSelecionados.includes('adm_hht'),
      admin_templates: menusSelecionados.includes('adm_templates'),
      admin_metas_indicadores: menusSelecionados.includes('adm_metas_indicadores'),
      admin_modelos_inspecao: menusSelecionados.includes('adm_modelos_inspecao'),
      admin_checklists: menusSelecionados.includes('adm_checklists'),
      admin_importacao_funcionarios: menusSelecionados.includes('adm_importacao_funcionarios'),
      admin_logo: menusSelecionados.includes('adm_logo'),
      admin_configuracoes: menusSelecionados.includes('adm_configuracoes'),
      
      // Permissões de ações configuradas pelo usuário
      ...permissoesAcoes
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

      {/* Menus da Sidebar - Estrutura Hierárquica */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-orange-700">Menus e Permissões do Sistema</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Selecione os módulos do sistema que este perfil pode acessar. Você pode selecionar o módulo completo ou apenas submenus específicos.
        </p>
        
        <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-red-50">
          {menusHierarchy.map((section) => (
            <div key={section.key} className="border rounded-lg bg-white/80 backdrop-blur-sm">
              <Collapsible
                open={expandedSections.includes(section.key)}
                onOpenChange={() => handleToggleSection(section.key)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    {expandedSections.includes(section.key) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium text-sm">{section.label}</span>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-3 pb-3">
                  <div className="space-y-2 pl-6">
                    {section.items.map((item) => (
                      <div key={item.key} className="space-y-2">
                         {/* Menu Principal */}
                         <div className="flex items-center gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100">
                           <MenuCheckbox
                             id={`main-${item.key}`}
                             checked={isMainMenuSelected(item)}
                             indeterminate={isMainMenuPartiallySelected(item)}
                             onCheckedChange={() => handleToggleMainMenu(item)}
                           />
                           <Label 
                             htmlFor={`main-${item.key}`} 
                             className="text-sm font-medium cursor-pointer flex-1"
                           >
                             {item.label}
                             {item.submenus && (
                               <span className="text-xs text-muted-foreground ml-1">
                                 (Módulo completo)
                               </span>
                             )}
                           </Label>
                         </div>
                        
                        {/* Submenus */}
                        {item.submenus && (
                          <div className="pl-6 space-y-1">
                            {item.submenus.map((submenu) => (
                              <div key={submenu.key} className="flex items-center gap-2 p-1">
                                <Checkbox
                                  id={`sub-${submenu.key}`}
                                  checked={menusSelecionados.includes(submenu.key)}
                                  onCheckedChange={() => handleToggleSidebarMenu(submenu.key)}
                                />
                                <Label 
                                  htmlFor={`sub-${submenu.key}`} 
                                  className="text-xs cursor-pointer text-muted-foreground"
                                >
                                  {submenu.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>

      {/* Permissões de Ações */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-blue-700">Permissões de Ações</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          Configure as ações que este perfil pode realizar nos dados do sistema
        </p>
        <PermissoesActions 
          permissions={permissoesAcoes}
          onPermissionChange={handlePermissionChange}
        />
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

interface MenuCheckboxProps {
  id: string;
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange: () => void;
}

const MenuCheckbox = ({ id, checked, indeterminate, onCheckedChange }: MenuCheckboxProps) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      const input = checkboxRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (input) {
        input.indeterminate = indeterminate;
      }
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={checkboxRef}
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
  );
};
