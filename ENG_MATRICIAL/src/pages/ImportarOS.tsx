import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dados extraídos da planilha EM_Controle_de_OS_ELE_R03.xlsx - Setembro/2025
const osDataFromExcel = [
  { numero: "112", cca: "23015", descricaoCliente: "Hospital Sabará", responsavel: "Denise Maliniak", descricao: "Estudo Cargas - HVAC - ARPOL - 01/09 ( Planilha Comprativa )", valorHH: 95.00, hhApropriada: 8, valorOS: 760.00, valorSAO: null, terminoPrevisto: "10/09/25", competencia: "Sep-25" },
  { numero: "113", cca: "1521", descricaoCliente: "Orçamentos", responsavel: "Rogério / Allan", descricao: "Suporte em Balizamento e Apoio Técnico - Novo Nordisk - Elétrica K2G", valorHH: 95.00, hhApropriada: 8, valorOS: 760.00, valorSAO: null, terminoPrevisto: "10/09/25", competencia: "Sep-25" },
  { numero: "114", cca: "23015", descricaoCliente: "Hospital Sabará", responsavel: "Denise Maliniak", descricao: "Emissão de Escopo Técnico e MC 126.001 - Baramento Blindado", valorHH: 95.00, hhApropriada: 25, valorOS: 2375.00, valorSAO: null, terminoPrevisto: "30/09/25", competencia: "Sep-25" },
  { numero: "115", cca: "24021", descricaoCliente: "Rousselot - Projeto Canindé", responsavel: "Tiago Matos", descricao: "Análise Estudo de Seletividade", valorHH: 95.00, hhApropriada: 10, valorOS: 950.00, valorSAO: null, terminoPrevisto: "09/09/25", competencia: "Sep-25" },
  { numero: "116", cca: "25041", descricaoCliente: "OPY - HMME Dona Regina", responsavel: "Everton Kyosue", descricao: "Emissão de Primeiros Estudos e Projetos - Reengenharia", valorHH: 95.00, hhApropriada: 60, valorOS: 5700.00, valorSAO: null, terminoPrevisto: "30/09/25", competencia: "Sep-25" },
  { numero: "117", cca: "25028", descricaoCliente: "Libbs - Projeto Nova CAG", responsavel: "Gustavo Piagentinni", descricao: "Suporte Técnico Geral Elétrica", valorHH: 95.00, hhApropriada: 65, valorOS: 6175.00, valorSAO: null, terminoPrevisto: "30/09/25", competencia: "Sep-25" },
  { numero: "118", cca: "22043", descricaoCliente: "Monin - Projeto NUBR", responsavel: "Everton Kyosue", descricao: "Apoio Emergencial - Inauguração", valorHH: 95.00, hhApropriada: 8, valorOS: 760.00, valorSAO: null, terminoPrevisto: "23/09/25", competencia: "Sep-25" },
];

export default function ImportarOS() {
  const { toast } = useToast();
  const { addOS, osList, finalizarOS, aceitarFechamento, updateOSHH } = useOS();
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);

  const handleImportAll = () => {
    setIsImporting(true);
    
    try {
      // NÃO limpar as OS antigas - manter OS existentes
      
      // Criar apenas OS que não existem (por número)
      let osAdicionadas = 0;
      osDataFromExcel.forEach((osData) => {
        const dataCompromissadaFormatada = convertDateFormat(osData.terminoPrevisto);
        const dataCompromissadaObj = new Date(dataCompromissadaFormatada);
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        const osJaFechada = dataCompromissadaObj < dataAtual;

        // Verificar se já existe uma OS com este número
        const osExistente = osList.find(os => os.numero === osData.numero);
        
        if (!osExistente) {
          if (osJaFechada) {
            // Importar como OS concluída com data original
            const mes = String(dataCompromissadaObj.getMonth() + 1).padStart(2, '0');
            const ano = dataCompromissadaObj.getFullYear();
            const competenciaCalculada = `${mes}/${ano}`;
            
            const novaOS = {
              numero: osData.numero,
              cca: osData.cca,
              nomeSolicitante: osData.responsavel || "Sistema",
              cliente: osData.descricaoCliente.toLowerCase(),
              disciplina: "eletrica",
              disciplinasEnvolvidas: ["Elétrica"],
              familiaSAO: "Engenharia Elétrica",
              descricao: osData.descricao,
              dataCompromissada: dataCompromissadaFormatada,
              valorOrcamento: (osData.valorSAO || osData.valorOS || 0).toString(),
              anexos: [],
              responsavelEM: "Elton Anthony",
              status: "concluida",
              dataConclusao: dataCompromissadaFormatada, // Usa data original da planilha
              dataEntregaReal: dataCompromissadaFormatada, // Usa data original da planilha
              competencia: competenciaCalculada,
              valorSAO: osData.valorSAO || osData.valorOS || 0,
              valorEngenharia: osData.valorSAO || osData.valorOS || 0,
              valorSuprimentos: osData.valorSAO || osData.valorOS || 0,
              valorFinal: osData.valorSAO || osData.valorOS || 0,
              hhPlanejado: osData.hhApropriada,
              percentualSaving: 0
            };
            
            addOS(novaOS);
          } else {
            // Importar como OS aberta
            const novaOS = {
              numero: osData.numero,
              cca: osData.cca,
              nomeSolicitante: osData.responsavel || "Sistema",
              cliente: osData.descricaoCliente.toLowerCase(),
              disciplina: "eletrica",
              disciplinasEnvolvidas: ["Elétrica"],
              familiaSAO: "Engenharia Elétrica",
              descricao: osData.descricao,
              dataCompromissada: dataCompromissadaFormatada,
              valorOrcamento: "0",
              anexos: [],
              responsavelEM: "Elton Anthony"
            };
            
            addOS(novaOS);
          }
          
          osAdicionadas++;
        } else if (osExistente) {
          // Atualizar HH da OS existente sempre
          updateOSHH(osExistente.id, osData.hhApropriada || 0);
          
          // Forçar fechamento na competência informada (sempre atualiza)
          const dataConclusaoISO = parseCompetenciaToISO(osData.competencia as string, dataCompromissadaFormatada);
          const valor = String(osData.valorSAO || osData.valorOS || 0);
          finalizarOS(osExistente.id, valor, valor, dataConclusaoISO);
          aceitarFechamento(osExistente.id);
        }
      });

      setImportCompleted(true);
      
      toast({
        title: "Importação concluída!",
        description: osAdicionadas > 0 
          ? `${osAdicionadas} novas OS importadas. ${osDataFromExcel.length - osAdicionadas} OS já existentes foram mantidas.`
          : "Todas as OS já existiam no sistema.",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/os-abertas?hoje=1&disc=eletrica");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar as OS.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Converter formato de data DD/MM/YY para YYYY-MM-DD
  const convertDateFormat = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Converte competência no formato 'Sep-25' para a última data do mês (YYYY-MM-DD)
  const parseCompetenciaToISO = (competencia: string | undefined, fallbackISO: string): string => {
    if (!competencia) return fallbackISO;
    const [mon, yy] = competencia.split('-');
    const map: Record<string, number> = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
    const mIdx = map[mon as keyof typeof map];
    const fullYear = yy.length === 2 ? 2000 + parseInt(yy) : parseInt(yy);
    if (mIdx === undefined || isNaN(fullYear)) return fallbackISO;
    const lastDay = new Date(fullYear, mIdx + 1, 0).getDate();
    const mm = String(mIdx + 1).padStart(2, '0');
    const dd = String(lastDay).padStart(2, '0');
    return `${fullYear}-${mm}-${dd}`;
  };

  const competenciaFromISO = (iso: string) => {
    const d = new Date(iso);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${mm}/${yy}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/os-abertas">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
           <h1 className="text-3xl font-bold">Importar OS - Engenharia Matricial Elétrica</h1>
          <p className="text-muted-foreground">
            Planilha: EM_Controle_de_OS_ELE_R03.xlsx
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Importação</CardTitle>
          <CardDescription>
            Todas as OS serão importadas com status "ABERTA" e data de abertura de hoje.
            <br />
            O Valor SAO será importado da coluna "Custo S.A.O" quando disponível na planilha.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total de OS</p>
              <p className="text-2xl font-bold">{osDataFromExcel.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Disciplina</p>
              <p className="text-2xl font-bold">Elétrica</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Responsável EM</p>
              <p className="text-2xl font-bold">Elton Anthony</p>
            </div>
          </div>

          {!importCompleted ? (
            <Button 
              onClick={handleImportAll} 
              disabled={isImporting}
              size="lg"
              className="w-full"
            >
              {isImporting ? (
                <>Importando...</>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Importar {osDataFromExcel.length} OS
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300 font-medium">
                Importação concluída! Redirecionando...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pré-visualização das OS</CardTitle>
          <CardDescription>
            Primeiras 10 OS que serão importadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OS Nº</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">HH</TableHead>
                  <TableHead className="text-right">Valor SAO</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Competência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {osDataFromExcel.slice(0, 10).map((os) => (
                  <TableRow key={os.numero}>
                    <TableCell className="font-medium">{os.numero}</TableCell>
                    <TableCell>{os.cca}</TableCell>
                    <TableCell>{os.descricaoCliente}</TableCell>
                    <TableCell className="text-sm">{os.responsavel || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {os.descricao}
                    </TableCell>
                    <TableCell className="text-right">{os.hhApropriada}</TableCell>
                    <TableCell className="text-right">
                      {os.valorSAO ? (
                        <>
                          {formatCurrency(os.valorSAO)}
                          <div className="text-xs text-muted-foreground">(Custo S.A.O)</div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{os.terminoPrevisto}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{os.competencia}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {osDataFromExcel.length > 10 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              ... e mais {osDataFromExcel.length - 10} OS
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
