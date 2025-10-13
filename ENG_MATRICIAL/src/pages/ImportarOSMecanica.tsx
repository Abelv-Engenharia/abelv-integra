import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dados extraídos da planilha EM_Controle_de_OS_MEC_R02.xlsm - Setembro/2025
const osDataFromExcel = [
  { numero: "67", cca: "23015", descricaoCliente: "Hospital Sabará", responsavel: "Denise Maliniak", descricao: "Tanque de aço carbono", valorHH: 95.00, hhApropriada: 3, valorOS: 285.00, valorSAO: 37704.00, terminoPrevisto: "25/04/25", competencia: "Sep-25" },
  { numero: "78", cca: "24021", descricaoCliente: "Rousselot", responsavel: "Tiago Matos", descricao: "Avaliação Técnica TQ Sand Screw, Elaboração de Projeto SKID's Quimicos, Compatibilização Agitador Semco", valorHH: 95.00, hhApropriada: 53, valorOS: 5035.00, valorSAO: null, terminoPrevisto: "22/08/25", competencia: "Sep-25" },
  { numero: "80", cca: "25028", descricaoCliente: "LIBBS", responsavel: "Douglas Gomes", descricao: "Avaliação Técnica e compra de tanques da familia 246", valorHH: 95.00, hhApropriada: 28, valorOS: 2660.00, valorSAO: null, terminoPrevisto: "13/08/25", competencia: "Sep-25" },
  { numero: "81", cca: "25028", descricaoCliente: "LIBBS", responsavel: "Douglas Gomes", descricao: "Avaliação Técnica e compra de escada da familia 247", valorHH: 95.00, hhApropriada: 22, valorOS: 2090.00, valorSAO: null, terminoPrevisto: "14/08/25", competencia: "Sep-25" },
  { numero: "83", cca: "25028", descricaoCliente: "LIBBS", responsavel: "Douglas Gomes", descricao: "Avaliação Técnica e compra de valvulas da familia 238/261/266", valorHH: 95.00, hhApropriada: 35, valorOS: 3325.00, valorSAO: null, terminoPrevisto: "08/08/25", competencia: "Sep-25" },
  { numero: "84", cca: "23015", descricaoCliente: "Hospital Sabará", responsavel: "Denise Maliniak", descricao: "Complemento de horas familia 241/242/216/218/269/267", valorHH: 95.00, hhApropriada: 50, valorOS: 4750.00, valorSAO: null, terminoPrevisto: "29/08/25", competencia: "Sep-25" },
  { numero: "99", cca: "", descricaoCliente: "", responsavel: "", descricao: "", valorHH: 95.00, hhApropriada: 0, valorOS: 0, valorSAO: null, terminoPrevisto: "30/09/25", competencia: "Sep-25" },
];

export default function ImportarOSMecanica() {
  const { toast } = useToast();
  const { addOS, osList, finalizarOS, aceitarFechamento, updateOSHH } = useOS();
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);

  const handleImportAll = () => {
    setIsImporting(true);
    
    try {
      // NÃO limpar as OS antigas - manter OS existentes
      
      // Criar apenas OS que não existem (por número) e excluir OS 99 que está vazia
      let osAdicionadas = 0;
      osDataFromExcel.filter(os => os.numero !== "99").forEach((osData) => {
        const dataCompromissadaFormatada = convertDateFormat(osData.terminoPrevisto);
        const dataCompromissadaObj = new Date(dataCompromissadaFormatada);
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        const osJaFechada = dataCompromissadaObj < dataAtual;

        // Verificar se já existe uma OS com este número
        const osExistente = osList.find(os => os.numero === osData.numero);
        
        if (!osExistente) {
          // Importar SEMPRE como concluída na competência informada
          const dataConclusaoISO = parseCompetenciaToISO(osData.competencia as string, dataCompromissadaFormatada);
          const competenciaCalculada = competenciaFromISO(dataConclusaoISO);

          const novaOS = {
            numero: osData.numero,
            cca: osData.cca,
            nomeSolicitante: osData.responsavel || "Sistema",
            cliente: osData.descricaoCliente.toLowerCase(),
            disciplina: "mecanica",
            disciplinasEnvolvidas: ["Mecânica"],
            familiaSAO: "Engenharia Mecânica",
            descricao: osData.descricao,
            dataCompromissada: dataCompromissadaFormatada,
            valorOrcamento: (osData.valorSAO || osData.valorOS || 0).toString(),
            anexos: [],
            responsavelEM: "Ricardo Cunha",
            status: "concluida",
            dataConclusao: dataConclusaoISO,
            dataEntregaReal: dataConclusaoISO,
            competencia: competenciaCalculada,
            valorSAO: osData.valorSAO || osData.valorOS || 0,
            valorEngenharia: osData.valorSAO || osData.valorOS || 0,
            valorSuprimentos: osData.valorSAO || osData.valorOS || 0,
            valorFinal: osData.valorSAO || osData.valorOS || 0,
            hhPlanejado: osData.hhApropriada,
            percentualSaving: 0
          };
          
          addOS(novaOS);
          osAdicionadas++;
        } else if (osExistente) {
          // Atualizar HH da OS existente sempre
          updateOSHH(osExistente.id, osData.hhApropriada || 0);
          
          // Forçar fechamento na competência informada
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
          ? `${osAdicionadas} novas OS importadas. ${osDataFromExcel.length - 1 - osAdicionadas} OS já existentes foram mantidas.`
          : "Todas as OS já existiam no sistema.",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/os-abertas?hoje=1&disc=mecanica");
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

  const osParaExibir = osDataFromExcel.filter(os => os.numero !== "99");

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
          <h1 className="text-3xl font-bold">Importar OS - Engenharia Matricial Mecânica</h1>
          <p className="text-muted-foreground">
            Planilha: EM_Controle_de_OS_MEC_R02.xlsm
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
              <p className="text-2xl font-bold">{osParaExibir.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Disciplina</p>
              <p className="text-2xl font-bold">Mecânica</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Responsável EM</p>
              <p className="text-2xl font-bold">Ricardo Cunha</p>
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
                  Importar {osParaExibir.length} OS
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
            OS que serão importadas
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
                {osParaExibir.map((os) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
