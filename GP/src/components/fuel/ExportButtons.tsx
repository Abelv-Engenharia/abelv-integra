import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FuelTransaction, FuelFilters } from "@/types/fuel";
import * as XLSX from 'xlsx';

interface ExportButtonsProps {
  data: FuelTransaction[];
  filters: FuelFilters;
  plateSearch: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  data, 
  filters, 
  plateSearch 
}) => {
  const { toast } = useToast();

  const formatDataForExport = (data: FuelTransaction[]) => {
    return data.map(item => ({
      'Motorista': item.motorista,
      'Centro de Custo': item.centro_custo,
      'Placa': item.placa,
      'Modelo do Veículo': item.modelo_veiculo,
      'Tipo Cartão': item.tipo_cartao,
      'Número do Cartão': item.numero_cartao,
      'Data/Hora da Transação': item.data_hora_transacao,
      'UF EC': item.uf_ec,
      'Cidade EC': item.cidade_ec,
      'Nome EC': item.nome_ec,
      'Tipo Mercadoria': item.tipo_mercadoria,
      'Mercadoria': item.mercadoria,
      'Qtd. Mercadoria': item.qtd_mercadoria,
      'Valor': item.valor,
      'Data Upload': item.data_upload,
      'Usuário Responsável': item.usuario_responsavel
    }));
  };

  const exportToExcel = () => {
    try {
      if (data.length === 0) {
        toast({
          title: "Nenhum Dado",
          description: "Não há dados para exportar",
          variant: "destructive"
        });
        return;
      }

      const formattedData = formatDataForExport(data);
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      
      // Adicionar filtros aplicados como informação
      const filterInfo = [];
      if (plateSearch) filterInfo.push(`Placa: ${plateSearch}`);
      if (filters.motorista) filterInfo.push(`Motorista: ${filters.motorista}`);
      if (filters.centro_custo) filterInfo.push(`Centro de Custo: ${filters.centro_custo}`);
      if (filters.tipo_mercadoria) filterInfo.push(`Tipo Mercadoria: ${filters.tipo_mercadoria}`);
      if (filters.cidade_ec) filterInfo.push(`Cidade: ${filters.cidade_ec}`);
      if (filters.uf_ec) filterInfo.push(`UF: ${filters.uf_ec}`);
      if (filters.data_inicial && filters.data_final) {
        filterInfo.push(`Período: ${filters.data_inicial.toLocaleDateString()} a ${filters.data_final.toLocaleDateString()}`);
      }

      const workbook = XLSX.utils.book_new();
      
      // Adicionar informações de filtros se houver
      if (filterInfo.length > 0) {
        const infoSheet = XLSX.utils.aoa_to_sheet([
          ['RELATÓRIO DE ABASTECIMENTO'],
          ['Data de Exportação:', new Date().toLocaleString('pt-BR')],
          ['Total de Registros:', data.length],
          [''],
          ['FILTROS APLICADOS:'],
          ...filterInfo.map(filter => [filter])
        ]);
        XLSX.utils.book_append_sheet(workbook, infoSheet, 'Informações');
      }
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Abastecimentos');
      
      const fileName = `controle_abastecimento_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast({
        title: "Excel Exportado",
        description: `Arquivo ${fileName} baixado com sucesso`
      });
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      toast({
        title: "Erro na Exportação",
        description: "Erro ao gerar arquivo Excel",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = () => {
    try {
      if (data.length === 0) {
        toast({
          title: "Nenhum Dado",
          description: "Não há dados para exportar",
          variant: "destructive"
        });
        return;
      }

      // Criar conteúdo HTML para impressão/PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Abastecimento</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .filters { margin-bottom: 20px; padding: 10px; background-color: #f5f5f5; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .currency { text-align: right; }
            .center { text-align: center; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Controle de Abastecimento</h1>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            <p>Total de registros: ${data.length}</p>
          </div>
          
          ${Object.keys(filters).length > 0 || plateSearch ? `
          <div class="filters">
            <h3>Filtros Aplicados:</h3>
            ${plateSearch ? `<p><strong>Placa:</strong> ${plateSearch}</p>` : ''}
            ${filters.motorista ? `<p><strong>Motorista:</strong> ${filters.motorista}</p>` : ''}
            ${filters.centro_custo ? `<p><strong>Centro de Custo:</strong> ${filters.centro_custo}</p>` : ''}
            ${filters.tipo_mercadoria ? `<p><strong>Tipo Mercadoria:</strong> ${filters.tipo_mercadoria}</p>` : ''}
            ${filters.cidade_ec ? `<p><strong>Cidade:</strong> ${filters.cidade_ec}</p>` : ''}
            ${filters.uf_ec ? `<p><strong>UF:</strong> ${filters.uf_ec}</p>` : ''}
            ${filters.data_inicial && filters.data_final ? `
              <p><strong>Período:</strong> ${filters.data_inicial.toLocaleDateString('pt-BR')} a ${filters.data_final.toLocaleDateString('pt-BR')}</p>
            ` : ''}
          </div>
          ` : ''}
          
          <table>
            <thead>
              <tr>
                <th>Motorista</th>
                <th>Centro de Custo</th>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Tipo Cartão</th>
                <th>Data/Hora</th>
                <th>UF</th>
                <th>Cidade</th>
                <th>Estabelecimento</th>
                <th>Mercadoria</th>
                <th>Qtd.</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td>${item.motorista}</td>
                  <td>${item.centro_custo}</td>
                  <td class="center">${item.placa}</td>
                  <td>${item.modelo_veiculo}</td>
                  <td>${item.tipo_cartao}</td>
                  <td class="center">${new Date(item.data_hora_transacao).toLocaleString('pt-BR')}</td>
                  <td class="center">${item.uf_ec}</td>
                  <td>${item.cidade_ec}</td>
                  <td>${item.nome_ec}</td>
                  <td>${item.mercadoria}</td>
                  <td class="center">${item.qtd_mercadoria.toFixed(2)}</td>
                  <td class="currency">${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total">
                <td colspan="11"><strong>TOTAL GERAL:</strong></td>
                <td class="currency"><strong>${data.reduce((sum, item) => sum + item.valor, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></td>
              </tr>
            </tfoot>
          </table>
        </body>
        </html>
      `;

      // Abrir nova janela para impressão
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Aguardar carregamento e imprimir
        printWindow.onload = () => {
          printWindow.print();
        };
        
        toast({
          title: "PDF Gerado",
          description: "Relatório aberto em nova janela para impressão/salvamento"
        });
      } else {
        throw new Error('Não foi possível abrir janela de impressão');
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast({
        title: "Erro na Exportação",
        description: "Erro ao gerar arquivo PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={exportToExcel}
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={data.length === 0}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      
      <Button
        onClick={exportToPDF}
        variant="outline"
        size="sm"
        className="gap-2"
        disabled={data.length === 0}
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};