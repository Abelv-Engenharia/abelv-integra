import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { usePrestadoresPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";

const demonstrativoSchema = z.object({
  codigo: z.string().optional(),
  periodocontabil: z.string().min(1, "Período Contábil é obrigatório"),
  codigosienge: z.string().min(1, "N° Credor Sienge é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  datanascimento: z.date({ required_error: "Data de nascimento é obrigatória" }),
  obra: z.string().min(1, "Obra é obrigatória"),
  funcao: z.string().min(1, "Função é obrigatória"),
  nomeempresa: z.string().min(1, "Nome da empresa é obrigatório"),
  admissao: z.date({ required_error: "Data de admissão é obrigatória" }),
  salario: z.number().min(0, "Valor não pode ser negativo"),
  premiacaonexa: z.number().min(0, "Valor não pode ser negativo"),
  ajudacustoobra: z.number().min(0, "Valor não pode ser negativo"),
  ajudaaluguel: z.number().min(0, "Valor não pode ser negativo"),
  reembolsoconvenio: z.number().min(0, "Valor não pode ser negativo"),
  multasdescontos: z.number().min(0, "Valor não pode ser negativo"),
  descontoconvenio: z.number().min(0, "Valor não pode ser negativo"),
  descontoabelvrun: z.number().min(0, "Valor não pode ser negativo"),
  estacionamento: z.number().min(0, "Valor não pode ser negativo"),
});

type DemonstrativoFormData = z.infer<typeof demonstrativoSchema>;

interface NovoDemonstrativoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DemonstrativoFormData & { 
    valornf: number;
    prestadorId: string;
    ccaId?: number;
    ccaCodigo?: string;
    mes: string;
  }) => void;
}

