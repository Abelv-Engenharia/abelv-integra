import { useState, useMemo } from "react";
import { FileText, Download, Plus, Edit, Trash2, Mail, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { EnviarDemonstrativoModal } from "@/components/demonstrativo/EnviarDemonstrativoModal";
import { downloadDemonstrativoPDF } from "@/components/demonstrativo/GenerateDemonstrativoPDF";
import { NovoDemonstrativoModal } from "@/components/demonstrativo/NovoDemonstrativoModal";
import { EditarDemonstrativoModal } from "@/components/demonstrativo/EditarDemonstrativoModal";
import { format } from "date-fns";

// Dados mock para a tabela de demonstrativo
const mockDemonstrativo = [{
  codigo: "001",
  periodocontabil: "03/2024",
  codigosienge: "SG001",
  nome: "João da Silva",
  email: "joao.silva@email.com",
  obra: "Obra Centro",
  funcao: "Pedreiro",
  nomeempresa: "Construtora ABC Ltda",
  cpf: "123.456.789-00",
  datanascimento: "15/03/1985",
  admissao: "01/01/2024",
  salario: 2500.00,
  premiacaonexa: 250.00,
  ajudacustoobra: 300.00,
  multasdescontos: 0.00,
  ajudaaluguel: 400.00,
  descontoconvenio: 150.00,
  reembolsoconvenio: 0.00,
  descontoabelvrun: 100.00,
  estacionamento: 50.00,
  valornf: 3300.00,
  enviadoem: "15/03/2024 10:30"
}, {
  codigo: "002",
  periodocontabil: "03/2024",
  codigosienge: "SG002",
  nome: "Maria Santos",
  email: "maria.santos@email.com",
  obra: "Obra Norte",
  funcao: "Eletricista",
  nomeempresa: "Elétrica XYZ Ltda",
  cpf: "987.654.321-00",
  datanascimento: "22/07/1990",
  admissao: "15/01/2024",
  salario: 2800.00,
  premiacaonexa: 280.00,
  ajudacustoobra: 350.00,
  multasdescontos: 50.00,
  ajudaaluguel: 450.00,
  descontoconvenio: 180.00,
  reembolsoconvenio: 0.00,
  descontoabelvrun: 120.00,
  estacionamento: 60.00,
  valornf: 3630.00,
  enviadoem: null
}, {
  codigo: "003",
  periodocontabil: "02/2024",
  codigosienge: "SG003",
  nome: "Carlos Oliveira",
  email: "carlos.oliveira@email.com",
  obra: "Obra Sul",
  funcao: "Soldador",
  nomeempresa: "Metalúrgica DEF Ltda",
  cpf: "456.789.123-00",
  datanascimento: "10/12/1982",
  admissao: "10/02/2024",
  salario: 3200.00,
  premiacaonexa: 320.00,
  ajudacustoobra: 400.00,
  multasdescontos: 0.00,
  ajudaaluguel: 500.00,
  descontoconvenio: 200.00,
  reembolsoconvenio: 50.00,
  descontoabelvrun: 150.00,
  estacionamento: 75.00,
  valornf: 4270.00,
  enviadoem: "20/03/2024 14:00"
}];

export default function DemonstrativoPrestacaoServico() {
  const [demonstrativo, setDemonstrativo] = useState(mockDemonstrativo);
  const [enviarModalOpen, setEnviarModalOpen] = useState(false);
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [demonstrativoSelecionado, setDemonstrativoSelecionado] = useState<any>(null);
  const [filtroperiodo, setFiltroPeriodo] = useState<string>("todos");

  // Obter períodos únicos para o filtro
  const periodosDisponiveis = useMemo(() => {
    const periodos = new Set(demonstrativo.map(d => d.periodocontabil));
    return Array.from(periodos).sort().reverse();
  }, [demonstrativo]);

  // Filtrar demonstrativos por período
  const demonstrativosFiltrados = useMemo(() => {
    if (filtroperiodo === "todos") return demonstrativo;
    return demonstrativo.filter(d => d.periodocontabil === filtroperiodo);
  }, [demonstrativo, filtroperiodo]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(demonstrativosFiltrados.map(item => ({
      'Código': item.codigo,
      'Período Contábil': item.periodocontabil,
      'Código Sienge': item.codigosienge,
      'Nome': item.nome,
      'Email': item.email,
      'Obra': item.obra,
      'Função': item.funcao,
      'Nome da Empresa': item.nomeempresa,
      'CPF': item.cpf,
      'Data de Nascimento': item.datanascimento,
      'Admissão': item.admissao,
      'Salário': item.salario,
      'Premiação Nexa Parada': item.premiacaonexa,
      'Ajuda de Custo Obra': item.ajudacustoobra,
      'Multas e Descontos': item.multasdescontos,
      'Ajuda de Aluguel': item.ajudaaluguel,
      'Desconto de Convênio': item.descontoconvenio,
      'Reembolso Convênio': item.reembolsoconvenio,
      'Desconto Abelv Run': item.descontoabelvrun,
      'Estacionamento': item.estacionamento,
      'Valor NF': item.valornf,
      'Enviado em': item.enviadoem || 'Não enviado'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Demonstrativo');
    XLSX.writeFile(workbook, 'demonstrativo-prestacao-servico.xlsx');
    toast({
      title: "Sucesso",
      description: "Arquivo Excel exportado com sucesso!"
    });
  };

  const handleNovoRegistro = () => {
    setNovoModalOpen(true);
  };

  const handleSalvarNovo = (data: any) => {
    const novoRegistro = {
      ...data,
      datanascimento: data.datanascimento ? format(data.datanascimento, "dd/MM/yyyy") : "",
      admissao: data.admissao ? format(data.admissao, "dd/MM/yyyy") : "",
      enviadoem: null
    };
    setDemonstrativo([...demonstrativo, novoRegistro]);
  };

  const handleEditar = (item: any) => {
    setDemonstrativoSelecionado(item);
    setEditarModalOpen(true);
  };

  const handleSalvarEdicao = (data: any) => {
    const demonstrativoAtualizado = demonstrativo.map((d) =>
      d.codigo === demonstrativoSelecionado.codigo
        ? {
            ...d,
            ...data,
            datanascimento: data.datanascimento ? format(data.datanascimento, "dd/MM/yyyy") : d.datanascimento,
            admissao: data.admissao ? format(data.admissao, "dd/MM/yyyy") : d.admissao,
          }
        : d
    );
    setDemonstrativo(demonstrativoAtualizado);
    setDemonstrativoSelecionado(null);
  };

  const handleExcluir = (codigo: string) => {
    toast({
      title: "Excluir Registro",
      description: `Excluindo registro ${codigo} - funcionalidade em desenvolvimento`
    });
  };

  const handleEnviarDemonstrativo = (item: any) => {
    const totalProventos = (item.salario || 0) + (item.premiacaonexa || 0) + (item.ajudacustoobra || 0) + (item.ajudaaluguel || 0) + (item.reembolsoconvenio || 0);
    const totalDescontos = (item.multasdescontos || 0) + (item.descontoconvenio || 0) + (item.descontoabelvrun || 0) + (item.estacionamento || 0);
    const valorLiquidoCalculado = item.valornf || (totalProventos - totalDescontos);
    
    setDemonstrativoSelecionado({
      prestador: item.nome || "",
      email: item.email || "",
      periodo: item.periodocontabil || `${item.admissao}`,
      servico: item.funcao || "",
      centroCusto: item.obra || "",
      valorBruto: totalProventos,
      descontos: totalDescontos,
      valorLiquido: valorLiquidoCalculado
    });
    setEnviarModalOpen(true);
  };

  const handleDownloadPDF = (item: any) => {
    const pdfData = {
      prestador: item.nome,
      email: item.email,
      periodo: `${item.admissao}`,
      items: [
        { codigo: '001', descricao: 'Base (Salário)', proventos: item.salario, descontos: 0 },
        { codigo: '002', descricao: 'Premiação Nexa Parada', proventos: item.premiacaonexa, descontos: 0 },
        { codigo: '003', descricao: 'Ajuda de Custo Obra', proventos: item.ajudacustoobra, descontos: 0 },
        { codigo: '004', descricao: 'Ajuda de Aluguel', proventos: item.ajudaaluguel, descontos: 0 },
        { codigo: '005', descricao: 'Reembolso Convênio', proventos: item.reembolsoconvenio, descontos: 0 },
        { codigo: '006', descricao: 'Multas e Descontos', proventos: 0, descontos: item.multasdescontos },
        { codigo: '007', descricao: 'Desconto de Convênio', proventos: 0, descontos: item.descontoconvenio },
        { codigo: '008', descricao: 'Desconto Abelv Run', proventos: 0, descontos: item.descontoabelvrun },
        { codigo: '009', descricao: 'Estacionamento', proventos: 0, descontos: item.estacionamento },
      ],
    };
    
    downloadDemonstrativoPDF(pdfData);
    
    toast({
      title: "Download concluído",
      description: "O demonstrativo foi baixado com sucesso.",
    });
  };

  return <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demonstrativo de Prestação de Serviço</h1>
          <p className="text-muted-foreground">Relatório detalhado dos serviços prestados pelos colaboradores</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Demonstrativo de Prestação de Serviço</CardTitle>
              <CardDescription>Relatório com informações dos prestadores e valores</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filtroperiodo}
                  onChange={(e) => setFiltroPeriodo(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="todos">Todos os Períodos</option>
                  {periodosDisponiveis.map((periodo) => (
                    <option key={periodo} value={periodo}>
                      {new Date(`${periodo.split('/')[1]}-${periodo.split('/')[0]}-01`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleNovoRegistro} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Registro
              </Button>
              <Button onClick={exportToExcel} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar para Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Período Contábil</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nome da Empresa</TableHead>
                  <TableHead>Valor NF</TableHead>
                  <TableHead>Status Envio</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demonstrativosFiltrados.map((item, index) => <TableRow key={index}>
                    <TableCell className="font-medium">{item.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {new Date(`${item.periodocontabil.split('/')[1]}-${item.periodocontabil.split('/')[0]}-01`).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.nomeempresa}</TableCell>
                    <TableCell className="font-semibold">R$ {item.valornf.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.enviadoem ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Enviado
                          </Badge>
                          <p className="text-xs text-muted-foreground">{item.enviadoem}</p>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Não Enviado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(item)} className="h-8 w-8 p-0" title="Baixar PDF">
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEnviarDemonstrativo(item)} className="h-8 w-8 p-0" title="Enviar para Prestador">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditar(item)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExcluir(item.codigo)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>

          {demonstrativo.length === 0 && <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhum registro encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece adicionando um novo registro de prestação de serviço.
              </p>
              <div className="mt-6">
                <Button onClick={handleNovoRegistro} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Registro
                </Button>
              </div>
            </div>}
        </CardContent>
      </Card>

      {demonstrativoSelecionado && (
        <EnviarDemonstrativoModal
          open={enviarModalOpen}
          onOpenChange={setEnviarModalOpen}
          demonstrativo={demonstrativoSelecionado}
        />
      )}

      <NovoDemonstrativoModal
        open={novoModalOpen}
        onOpenChange={setNovoModalOpen}
        onSave={handleSalvarNovo}
      />

      {demonstrativoSelecionado && (
        <EditarDemonstrativoModal
          open={editarModalOpen}
          onOpenChange={setEditarModalOpen}
          onSave={handleSalvarEdicao}
          demonstrativo={demonstrativoSelecionado}
        />
      )}
    </div>;
}
