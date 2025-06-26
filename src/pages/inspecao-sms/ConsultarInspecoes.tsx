import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Search, Download, Eye, FileSearch, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ConsultarInspecoes = () => {
  const [inspecoes, setInspecoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tiposInspecao, setTiposInspecao] = useState<any[]>([]);
  const [filtros, setFiltros] = useState({
    tipo_inspecao: '',
    situacao: '',
    responsavel: '',
    data_inicio: undefined as Date | undefined,
    data_fim: undefined as Date | undefined,
    local: ''
  });
  const [inspecaoDetalhes, setInspecaoDetalhes] = useState<any>(null);
  const [dialogDetalhesOpen, setDialogDetalhesOpen] = useState(false);
  
  const { data: userCCAs = [] } = useUserCCAs();

  const loadTiposInspecao = async () => {
    try {
      const { data } = await supabase
        .from('tipos_inspecao_sms')
        .select('*')
        .eq('ativo', true);
      
      if (data) {
        setTiposInspecao(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const loadInspecoes = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('inspecoes_sms')
        .select(`
          *,
          modelos_inspecao_sms(
            nome,
            tipos_inspecao_sms(nome)
          ),
          profiles(nome)
        `)
        .order('data_inspecao', { ascending: false });

      // Aplicar filtro por CCAs do usuário
      const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : [];
      if (ccaIds.length > 0) {
        query = query.in('cca_id', ccaIds);
      }

      // Aplicar filtros
      if (filtros.tipo_inspecao) {
        const { data: modelosDoTipo } = await supabase
          .from('modelos_inspecao_sms')
          .select('id')
          .eq('tipo_inspecao_id', filtros.tipo_inspecao);
        
        if (modelosDoTipo) {
          const modeloIds = modelosDoTipo.map(m => m.id);
          query = query.in('modelo_id', modeloIds);
        }
      }

      if (filtros.situacao) {
        if (filtros.situacao === 'com_nao_conformidade') {
          query = query.eq('tem_nao_conformidade', true);
        } else if (filtros.situacao === 'sem_nao_conformidade') {
          query = query.eq('tem_nao_conformidade', false);
        }
      }

      if (filtros.data_inicio) {
        query = query.gte('data_inspecao', format(filtros.data_inicio, 'yyyy-MM-dd'));
      }

      if (filtros.data_fim) {
        query = query.lte('data_inspecao', format(filtros.data_fim, 'yyyy-MM-dd'));
      }

      if (filtros.local) {
        query = query.ilike('local', `%${filtros.local}%`);
      }

      const { data } = await query;
      
      if (data) {
        setInspecoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar inspeções:', error);
    } finally {
      setLoading(false);
    }
  };

  const visualizarDetalhes = async (inspecaoId: string) => {
    try {
      const { data } = await supabase
        .from('inspecoes_sms')
        .select(`
          *,
          modelos_inspecao_sms(
            nome,
            tipos_inspecao_sms(nome)
          ),
          profiles(nome),
          ccas(codigo, nome)
        `)
        .eq('id', inspecaoId)
        .single();
      
      if (data) {
        setInspecaoDetalhes(data);
        setDialogDetalhesOpen(true);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  const baixarPDF = (inspecao: any) => {
    if (inspecao.pdf_gerado_url) {
      window.open(inspecao.pdf_gerado_url, '_blank');
    } else {
      // Simular geração de PDF
      alert('PDF não disponível. Gerando PDF...');
    }
  };

  const limparFiltros = () => {
    setFiltros({
      tipo_inspecao: '',
      situacao: '',
      responsavel: '',
      data_inicio: undefined,
      data_fim: undefined,
      local: ''
    });
  };

  useEffect(() => {
    loadTiposInspecao();
  }, []);

  useEffect(() => {
    if (userCCAs.length >= 0) {
      loadInspecoes();
    }
  }, [userCCAs, filtros]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileSearch className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Consultar Inspeções SMS</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <Label>Tipo de Inspeção</Label>
              <Select 
                value={filtros.tipo_inspecao} 
                onValueChange={(value) => setFiltros({...filtros, tipo_inspecao: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tiposInspecao.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Situação</Label>
              <Select 
                value={filtros.situacao} 
                onValueChange={(value) => setFiltros({...filtros, situacao: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as situações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as situações</SelectItem>
                  <SelectItem value="com_nao_conformidade">Com Não Conformidade</SelectItem>
                  <SelectItem value="sem_nao_conformidade">Sem Não Conformidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data Início</Label>
              <DatePickerWithManualInput
                value={filtros.data_inicio}
                onChange={(date) => setFiltros({...filtros, data_inicio: date})}
              />
            </div>

            <div>
              <Label>Data Fim</Label>
              <DatePickerWithManualInput
                value={filtros.data_fim}
                onChange={(date) => setFiltros({...filtros, data_fim: date})}
              />
            </div>

            <div>
              <Label>Local</Label>
              <Input
                value={filtros.local}
                onChange={(e) => setFiltros({...filtros, local: e.target.value})}
                placeholder="Filtrar por local"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={loadInspecoes} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
              <Button variant="outline" onClick={limparFiltros}>
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>
            Inspeções Encontradas ({inspecoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando inspeções...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspecoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhuma inspeção encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  inspecoes.map((inspecao) => (
                    <TableRow key={inspecao.id}>
                      <TableCell>
                        {format(new Date(inspecao.data_inspecao), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {inspecao.modelos_inspecao_sms?.tipos_inspecao_sms?.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {inspecao.modelos_inspecao_sms?.nome}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{inspecao.local}</TableCell>
                      <TableCell>{inspecao.profiles?.nome}</TableCell>
                      <TableCell>
                        {inspecao.tem_nao_conformidade ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <XCircle className="h-3 w-3" />
                            Não Conforme
                          </Badge>
                        ) : (
                          <Badge variant="default" className="flex items-center gap-1 w-fit bg-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Conforme
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => visualizarDetalhes(inspecao.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {inspecao.tem_nao_conformidade && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => baixarPDF(inspecao)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogDetalhesOpen} onOpenChange={setDialogDetalhesOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Inspeção</DialogTitle>
          </DialogHeader>
          
          {inspecaoDetalhes && (
            <div className="space-y-4">
              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Data da Inspeção</Label>
                      <p>{format(new Date(inspecaoDetalhes.data_inspecao), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Responsável</Label>
                      <p>{inspecaoDetalhes.profiles?.nome}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Local</Label>
                      <p>{inspecaoDetalhes.local}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">CCA</Label>
                      <p>{inspecaoDetalhes.ccas ? `${inspecaoDetalhes.ccas.codigo} - ${inspecaoDetalhes.ccas.nome}` : 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tipo</Label>
                      <p>{inspecaoDetalhes.modelos_inspecao_sms?.tipos_inspecao_sms?.nome}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Modelo</Label>
                      <p>{inspecaoDetalhes.modelos_inspecao_sms?.nome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Itens Verificados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Itens Verificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(inspecaoDetalhes.dados_preenchidos?.itens || []).map((item: any, index: number) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <span className="font-medium">{index + 1}. {item.nome}</span>
                        <Badge 
                          variant={
                            item.status === 'conforme' ? 'default' :
                            item.status === 'nao_conforme' ? 'destructive' : 
                            'secondary'
                          }
                          className={
                            item.status === 'conforme' ? 'bg-green-600' : ''
                          }
                        >
                          {item.status === 'conforme' ? 'Conforme' :
                           item.status === 'nao_conforme' ? 'Não Conforme' :
                           'Não se Aplica'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              {inspecaoDetalhes.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{inspecaoDetalhes.observacoes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultarInspecoes;
