import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Eye, Edit, Save, X, Plus, Trash2, Calendar } from "lucide-react";
import { MapaMOI, MotoristaDiv } from "@/types/gestao-pessoas/fuel";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MapaMOITabProps {
  mapaMOI: MapaMOI | null;
  onMapaMOIChange: (mapa: MapaMOI) => void;
  historico: MapaMOI[];
}

export const MapaMOITab: React.FC<MapaMOITabProps> = ({
  mapaMOI,
  onMapaMOIChange,
  historico
}) => {
  const { toast } = useToast();
  const [editingMOI, setEditingMOI] = useState<MapaMOI | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewingHistorico, setViewingHistorico] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'Pendente': { variant: 'secondary' as const, label: 'Pendente' },
      'Ativo': { variant: 'default' as const, label: 'Ativo' },
      'Arquivado': { variant: 'outline' as const, label: 'Arquivado' }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.Pendente;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Simular upload e processamento do arquivo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const novoMOI: MapaMOI = {
        id: `moi_${Date.now()}`,
        mes_referencia: format(new Date(), 'yyyy-MM'),
        ano_referencia: new Date().getFullYear(),
        data_geracao: new Date(),
        status: 'Ativo',
        data_upload: new Date().toISOString(),
        usuario_responsavel: 'Sistema',
        motoristas: [
          {
            motorista: 'João Silva',
            matricula: '12345',
            placa: 'ABC-1234',
            cca_principal: 'CC001',
            divisao_ccas: [
              { cca: 'CC001', percentual: 60 },
              { cca: 'CC002', percentual: 40 }
            ]
          },
          {
            motorista: 'Maria Santos',
            matricula: '54321',
            placa: 'XYZ-5678',
            cca_principal: 'CC003',
            divisao_ccas: [
              { cca: 'CC003', percentual: 70 },
              { cca: 'CC004', percentual: 30 }
            ]
          }
        ]
      };

      onMapaMOIChange(novoMOI);
      toast({
        title: "MOI Carregado",
        description: `Mapa MOI para ${format(new Date(), 'MMMM yyyy', { locale: ptBR })} carregado com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro no Upload",
        description: "Erro ao processar arquivo do Mapa MOI",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (mapaMOI) {
      setEditingMOI({ ...mapaMOI });
    }
  };

  const handleSave = () => {
    if (editingMOI) {
      onMapaMOIChange(editingMOI);
      setEditingMOI(null);
      toast({
        title: "MOI Atualizado",
        description: "Alterações salvas com sucesso"
      });
    }
  };

  const handleCancel = () => {
    setEditingMOI(null);
  };

  const updateMotorista = (index: number, field: keyof MotoristaDiv, value: any) => {
    if (!editingMOI) return;
    
    const novosMotoristas = [...editingMOI.motoristas];
    novosMotoristas[index] = { ...novosMotoristas[index], [field]: value };
    
    setEditingMOI({
      ...editingMOI,
      motoristas: novosMotoristas
    });
  };

  const addMotorista = () => {
    if (!editingMOI) return;
    
    const novoMotorista: MotoristaDiv = {
      motorista: '',
      matricula: '',
      placa: '',
      cca_principal: '',
      divisao_ccas: [{ cca: '', percentual: 100 }]
    };
    
    setEditingMOI({
      ...editingMOI,
      motoristas: [...editingMOI.motoristas, novoMotorista]
    });
  };

  const removeMotorista = (index: number) => {
    if (!editingMOI) return;
    
    const novosMotoristas = editingMOI.motoristas.filter((_, i) => i !== index);
    setEditingMOI({
      ...editingMOI,
      motoristas: novosMotoristas
    });
  };

  const currentMOI = editingMOI || mapaMOI;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mapa MOI - Mão de Obra Indireta</h2>
          <p className="text-muted-foreground">
            Gestão mensal de divisão de custos por motorista
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewingHistorico(!viewingHistorico)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {viewingHistorico ? 'Atual' : 'Histórico'}
          </Button>
          {mapaMOI && !editingMOI && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {editingMOI && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      {viewingHistorico ? (
        /* Histórico */
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Mapas MOI</CardTitle>
          </CardHeader>
          <CardContent>
            {historico.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Data Geração</TableHead>
                    <TableHead>Motoristas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.map((moi) => (
                    <TableRow key={moi.id}>
                      <TableCell>
                        {format(new Date(moi.mes_referencia + '-01'), 'MMMM yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {format(moi.data_geracao, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{moi.motoristas.length}</TableCell>
                      <TableCell>
                        <Badge {...getStatusBadge(moi.status)}>
                          {getStatusBadge(moi.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum histórico disponível
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        /* MOI Atual */
        <>
          {!currentMOI ? (
            /* Upload de Novo MOI */
            <Card>
              <CardHeader>
                <CardTitle>Carregar Mapa MOI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhum Mapa MOI carregado para este mês
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Carregue o arquivo Excel/CSV com as divisões dos motoristas
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="moi-upload"
                      disabled={loading}
                    />
                    <label htmlFor="moi-upload">
                      <Button asChild disabled={loading}>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {loading ? 'Processando...' : 'Carregar Mapa MOI'}
                        </span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: .xlsx, .xls, .csv
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Visualizar/Editar MOI */
            <div className="space-y-6">
              {/* Info do MOI */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      Mapa MOI - {format(currentMOI.data_geracao, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <Badge {...getStatusBadge(currentMOI.status)}>
                      {getStatusBadge(currentMOI.status).label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Data de Geração</p>
                      <p className="text-sm text-muted-foreground">
                        {format(currentMOI.data_geracao, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mês Referência</p>
                      <p className="text-sm text-muted-foreground">
                        {currentMOI.mes_referencia}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Motoristas</p>
                      <p className="text-sm text-muted-foreground">
                        {currentMOI.motoristas.length} com divisão
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Responsável</p>
                      <p className="text-sm text-muted-foreground">
                        {currentMOI.usuario_responsavel}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de Motoristas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Motoristas com Divisão</CardTitle>
                  {editingMOI && (
                    <Button variant="outline" size="sm" onClick={addMotorista}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>CCA Principal</TableHead>
                        <TableHead>Divisão</TableHead>
                        {editingMOI && <TableHead>Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentMOI.motoristas.map((motorista, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {editingMOI ? (
                              <Input
                                value={motorista.motorista}
                                onChange={(e) => updateMotorista(index, 'motorista', e.target.value)}
                                className="w-full"
                              />
                            ) : (
                              motorista.motorista
                            )}
                          </TableCell>
                          <TableCell>
                            {editingMOI ? (
                              <Input
                                value={motorista.matricula || ''}
                                onChange={(e) => updateMotorista(index, 'matricula', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              motorista.matricula
                            )}
                          </TableCell>
                          <TableCell>
                            {editingMOI ? (
                              <Input
                                value={motorista.placa || ''}
                                onChange={(e) => updateMotorista(index, 'placa', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              motorista.placa
                            )}
                          </TableCell>
                          <TableCell>
                            {editingMOI ? (
                              <Input
                                value={motorista.cca_principal}
                                onChange={(e) => updateMotorista(index, 'cca_principal', e.target.value)}
                                className="w-24"
                              />
                            ) : (
                              motorista.cca_principal
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {motorista.divisao_ccas.map((divisao, divIndex) => (
                                <div key={divIndex} className="flex items-center gap-2 text-sm">
                                  <span className="font-mono">{divisao.cca}</span>
                                  <span className="text-muted-foreground">→</span>
                                  <span className="font-medium">{divisao.percentual}%</span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          {editingMOI && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMotorista(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};