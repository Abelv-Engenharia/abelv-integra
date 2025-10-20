import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSpreadsheet, FileText, Building2, Download } from "lucide-react";
import { toast } from "sonner";

// Mock data baseado na estrutura da planilha
const mockDadosObras = [
  {
    codigo: "A01",
    nome: "MOI 01 - ENGENHEIRO E ADMINISTRATIVO",
    logradouro: "Rua Matozinhos, nº 211",
    complemento: "Apto 101",
    bairro: "Centro",
    municipio: "Três Marias",
    uf: "MG",
    cep: "39.205-000",
    qtdeQuartos: 2,
    lotacaoMaxima: 2,
    lotacaoAtual: 1,
    distanciaObra: "2KM",
    tipoImovel: "APTO",
    inicioLocacao: "03/03/25",
    fimLocacao: "03/03/26",
    vigenciaContrato: 12,
    multaQuebraContrato: "PROPORCIONAL",
    caucao: "2,500.00",
    proprietario: "APARECIDO ANTONIO ASSIS",
    cpfCnpjProprietario: "038.356.156-61",
    tipoProprietario: "",
    favorecido: "APARECIDO ANTONIO ASSIS",
    cpfCnpjFavorecido: "038.356.156-61",
    tipoFavorecido: "",
    formaPagamento: "PIX - 03835615661",
    banco: "BB",
    agencia: "1160-6",
    operacao: "51.00",
    contaCorrente: "31215-0",
    tipoAluguel: "PAGA E MORA"
  },
  {
    codigo: "A02",
    nome: "MOI 02 - SUPERVISÃO",
    logradouro: "Rua Matozinhos, nº 211",
    complemento: "Apto 102",
    bairro: "Centro",
    municipio: "Três Marias",
    uf: "MG",
    cep: "39.205-000",
    qtdeQuartos: 3,
    lotacaoMaxima: 3,
    lotacaoAtual: 2,
    distanciaObra: "2KM",
    tipoImovel: "APTO",
    inicioLocacao: "03/03/25",
    fimLocacao: "03/03/26",
    vigenciaContrato: 12,
    multaQuebraContrato: "PROPORCIONAL",
    caucao: "2,500.00",
    proprietario: "APARECIDO ANTONIO ASSIS",
    cpfCnpjProprietario: "038.356.156-61",
    tipoProprietario: "",
    favorecido: "APARECIDO ANTONIO ASSIS",
    cpfCnpjFavorecido: "038.356.156-61",
    tipoFavorecido: "",
    formaPagamento: "PIX - 03835615661",
    banco: "BB",
    agencia: "1160-6",
    operacao: "51.00",
    contaCorrente: "31215-0",
    tipoAluguel: "MORA E PAGA"
  },
  {
    codigo: "A03",
    nome: "MOI 03 - GERÊNCIA",
    logradouro: "Rua Holanda, nº 104",
    complemento: "",
    bairro: "Parque das Nações",
    municipio: "Três Marias",
    uf: "MG",
    cep: "39.205-000",
    qtdeQuartos: 2,
    lotacaoMaxima: 2,
    lotacaoAtual: 1,
    distanciaObra: "",
    tipoImovel: "CASA",
    inicioLocacao: "10/03/25",
    fimLocacao: "10/03/26",
    vigenciaContrato: 12,
    multaQuebraContrato: "PROPORCIONAL",
    caucao: "N/A",
    proprietario: "ARNALDINO FERREIRA DA SILVA",
    cpfCnpjProprietario: "585.567.456-87",
    tipoProprietario: "",
    favorecido: "DENÍLSON SILVA ARAÚJO",
    cpfCnpjFavorecido: "587.634.816-34",
    tipoFavorecido: "",
    formaPagamento: "DEPÓSITO",
    banco: "SANTANDER",
    agencia: "3115",
    operacao: "",
    contaCorrente: "010.884.58-4",
    tipoAluguel: "PAGA E MORA"
  },
  {
    codigo: "A07",
    nome: "Apartamento 1 - Engenharia",
    logradouro: "R. Professor Luiz Miguel Christofoletti, nº 218",
    complemento: "AP 15 / Edif Yasmin",
    bairro: "Vl São José",
    municipio: "Itu",
    uf: "SP",
    cep: "13,310,280",
    qtdeQuartos: 3,
    lotacaoMaxima: 3,
    lotacaoAtual: 0,
    distanciaObra: "18KM",
    tipoImovel: "APTO",
    inicioLocacao: "20/03/23",
    fimLocacao: "20/09/25",
    vigenciaContrato: 12,
    multaQuebraContrato: "6,900.00",
    caucao: "6,900.00",
    proprietario: "RENATA PASCHOALETE CARLIN HAFLIGER",
    cpfCnpjProprietario: "220.474.188-44",
    tipoProprietario: "PESSOA FÍSICA",
    favorecido: "MARCELO BATISTA DA SILVA IMÓVEIS",
    cpfCnpjFavorecido: "30.061.512/0001-29",
    tipoFavorecido: "PESSOA FÍSICA",
    formaPagamento: "Depósito",
    banco: "Mercado Pago",
    agencia: "0001",
    operacao: "",
    contaCorrente: "15116191468",
    tipoAluguel: "MORA E PAGA"
  }
];

const opcoesFiltro = [
  { value: "todas", label: "Todas as Obras" },
  { value: "tres-marias", label: "Três Marias - MG" },
  { value: "itu", label: "Itu - SP" },
  { value: "sao-paulo", label: "São Paulo - SP" }
];

