import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Save, Download, Trash2, Edit, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useColaboradores } from '@/contexts/ColaboradoresContext';

// Mock data
const mockEmpresas = [
  "Construtora ABC Ltda",
  "Engenharia XYZ S.A.",
  "Terceiros Alpha",
  "Beta Serviços",
  "GDFORCE",
  "MultiTener"
];

const mockDisciplinas = [
  "Civil",
  "Elétrica",
  "Container",
  "Operadores",
  "Mecânica",
  "Instrumentação",
  "Passivação",
  "Tubulação",
  "Isolamento"
];

const mockFuncoes = [
  "Ajudante",
  "Pedreiro",
  "Eletricista",
  "Encanador",
  "Operador de Máquinas",
  "Soldador",
  "Carpinteiro",
  "Encarregado",
  "Engenheiro",
  "Técnico",
  "Servente",
  "Coordenador",
  "Montador",
  "Motorista"
];

export default function EfetivoTerceiros() {
  const { toast } = useToast();
  const { colaboradores, adicionarColaborador, atualizarColaborador, removerColaborador } = useColaboradores();
  const [ccaSelecionado, setCcaSelecionado] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  const [novoColaborador, setNovoColaborador] = useState({
    empresa: '',
    nome: '',
    cpf: '',
    funcao: '',
    disciplina: '',
    classificacao: 'MO - DIRETA',
    cca_codigo: '',
    cca_nome: ''
  });

  const colaboradoresFiltrados = colaboradores.filter(col => {
    const matchCca = !ccaSelecionado || col.cca_codigo === ccaSelecionado;
    const matchEmpresa = !empresaSelecionada || col.empresa === empresaSelecionada;
    return matchCca && matchEmpresa;
  });

  const handleSalvar = async () => {
    if (!novoColaborador.empresa || !novoColaborador.nome || !novoColaborador.funcao || !novoColaborador.disciplina || !novoColaborador.cca_codigo) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios (incluindo Obra/CCA)",
        variant: "destructive"
      });
      return;
    }

    // Check duplicity
    const duplicado = colaboradores.find(col => 
      col.nome.toLowerCase() === novoColaborador.nome.toLowerCase() && 
      col.empresa === novoColaborador.empresa
    );

    if (duplicado && editandoId !== duplicado.id) {
      toast({
        title: "Colaborador duplicado",
        description: "Este colaborador já está cadastrado para esta empresa",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editandoId) {
        await atualizarColaborador(editandoId, novoColaborador);
        toast({
          title: "Atualizado com sucesso",
          description: "Colaborador atualizado no efetivo de terceiros"
        });
      } else {
        await adicionarColaborador(novoColaborador);
        toast({
          title: "Adicionado com sucesso",
          description: "Colaborador incluído no efetivo de terceiros. Ele aparecerá automaticamente no Controle Diário."
        });
      }

      setNovoColaborador({
        empresa: '',
        nome: '',
        cpf: '',
        funcao: '',
        disciplina: '',
        classificacao: 'MO - DIRETA',
        cca_codigo: '',
        cca_nome: ''
      });
      setMostrarFormulario(false);
      setEditandoId(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar colaborador",
        variant: "destructive"
      });
    }
  };

  const handleEditar = (colaborador: typeof colaboradores[0]) => {
    setNovoColaborador({
      empresa: colaborador.empresa,
      nome: colaborador.nome,
      cpf: (colaborador as any).cpf || '',
      funcao: colaborador.funcao,
      disciplina: colaborador.disciplina,
      classificacao: colaborador.classificacao,
      cca_codigo: (colaborador as any).cca_codigo || '',
      cca_nome: (colaborador as any).cca_nome || ''
    });
    setEditandoId(colaborador.id);
    setMostrarFormulario(true);
  };

  const handleExcluir = (id: string) => {
    removerColaborador(id);
    toast({
      title: "Removido",
      description: "Colaborador removido do efetivo de terceiros"
    });
  };

  const handleExportar = () => {
    toast({
      title: "Exportando",
      description: "Relatório de efetivo de terceiros sendo gerado..."
    });
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Efetivo de terceiros</h1>
            <p className="text-muted-foreground">Cadastro e atualização de colaboradores terceirizados</p>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Os colaboradores cadastrados aqui aparecem automaticamente no <strong>Controle Diário</strong> para registro de status diário.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Obra/CCA</Label>
                <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a obra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24023IBRF">24023|BRF - Projeto Ouro |Itapecerica da Serra - SP</SelectItem>
                    <SelectItem value="CCA-002">CCA 002 - Projeto Beta</SelectItem>
                    <SelectItem value="CCA-003">CCA 003 - Projeto Gamma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Empresa</Label>
                <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmpresas.map(emp => (
                      <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={handleExportar} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Colaboradores terceirizados
                </CardTitle>
                <CardDescription>
                  {colaboradoresFiltrados.length} colaborador(es) cadastrado(s)
                </CardDescription>
              </div>
              <Button onClick={() => {
                setMostrarFormulario(!mostrarFormulario);
                setEditandoId(null);
                setNovoColaborador({
                  empresa: '',
                  nome: '',
                  cpf: '',
                  funcao: '',
                  disciplina: '',
                  classificacao: 'MO - DIRETA',
                  cca_codigo: '',
                  cca_nome: ''
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar colaborador
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Inline Form */}
            {mostrarFormulario && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-destructive">Empresa *</Label>
                      <Select 
                        value={novoColaborador.empresa} 
                        onValueChange={(value) => setNovoColaborador({...novoColaborador, empresa: value})}
                      >
                        <SelectTrigger className={!novoColaborador.empresa ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecione a empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEmpresas.map(emp => (
                            <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-destructive">Obra/CCA *</Label>
                      <Select 
                        value={novoColaborador.cca_codigo} 
                        onValueChange={(value) => {
                          const ccaMap: Record<string, string> = {
                            '24023IBRF': '24023|BRF - Projeto Ouro',
                            'CCA-002': 'CCA 002 - Projeto Beta',
                            'CCA-003': 'CCA 003 - Projeto Gamma'
                          };
                          setNovoColaborador({
                            ...novoColaborador, 
                            cca_codigo: value,
                            cca_nome: ccaMap[value] || ''
                          });
                        }}
                      >
                        <SelectTrigger className={!novoColaborador.cca_codigo ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecione a obra" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24023IBRF">24023|BRF - Projeto Ouro</SelectItem>
                          <SelectItem value="CCA-002">CCA 002 - Projeto Beta</SelectItem>
                          <SelectItem value="CCA-003">CCA 003 - Projeto Gamma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-destructive">Nome do colaborador *</Label>
                      <Input 
                        placeholder="Nome completo"
                        value={novoColaborador.nome}
                        onChange={(e) => setNovoColaborador({...novoColaborador, nome: e.target.value})}
                        className={!novoColaborador.nome ? 'border-destructive' : ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-destructive">Função *</Label>
                      <Select 
                        value={novoColaborador.funcao} 
                        onValueChange={(value) => setNovoColaborador({...novoColaborador, funcao: value})}
                      >
                        <SelectTrigger className={!novoColaborador.funcao ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockFuncoes.map(func => (
                            <SelectItem key={func} value={func}>{func}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-destructive">Disciplina *</Label>
                      <Select 
                        value={novoColaborador.disciplina} 
                        onValueChange={(value) => setNovoColaborador({...novoColaborador, disciplina: value})}
                      >
                        <SelectTrigger className={!novoColaborador.disciplina ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDisciplinas.map(disc => (
                            <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Classificação</Label>
                      <Input 
                        value={novoColaborador.classificacao}
                        onChange={(e) => setNovoColaborador({...novoColaborador, classificacao: e.target.value})}
                        placeholder="MO - DIRETA"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setMostrarFormulario(false);
                        setEditandoId(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvar}>
                      <Save className="h-4 w-4 mr-2" />
                      {editandoId ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Nome do colaborador</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Data inclusão</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradoresFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Nenhum colaborador cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    colaboradoresFiltrados.map((colaborador) => (
                      <TableRow key={colaborador.id}>
                        <TableCell className="font-medium">{colaborador.empresa}</TableCell>
                        <TableCell>{colaborador.nome}</TableCell>
                        <TableCell>{colaborador.funcao}</TableCell>
                        <TableCell>{colaborador.disciplina}</TableCell>
                        <TableCell>{colaborador.classificacao}</TableCell>
                        <TableCell>{new Date(colaborador.dataInclusao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditar(colaborador)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExcluir(colaborador.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
