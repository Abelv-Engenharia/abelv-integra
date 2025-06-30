import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CCASelector } from "./CCASelector";
import { Permissoes } from "@/types/users";
import { PerfilPasswordFields } from "./PerfilPasswordFields";

interface PerfilFormProps {
  initialData: {
    nome: string;
    descricao: string;
    permissoes: Permissoes;
    ccas_permitidas: number[];
  };
  onCancel: () => void;
  onSave: (nome: string, descricao: string, permissoes: Permissoes, ccas_permitidas: number[], password?: string) => void;
  loading: boolean;
}

export const PerfilForm = ({ initialData, onCancel, onSave, loading }: PerfilFormProps) => {
  const [nome, setNome] = useState(initialData.nome);
  const [descricao, setDescricao] = useState(initialData.descricao);
  const [permissoes, setPermissoes] = useState<Permissoes>(initialData.permissoes);
  const [ccasSelecionadas, setCcasSelecionadas] = useState<number[]>(initialData.ccas_permitidas);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isCreating = !initialData.nome;

  const validatePasswords = () => {
    let valid = true;
    setPasswordError("");
    setConfirmPasswordError("");

    if (isCreating && !password) {
      setPasswordError("Senha é obrigatória para novos perfis");
      valid = false;
    }

    if (password && password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      valid = false;
    }

    return valid;
  };

  const handlePermissaoChange = (key: keyof Permissoes, value: boolean) => {
    setPermissoes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMenuSidebarChange = (menu: string, checked: boolean) => {
    const currentMenus = permissoes.menus_sidebar || [];
    if (checked) {
      if (!currentMenus.includes(menu)) {
        setPermissoes(prev => ({
          ...prev,
          menus_sidebar: [...currentMenus, menu]
        }));
      }
    } else {
      setPermissoes(prev => ({
        ...prev,
        menus_sidebar: currentMenus.filter(m => m !== menu)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    onSave(nome, descricao, permissoes, ccasSelecionadas, password || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Perfil</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do perfil"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição para o perfil"
            className="min-h-[40px]"
          />
        </div>
      </div>

      <PerfilPasswordFields
        isEditing={isCreating}
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
        onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
      />

      <Tabs defaultValue="permissoes" className="w-full">
        <TabsList>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="ccas">CCAs Permitidas</TabsTrigger>
        </TabsList>

        <TabsContent value="permissoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissões do Perfil</CardTitle>
              <CardDescription>Defina as permissões para este perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                  checked={permissoes.desvios || false}
                  onCheckedChange={(checked) => handlePermissaoChange("desvios", !!checked)}
                  id="desvios"
                >
                  Acesso a Desvios
                </Checkbox>
                <Checkbox
                  checked={permissoes.treinamentos || false}
                  onCheckedChange={(checked) => handlePermissaoChange("treinamentos", !!checked)}
                  id="treinamentos"
                >
                  Acesso a Treinamentos
                </Checkbox>
                <Checkbox
                  checked={permissoes.ocorrencias || false}
                  onCheckedChange={(checked) => handlePermissaoChange("ocorrencias", !!checked)}
                  id="ocorrencias"
                >
                  Acesso a Ocorrências
                </Checkbox>
                <Checkbox
                  checked={permissoes.tarefas || false}
                  onCheckedChange={(checked) => handlePermissaoChange("tarefas", !!checked)}
                  id="tarefas"
                >
                  Acesso a Tarefas
                </Checkbox>
                <Checkbox
                  checked={permissoes.relatorios || false}
                  onCheckedChange={(checked) => handlePermissaoChange("relatorios", !!checked)}
                  id="relatorios"
                >
                  Acesso a Relatórios
                </Checkbox>
                <Checkbox
                  checked={permissoes.hora_seguranca || false}
                  onCheckedChange={(checked) => handlePermissaoChange("hora_seguranca", !!checked)}
                  id="hora_seguranca"
                >
                  Acesso a Hora Segurança
                </Checkbox>
                <Checkbox
                  checked={permissoes.medidas_disciplinares || false}
                  onCheckedChange={(checked) => handlePermissaoChange("medidas_disciplinares", !!checked)}
                  id="medidas_disciplinares"
                >
                  Acesso a Medidas Disciplinares
                </Checkbox>
                <Checkbox
                  checked={permissoes.admin_usuarios || false}
                  onCheckedChange={(checked) => handlePermissaoChange("admin_usuarios", !!checked)}
                  id="admin_usuarios"
                >
                  Administração de Usuários
                </Checkbox>
                <Checkbox
                  checked={permissoes.admin_perfis || false}
                  onCheckedChange={(checked) => handlePermissaoChange("admin_perfis", !!checked)}
                  id="admin_perfis"
                >
                  Administração de Perfis
                </Checkbox>
                {/* Adicione mais permissões conforme necessário */}
              </div>

              <div className="mt-6">
                <CardTitle>Menus Sidebar Permitidos</CardTitle>
                <CardDescription>Selecione os menus que este perfil pode acessar</CardDescription>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded p-2">
                  {[
                    "dashboard",
                    "desvios_dashboard",
                    "desvios_cadastro",
                    "desvios_consulta",
                    "desvios_nao_conformidade",
                    "treinamentos_dashboard",
                    "treinamentos_normativo",
                    "treinamentos_consulta",
                    "treinamentos_execucao",
                    "treinamentos_cracha",
                    "medidas_disciplinares_dashboard",
                    "medidas_disciplinares_cadastro",
                    "medidas_disciplinares_consulta",
                    "inspecao_sms_dashboard",
                    "inspecao_sms_cadastro",
                    "inspecao_sms_consulta",
                    "tarefas_dashboard",
                    "tarefas_minhas_tarefas",
                    "tarefas_cadastro",
                    "relatorios",
                    "relatorios_idsms",
                    "admin_usuarios",
                    "admin_perfis",
                    "admin_empresas",
                    "admin_ccas",
                    "admin_engenheiros",
                    "admin_supervisores",
                    "admin_funcionarios",
                    "admin_hht",
                    "admin_metas_indicadores",
                    "admin_modelos_inspecao",
                    "admin_templates",
                    "admin_logo",
                    "idsms_dashboard",
                    "idsms_indicadores",
                    "idsms_iid",
                    "idsms_hsa",
                    "idsms_ht",
                    "idsms_ipom",
                    "idsms_inspecao_alta_lideranca",
                    "idsms_inspecao_gestao_sms",
                    "idsms_indice_reativo",
                    "hora_seguranca_cadastro",
                    "hora_seguranca_cadastro_inspecao",
                    "hora_seguranca_cadastro_nao_programada",
                    "hora_seguranca_dashboard",
                    "hora_seguranca_agenda",
                    "hora_seguranca_acompanhamento",
                    "gro_perigos",
                    "gro_avaliacao",
                    "gro_pgr",
                    "ocorrencias_dashboard",
                    "ocorrencias_cadastro",
                    "ocorrencias_consulta",
                  ].map(menu => (
                    <Checkbox
                      key={menu}
                      checked={permissoes.menus_sidebar?.includes(menu) || false}
                      onCheckedChange={(checked) => handleMenuSidebarChange(menu, !!checked)}
                      id={`menu-${menu}`}
                    >
                      {menu}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ccas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CCAs Permitidas</CardTitle>
              <CardDescription>Selecione os CCAs que este perfil pode acessar</CardDescription>
            </CardHeader>
            <CardContent>
              <CCASelector
                selectedCCAs={ccasSelecionadas}
                onChange={setCcasSelecionadas}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};
