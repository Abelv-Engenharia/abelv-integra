
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
  const [permissoes, setPermissoes] = useState<Permissoes>(initialData.permissoes);
  const [ccasPermitidas, setCcasPermitidas] = useState<number[]>(initialData.ccas_permitidas || []);

  // Obter menus definidos globalmente
  const menusSidebar = getAllMenusSidebar();

  // Agrupamento dos módulos principais para exibir como checkboxes
  const modulosPrincipais: { key: keyof Permissoes; label: string }[] = [
    { key: 'desvios', label: 'Desvios' },
    { key: 'treinamentos', label: 'Treinamentos' },
    { key: 'ocorrencias', label: 'Ocorrências' },
    { key: 'tarefas', label: 'Tarefas' },
    { key: 'relatorios', label: 'Relatórios' },
    { key: 'hora_seguranca', label: 'Hora de Segurança' },
    { key: 'medidas_disciplinares', label: 'Medidas Disciplinares' },
    { key: 'idsms_dashboard', label: 'IDSMS Dashboard' },
    { key: 'idsms_formularios', label: 'IDSMS Formulários' },
  ];

  const administrativos: { key: keyof Permissoes; label: string }[] = [
    { key: 'admin_usuarios', label: 'Admin: Usuários' },
    { key: 'admin_perfis', label: 'Admin: Perfis' },
    { key: 'admin_funcionarios', label: 'Admin: Funcionários' },
    { key: 'admin_hht', label: 'Admin: HHT' },
    { key: 'admin_templates', label: 'Admin: Templates' },
    { key: 'admin_empresas', label: 'Admin: Empresas' },
    { key: 'admin_supervisores', label: 'Admin: Supervisores' },
    { key: 'admin_engenheiros', label: 'Admin: Engenheiros' },
    { key: 'admin_ccas', label: 'Admin: CCAs' }
  ];

  const permissoesEspecificas: { key: keyof Permissoes; label: string }[] = [
    { key: 'pode_editar_desvios', label: 'Pode Editar Desvios' },
    { key: 'pode_excluir_desvios', label: 'Pode Excluir Desvios' },
    { key: 'pode_editar_ocorrencias', label: 'Pode Editar Ocorrências' },
    { key: 'pode_excluir_ocorrencias', label: 'Pode Excluir Ocorrências' },
    { key: 'pode_editar_treinamentos', label: 'Pode Editar Treinamentos' },
    { key: 'pode_excluir_treinamentos', label: 'Pode Excluir Treinamentos' },
    { key: 'pode_editar_tarefas', label: 'Pode Editar Tarefas' },
    { key: 'pode_excluir_tarefas', label: 'Pode Excluir Tarefas' },
    { key: 'pode_aprovar_tarefas', label: 'Pode Aprovar Tarefas' },
    { key: 'pode_visualizar_relatorios_completos', label: 'Relatórios Completos' },
    { key: 'pode_exportar_dados', label: 'Pode Exportar Dados' },
  ];

  // Handler para checkboxes comuns
  const handleChangePermissao = (key: keyof Permissoes, value: boolean) => {
    setPermissoes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handler para seleção dos menus da sidebar
  const handleToggleSidebarMenu = (menu: string) => {
    setPermissoes(prev => {
      const atual = prev.menus_sidebar ? prev.menus_sidebar : [];
      if (atual.includes(menu)) {
        return { ...prev, menus_sidebar: atual.filter((m) => m !== menu) }
      } else {
        return { ...prev, menus_sidebar: [...atual, menu] }
      }
    });
  };

  const handleSave = () => {
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
      
      {/* Módulos Principais */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-blue-700">Módulos do Sistema</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {modulosPrincipais.map((modulo) => (
            <PermissaoCheckbox
              key={modulo.key}
              id={modulo.key}
              label={modulo.label}
              checked={!!permissoes[modulo.key]}
              onChange={(checked) => handleChangePermissao(modulo.key, checked)}
            />
          ))}
        </div>
      </div>

      {/* Administração */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-green-700">Administração</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {administrativos.map((adm) => (
            <PermissaoCheckbox
              key={adm.key}
              id={adm.key}
              label={adm.label}
              checked={!!permissoes[adm.key]}
              onChange={(checked) => handleChangePermissao(adm.key, checked)}
            />
          ))}
        </div>
      </div>

      {/* Permissões Específicas */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-purple-700">Permissões Específicas</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {permissoesEspecificas.map((per) => (
            <PermissaoCheckbox
              key={per.key}
              id={per.key}
              label={per.label}
              checked={!!permissoes[per.key]}
              onChange={(checked) => handleChangePermissao(per.key, checked)}
            />
          ))}
        </div>
      </div>

      {/* Menus da Sidebar */}
      <div className="section-spacing pt-4 border-t">
        <h4 className="text-sm sm:text-base font-semibold text-orange-700">Menus e Itens da Sidebar</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Selecione os menus e submenus da sidebar que este perfil pode visualizar/acessar
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-h-32 sm:max-h-48 overflow-y-auto border p-2 rounded bg-orange-50">
          {menusSidebar.map((menu) => (
            <SidebarMenuCheckbox
              key={menu}
              id={menu}
              label={menu}
              checked={!!(permissoes.menus_sidebar && permissoes.menus_sidebar.includes(menu))}
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

// Componente para checkbox de permissão comum
interface PermissaoCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PermissaoCheckbox = ({ id, label, checked, onChange }: PermissaoCheckboxProps) => (
  <div className="flex items-center space-x-2">
    <Checkbox 
      id={id} 
      checked={checked} 
      onCheckedChange={(checked) => onChange(checked === true)}
    />
    <Label htmlFor={id} className="text-xs sm:text-sm break-words min-w-0">{label}</Label>
  </div>
);

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
