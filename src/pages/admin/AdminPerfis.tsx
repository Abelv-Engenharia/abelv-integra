import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Perfil, Permissoes } from "@/types/users";
import { useToast } from "@/hooks/use-toast";
import { PerfisTable } from "@/components/admin/perfis/PerfisTable";
import { PerfilDialog } from "@/components/admin/perfis/PerfilDialog";
import { AdminOnlySection } from "@/components/security/AdminOnlySection";
import { useSecurityValidation } from "@/hooks/useSecurityValidation";
import { fetchPerfis, createPerfil, updatePerfil, deletePerfil } from "@/services/perfisService";

const AdminPerfis = () => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [novoPerfil, setNovoPerfil] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buscar, setBuscar] = useState<string>('');
  const { toast } = useToast();
  const { validateAction } = useSecurityValidation();
  
  const permissoesIniciais: Permissoes = {
    menus_sidebar: [],
    admin_usuarios: false,
    admin_perfis: false,
    admin_funcionarios: false,
    admin_empresas: false,
    admin_ccas: false,
    admin_engenheiros: false,
    admin_supervisores: false,
    admin_hht: false,
    admin_templates: false,
    admin_metas_indicadores: false,
    admin_modelos_inspecao: false,
    admin_checklists: false,
    admin_importacao_funcionarios: false,
    admin_logo: false,
    admin_configuracoes: false,
    pode_editar: true,
    pode_excluir: true,
    pode_aprovar: false,
    pode_exportar: true,
    pode_visualizar_todos_ccas: false
  };
  
  const [perfilSelecionado, setPerfilSelecionado] = useState<Perfil | null>(null);

  useEffect(() => {
    const loadPerfis = async () => {
      setLoading(true);
      try {
        const data = await fetchPerfis();
        const perfisFormatados = data.map(perfil => {
          let permissoes: Permissoes;
          try {
            if (typeof perfil.permissoes === 'object' && perfil.permissoes !== null) {
              permissoes = perfil.permissoes as unknown as Permissoes;
            } else {
              permissoes = permissoesIniciais;
            }
          } catch (error) {
            console.warn('Error parsing permissoes for perfil:', perfil.id, error);
            permissoes = permissoesIniciais;
          }

          let ccas_permitidas: number[];
          try {
            if (Array.isArray(perfil.ccas_permitidas)) {
              ccas_permitidas = (perfil.ccas_permitidas as unknown[]).map(id => Number(id)).filter(id => !isNaN(id));
            } else {
              ccas_permitidas = [];
            }
          } catch (error) {
            console.warn('Error parsing ccas_permitidas for perfil:', perfil.id, error);
            ccas_permitidas = [];
          }

          return {
            ...perfil,
            permissoes,
            ccas_permitidas
          } as Perfil;
        });
        setPerfis(perfisFormatados);
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

  const handleNovoPerfil = async () => {
    const isValid = await validateAction('create_profile', 'admin_perfis');
    if (!isValid) return;

    setNovoPerfil(true);
    setPerfilSelecionado(null);
  };

  const handleSalvar = async (nome: string, descricao: string, permissoes: Permissoes, ccas_permitidas: number[]) => {
    if (!nome) {
      toast({
        title: "Erro",
        description: "O nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const action = perfilSelecionado ? 'update_profile' : 'create_profile';
    const isValid = await validateAction(action, 'admin_perfis');
    if (!isValid) return;

    setLoading(true);
    try {
      if (perfilSelecionado) {
        const updatedPerfil = await updatePerfil(perfilSelecionado.id, {
          nome,
          descricao,
          permissoes,
          ccas_permitidas
        });

        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso"
        });

        setPerfis(prevPerfis =>
          prevPerfis.map(p => {
            if (p.id === perfilSelecionado.id) {
              let convertedPermissoes: Permissoes;
              let convertedCcas: number[];
              
              try {
                convertedPermissoes = updatedPerfil.permissoes as unknown as Permissoes;
              } catch {
                convertedPermissoes = permissoes;
              }
              
              try {
                convertedCcas = Array.isArray(updatedPerfil.ccas_permitidas) 
                  ? (updatedPerfil.ccas_permitidas as unknown[]).map(id => Number(id)).filter(id => !isNaN(id))
                  : ccas_permitidas;
              } catch {
                convertedCcas = ccas_permitidas;
              }

              return {
                ...updatedPerfil,
                permissoes: convertedPermissoes,
                ccas_permitidas: convertedCcas
              } as Perfil;
            }
            return p;
          })
        );
      } else {
        const novoPerfil = await createPerfil({
          nome,
          descricao,
          permissoes,
          ccas_permitidas
        });

        if (novoPerfil) {
          toast({
            title: "Sucesso",
            description: "Perfil criado com sucesso"
          });

          let convertedPermissoes: Permissoes;
          let convertedCcas: number[];
          
          try {
            convertedPermissoes = novoPerfil.permissoes as unknown as Permissoes;
          } catch {
            convertedPermissoes = permissoes;
          }
          
          try {
            convertedCcas = Array.isArray(novoPerfil.ccas_permitidas) 
              ? (novoPerfil.ccas_permitidas as unknown[]).map(id => Number(id)).filter(id => !isNaN(id))
              : ccas_permitidas;
          } catch {
            convertedCcas = ccas_permitidas;
          }

          const newPerfilFormatted: Perfil = {
            ...novoPerfil,
            permissoes: convertedPermissoes,
            ccas_permitidas: convertedCcas
          };

          setPerfis([...perfis, newPerfilFormatted]);
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

  const handleEditar = async (perfil: Perfil) => {
    const isValid = await validateAction('edit_profile', 'admin_perfis');
    if (!isValid) return;

    setPerfilSelecionado(perfil);
    setNovoPerfil(true);
  };

  const handleExcluir = async (id: number) => {
    const isValid = await validateAction('delete_profile', 'admin_perfis');
    if (!isValid) return;

    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
      setLoading(true);
      try {
        await deletePerfil(id);

        toast({
          title: "Sucesso",
          description: "Perfil excluído com sucesso"
        });

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
    <AdminOnlySection fallbackMessage="Apenas administradores podem gerenciar perfis de acesso.">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Perfis de Acesso</CardTitle>
              <CardDescription>Gerencie os perfis de acesso dos usuários definindo CCAs permitidas e menus da sidebar</CardDescription>
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
    </AdminOnlySection>
  );
};

export default AdminPerfis;
