import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Perfil, Permissoes, Json } from "@/types/users";
import { useToast } from "@/hooks/use-toast";

const AdminPerfis = () => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [novoPerfil, setNovoPerfil] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
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
  
  const [permissoes, setPermissoes] = useState<Permissoes>(permissoesIniciais);
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

  const perfisFiltrados = perfis.filter(perfil =>
    perfil.nome.toLowerCase().includes(buscar.toLowerCase()) ||
    perfil.descricao.toLowerCase().includes(buscar.toLowerCase())
  );

  const handleNovoPerfil = () => {
    setNovoPerfil(true);
    setNome('');
    setDescricao('');
    setPermissoes(permissoesIniciais);
    setPerfilSelecionado(null);
  };

  const handleSalvar = async () => {
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
    setNome(perfil.nome);
    setDescricao(perfil.descricao);
    setPermissoes({ ...perfil.permissoes });
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

  const handleChangePermissao = (key: keyof Permissoes, value: boolean) => {
    setPermissoes(prev => ({
      ...prev,
      [key]: value
    }));
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : perfisFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Nenhum perfil encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                perfisFiltrados.map((perfil) => (
                  <TableRow key={perfil.id}>
                    <TableCell>{perfil.nome}</TableCell>
                    <TableCell>{perfil.descricao}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditar(perfil)}>
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleExcluir(perfil.id)}>
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={novoPerfil} onOpenChange={setNovoPerfil}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {perfilSelecionado ? `Editar perfil: ${perfilSelecionado.nome}` : "Novo Perfil de Acesso"}
            </DialogTitle>
            <DialogDescription>
              {perfilSelecionado ? "Atualize as informações do perfil e suas permissões" : "Crie um novo perfil de acesso e defina suas permissões"}
            </DialogDescription>
          </DialogHeader>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="desvios" 
                      checked={permissoes.desvios} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('desvios', checked === true)
                      }
                    />
                    <Label htmlFor="desvios">Desvios</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="treinamentos" 
                      checked={permissoes.treinamentos} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('treinamentos', checked === true)
                      }
                    />
                    <Label htmlFor="treinamentos">Treinamentos</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ocorrencias" 
                      checked={permissoes.ocorrencias} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('ocorrencias', checked === true)
                      }
                    />
                    <Label htmlFor="ocorrencias">Ocorrências</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tarefas" 
                      checked={permissoes.tarefas} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('tarefas', checked === true)
                      }
                    />
                    <Label htmlFor="tarefas">Tarefas</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="relatorios" 
                      checked={permissoes.relatorios} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('relatorios', checked === true)
                      }
                    />
                    <Label htmlFor="relatorios">Relatórios</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hora_seguranca" 
                      checked={permissoes.hora_seguranca} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('hora_seguranca', checked === true)
                      }
                    />
                    <Label htmlFor="hora_seguranca">Hora de Segurança</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="medidas_disciplinares" 
                      checked={permissoes.medidas_disciplinares} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('medidas_disciplinares', checked === true)
                      }
                    />
                    <Label htmlFor="medidas_disciplinares">Medidas Disciplinares</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin_usuarios" 
                      checked={permissoes.admin_usuarios} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('admin_usuarios', checked === true)
                      }
                    />
                    <Label htmlFor="admin_usuarios">Admin: Usuários</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin_perfis" 
                      checked={permissoes.admin_perfis} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('admin_perfis', checked === true)
                      }
                    />
                    <Label htmlFor="admin_perfis">Admin: Perfis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin_funcionarios" 
                      checked={permissoes.admin_funcionarios} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('admin_funcionarios', checked === true)
                      }
                    />
                    <Label htmlFor="admin_funcionarios">Admin: Funcionários</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin_hht" 
                      checked={permissoes.admin_hht} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('admin_hht', checked === true)
                      }
                    />
                    <Label htmlFor="admin_hht">Admin: HHT</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin_templates" 
                      checked={permissoes.admin_templates} 
                      onCheckedChange={(checked) => 
                        handleChangePermissao('admin_templates', checked === true)
                      }
                    />
                    <Label htmlFor="admin_templates">Admin: Templates</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovoPerfil(false)}>Cancelar</Button>
            <Button onClick={handleSalvar} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPerfis;
