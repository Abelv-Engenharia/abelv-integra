import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContratoEmitido } from "@/types/contrato";
import { Button } from "@/components/ui/button";
import { StatusContratoBadge } from "./StatusContratoBadge";
import { TipoContratoBadge } from "./TipoContratoBadge";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface VisualizarContratoModalProps {
  contrato: ContratoEmitido | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisualizarContratoModal({ contrato, open, onOpenChange }: VisualizarContratoModalProps) {
  if (!contrato) return null;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`Contrato nº: ${contrato.numero}`, 14, 40);

      const dadosContrato = [
        ['Prestador', contrato.prestador],
        ['CPF', contrato.cpf],
        ['CNPJ', contrato.cnpj],
        ['Serviço', contrato.servico],
        ['Valor', contrato.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
        ['Empresa', contrato.empresa],
        ['Obra', contrato.obra],
        ['Data de emissão', new Date(contrato.dataemissao).toLocaleDateString('pt-BR')],
        ['Data de início', new Date(contrato.datainicio).toLocaleDateString('pt-BR')],
        ['Data de término', new Date(contrato.datafim).toLocaleDateString('pt-BR')],
        ['Status', contrato.status.toUpperCase()],
      ];

      autoTable(doc, {
        head: [['Campo', 'Informação']],
        body: dadosContrato,
        startY: 50,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 66, 66] },
      });

      doc.save(`contrato_${contrato.numero}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do contrato</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Número do contrato</p>
              <p className="font-semibold">{contrato.numero}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusContratoBadge status={contrato.status} />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Tipo de contrato</p>
            <TipoContratoBadge tipo={contrato.tipo} />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações do prestador</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{contrato.prestador}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{contrato.cpf}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-medium">{contrato.cnpj}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">{contrato.servico}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações do contrato</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Empresa</p>
                <p className="font-medium">{contrato.empresa}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Obra</p>
                <p className="font-medium">{contrato.obra}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-semibold text-lg text-green-600">
                  {contrato.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de emissão</p>
                <p className="font-medium">{new Date(contrato.dataemissao).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Data de início</p>
                <p className="font-medium">{new Date(contrato.datainicio).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de término</p>
                <p className="font-medium">{new Date(contrato.datafim).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
