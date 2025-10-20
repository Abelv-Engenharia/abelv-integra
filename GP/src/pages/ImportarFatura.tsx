import { useState } from "react";
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { FaturaIntegra } from "@/types/travel";

const ImportarFatura = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importSuccess, setImportSuccess] = useState(false);
  const [totalImported, setTotalImported] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportSuccess(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      const data = await file.arrayBuffer();
      setProgress(30);

      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setProgress(50);

      const faturas: FaturaIntegra[] = jsonData.map((row: any) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        dataemissaofat: row["DATA EMISSÃO FAT"] || row["dataemissaofat"] || "",
        agencia: row["AGENCIA"] || row["agencia"] || "",
        numerodefat: row["NUMERO DE FAT"] || row["numerodefat"] || "",
        protocolo: row["PROTOCOLO"] || row["protocolo"] || "",
        datadacompra: row["DATA DA COMPRA"] || row["datadacompra"] || "",
        viajante: row["VIAJANTE"] || row["viajante"] || "",
        tipo: row["TIPO"] || row["tipo"] || "",
        hospedagem: row["HOSPEDAGEM"] || row["hospedagem"] || undefined,
        origem: row["ORIGEM"] || row["origem"] || "",
        destino: row["DESTINO"] || row["destino"] || "",
        checkin: row["CHECK-IN"] || row["checkin"] || undefined,
        checkout: row["CHECK-OUT"] || row["checkout"] || undefined,
        comprador: row["COMPRADOR"] || row["comprador"] || "",
        valorpago: parseFloat(row["VALOR PAGO"] || row["valorpago"] || "0"),
        motivoevento: row["MOTIVO_EVENTO"] || row["motivoevento"] || "",
        cca: row["CCA"] || row["cca"] || "",
        centrodecusto: row["CENTRO DE CUSTO"] || row["centrodecusto"] || "",
        antecedencia: row["ANTECEDENCIA"] || row["antecedencia"] || undefined,
        ciaida: row["CIA IDA"] || row["ciaida"] || undefined,
        ciavolta: row["CIA VOLTA"] || row["ciavolta"] || undefined,
        possuibagagem: row["POSSUI BAGAGEM"] || row["possuibagagem"] || "Não",
        valorpagodebagagem: row["VALOR PAGO DE BAGAGEM"] || row["valorpagodebagagem"] || undefined,
        observacao: row["OBSERVAÇÃO"] || row["observacao"] || undefined,
        quemsolicitouforapolitica: row["QUEM SOLICITOU? (FORA DA POLÍTICA)"] || row["quemsolicitouforapolitica"] || undefined,
        dentrodapolitica: row["DENTRO DA POLÍTICA"] || row["dentrodapolitica"] || "Sim",
        codconta: row["CÓD. CONTA"] || row["codconta"] || undefined,
        contafinanceira: row["CONTA FINANCEIRA"] || row["contafinanceira"] || undefined,
      }));

      setProgress(70);

      const existingFaturas: FaturaIntegra[] = JSON.parse(
        localStorage.getItem("faturas_integra") || "[]"
      );

      const allFaturas = [...existingFaturas, ...faturas];
      localStorage.setItem("faturas_integra", JSON.stringify(allFaturas));
      
      setProgress(100);
      setTotalImported(faturas.length);
      setImportSuccess(true);

      toast.success(`${faturas.length} faturas importadas com sucesso`);
    } catch (error) {
      console.error("Erro ao importar planilha:", error);
      toast.error("Erro ao importar planilha. Verifique o formato do arquivo.");
    } finally {
      setImporting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setProgress(0);
    setImportSuccess(false);
    setTotalImported(0);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Importar Fatura</h1>
      </div>

      {/* Card de Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {file ? `Arquivo selecionado: ${file.name}` : "Selecione um arquivo Excel (.xlsx) para importar"}
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={importing}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={importing} variant="outline">
                <span>Selecionar Arquivo</span>
              </Button>
            </label>
          </div>

          {/* Progress Bar */}
          {importing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Importando... {progress}%
              </p>
            </div>
          )}

          {/* Success Alert */}
          {importSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {totalImported} faturas importadas com sucesso!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Card de Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Formato Esperado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-semibold">O arquivo deve conter as seguintes colunas:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Data Emissão Fat</li>
                <li>Agencia</li>
                <li>Numero De Fat</li>
                <li>Protocolo</li>
                <li>Data Da Compra</li>
                <li>Viajante</li>
                <li>Tipo</li>
                <li>Hospedagem</li>
                <li>Origem</li>
              </ul>
              <ul className="list-disc list-inside space-y-1">
                <li>Destino</li>
                <li>Check-in</li>
                <li>Check-out</li>
                <li>Comprador</li>
                <li>Valor Pago</li>
                <li>Motivo_evento</li>
                <li>Cca</li>
                <li>Centro De Custo</li>
                <li>Antecedencia</li>
              </ul>
              <ul className="list-disc list-inside space-y-1">
                <li>Cia Ida</li>
                <li>Cia Volta</li>
                <li>Possui Bagagem</li>
                <li>Valor Pago De Bagagem</li>
                <li>Observação</li>
                <li>Quem Solicitou? (fora Da Política)</li>
                <li>Dentro Da Política</li>
                <li>Cód. Conta</li>
                <li>Conta Financeira</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-2 justify-end">
        <Button 
          onClick={handleClear} 
          variant="outline"
          disabled={!file || importing}
        >
          Limpar
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={!file || importing}
        >
          {importing ? "Importando..." : "Confirmar Importação"}
        </Button>
        {importSuccess && (
          <Button 
            onClick={() => navigate("/consulta-faturas")}
            variant="default"
          >
            <Database className="mr-2 h-4 w-4" />
            Ver Faturas Importadas
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportarFatura;
