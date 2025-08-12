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

  // Organizar menus por categoria
  const menuCategories = {
    "Dashboard": ["dashboard"],
    "Gestão SMS": [
      "desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade",
      "treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha",
      "hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada", "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento",
      "inspecao_sms_dashboard", "inspecao_sms_cadastro", "inspecao_sms_consulta",
      "medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta",
      "ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta"
    ],
    "IDSMS": ["idsms_dashboard", "idsms_relatorios"],
    "ADM Matricial": [
      "adm_dashboard", "adm_configuracoes", "adm_usuarios", "adm_perfis", "adm_empresas", "adm_ccas",
      "adm_engenheiros", "adm_supervisores", "adm_funcionarios", "adm_hht", "adm_metas_indicadores",
      "adm_modelos_inspecao", "adm_templates", "adm_logo", "adm_manutencao", "adm_importacao_funcionarios", "adm_importacao_execucao_treinamentos"
    ],
    "Orçamentos": [
      "orcamentos_dashboard", "orcamentos_projetos", "orcamentos_custos", "orcamentos_analises", "orcamentos_aprovacoes", "orcamentos_historico"
    ],
    "Produção": [
      "producao_dashboard", "producao_planejamento", "producao_ordens_producao", "producao_controle_qualidade", "producao_manutencao", "producao_recursos", "producao_indicadores"
    ],
    "Qualidade": [
      "qualidade_dashboard", "qualidade_controle", "qualidade_auditorias", "qualidade_indicadores", "qualidade_equipe", "qualidade_configuracoes"
    ],
    "Suprimentos": [
      "suprimentos_dashboard", "suprimentos_fornecedores", "suprimentos_materiais", "suprimentos_compras", "suprimentos_estoque", "suprimentos_pedidos", "suprimentos_contratos"
    ],
    "Tarefas": ["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"],
    "Relatórios": ["relatorios_dashboard", "relatorios_idsms"],
    "Configurações": [
      "admin_usuarios", "admin_perfis", "admin_empresas", "admin_ccas", "admin_engenheiros", "admin_supervisores", "admin_encarregados",
      "admin_funcionarios", "admin_registro_hht", "admin_metas_indicadores", "admin_modelos_inspecao", "admin_templates",
      "admin_logo_sistema", "admin_upload_tutoriais", "admin_configuracao_emails", "admin_exportacao_dados",
      "admin_importacao_funcionarios", "admin_importacao_execucao_treinamentos"
    ],
    "Conta": ["conta_perfil", "conta_configuracoes"]
  };

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

  // Handler para selecionar/desselecionar todos os menus de uma categoria
  const handleToggleCategory = (categoryMenus: string[]) => {
    const allSelected = categoryMenus.every(menu => menusSelecionados.includes(menu));
    
    if (allSelected) {
      // Desselecionar todos da categoria
      setMenusSelecionados(prev => prev.filter(menu => !categoryMenus.includes(menu)));
    } else {
      // Selecionar todos da categoria
      setMenusSelecionados(prev => {
        const newMenus = [...prev];
        categoryMenus.forEach(menu => {
          if (!newMenus.includes(menu)) {
            newMenus.push(menu);
          }
        });
        return newMenus;
      });
    }
  };

  const handleSave = () => {
    const permissoes: Permissoes = {
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
        <div className="max-h-96 overflow-y-auto border p-4 rounded bg-orange-50">
          {Object.entries(menuCategories).map(([category, categoryMenus]) => {
            const allSelected = categoryMenus.every(menu => menusSelecionados.includes(menu));
            const someSelected = categoryMenus.some(menu => menusSelecionados.includes(menu));
            
            return (
              <div key={category} className="mb-4">
                <div className="flex items-center space-x-2 mb-2 p-2 bg-orange-100 rounded">
                  <Checkbox
                    id={`category-${category}`}
                    checked={allSelected}
                    onCheckedChange={() => handleToggleCategory(categoryMenus)}
                  />
                  <Label htmlFor={`category-${category}`} className="font-semibold text-sm">
                    {category}
                  </Label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                  {categoryMenus.map((menu) => (
                    <SidebarMenuCheckbox
                      key={menu}
                      id={menu}
                      label={menu.replace(/_/g, ' ')}
                      checked={menusSelecionados.includes(menu)}
                      onChange={() => handleToggleSidebarMenu(menu)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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
    <Label htmlFor={id + "-sidebar"} className="text-xs break-words min-w-0 capitalize">{label}</Label>
  </div>
);
