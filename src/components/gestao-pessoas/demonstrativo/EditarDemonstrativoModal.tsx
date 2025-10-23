import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
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

interface EditarDemonstrativoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DemonstrativoFormData & { valornf: number; valorliquido: number }) => void;
  demonstrativo: any;
}

export function EditarDemonstrativoModal({ open, onOpenChange, onSave, demonstrativo }: EditarDemonstrativoModalProps) {
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [dataAdmissao, setDataAdmissao] = useState<Date>();
  const [periodoContabil, setPeriodoContabil] = useState<string>("");

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

  // Preencher formulário com dados existentes
  useEffect(() => {
    if (demonstrativo && open) {
      setValue("codigo", demonstrativo.codigo || "");
      setValue("periodocontabil", demonstrativo.mes || "");
      setPeriodoContabil(demonstrativo.mes || "");
      setValue("codigosienge", demonstrativo.codigosienge || "");
      setValue("nome", demonstrativo.nome || "");
      setValue("email", demonstrativo.email || "");
      setValue("cpf", demonstrativo.cpf || "");
      setValue("obra", demonstrativo.obra || "");
      setValue("funcao", demonstrativo.funcao || "");
      setValue("nomeempresa", demonstrativo.nomeempresa || "");
      setValue("salario", demonstrativo.salario || 0);
      setValue("premiacaonexa", demonstrativo.premiacaonexa || 0);
      setValue("ajudacustoobra", demonstrativo.ajudacustoobra || 0);
      setValue("ajudaaluguel", demonstrativo.ajudaaluguel || 0);
      setValue("reembolsoconvenio", demonstrativo.reembolsoconvenio || 0);
      setValue("multasdescontos", demonstrativo.multasdescontos || 0);
      setValue("descontoconvenio", demonstrativo.descontoconvenio || 0);
      setValue("descontoabelvrun", demonstrativo.descontoabelvrun || 0);
      setValue("estacionamento", demonstrativo.estacionamento || 0);

      // Converter strings de data para Date objects (formato do banco: yyyy-MM-dd)
      if (demonstrativo.datanascimento) {
        try {
          const dataNasc = parse(demonstrativo.datanascimento, "yyyy-MM-dd", new Date());
          if (dataNasc && !isNaN(dataNasc.getTime())) {
            setDataNascimento(dataNasc);
            setValue("datanascimento", dataNasc);
          }
        } catch (error) {
          console.error("Erro ao parsear data de nascimento:", error);
        }
      }

      if (demonstrativo.admissao) {
        try {
          const dataAdm = parse(demonstrativo.admissao, "yyyy-MM-dd", new Date());
          if (dataAdm && !isNaN(dataAdm.getTime())) {
            setDataAdmissao(dataAdm);
            setValue("admissao", dataAdm);
          }
        } catch (error) {
          console.error("Erro ao parsear data de admissão:", error);
        }
      }
    }
  }, [demonstrativo, open, setValue]);

  const handlePeriodoContabilChange = (periodo: string) => {
    setPeriodoContabil(periodo);
    setValue("periodocontabil", periodo);
  };

  // Gerar lista de períodos contábeis (últimos 12 meses + próximos 6 meses)
  const gerarPeriodosContabeis = () => {
    const periodos = [];
    const hoje = new Date();
    
    // Gerar dos últimos 12 meses até os próximos 6 meses
    for (let i = 12; i >= -6; i--) {
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
    onSave({
      ...data,
      valornf: valorNF,
      valorliquido: valorNF,
    });
    toast({
      title: "Sucesso",
      description: "Demonstrativo atualizado com sucesso!",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Demonstrativo de Prestação de Serviço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {dataNascimento && !isNaN(dataNascimento.getTime()) 
                      ? format(dataNascimento, "PPP", { locale: ptBR }) 
                      : "Selecione a data"}
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
                  Nome da empresa*
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
                  Data de Admissão*
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
                      {dataAdmissao && !isNaN(dataAdmissao.getTime()) 
                        ? format(dataAdmissao, "PPP", { locale: ptBR }) 
                        : "Selecione a data"}
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
            </div>
          </div>

          {/* Valores - Proventos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Proventos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salario">Salário</Label>
                <Input 
                  id="salario" 
                  type="text"
                  value={salario ? salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "salario")}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="premiacaonexa">Premiação Nexa</Label>
                <Input 
                  id="premiacaonexa" 
                  type="text"
                  value={premiacaonexa ? premiacaonexa.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "premiacaonexa")}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ajudacustoobra">Ajuda de custo - obra</Label>
                <Input 
                  id="ajudacustoobra" 
                  type="text"
                  value={ajudacustoobra ? ajudacustoobra.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "ajudacustoobra")}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="ajudaaluguel">Ajuda de aluguel</Label>
                <Input 
                  id="ajudaaluguel" 
                  type="text"
                  value={ajudaaluguel ? ajudaaluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "ajudaaluguel")}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reembolsoconvenio">Reembolso convênio</Label>
              <Input 
                id="reembolsoconvenio" 
                type="text"
                value={reembolsoconvenio ? reembolsoconvenio.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                onChange={(e) => handleCurrencyInput(e, "reembolsoconvenio")}
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          {/* Valores - Descontos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b pb-2">Descontos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="multasdescontos">Multas de trânsito/descontos</Label>
                <Input 
                  id="multasdescontos" 
                  type="text"
                  value={multasdescontos ? multasdescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "multasdescontos")}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="descontoconvenio">Desconto convênio</Label>
                <Input 
                  id="descontoconvenio" 
                  type="text"
                  value={descontoconvenio ? descontoconvenio.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "descontoconvenio")}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descontoabelvrun">Desconto abelv run</Label>
                <Input 
                  id="descontoabelvrun" 
                  type="text"
                  value={descontoabelvrun ? descontoabelvrun.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "descontoabelvrun")}
                  placeholder="R$ 0,00"
                />
              </div>
              <div>
                <Label htmlFor="estacionamento">Estacionamento</Label>
                <Input 
                  id="estacionamento" 
                  type="text"
                  value={estacionamento ? estacionamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  onChange={(e) => handleCurrencyInput(e, "estacionamento")}
                  placeholder="R$ 0,00"
                />
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
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorNF)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
