import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, FileSpreadsheet, Calendar } from "lucide-react";
import { useCCAs } from "@/hooks/useCCAs";
import { exportDesviosToExcel } from "@/services/desvios/exportService";
import { exportTreinamentosExecucaoToExcel } from "@/services/export/execucaoTreinamentosExportService";
import { exportTreinamentosNormativosToExcel } from "@/services/export/treinamentosNormativosExportService";
import { exportHoraSegurancaToExcel } from "@/services/export/horaSegurancaExportService";
import { exportOcorrenciasToExcel } from "@/services/export/ocorrenciasExportService";

const ExportacaoDados = () => {
  const { toast } = useToast();
  const { data: ccas = [] } = useCCAs();
  
  const [tipoExportacao, setTipoExportacao] = useState("");
  const [ccaSelecionado, setCcaSelecionado] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const tiposExportacao = [
    { value: "desvios", label: "Desvios" },
    { value: "execucao-treinamentos", label: "Execução de Treinamentos" },
    { value: "treinamentos-normativos", label: "Treinamentos Normativos" },
    { value: "hora-seguranca", label: "Hora da Segurança" },
    { value: "ocorrencias", label: "Ocorrências" }
  ];

  const handleExport = async () => {
    if (!tipoExportacao) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de dados para exportar",
        variant: "destructive",
      });
      return;
    }

    if (!dataInicial || !dataFinal) {
      toast({
        title: "Erro",
        description: "Selecione o período para exportação",
        variant: "destructive",
      });
      return;
    }

    if (new Date(dataInicial) > new Date(dataFinal)) {
      toast({
        title: "Erro",
        description: "A data inicial deve ser anterior à data final",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const filters = {
        dataInicial,
        dataFinal,
        ccaId: ccaSelecionado && ccaSelecionado !== "todos" ? ccaSelecionado : undefined
      };

      let result;
      
      switch (tipoExportacao) {
        case "desvios":
          result = await exportDesviosToExcel(filters);
          break;
        case "execucao-treinamentos":
          result = await exportTreinamentosExecucaoToExcel(filters);
          break;
        case "treinamentos-normativos":
          result = await exportTreinamentosNormativosToExcel(filters);
          break;
        case "hora-seguranca":
          result = await exportHoraSegurancaToExcel(filters);
          break;
        case "ocorrencias":
          result = await exportOcorrenciasToExcel(filters);
          break;
        default:
          throw new Error("Tipo de exportação não reconhecido");
      }

      toast({
        title: "Exportação concluída",
        description: `Arquivo ${result.filename} gerado com sucesso!`,
      });
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast({
        title: "Erro na exportação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetForm = () => {
    setTipoExportacao("");
    setCcaSelecionado("");
    setDataInicial("");
    setDataFinal("");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Download className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Exportação de Dados</h1>
          <p className="text-muted-foreground">
            Exporte dados do sistema em formato Excel para análise
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Configurações de Exportação
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para exportação dos dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de Exportação */}
          <div className="space-y-2">
            <Label htmlFor="tipo-exportacao">Tipo de Dados</Label>
            <Select 
              value={tipoExportacao} 
              onValueChange={setTipoExportacao}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de dados para exportar" />
              </SelectTrigger>
              <SelectContent>
                {tiposExportacao.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CCA Seleção */}
          <div className="space-y-2">
            <Label htmlFor="cca">CCA (Opcional)</Label>
            <Select 
              value={ccaSelecionado} 
              onValueChange={setCcaSelecionado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os CCAs ou selecione um específico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os CCAs</SelectItem>
                {ccas.map((cca) => (
                  <SelectItem key={cca.id} value={cca.id.toString()}>
                    {cca.codigo} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-inicial" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data Inicial
              </Label>
              <Input
                id="data-inicial"
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-final" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data Final
              </Label>
              <Input
                id="data-final"
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar Dados"}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetForm}
              disabled={isExporting}
            >
              Limpar Filtros
            </Button>
          </div>

          {/* Informações */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informações sobre a Exportação:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• O arquivo será gerado no formato Excel (.xlsx)</li>
              <li>• Todas as colunas das tabelas serão incluídas</li>
              <li>• Os dados são filtrados pelo período selecionado</li>
              <li>• Se nenhum CCA for selecionado, todos os CCAs serão incluídos</li>
              <li>• O download iniciará automaticamente após a geração</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportacaoDados;