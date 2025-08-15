
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Perfil, Permissoes } from "@/types/users";
import { getMenusHierarchy, MenuItem, MenuSection } from "@/services/perfisService";
import { CCASelector } from "./CCASelector";
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

  // Obter estrutura hierárquica de menus
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
