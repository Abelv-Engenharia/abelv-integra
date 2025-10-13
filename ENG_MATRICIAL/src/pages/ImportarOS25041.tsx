import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dados extraídos da planilha EM_Controle_de_OS_MEC_R02-7.xlsm - CCA 25041
const osDataFromExcel = [
  { numero: "88", familia: "204", descricao: "Tubo e conexões em CPVC (SCH80)", valorHH: 95.00, hhApropriada: 40, valorOS: 3800.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "89", familia: "233", descricao: "Tubos de cobre", valorHH: 95.00, hhApropriada: 22, valorOS: 2090.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "90", familia: "238", descricao: "Válvulas e acessórios", valorHH: 95.00, hhApropriada: 26, valorOS: 2470.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "91", familia: "240", descricao: "Equipamentos contra incêndio", valorHH: 95.00, hhApropriada: 12, valorOS: 1140.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "92", familia: "241", descricao: "Bombas", valorHH: 95.00, hhApropriada: 20, valorOS: 1900.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "93", familia: "244", descricao: "Louças e metais sanitários, registros brutos e cromados", valorHH: 95.00, hhApropriada: 28, valorOS: 2660.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "94", familia: "250", descricao: "Tubos de aço carbono para sistema Groove", valorHH: 95.00, hhApropriada: 22, valorOS: 2090.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "95", familia: "251", descricao: "Acoplamentos e Conexões para sistema Groove", valorHH: 95.00, hhApropriada: 6, valorOS: 570.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "96", familia: "264", descricao: "ETA", valorHH: 95.00, hhApropriada: 6, valorOS: 570.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "97", familia: "265", descricao: "Óleo Diesel", valorHH: 95.00, hhApropriada: 18, valorOS: 1710.00, inicio: "30/09/25", termino: "30/12/25" },
  { numero: "98", familia: "269", descricao: "Água quente", valorHH: 95.00, hhApropriada: 36, valorOS: 3420.00, inicio: "30/09/25", termino: "30/12/25" },
];

const CCA_INFO = {
  numero: "25041",
  nome: "Hosp. OPY HMME",
  responsavel: "Everton Kiyosue"
};

export default function ImportarOS25041() {
  const { toast } = useToast();
  const { addOS, osList } = useOS();
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);

  const handleImportAll = () => {
    setIsImporting(true);
    
    try {
      let osAdicionadas = 0;
      
      osDataFromExcel.forEach((osData) => {
        // Verificar se já existe uma OS com este número
        const osExistente = osList.find(os => os.numero === osData.numero);
        
        if (!osExistente) {
          const dataInicioFormatada = convertDateFormat(osData.inicio);
          const dataTerminoFormatada = convertDateFormat(osData.termino);

          const novaOS = {
            numero: osData.numero,
            cca: CCA_INFO.numero,
            nomeSolicitante: CCA_INFO.responsavel,
            cliente: CCA_INFO.nome.toLowerCase(),
            disciplina: "mecanica",
            disciplinasEnvolvidas: ["Mecânica"],
            familiaSAO: `Família ${osData.familia}`,
            descricao: osData.descricao,
            dataCompromissada: dataTerminoFormatada,
            valorOrcamento: "0",
            anexos: [],
            responsavelEM: "Ricardo Cunha",
            status: "aberta",
            dataAbertura: dataInicioFormatada
          };
          
          addOS(novaOS);
          osAdicionadas++;
        }
      });

      setImportCompleted(true);
      
      toast({
        title: "Importação concluída!",
        description: osAdicionadas > 0 
          ? `${osAdicionadas} novas OS importadas como "Abertas".`
          : "Todas as OS já existiam no sistema.",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/os-abertas?disc=mecanica");
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalHH = osDataFromExcel.reduce((acc, os) => acc + os.hhApropriada, 0);
  const totalValor = osDataFromExcel.reduce((acc, os) => acc + os.valorOS, 0);

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
          <h1 className="text-3xl font-bold">Importar OS - CCA 25041</h1>
          <p className="text-muted-foreground">
            Planilha: EM_Controle_de_OS_MEC_R02-7.xlsm | {CCA_INFO.nome}
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Importação</CardTitle>
          <CardDescription>
            Todas as OS serão importadas com status "ABERTA" para posterior inserção de informações.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total de OS</p>
              <p className="text-2xl font-bold">{osDataFromExcel.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">CCA</p>
              <p className="text-2xl font-bold">{CCA_INFO.numero}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total HH</p>
              <p className="text-2xl font-bold">{totalHH}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValor)}</p>
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
                  Importar {osDataFromExcel.length} OS como "Abertas"
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
            OS que serão importadas - {CCA_INFO.nome} | Responsável: {CCA_INFO.responsavel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OS Nº</TableHead>
                  <TableHead>Família</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">HH</TableHead>
                  <TableHead className="text-right">Valor OS</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {osDataFromExcel.map((os) => (
                  <TableRow key={os.numero}>
                    <TableCell className="font-medium">{os.numero}</TableCell>
                    <TableCell>{os.familia}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {os.descricao}
                    </TableCell>
                    <TableCell className="text-right">{os.hhApropriada}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(os.valorOS)}
                    </TableCell>
                    <TableCell className="text-sm">{os.inicio}</TableCell>
                    <TableCell className="text-sm">{os.termino}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Aberta</Badge>
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
