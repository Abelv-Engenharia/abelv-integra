import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, XCircle, Clock, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const InspecaoSMSDashboard = () => {
  const [totalInspecoes, setTotalInspecoes] = useState(0);
  const [conformes, setConformes] = useState(0);
  const [naoConformes, setNaoConformes] = useState(0);
  const [ultimasInspecoes, setUltimasInspecoes] = useState<any[]>([]);
  const [tiposInspecao, setTiposInspecao] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const { data: userCCAs = [] } = useUserCCAs();

  const loadData = async () => {
    try {
      const mesAtual = new Date().getMonth() + 1;
      const anoAtual = new Date().getFullYear();
      
      // Filtrar por CCAs do usuário
      const ccaIds = userCCAs.length > 0 ? userCCAs.map(cca => cca.id) : [];
      
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
        .gte('created_at', `${anoAtual}-${mesAtual.toString().padStart(2, '0')}-01`)
        .order('created_at', { ascending: false });

      if (ccaIds.length > 0) {
        query = query.in('cca_id', ccaIds);
      }

      if (filtroTipo) {
        const { data: modelosDoTipo } = await supabase
          .from('modelos_inspecao_sms')
          .select('id')
          .eq('tipo_inspecao_id', filtroTipo);
        
        if (modelosDoTipo) {
          const modeloIds = modelosDoTipo.map(m => m.id);
          query = query.in('modelo_id', modeloIds);
        }
      }

      if (dataInicio) {
        query = query.gte('data_inspecao', format(dataInicio, 'yyyy-MM-dd'));
      }

      if (dataFim) {
        query = query.lte('data_inspecao', format(dataFim, 'yyyy-MM-dd'));
      }

      const { data: inspecoes } = await query;

      if (inspecoes) {
        setTotalInspecoes(inspecoes.length);
        setConformes(inspecoes.filter(i => !i.tem_nao_conformidade).length);
        setNaoConformes(inspecoes.filter(i => i.tem_nao_conformidade).length);
        setUltimasInspecoes(inspecoes.slice(0, 10));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

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
      console.error('Erro ao carregar tipos de inspeção:', error);
    }
  };

  useEffect(() => {
    loadTiposInspecao();
  }, []);

  useEffect(() => {
    if (userCCAs.length >= 0) {
      loadData();
    }
  }, [userCCAs, filtroTipo, dataInicio, dataFim]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileSearch className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Dashboard - Inspeção SMS</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Inspeção</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
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
              <label className="text-sm font-medium">Data Início</label>
              <DatePickerWithManualInput
                value={dataInicio}
                onChange={setDataInicio}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Fim</label>
              <DatePickerWithManualInput
                value={dataFim}
                onChange={setDataFim}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadData} className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInspecoes}</div>
            <p className="text-xs text-muted-foreground">
              No período selecionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{conformes}</div>
            <p className="text-xs text-muted-foreground">
              {totalInspecoes > 0 ? `${((conformes / totalInspecoes) * 100).toFixed(1)}%` : '0%'} do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Conformes</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{naoConformes}</div>
            <p className="text-xs text-muted-foreground">
              {totalInspecoes > 0 ? `${((naoConformes / totalInspecoes) * 100).toFixed(1)}%` : '0%'} do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalInspecoes > 0 ? `${((conformes / totalInspecoes) * 100).toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 90%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista das Últimas Inspeções */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Inspeções Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ultimasInspecoes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma inspeção encontrada no período selecionado.
              </p>
            ) : (
              ultimasInspecoes.map((inspecao) => (
                <div key={inspecao.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {inspecao.modelos_inspecao_sms?.tipos_inspecao_sms?.nome || 'Tipo não definido'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {inspecao.modelos_inspecao_sms?.nome || 'Modelo não definido'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Local: {inspecao.local} | Responsável: {inspecao.profiles?.nome}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {format(new Date(inspecao.data_inspecao), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                    <div className="flex items-center gap-1">
                      {inspecao.tem_nao_conformidade ? (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600">Não Conforme</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600">Conforme</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspecaoSMSDashboard;
