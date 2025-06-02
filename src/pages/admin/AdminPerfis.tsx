
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Perfil, Permissoes } from "@/types/users";
import { useToast } from "@/hooks/use-toast";
import { PerfisTable } from "@/components/admin/perfis/PerfisTable";
import { PerfilDialog } from "@/components/admin/perfis/PerfilDialog";
import { fetchPerfis, createPerfil, updatePerfil, deletePerfil } from "@/services/perfisService";

const AdminPerfis = () => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [novoPerfil, setNovoPerfil] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buscar, setBuscar] = useState<string>('');
  const { toast } = useToast();
  
  // Definir permissões iniciais completas para evitar erros de tipo
  const permissoesIniciais: Permissoes = {
    // Módulos principais
    desvios: true,
    treinamentos: true,
    ocorrencias: true,
    tarefas: true,
    relatorios: true,
    hora_seguranca: true,
    medidas_disciplinares: true,
    
    // Administração
    admin_usuarios: false,
    admin_perfis: false,
    admin_funcionarios: false,
    admin_hht: false,
    admin_templates: false,
    admin_empresas: false,
    admin_supervisores: false,
    admin_engenheiros: false,
    admin_ccas: false,
    
    // IDSMS
    idsms_dashboard: false,
    idsms_formularios: false,
    
    // Configurações específicas de permissões
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
  };
  
  const [perfilSelecionado, setPerfilSelecionado] = useState<Perfil | null>(null);

  useEffect(() => {
    const loadPerfis = async () => {
      setLoading(true);
      try {
        const data = await fetchPerfis();
        setPerfis(data);
      } catch (error) {
        console.error('Erro ao carregar perfis:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os perfis",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPerfis();
  }, [toast]);

  const handleNovoPerfil = () => {
    setNovoPerfil(true);
    setPerfilSelecionado(null);
  };

  const handleSalvar = async (nome: string, descricao: string, permissoes: Permissoes) => {
    if (!nome) {
      toast({
        title: "Erro",
        description: "O nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (perfilSelecionado) {
        // Atualizar perfil existente
        await updatePerfil(perfilSelecionado.id, {
          nome,
          descricao,
          permissoes
        });

        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso"
        });

        // Atualizar o estado local
        setPerfis(prevPerfis =>
          prevPerfis.map(p =>
            p.id === perfilSelecionado.id
              ? { ...p, nome, descricao, permissoes }
              : p
          )
        );
      } else {
        // Criar novo perfil
        const novoPerfil = await createPerfil({
          nome,
          descricao,
          permissoes
        });

        if (novoPerfil) {
          toast({
            title: "Sucesso",
            description: "Perfil criado com sucesso"
          });

          // Adicionar o novo perfil ao estado local
          setPerfis([...perfis, novoPerfil]);
        }
      }

      setNovoPerfil(false);
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (perfil: Perfil) => {
    setPerfilSelecionado(perfil);
    setNovoPerfil(true);
  };

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
      setLoading(true);
      try {
        await deletePerfil(id);

        toast({
          title: "Sucesso",
          description: "Perfil excluído com sucesso"
        });

        // Remover o perfil do estado local
        setPerfis(perfis.filter(p => p.id !== id));
      } catch (error: any) {
        console.error('Erro ao excluir perfil:', error);
        toast({
          title: "Erro",
          description: error.message || "Não foi possível excluir o perfil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Perfis de Acesso</CardTitle>
            <CardDescription>Gerencie os perfis de acesso dos usuários com todas as permissões do sistema</CardDescription>
          </div>
          <Button onClick={handleNovoPerfil}>Novo Perfil</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input 
              placeholder="Buscar perfil..." 
              value={buscar} 
              onChange={(e) => setBuscar(e.target.value)}
            />
          </div>
          <PerfisTable
            perfis={perfis}
            loading={loading}
            buscar={buscar}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
          />
        </CardContent>
      </Card>

      <PerfilDialog
        open={novoPerfil}
        onOpenChange={setNovoPerfil}
        perfilSelecionado={perfilSelecionado}
        loading={loading}
        permissoesIniciais={permissoesIniciais}
        onSalvar={handleSalvar}
      />
    </div>
  );
};

export default AdminPerfis;
