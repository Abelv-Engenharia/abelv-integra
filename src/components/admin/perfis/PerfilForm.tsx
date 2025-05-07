
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
    <div className="space-y-4">
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
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Permissões</h3>
        
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
            
            <PermissaoCheckbox
              id="tarefas"
              label="Tarefas"
              checked={permissoes.tarefas}
              onChange={(checked) => handleChangePermissao('tarefas', checked)}
            />
          </div>
          
          <div className="space-y-2">
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
            
            <PermissaoCheckbox
              id="medidas_disciplinares"
              label="Medidas Disciplinares"
              checked={permissoes.medidas_disciplinares}
              onChange={(checked) => handleChangePermissao('medidas_disciplinares', checked)}
            />
          </div>
          
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
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
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
    <Label htmlFor={id}>{label}</Label>
  </div>
);
