
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Perfil, Permissoes } from "@/types/users";

interface PerfilFormProps {
  initialData: {
    nome: string;
    descricao: string;
    permissoes: Permissoes;
  };
  onCancel: () => void;
  onSave: (nome: string, descricao: string, permissoes: Permissoes) => void;
  loading: boolean;
}

export const PerfilForm = ({ initialData, onCancel, onSave, loading }: PerfilFormProps) => {
  const [nome, setNome] = useState<string>(initialData.nome);
  const [descricao, setDescricao] = useState<string>(initialData.descricao);
  const [permissoes, setPermissoes] = useState<Permissoes>(initialData.permissoes);

  const handleChangePermissao = (key: keyof Permissoes, value: boolean) => {
    setPermissoes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(nome, descricao, permissoes);
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input 
            id="nome" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Nome do perfil" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input 
            id="descricao" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
            placeholder="Descrição do perfil" 
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Permissões do Sistema</h3>
        
        {/* Módulos Principais */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-blue-600">Módulos Principais</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <PermissaoCheckbox
                id="desvios"
                label="Desvios"
                checked={permissoes.desvios}
                onChange={(checked) => handleChangePermissao('desvios', checked)}
              />
              
              <PermissaoCheckbox
                id="treinamentos"
                label="Treinamentos"
                checked={permissoes.treinamentos}
                onChange={(checked) => handleChangePermissao('treinamentos', checked)}
              />
              
              <PermissaoCheckbox
                id="ocorrencias"
                label="Ocorrências"
                checked={permissoes.ocorrencias}
                onChange={(checked) => handleChangePermissao('ocorrencias', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <PermissaoCheckbox
                id="tarefas"
                label="Tarefas"
                checked={permissoes.tarefas}
                onChange={(checked) => handleChangePermissao('tarefas', checked)}
              />
              
              <PermissaoCheckbox
                id="relatorios"
                label="Relatórios"
                checked={permissoes.relatorios}
                onChange={(checked) => handleChangePermissao('relatorios', checked)}
              />
              
              <PermissaoCheckbox
                id="hora_seguranca"
                label="Hora de Segurança"
                checked={permissoes.hora_seguranca}
                onChange={(checked) => handleChangePermissao('hora_seguranca', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <PermissaoCheckbox
                id="medidas_disciplinares"
                label="Medidas Disciplinares"
                checked={permissoes.medidas_disciplinares}
                onChange={(checked) => handleChangePermissao('medidas_disciplinares', checked)}
              />
              
              <PermissaoCheckbox
                id="idsms_dashboard"
                label="IDSMS Dashboard"
                checked={permissoes.idsms_dashboard}
                onChange={(checked) => handleChangePermissao('idsms_dashboard', checked)}
              />
              
              <PermissaoCheckbox
                id="idsms_formularios"
                label="IDSMS Formulários"
                checked={permissoes.idsms_formularios}
                onChange={(checked) => handleChangePermissao('idsms_formularios', checked)}
              />
            </div>
          </div>
        </div>

        {/* Administração */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-green-600">Administração</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <PermissaoCheckbox
                id="admin_usuarios"
                label="Admin: Usuários"
                checked={permissoes.admin_usuarios}
                onChange={(checked) => handleChangePermissao('admin_usuarios', checked)}
              />
              
              <PermissaoCheckbox
                id="admin_perfis"
                label="Admin: Perfis"
                checked={permissoes.admin_perfis}
                onChange={(checked) => handleChangePermissao('admin_perfis', checked)}
              />
              
              <PermissaoCheckbox
                id="admin_funcionarios"
                label="Admin: Funcionários"
                checked={permissoes.admin_funcionarios}
                onChange={(checked) => handleChangePermissao('admin_funcionarios', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <PermissaoCheckbox
                id="admin_hht"
                label="Admin: HHT"
                checked={permissoes.admin_hht}
                onChange={(checked) => handleChangePermissao('admin_hht', checked)}
              />
              
              <PermissaoCheckbox
                id="admin_templates"
                label="Admin: Templates"
                checked={permissoes.admin_templates}
                onChange={(checked) => handleChangePermissao('admin_templates', checked)}
              />
              
              <PermissaoCheckbox
                id="admin_empresas"
                label="Admin: Empresas"
                checked={permissoes.admin_empresas}
                onChange={(checked) => handleChangePermissao('admin_empresas', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <PermissaoCheckbox
                id="admin_supervisores"
                label="Admin: Supervisores"
                checked={permissoes.admin_supervisores}
                onChange={(checked) => handleChangePermissao('admin_supervisores', checked)}
              />
              
              <PermissaoCheckbox
                id="admin_engenheiros"
                label="Admin: Engenheiros"
                checked={permissoes.admin_engenheiros}
                onChange={(checked) => handleChangePermissao('admin_engenheiros', checked)}
              />
              
              <PermissaoCheckbox
                id="admin_ccas"
                label="Admin: CCAs"
                checked={permissoes.admin_ccas}
                onChange={(checked) => handleChangePermissao('admin_ccas', checked)}
              />
            </div>
          </div>
        </div>

        {/* Permissões de Edição e Visualização */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-purple-600">Permissões de Edição</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <PermissaoCheckbox
                id="pode_editar_desvios"
                label="Pode Editar Desvios"
                checked={permissoes.pode_editar_desvios}
                onChange={(checked) => handleChangePermissao('pode_editar_desvios', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_excluir_desvios"
                label="Pode Excluir Desvios"
                checked={permissoes.pode_excluir_desvios}
                onChange={(checked) => handleChangePermissao('pode_excluir_desvios', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_editar_ocorrencias"
                label="Pode Editar Ocorrências"
                checked={permissoes.pode_editar_ocorrencias}
                onChange={(checked) => handleChangePermissao('pode_editar_ocorrencias', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_excluir_ocorrencias"
                label="Pode Excluir Ocorrências"
                checked={permissoes.pode_excluir_ocorrencias}
                onChange={(checked) => handleChangePermissao('pode_excluir_ocorrencias', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <PermissaoCheckbox
                id="pode_editar_treinamentos"
                label="Pode Editar Treinamentos"
                checked={permissoes.pode_editar_treinamentos}
                onChange={(checked) => handleChangePermissao('pode_editar_treinamentos', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_excluir_treinamentos"
                label="Pode Excluir Treinamentos"
                checked={permissoes.pode_excluir_treinamentos}
                onChange={(checked) => handleChangePermissao('pode_excluir_treinamentos', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_editar_tarefas"
                label="Pode Editar Tarefas"
                checked={permissoes.pode_editar_tarefas}
                onChange={(checked) => handleChangePermissao('pode_editar_tarefas', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_excluir_tarefas"
                label="Pode Excluir Tarefas"
                checked={permissoes.pode_excluir_tarefas}
                onChange={(checked) => handleChangePermissao('pode_excluir_tarefas', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <PermissaoCheckbox
                id="pode_aprovar_tarefas"
                label="Pode Aprovar Tarefas"
                checked={permissoes.pode_aprovar_tarefas}
                onChange={(checked) => handleChangePermissao('pode_aprovar_tarefas', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_visualizar_relatorios_completos"
                label="Relatórios Completos"
                checked={permissoes.pode_visualizar_relatorios_completos}
                onChange={(checked) => handleChangePermissao('pode_visualizar_relatorios_completos', checked)}
              />
              
              <PermissaoCheckbox
                id="pode_exportar_dados"
                label="Pode Exportar Dados"
                checked={permissoes.pode_exportar_dados}
                onChange={(checked) => handleChangePermissao('pode_exportar_dados', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

// Componente para cada checkbox de permissão
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
    <Label htmlFor={id} className="text-sm">{label}</Label>
  </div>
);
