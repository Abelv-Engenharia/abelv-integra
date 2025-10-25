import { useMemo } from "react";
import { FileText, Download, Plus, Edit, Trash2, Mail, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { EnviarDemonstrativoModal } from "@/components/gestao-pessoas/demonstrativo/EnviarDemonstrativoModal";
import { downloadDemonstrativoPDF } from "@/components/gestao-pessoas/demonstrativo/GenerateDemonstrativoPDF";
import { NovoDemonstrativoModal } from "@/components/gestao-pessoas/demonstrativo/NovoDemonstrativoModal";
import { EditarDemonstrativoModal } from "@/components/gestao-pessoas/demonstrativo/EditarDemonstrativoModal";
import { format } from "date-fns";
import { useDemonstrativos, useCreateDemonstrativo, useUpdateDemonstrativo, useDeleteDemonstrativo } from "@/hooks/gestao-pessoas/useDemonstrativos";
import { useState } from "react";

export default function DemonstrativoPrestacaoServico() {
  const { data: demonstrativo = [], isLoading } = useDemonstrativos();
  const createDemonstrativo = useCreateDemonstrativo();
  const updateDemonstrativo = useUpdateDemonstrativo();
  const deleteDemonstrativo = useDeleteDemonstrativo();
  const [enviarModalOpen, setEnviarModalOpen] = useState(false);
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [demonstrativoSelecionado, setDemonstrativoSelecionado] = useState<any>(null);
  const [filtroperiodo, setFiltroPeriodo] = useState<string>("todos");

  // Obter períodos únicos para o filtro
  const periodosDisponiveis = useMemo(() => {
    const periodos = new Set(demonstrativo.map(d => d.mes));
    return Array.from(periodos).sort().reverse();
  }, [demonstrativo]);

  // Filtrar demonstrativos por período
  const demonstrativosFiltrados = useMemo(() => {
    if (filtroperiodo === "todos") return demonstrativo;
    return demonstrativo.filter(d => d.mes === filtroperiodo);
  }, [demonstrativo, filtroperiodo]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(demonstrativosFiltrados.map(item => ({
      'Código': item.codigo,
      'Mês': item.mes,
      'Nome': item.nome,
      'Obra': item.obra,
      'Função': item.funcao,
      'Nome da Empresa': item.nomeempresa,
      'CPF': item.cpf,
      'Data de Nascimento': item.datanascimento,
      'Admissão': item.admissao,
      'Salário': item.salario,
      'Premiação Nexa': item.premiacaonexa,
      'Ajuda de Custo Obra': item.ajudacustoobra,
      'Multas e Descontos': item.multasdescontos,
      'Ajuda de Aluguel': item.ajudaaluguel,
      'Desconto de Convênio': item.descontoconvenio,
      'Reembolso Convênio': item.reembolsoconvenio,
      'Desconto Abelv Run': item.descontoabelvrun,
      'Valor NF': item.valornf,
      'Valor Líquido': item.valorliquido
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

  const handleSalvarNovo = async (data: any) => {
    try {
      await createDemonstrativo.mutateAsync({
        ...data,
        datanascimento: data.datanascimento ? format(data.datanascimento, "yyyy-MM-dd") : "",
        admissao: data.admissao ? format(data.admissao, "yyyy-MM-dd") : "",
      });
    } catch (error) {
      console.error("Erro ao criar demonstrativo:", error);
    }
  };

  const handleEditar = (item: any) => {
    setDemonstrativoSelecionado(item);
    setEditarModalOpen(true);
  };

  const handleSalvarEdicao = async (data: any) => {
    try {
      await updateDemonstrativo.mutateAsync({
        id: demonstrativoSelecionado.id,
        ...data,
        datanascimento: data.datanascimento ? format(data.datanascimento, "yyyy-MM-dd") : demonstrativoSelecionado.datanascimento,
        admissao: data.admissao ? format(data.admissao, "yyyy-MM-dd") : demonstrativoSelecionado.admissao,
        mes: data.periodocontabil,
      });
      setDemonstrativoSelecionado(null);
      setEditarModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar demonstrativo:", error);
    }
  };

  const handleExcluir = async (id: string) => {
    try {
      await deleteDemonstrativo.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao excluir demonstrativo:", error);
    }
  };

  const handleEnviarDemonstrativo = (item: any) => {
    const totalProventos = (item.salario || 0) + (item.premiacaonexa || 0) + (item.ajudacustoobra || 0) + (item.ajudaaluguel || 0) + (item.reembolsoconvenio || 0);
    const totalDescontos = (item.multasdescontos || 0) + (item.descontoconvenio || 0) + (item.descontoabelvrun || 0);
    
    setDemonstrativoSelecionado({
      prestador: item.nome || "",
      periodo: item.mes || "",
      servico: item.funcao || "",
      centroCusto: item.obra || "",
      valorBruto: totalProventos,
      descontos: totalDescontos,
      valorLiquido: item.valorliquido || 0
    });
    setEnviarModalOpen(true);
  };

  const handleDownloadPDF = (item: any) => {
    const pdfData = {
      prestador: item.nome,
      email: "",
      periodo: item.mes,
      items: [
        { codigo: '001', descricao: 'Base (Salário)', proventos: item.salario, descontos: 0 },
        { codigo: '002', descricao: 'Bonificação', proventos: item.premiacaonexa, descontos: 0 },
        { codigo: '003', descricao: 'Ajuda de Custo Obra', proventos: item.ajudacustoobra, descontos: 0 },
        { codigo: '004', descricao: 'Ajuda de Aluguel', proventos: item.ajudaaluguel, descontos: 0 },
        { codigo: '005', descricao: 'Reembolso Convênio', proventos: item.reembolsoconvenio, descontos: 0 },
        { codigo: '006', descricao: 'Multas e Descontos', proventos: 0, descontos: item.multasdescontos },
        { codigo: '007', descricao: 'Desconto de Convênio', proventos: 0, descontos: item.descontoconvenio },
        { codigo: '008', descricao: 'Desconto Abelv Run', proventos: 0, descontos: item.descontoabelvrun },
      ],
    };
    
    downloadDemonstrativoPDF(pdfData);
    
    toast({
      title: "Download concluído",
      description: "O demonstrativo foi baixado com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

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
                  <TableHead>Mês</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nome da Empresa</TableHead>
                  <TableHead>Valor NF</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demonstrativosFiltrados.map((item) => <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.mes}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.nomeempresa}</TableCell>
                    <TableCell className="font-semibold">R$ {item.valornf?.toFixed(2) || '0.00'}</TableCell>
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
                        <Button size="sm" variant="outline" onClick={() => handleExcluir(item.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
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
