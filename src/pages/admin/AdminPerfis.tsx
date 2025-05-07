
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Perfil, Permissoes, Json } from "@/types/users";
import { useToast } from "@/hooks/use-toast";
import { PerfisTable } from "@/components/admin/perfis/PerfisTable";
import { PerfilDialog } from "@/components/admin/perfis/PerfilDialog";

const AdminPerfis = () => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [novoPerfil, setNovoPerfil] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [buscar, setBuscar] = useState<string>('');
  const { toast } = useToast();
  
  // Definir permissões iniciais completas para evitar erros de tipo
  const permissoesIniciais: Permissoes = {
    desvios: true,
    treinamentos: true,
    ocorrencias: true,
    tarefas: true,
    relatorios: true,
    hora_seguranca: true,
    medidas_disciplinares: true,
    admin_usuarios: false,
    admin_perfis: false,
    admin_funcionarios: false,
    admin_hht: false,
    admin_templates: false
  };
  
  const [perfilSelecionado, setPerfilSelecionado] = useState<Perfil | null>(null);

  useEffect(() => {
    const fetchPerfis = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('perfis')
          .select('*')
          .order('nome', { ascending: true });

        if (error) throw error;

        if (data) {
          // Converter o resultado para o tipo Perfil[], garantindo que todas as propriedades necessárias estejam presentes
          const perfisMapeados: Perfil[] = data.map(p => {
            // Converter o campo permissoes para o tipo Permissoes
            const permissoesObj = p.permissoes as unknown;
            // Garantir que todas as propriedades estejam presentes
            const permissoesTipadas: Permissoes = {
              desvios: ((permissoesObj as any)?.desvios ?? true) as boolean,
              treinamentos: ((permissoesObj as any)?.treinamentos ?? true) as boolean,
              ocorrencias: ((permissoesObj as any)?.ocorrencias ?? true) as boolean,
              tarefas: ((permissoesObj as any)?.tarefas ?? true) as boolean,
              relatorios: ((permissoesObj as any)?.relatorios ?? true) as boolean,
              hora_seguranca: ((permissoesObj as any)?.hora_seguranca ?? true) as boolean,
              medidas_disciplinares: ((permissoesObj as any)?.medidas_disciplinares ?? true) as boolean,
              admin_usuarios: ((permissoesObj as any)?.admin_usuarios ?? false) as boolean,
              admin_perfis: ((permissoesObj as any)?.admin_perfis ?? false) as boolean,
              admin_funcionarios: ((permissoesObj as any)?.admin_funcionarios ?? false) as boolean,
              admin_hht: ((permissoesObj as any)?.admin_hht ?? false) as boolean,
              admin_templates: ((permissoesObj as any)?.admin_templates ?? false) as boolean
            };
            
            return {
              id: p.id,
              nome: p.nome,
              descricao: p.descricao || '',
              permissoes: permissoesTipadas
            };
          });
          setPerfis(perfisMapeados);
        }
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

    fetchPerfis();
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
        const { error } = await supabase
          .from('perfis')
          .update({
            nome,
            descricao,
            permissoes: permissoes as unknown as Json
          })
          .eq('id', perfilSelecionado.id);

        if (error) throw error;

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
        const { data, error } = await supabase
          .from('perfis')
          .insert({
            nome,
            descricao,
            permissoes: permissoes as unknown as Json
          })
          .select();

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Perfil criado com sucesso"
        });

        // Adicionar o novo perfil ao estado local
        if (data) {
          const novoPerfil: Perfil = {
            id: data[0].id,
            nome: data[0].nome,
            descricao: data[0].descricao || '',
            permissoes: permissoes
          };
          setPerfis([...perfis, novoPerfil]);
        }
      }

      setNovoPerfil(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o perfil",
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
        const { error } = await supabase
          .from('perfis')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Perfil excluído com sucesso"
        });

        // Remover o perfil do estado local
        setPerfis(perfis.filter(p => p.id !== id));
      } catch (error) {
        console.error('Erro ao excluir perfil:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o perfil",
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
            <CardDescription>Gerencie os perfis de acesso dos usuários</CardDescription>
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