export default function RelatorioConsolidadoObras() {
  const [obraSelecionada, setObraSelecionada] = useState("todas");

  const dadosFiltrados = obraSelecionada === "todas" 
    ? mockDadosObras 
    : mockDadosObras.filter(item => {
        if (obraSelecionada === "tres-marias") return item.municipio === "Três Marias";
        if (obraSelecionada === "itu") return item.municipio === "Itu";
        if (obraSelecionada === "sao-paulo") return item.municipio === "São Paulo";
        return true;
      });

  const handleExportarExcel = () => {
    toast.success("Relatório exportado para Excel com sucesso!");
  };

  const handleExportarPDF = () => {
    toast.success("Relatório exportado para PDF com sucesso!");
  };

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Relatório Consolidado – Obras</h1>
        </div>
        <p className="text-muted-foreground">
          Visualização consolidada do cadastro de alojamentos por obra
        </p>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select value={obraSelecionada} onValueChange={setObraSelecionada}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Selecione a obra" />
            </SelectTrigger>
            <SelectContent>
              {opcoesFiltro.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportarExcel} className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
          <Button variant="outline" onClick={handleExportarPDF} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Alojamentos</p>
                <p className="text-2xl font-bold text-primary">{dadosFiltrados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lotação Total</p>
                <p className="text-2xl font-bold text-primary">
                  {dadosFiltrados.reduce((acc, item) => acc + item.lotacaoMaxima, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ocupação Atual</p>
                <p className="text-2xl font-bold text-primary">
                  {dadosFiltrados.reduce((acc, item) => acc + item.lotacaoAtual, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round((dadosFiltrados.reduce((acc, item) => acc + item.lotacaoAtual, 0) / 
                   dadosFiltrados.reduce((acc, item) => acc + item.lotacaoMaxima, 0)) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cadastro de Alojamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-[2000px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="font-semibold">Código</TableHead>
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="font-semibold">Logradouro</TableHead>
                    <TableHead className="font-semibold">Complemento</TableHead>
                    <TableHead className="font-semibold">Bairro</TableHead>
                    <TableHead className="font-semibold">Município</TableHead>
                    <TableHead className="font-semibold">UF</TableHead>
                    <TableHead className="font-semibold">CEP</TableHead>
                    <TableHead className="font-semibold">Qtde Quartos</TableHead>
                    <TableHead className="font-semibold">Lotação Máxima</TableHead>
                    <TableHead className="font-semibold">Lotação Atual</TableHead>
                    <TableHead className="font-semibold">Distância da Obra</TableHead>
                    <TableHead className="font-semibold">Tipo de Imóvel</TableHead>
                    <TableHead className="font-semibold">Início da Locação</TableHead>
                    <TableHead className="font-semibold">Fim da Locação</TableHead>
                    <TableHead className="font-semibold">Vigência (Meses)</TableHead>
                    <TableHead className="font-semibold">Multa Quebra</TableHead>
                    <TableHead className="font-semibold">Caução</TableHead>
                    <TableHead className="font-semibold">Proprietário</TableHead>
                    <TableHead className="font-semibold">CPF/CNPJ Proprietário</TableHead>
                    <TableHead className="font-semibold">Favorecido</TableHead>
                    <TableHead className="font-semibold">CPF/CNPJ Favorecido</TableHead>
                    <TableHead className="font-semibold">Forma de Pagamento</TableHead>
                    <TableHead className="font-semibold">Banco</TableHead>
                    <TableHead className="font-semibold">Agência</TableHead>
                    <TableHead className="font-semibold">Conta Corrente</TableHead>
                    <TableHead className="font-semibold">Tipo de Aluguel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosFiltrados.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell className="max-w-[200px]">{item.nome}</TableCell>
                      <TableCell className="max-w-[200px]">{item.logradouro}</TableCell>
                      <TableCell>{item.complemento}</TableCell>
                      <TableCell>{item.bairro}</TableCell>
                      <TableCell>{item.municipio}</TableCell>
                      <TableCell>{item.uf}</TableCell>
                      <TableCell>{item.cep}</TableCell>
                      <TableCell className="text-center">{item.qtdeQuartos}</TableCell>
                      <TableCell className="text-center">{item.lotacaoMaxima}</TableCell>
                      <TableCell className="text-center">{item.lotacaoAtual}</TableCell>
                      <TableCell>{item.distanciaObra}</TableCell>
                      <TableCell>{item.tipoImovel}</TableCell>
                      <TableCell>{item.inicioLocacao}</TableCell>
                      <TableCell>{item.fimLocacao}</TableCell>
                      <TableCell className="text-center">{item.vigenciaContrato}</TableCell>
                      <TableCell>{item.multaQuebraContrato}</TableCell>
                      <TableCell>{item.caucao}</TableCell>
                      <TableCell className="max-w-[200px]">{item.proprietario}</TableCell>
                      <TableCell>{item.cpfCnpjProprietario}</TableCell>
                      <TableCell className="max-w-[200px]">{item.favorecido}</TableCell>
                      <TableCell>{item.cpfCnpjFavorecido}</TableCell>
                      <TableCell>{item.formaPagamento}</TableCell>
                      <TableCell>{item.banco}</TableCell>
                      <TableCell>{item.agencia}</TableCell>
                      <TableCell>{item.contaCorrente}</TableCell>
                      <TableCell>{item.tipoAluguel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}