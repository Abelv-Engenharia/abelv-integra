import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Save, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useColaboradores } from '@/contexts/ColaboradoresContext';
import { supabase } from '@/integrations/supabase/client';

// Status types with colors matching the legend
const STATUS_OPTIONS = [
  { value: '', label: '-', color: 'bg-gray-100', textColor: 'text-gray-400', description: 'Sem status' },
  { value: 'PR', label: 'PR', color: 'bg-green-500', textColor: 'text-white', description: 'Presente' },
  { value: 'NE', label: 'NE', color: 'bg-red-300', textColor: 'text-white', description: 'Não escalado' },
  { value: 'FT', label: 'FT', color: 'bg-red-600', textColor: 'text-white', description: 'Faltas' },
  { value: 'CO', label: 'CO', color: 'bg-orange-500', textColor: 'text-white', description: 'Compensado' },
  { value: 'AT', label: 'AT', color: 'bg-yellow-700', textColor: 'text-white', description: 'Atestado médico' },
  { value: 'FO', label: 'FO', color: 'bg-gray-500', textColor: 'text-white', description: 'Folga de campo' },
  { value: 'FR', label: 'FR', color: 'bg-blue-400', textColor: 'text-white', description: 'Férias' },
  { value: 'AF', label: 'AF', color: 'bg-purple-600', textColor: 'text-white', description: 'Afastados' },
  { value: 'TE', label: 'TE', color: 'bg-cyan-400', textColor: 'text-white', description: 'Treinamento externo' },
  { value: 'EP', label: 'EP', color: 'bg-purple-300', textColor: 'text-white', description: 'Exame periódico' },
  { value: 'AC', label: 'AC', color: 'bg-yellow-300', textColor: 'text-black', description: 'Aguardando chegada/crachá' },
  { value: 'SE', label: 'SE', color: 'bg-yellow-400', textColor: 'text-black', description: 'Serviços externos' },
  { value: 'AS', label: 'AS', color: 'bg-gray-400', textColor: 'text-white', description: 'Aguardando docs SMS' },
  { value: 'AI', label: 'AI', color: 'bg-teal-400', textColor: 'text-white', description: 'Aguardando integração' },
  { value: 'TR', label: 'TR', color: 'bg-purple-400', textColor: 'text-white', description: 'Transferido' },
  { value: 'DE', label: 'DE', color: 'bg-pink-300', textColor: 'text-white', description: 'Demitidos' }
];

interface ColaboradorDiario {
  id: string;
  empresa: string;
  nome: string;
  funcao: string;
  disciplina: string;
  classificacao: string;
  status: { [dia: number]: string }; // dia: status
}

