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
import { useMemo, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const demonstrativoSchema = z.object({
  codigo: z.string().optional(),
  periodocontabil: z.string().min(1, "Período Contábil é obrigatório"),
  codigosienge: z.string().min(1, "Código Sienge é obrigatório"),
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
  onSave: (data: DemonstrativoFormData & { valornf: number }) => void;
}

export function NovoDemonstrativoModal({ open, onOpenChange, onSave }: NovoDemonstrativoModalProps) {
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [dataAdmissao, setDataAdmissao] = useState<Date>();
  const [prestadores, setPrestadores] = useState<any[]>([]);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<string>("");
  const [periodoContabil, setPeriodoContabil] = useState<string>("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Carregar prestadores do localStorage
  useEffect(() => {
    const prestadoresStorage = localStorage.getItem('cadastros_pessoa_juridica');
    if (prestadoresStorage) {
      setPrestadores(JSON.parse(prestadoresStorage));
    }
  }, [open]);

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
  const handlePrestadorChange = (cpf: string) => {
    setPrestadorSelecionado(cpf);
    verificarExibicaoFormulario();
    
    const prestador = prestadores.find(p => p.cpf === cpf);
    if (prestador) {
      setValue("nome", prestador.nomecompleto || "");
      setValue("email", prestador.emailrepresentante || prestador.email || "");
      setValue("cpf", prestador.cpf || "");
      setValue("nomeempresa", prestador.razaosocial || "");
      setValue("funcao", prestador.servico || "");
      
      if (prestador.datanascimento) {
        const dataNasc = new Date(prestador.datanascimento);
        setDataNascimento(dataNasc);
        setValue("datanascimento", dataNasc);
      }
      
      if (prestador.datainiciocontrato) {
        const dataAdm = new Date(prestador.datainiciocontrato);
        setDataAdmissao(dataAdm);
        setValue("admissao", dataAdm);
      }

      // Preencher valores financeiros se existirem
      if (prestador.valorprestacaoservico) {
        const valor = parseFloat(prestador.valorprestacaoservico.replace(/\D/g, '')) / 100;
        setValue("salario", valor || 0);
      }
      if (prestador.ajudacusto) {
        const valor = parseFloat(prestador.ajudacusto.replace(/\D/g, '')) / 100;
        setValue("ajudacustoobra", valor || 0);
      }
      if (prestador.ajudaaluguel) {
        const valor = parseFloat(prestador.ajudaaluguel.replace(/\D/g, '')) / 100;
        setValue("ajudaaluguel", valor || 0);
      }
      if (prestador.valorauxilioconveniomedico) {
        const valor = parseFloat(prestador.valorauxilioconveniomedico.replace(/\D/g, '')) / 100;
        setValue("reembolsoconvenio", valor || 0);
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
    onSave({
      ...data,
      codigo,
      valornf: valorNF,
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
              <Select value={prestadorSelecionado} onValueChange={handlePrestadorChange}>
                <SelectTrigger id="prestador">
                  <SelectValue placeholder="Selecione um prestador para auto-preencher os dados" />
                </SelectTrigger>
                <SelectContent>
                  {prestadores.length === 0 ? (
                    <SelectItem value="none" disabled>Nenhum prestador cadastrado</SelectItem>
                  ) : (
                    prestadores.map((prestador) => (
                      <SelectItem key={prestador.cpf} value={prestador.cpf}>
                        {prestador.nomecompleto} - {prestador.cpf}
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
                  Código Sienge*
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
                  Obra*
                </Label>
                <Input 
                  id="obra" 
                  {...register("obra")}
                  className={errors.obra ? "border-destructive" : ""}
                />
                {errors.obra && <p className="text-xs text-destructive mt-1">{errors.obra.message}</p>}
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
                <Input 
                  id="salario" 
                  type="number"
                  step="0.01"
                  {...register("salario", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="premiacaonexa">Bonificação</Label>
                <Input 
                  id="premiacaonexa" 
                  type="number"
                  step="0.01"
                  {...register("premiacaonexa", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ajudacustoobra">Ajuda de Custo Obra</Label>
                <Input 
                  id="ajudacustoobra" 
                  type="number"
                  step="0.01"
                  {...register("ajudacustoobra", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="ajudaaluguel">Ajuda de Aluguel</Label>
                <Input 
                  id="ajudaaluguel" 
                  type="number"
                  step="0.01"
                  {...register("ajudaaluguel", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reembolsoconvenio">Reembolso Convênio</Label>
              <Input 
                id="reembolsoconvenio" 
                type="number"
                step="0.01"
                {...register("reembolsoconvenio", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Descontos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2 border-red-500/30">Descontos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="multasdescontos">Multas de Trânsito</Label>
                <Input 
                  id="multasdescontos" 
                  type="number"
                  step="0.01"
                  {...register("multasdescontos", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="descontoconvenio">Desconto de Convênio</Label>
                <Input 
                  id="descontoconvenio" 
                  type="number"
                  step="0.01"
                  {...register("descontoconvenio", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descontoabelvrun">Desconto Abelv Run</Label>
                <Input 
                  id="descontoabelvrun" 
                  type="number"
                  step="0.01"
                  {...register("descontoabelvrun", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="estacionamento">Estacionamento</Label>
                <Input 
                  id="estacionamento" 
                  type="number"
                  step="0.01"
                  {...register("estacionamento", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Valor Total */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Valor Total</h3>
            <div className="bg-muted p-4 rounded-lg">
              <Label>Valor NF (Calculado)</Label>
              <p className="text-2xl font-bold text-primary mt-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorNF)}
              </p>
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