export function NovoDemonstrativoModal({ open, onOpenChange, onSave }: NovoDemonstrativoModalProps) {
  const { data: prestadores = [], isLoading: loadingPrestadores } = usePrestadoresPJ();
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [dataAdmissao, setDataAdmissao] = useState<Date>();
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<string>("");
  const [periodoContabil, setPeriodoContabil] = useState<string>("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<DemonstrativoFormData>({
    resolver: zodResolver(demonstrativoSchema),
    defaultValues: {
      salario: 0,
      premiacaonexa: 0,
      ajudacustoobra: 0,
      ajudaaluguel: 0,
      reembolsoconvenio: 0,
      multasdescontos: 0,
      descontoconvenio: 0,
      descontoabelvrun: 0,
      estacionamento: 0,
    }
  });

  // Verificar se deve mostrar formulário
  const verificarExibicaoFormulario = () => {
    if (prestadorSelecionado && periodoContabil) {
      setMostrarFormulario(true);
    } else {
      setMostrarFormulario(false);
    }
  };

  // Auto-preencher campos ao selecionar prestador
  const handlePrestadorChange = (id: string) => {
    setPrestadorSelecionado(id);
    
    const prestador = prestadores.find(p => p.id === id);
    if (prestador) {
      console.log("Prestador selecionado:", prestador);
      console.log("CCA ID:", prestador.ccaId);
      console.log("CCA Código:", prestador.ccaCodigo);
      console.log("CCA Nome:", prestador.ccaNome);
      
      setValue("nome", prestador.nomeCompleto || "");
      setValue("email", prestador.emailRepresentante || "");
      setValue("cpf", prestador.cpf || "");
      setValue("nomeempresa", prestador.razaoSocial || "");
      setValue("funcao", prestador.servico || "");
      setValue("codigosienge", prestador.numeroCredorSienge || "");
      
      // Preencher campo CCA - tentar todas as possibilidades
      if (prestador.ccaCodigo && prestador.ccaNome) {
        const ccaValue = `${prestador.ccaCodigo} - ${prestador.ccaNome}`;
        console.log("Preenchendo CCA com:", ccaValue);
        setValue("obra", ccaValue);
      } else if (prestador.ccaId) {
        // Se não tiver código e nome, apenas mostrar o ID
        setValue("obra", `CCA ID: ${prestador.ccaId}`);
        console.log("CCA preenchido apenas com ID:", prestador.ccaId);
      }
      
      if (prestador.dataNascimento) {
        // Corrigir timezone para não perder um dia
        const [ano, mes, dia] = prestador.dataNascimento.split('-');
        const dataNasc = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        setDataNascimento(dataNasc);
        setValue("datanascimento", dataNasc);
      }
      
      if (prestador.dataInicioContrato) {
        // Corrigir timezone para não perder um dia
        const [ano, mes, dia] = prestador.dataInicioContrato.split('-');
        const dataAdm = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        setDataAdmissao(dataAdm);
        setValue("admissao", dataAdm);
      }

      // Preencher valores financeiros se existirem
      if (prestador.valorPrestacaoServico) {
        setValue("salario", prestador.valorPrestacaoServico || 0);
      }
      if (prestador.ajudaCusto) {
        setValue("ajudacustoobra", prestador.ajudaCusto || 0);
      }
      if (prestador.ajudaAluguel) {
        setValue("ajudaaluguel", prestador.ajudaAluguel || 0);
      }
      if (prestador.valorAuxilioConvenioMedico) {
        setValue("reembolsoconvenio", prestador.valorAuxilioConvenioMedico || 0);
      }
    }
    verificarExibicaoFormulario();
  };

  const handlePeriodoContabilChange = (periodo: string) => {
    setPeriodoContabil(periodo);
    setValue("periodocontabil", periodo);
    verificarExibicaoFormulario();
  };

  // Gerar lista de períodos contábeis (últimos 12 meses + próximos 3 meses)
  const gerarPeriodosContabeis = () => {
    const periodos = [];
    const hoje = new Date();
    
    for (let i = 12; i >= -3; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      periodos.push({
        valor: `${mes}/${ano}`,
        label: data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      });
    }
    
    return periodos;
  };

  // Watch financial fields for automatic calculation
  const salario = watch("salario") || 0;
  const premiacaonexa = watch("premiacaonexa") || 0;
  const ajudacustoobra = watch("ajudacustoobra") || 0;
  const ajudaaluguel = watch("ajudaaluguel") || 0;
  const reembolsoconvenio = watch("reembolsoconvenio") || 0;
  const multasdescontos = watch("multasdescontos") || 0;
  const descontoconvenio = watch("descontoconvenio") || 0;
  const descontoabelvrun = watch("descontoabelvrun") || 0;
  const estacionamento = watch("estacionamento") || 0;

  const valorNF = useMemo(() => {
    const totalProventos = salario + premiacaonexa + ajudacustoobra + ajudaaluguel + reembolsoconvenio;
    const totalDescontos = multasdescontos + descontoconvenio + descontoabelvrun + estacionamento;
    return totalProventos - totalDescontos;
  }, [salario, premiacaonexa, ajudacustoobra, ajudaaluguel, reembolsoconvenio, multasdescontos, descontoconvenio, descontoabelvrun, estacionamento]);

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount;
  };

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof DemonstrativoFormData) => {
    const value = formatCurrency(e.target.value);
    setValue(field as any, value);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const onSubmit = (data: DemonstrativoFormData) => {
    const codigo = data.codigo || `DEMO-${Date.now()}`;
    
    // Buscar prestador para obter ccaId e ccaCodigo
    const prestador = prestadores.find(p => p.id === prestadorSelecionado);
    
    onSave({
      ...data,
      codigo,
      valornf: valorNF,
      prestadorId: prestadorSelecionado,
      ccaId: prestador?.ccaId,
      ccaCodigo: prestador?.ccaCodigo,
      mes: data.periodocontabil,
    });
    toast({
      title: "Sucesso",
      description: "Demonstrativo cadastrado com sucesso!",
    });
    
    // Resetar formulário
    reset();
    setDataNascimento(undefined);
    setDataAdmissao(undefined);
    setPrestadorSelecionado("");
    setPeriodoContabil("");
    setMostrarFormulario(false);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Demonstrativo de Prestação de Serviço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção de Prestador e Período Contábil */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2 text-primary">Selecionar Prestador e Período</h3>
            <div>
              <Label htmlFor="prestador">Prestador Cadastrado</Label>
              <Select 
                value={prestadorSelecionado} 
                onValueChange={handlePrestadorChange}
                disabled={loadingPrestadores}
              >
                <SelectTrigger id="prestador">
                  <SelectValue placeholder={loadingPrestadores ? "Carregando..." : "Selecione um prestador para auto-preencher os dados"} />
                </SelectTrigger>
                <SelectContent>
                  {prestadores.length === 0 ? (
                    <SelectItem value="none" disabled>Nenhum prestador cadastrado</SelectItem>
                  ) : (
                    prestadores.map((prestador) => (
                      <SelectItem key={prestador.id} value={prestador.id}>
                        {prestador.nomeCompleto} - CPF: {prestador.cpf}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Ao selecionar um prestador, os dados serão preenchidos automaticamente
              </p>
            </div>

            <div>
              <Label htmlFor="periodocontabil" className={errors.periodocontabil ? "text-destructive" : ""}>
                Período Contábil*
              </Label>
              <Select value={periodoContabil} onValueChange={handlePeriodoContabilChange}>
                <SelectTrigger 
                  id="periodocontabil"
                  className={errors.periodocontabil ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Selecione o período contábil" />
                </SelectTrigger>
                <SelectContent>
                  {gerarPeriodosContabeis().map((periodo) => (
                    <SelectItem key={periodo.valor} value={periodo.valor}>
                      {periodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.periodocontabil && <p className="text-xs text-destructive mt-1">{errors.periodocontabil.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Selecione o mês/ano de referência para este demonstrativo
              </p>
            </div>
          </div>

          {mostrarFormulario && (
            <>

          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" {...register("codigo")} placeholder="Auto-gerado" />
              </div>
              <div>
                <Label htmlFor="codigosienge" className={errors.codigosienge ? "text-destructive" : ""}>
                  N° Credor Sienge*
                </Label>
                <Input 
                  id="codigosienge" 
                  {...register("codigosienge")}
                  className={errors.codigosienge ? "border-destructive" : ""}
                />
                {errors.codigosienge && <p className="text-xs text-destructive mt-1">{errors.codigosienge.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="nome" className={errors.nome ? "text-destructive" : ""}>
                Nome*
              </Label>
              <Input 
                id="nome" 
                {...register("nome")}
                className={errors.nome ? "border-destructive" : ""}
              />
              {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                  Email*
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="cpf" className={errors.cpf ? "text-destructive" : ""}>
                  CPF*
                </Label>
                <Input 
                  id="cpf" 
                  {...register("cpf")}
                  onChange={(e) => {
                    e.target.value = formatCPF(e.target.value);
                    setValue("cpf", e.target.value);
                  }}
                  maxLength={14}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? "border-destructive" : ""}
                />
                {errors.cpf && <p className="text-xs text-destructive mt-1">{errors.cpf.message}</p>}
              </div>
            </div>

            <div>
              <Label className={errors.datanascimento ? "text-destructive" : ""}>
                Data de Nascimento*
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataNascimento && "text-muted-foreground",
                      errors.datanascimento && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataNascimento ? format(dataNascimento, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataNascimento}
                    onSelect={(date) => {
                      setDataNascimento(date);
                      setValue("datanascimento", date as Date);
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.datanascimento && <p className="text-xs text-destructive mt-1">{errors.datanascimento.message}</p>}
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Dados Profissionais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="obra" className={errors.obra ? "text-destructive" : ""}>
                  CCA*
                </Label>
                <Input 
                  id="obra" 
                  {...register("obra")}
                  className={cn(
                    errors.obra && !watch("obra") ? "border-destructive" : "",
                    "bg-muted"
                  )}
                  placeholder="Selecione um prestador primeiro"
                  readOnly
                />
                {errors.obra && <p className="text-xs text-destructive mt-1">{errors.obra.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Campo preenchido automaticamente do cadastro do prestador
                </p>
              </div>
              <div>
                <Label htmlFor="funcao" className={errors.funcao ? "text-destructive" : ""}>
                  Função*
                </Label>
                <Input 
                  id="funcao" 
                  {...register("funcao")}
                  className={errors.funcao ? "border-destructive" : ""}
                />
                {errors.funcao && <p className="text-xs text-destructive mt-1">{errors.funcao.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeempresa" className={errors.nomeempresa ? "text-destructive" : ""}>
                  Nome da Empresa*
                </Label>
                <Input 
                  id="nomeempresa" 
                  {...register("nomeempresa")}
                  className={errors.nomeempresa ? "border-destructive" : ""}
                />
                {errors.nomeempresa && <p className="text-xs text-destructive mt-1">{errors.nomeempresa.message}</p>}
              </div>
              <div>
                <Label className={errors.admissao ? "text-destructive" : ""}>
                  Admissão*
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataAdmissao && "text-muted-foreground",
                        errors.admissao && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAdmissao ? format(dataAdmissao, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataAdmissao}
                      onSelect={(date) => {
                        setDataAdmissao(date);
                        setValue("admissao", date as Date);
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.admissao && <p className="text-xs text-destructive mt-1">{errors.admissao.message}</p>}
              </div>
            </div>
          </div>

          {/* Proventos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2 border-green-500/30">Proventos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salario">Salário</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="salario" 
                    type="text"
                    className="pl-10"
                    value={salario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("salario", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="premiacaonexa">Bonificação</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="premiacaonexa" 
                    type="text"
                    className="pl-10"
                    value={premiacaonexa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("premiacaonexa", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ajudacustoobra">Ajuda de Custo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="ajudacustoobra" 
                    type="text"
                    className="pl-10"
                    value={ajudacustoobra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("ajudacustoobra", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ajudaaluguel">Ajuda Aluguel</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="ajudaaluguel" 
                    type="text"
                    className="pl-10"
                    value={ajudaaluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("ajudaaluguel", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="reembolsoconvenio">Reembolso Convenio</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input 
                  id="reembolsoconvenio" 
                  type="text"
                  className="pl-10"
                  value={reembolsoconvenio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setValue("reembolsoconvenio", parseFloat(value) / 100 || 0);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Descontos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2 border-red-500/30">Descontos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="multasdescontos">Multas de Transito</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="multasdescontos" 
                    type="text"
                    className="pl-10"
                    value={multasdescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("multasdescontos", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="descontoconvenio">Desconto Convenio</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="descontoconvenio" 
                    type="text"
                    className="pl-10"
                    value={descontoconvenio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("descontoconvenio", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descontoabelvrun">Desconto Abelv Run</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="descontoabelvrun" 
                    type="text"
                    className="pl-10"
                    value={descontoabelvrun.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("descontoabelvrun", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="estacionamento">Estacionamento</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input 
                    id="estacionamento" 
                    type="text"
                    className="pl-10"
                    value={estacionamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue("estacionamento", parseFloat(value) / 100 || 0);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Valor Total */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Valor Total</h3>
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Total Proventos</Label>
                  <p className="text-lg font-semibold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      salario + premiacaonexa + ajudacustoobra + ajudaaluguel + reembolsoconvenio
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Descontos</Label>
                  <p className="text-lg font-semibold text-red-600">
                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      multasdescontos + descontoconvenio + descontoabelvrun + estacionamento
                    )}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <Label>Valor NF (Calculado)</Label>
                <p className="text-2xl font-bold text-primary mt-2">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorNF)}
                </p>
              </div>
            </div>
          </div>

          </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!mostrarFormulario}>Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
