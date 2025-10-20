import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaturaIntegra } from "@/types/travel";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface FaturaImportComponentProps {
  open: boolean;
  onClose: () => void;
  onImport: () => void;
}

export const FaturaImportComponent = ({ open, onClose, onImport }: FaturaImportComponentProps) => {
  const [importing, setImporting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

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

      const existingFaturas: FaturaIntegra[] = JSON.parse(
        localStorage.getItem("faturas_integra") || "[]"
      );

      const allFaturas = [...existingFaturas, ...faturas];
      localStorage.setItem("faturas_integra", JSON.stringify(allFaturas));

      toast.success(`${faturas.length} faturas importadas com sucesso`);
      onImport();
    } catch (error) {
      console.error("Erro ao importar planilha:", error);
      toast.error("Erro ao importar planilha. Verifique o formato do arquivo.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Planilha de Faturas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Selecione um arquivo Excel (.xlsx) para importar
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={importing}>
                <span>
                  {importing ? "Importando..." : "Selecionar Arquivo"}
                </span>
              </Button>
            </label>
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-semibold">Formato esperado:</p>
            <p>O arquivo deve conter as seguintes colunas:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>DATA EMISSÃO FAT</li>
              <li>AGENCIA</li>
              <li>NUMERO DE FAT</li>
              <li>PROTOCOLO</li>
              <li>DATA DA COMPRA</li>
              <li>VIAJANTE</li>
              <li>TIPO</li>
              <li>E demais colunas conforme planilha padrão</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