export default function ControleDiario() {
  const { toast } = useToast();
  const { colaboradores: colaboradoresEfetivo } = useColaboradores();
  const [ccaSelecionado, setCcaSelecionado] = useState('');
  const [mesAno, setMesAno] = useState('2025-10');
  const [statusDiario, setStatusDiario] = useState<{ [colaboradorId: string]: { [dia: number]: string } }>({});
  const [carregando, setCarregando] = useState(false);

  // Carregar status do banco ao mudar CCA ou mês
  useEffect(() => {
    if (ccaSelecionado && mesAno) {
      carregarStatusDiario();
    }
  }, [ccaSelecionado, mesAno]);

  const carregarStatusDiario = async () => {
    if (!ccaSelecionado) return;
    
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('controle_diario')
        .select('colaborador_id, data, status')
        .eq('cca_codigo', ccaSelecionado)
        .eq('competencia', mesAno);

      if (error) throw error;

      const statusMap: { [colaboradorId: string]: { [dia: number]: string } } = {};
      data?.forEach(registro => {
        const dia = new Date(registro.data).getDate();
        if (!statusMap[registro.colaborador_id]) {
          statusMap[registro.colaborador_id] = {};
        }
        statusMap[registro.colaborador_id][dia] = registro.status;
      });

      setStatusDiario(statusMap);
    } catch (error) {
      console.error('Erro ao carregar status diário:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar status diário",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  };

  // Filtrar colaboradores por CCA selecionada
  const colaboradoresFiltrados = ccaSelecionado 
    ? colaboradoresEfetivo.filter(col => col.cca_codigo === ccaSelecionado)
    : colaboradoresEfetivo;

  // Converter colaboradores do efetivo para formato do controle diário
  const colaboradores: ColaboradorDiario[] = colaboradoresFiltrados.map(col => ({
    ...col,
    status: statusDiario[col.id] || {}
  }));

  // Get days in month
  const getDaysInMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(mesAno);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleStatusChange = async (colaboradorId: string, dia: number, novoStatus: string) => {
    if (!ccaSelecionado) {
      toast({
        title: "Selecione uma CCA",
        description: "É necessário selecionar uma Obra/CCA",
        variant: "destructive"
      });
      return;
    }

    const data = `${mesAno}-${String(dia).padStart(2, '0')}`;

    try {
      const { error } = await supabase
        .from('controle_diario')
        .upsert({
          colaborador_id: colaboradorId,
          data,
          status: novoStatus,
          cca_codigo: ccaSelecionado,
          competencia: mesAno
        }, {
          onConflict: 'colaborador_id,data'
        });

      if (error) throw error;

      setStatusDiario(prev => ({
        ...prev,
        [colaboradorId]: {
          ...(prev[colaboradorId] || {}),
          [dia]: novoStatus
        }
      }));
    } catch (error) {
      console.error('Erro ao salvar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar status diário",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option || STATUS_OPTIONS[0];
  };

  const handleSalvar = () => {
    toast({
      title: "Salvamento automático",
      description: "Status são salvos automaticamente ao serem alterados"
    });
  };

  const handleExportar = () => {
    toast({
      title: "Exportando",
      description: "Relatório de efetivo diário sendo gerado..."
    });
  };

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    const [year, month] = mesAno.split('-').map(Number);
    const data = new Date(year, month - 1);
    
    if (direcao === 'anterior') {
      data.setMonth(data.getMonth() - 1);
    } else {
      data.setMonth(data.getMonth() + 1);
    }
    
    const novoMes = String(data.getMonth() + 1).padStart(2, '0');
    const novoAno = data.getFullYear();
    setMesAno(`${novoAno}-${novoMes}`);
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Controle de efetivo diário</h1>
              <p className="text-muted-foreground">Registro diário de presença dos colaboradores terceirizados</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportar}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={handleSalvar}>
                <Save className="h-4 w-4 mr-2" />
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>

        {/* Alert CCA obrigatório */}
        {!ccaSelecionado && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Selecione uma Obra/CCA para registrar o controle diário
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-destructive">Obra/CCA *</Label>
                <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                  <SelectTrigger className={!ccaSelecionado ? 'border-destructive' : ''}>
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
                <Label>Competência (Mês/Ano)</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navegarMes('anterior')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <input
                    type="month"
                    value={mesAno}
                    onChange={(e) => setMesAno(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navegarMes('proximo')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Legenda de status</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {STATUS_OPTIONS.slice(1).map(status => (
                    <div
                      key={status.value}
                      className={`${status.color} ${status.textColor} px-2 py-1 rounded text-xs font-bold text-center`}
                      title={status.description}
                    >
                      {status.value} - {status.description}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Control Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Grade de controle - {new Date(mesAno + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <CardDescription>
                  {colaboradores.length} colaborador(es) | {daysInMonth} dias
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left sticky left-0 bg-muted z-10 min-w-[100px]">Empresa</th>
                      <th className="border p-2 text-left sticky left-[100px] bg-muted z-10 min-w-[200px]">Nome do colaborador</th>
                      <th className="border p-2 text-left min-w-[120px]">Função</th>
                      <th className="border p-2 text-left min-w-[100px]">Disciplina</th>
                      <th className="border p-2 text-left min-w-[100px]">Classificação</th>
                      {days.map(dia => (
                        <th key={dia} className="border p-1 text-center min-w-[40px] bg-muted/50">
                          {String(dia).padStart(2, '0')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {colaboradores.map((colaborador) => (
                      <tr key={colaborador.id} className="hover:bg-muted/20">
                        <td className="border p-2 font-medium text-xs sticky left-0 bg-background">
                          {colaborador.empresa}
                        </td>
                        <td className="border p-2 text-xs sticky left-[100px] bg-background">
                          {colaborador.nome}
                        </td>
                        <td className="border p-2 text-xs">{colaborador.funcao}</td>
                        <td className="border p-2 text-xs">{colaborador.disciplina}</td>
                        <td className="border p-2 text-xs">{colaborador.classificacao}</td>
                        {days.map(dia => {
                          const status = colaborador.status[dia] || '';
                          const statusColor = getStatusColor(status);
                          
                          return (
                            <td key={dia} className="border p-0">
                              <select
                                value={status}
                                onChange={(e) => handleStatusChange(colaborador.id, dia, e.target.value)}
                                className={`w-full h-full text-center font-bold text-xs border-0 cursor-pointer ${statusColor.color} ${statusColor.textColor}`}
                                style={{ minHeight: '32px' }}
                                title={statusColor.description}
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total de colaboradores</p>
                <p className="text-2xl font-bold">{colaboradores.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dias úteis</p>
                <p className="text-2xl font-bold">{daysInMonth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taxa de presença média</p>
                <p className="text-2xl font-bold">--</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ausências totais</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
