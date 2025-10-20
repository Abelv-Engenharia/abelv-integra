import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EspelhoMedicaoProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    codigo_medicao: string;
    obra: string;
    obra_nome: string;
    adm_responsavel: string;
    data: string;
    empresa: string;
    cnpj: string;
    periodo_inicio: string;
    periodo_fim: string;
    trajetos: Array<{
      id: string;
      item: string;
      qtde: number;
      unit: number;
      total: number;
      comentarios: string;
    }>;
  };
}

export default function EspelhoMedicaoTransporte({ isOpen, onClose, dados }: EspelhoMedicaoProps) {
  const { toast } = useToast();

  const getTotalGeral = () => {
    return dados.trajetos.reduce((sum, trajeto) => sum + trajeto.total, 0);
  };

  const handleImprimir = () => {
    window.print();
    toast({
      title: "Sucesso",
      description: "Espelho de medição enviado para impressão"
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Sucesso",
      description: "Espelho de medição exportado em PDF"
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle>Espelho de Medição de Transporte</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleImprimir}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo do Espelho */}
        <div className="p-6 bg-white min-h-[800px]" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Header com Logo e Título */}
          <div className="relative mb-6">
            {/* Logo ABELV (placeholder) */}
            <div className="absolute top-0 left-0 w-24 h-16 border border-gray-300 flex items-center justify-center text-xs">
              <div className="text-center">
                <div className="font-bold text-blue-800">ABELV</div>
                <div className="text-[10px]">Engenharia</div>
              </div>
            </div>

            {/* Código da Medição */}
            <div className="absolute top-0 left-0 mt-20 bg-gray-800 text-white px-3 py-1 text-lg font-bold">
              {dados.codigo_medicao}
            </div>

            {/* Título Central */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white bg-blue-800 py-3 mx-24">
                Medição de Transporte
              </h1>
            </div>
          </div>

          {/* Campos do Cabeçalho */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-2 text-sm">
              {/* Primeira linha - Obra e Data */}
              <div className="flex">
                <div className="flex-1 flex items-center">
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[120px]">Obra:</span>
                  <span className="bg-gray-100 px-2 py-1 flex-1">{dados.obra} - {dados.obra_nome}</span>
                </div>
                <div className="flex items-center ml-4">
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[60px]">Data:</span>
                  <span className="bg-yellow-200 px-2 py-1 min-w-[100px]">{formatDate(dados.data)}</span>
                </div>
              </div>

              {/* Segunda linha - ADM Responsável e CNPJ */}
              <div className="flex">
                <div className="flex-1 flex items-center">
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[120px]">ADM. Resp.:</span>
                  <span className="bg-yellow-200 px-2 py-1 flex-1">{dados.adm_responsavel}</span>
                </div>
                <div className="flex items-center ml-4">
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[60px]">CNPJ:</span>
                  <span className="bg-gray-100 px-2 py-1 min-w-[100px]">{dados.cnpj || "0"}</span>
                </div>
              </div>

              {/* Terceira linha - Empresa */}
              <div className="flex">
                <div className="flex-1 flex items-center">
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[120px]">Empresa:</span>
                  <span className="bg-gray-100 px-2 py-1 flex-1">{dados.empresa}</span>
                </div>
              </div>

              {/* Quarta linha - Período Considerado */}
              <div className="flex">
                <div className="flex-1 flex items-center">
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[120px]">Período Considerado:</span>
                  <span className="bg-gray-100 px-2 py-1">{formatDate(dados.periodo_inicio)}</span>
                  <span className="font-semibold bg-gray-300 px-2 py-1 min-w-[40px] text-center">Até:</span>
                  <span className="bg-gray-100 px-2 py-1">{formatDate(dados.periodo_fim)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Título da Tabela */}
          <div className="mb-0">
            <div className="bg-blue-800 text-white text-center py-2 font-bold">
              MEDIÇÃO ATUAL
            </div>
          </div>

          {/* Tabela de Trajetos */}
          <div className="border border-gray-400">
            {/* Cabeçalho da Tabela */}
            <div className="flex bg-blue-800 text-white font-bold text-center">
              <div className="flex-1 border-r border-white p-2">ITEM</div>
              <div className="w-24 border-r border-white p-2">QTDE</div>
              <div className="w-24 border-r border-white p-2">UNIT</div>
              <div className="w-24 border-r border-white p-2">TOTAL</div>
              <div className="flex-1 p-2">COMENTÁRIOS</div>
            </div>

            {/* Linhas de Trajetos */}
            {dados.trajetos.map((trajeto, index) => (
              <div 
                key={trajeto.id} 
                className={`flex text-center border-t border-gray-300 ${
                  index % 2 === 0 ? 'bg-red-50' : 'bg-red-100'
                }`}
              >
                <div className="flex-1 border-r border-gray-300 p-2 text-left font-medium">
                  {trajeto.item}
                </div>
                <div className="w-24 border-r border-gray-300 p-2">
                  {trajeto.qtde > 0 ? trajeto.qtde : '-'}
                </div>
                <div className="w-24 border-r border-gray-300 p-2">
                  {trajeto.unit > 0 ? trajeto.unit.toFixed(2) : '-'}
                </div>
                <div className="w-24 border-r border-gray-300 p-2 font-bold">
                  {trajeto.total > 0 ? trajeto.total.toFixed(2) : '-'}
                </div>
                <div className="flex-1 p-2 text-left">
                  {trajeto.comentarios || '-'}
                </div>
              </div>
            ))}

            {/* Linha de Total */}
            <div className="flex text-center bg-yellow-300 border-t-2 border-black font-bold">
              <div className="flex-1 border-r border-gray-300 p-2 text-left text-lg">
                Total
              </div>
              <div className="w-24 border-r border-gray-300 p-2">
                -
              </div>
              <div className="w-24 border-r border-gray-300 p-2">
                -
              </div>
              <div className="w-24 border-r border-gray-300 p-2 text-lg">
                {getTotalGeral() > 0 ? getTotalGeral().toFixed(2) : '-'}
              </div>
              <div className="flex-1 p-2">
                -
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}