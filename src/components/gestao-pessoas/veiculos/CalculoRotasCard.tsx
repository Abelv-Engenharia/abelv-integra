import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Plus, Trash2, Loader2, MapPin, Route, FileText, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import type { EnderecoRota, CalculoEstimativaCartao } from "@/types/route";
import { calcularEstimativaCompleta } from "@/services/RouteCalculationService";

interface CalculoRotasCardProps {
  veiculos: Array<{
    id: number;
    placa: string;
    modelo: string;
    status: string;
  }>;
  cartoes: Array<{
    id: number;
    placa: string;
    numeroCartao: string;
    limiteCredito: number;
    status: string;
  }>;
  onCalculoSalvo?: (calculo: CalculoEstimativaCartao) => void;
}

export function CalculoRotasCard({ veiculos, cartoes, onCalculoSalvo }: CalculoRotasCardProps) {
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>("");
  const [consumoKmL, setConsumoKmL] = useState<string>("9");
  const [tipoCombustivel, setTipoCombustivel] = useState<string>("flex");
  const [precoCombustivel, setPrecoCombustivel] = useState<string>("");
  
  const [enderecoBase, setEnderecoBase] = useState({
    nome: "",
    endereco: ""
  });
  
  const [enderecoObra, setEnderecoObra] = useState({
    nome: "",
    endereco: ""
  });
  
  const [frequenciaDiaria, setFrequenciaDiaria] = useState<number>(2);
  const [diasUteis, setDiasUteis] = useState<string>("22");
  const [margemSeguranca, setMargemSeguranca] = useState<number>(20);
  
  const [trajetosAdicionais, setTrajetosAdicionais] = useState<Array<{
    id: string;
    nome: string;
    endereco: string;
    frequenciaSemanal: number;
  }>>([]);
  
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState<CalculoEstimativaCartao | null>(null);

  const veiculoAtual = veiculos.find(v => v.id.toString() === veiculoSelecionado);
  const cartaoVeiculo = cartoes.find(c => c.placa === veiculoAtual?.placa);

  const adicionarTrajeto = () => {
    setTrajetosAdicionais([
      ...trajetosAdicionais,
      {
        id: Date.now().toString(),
        nome: "",
        endereco: "",
        frequenciaSemanal: 1
      }
    ]);
  };

  const removerTrajeto = (id: string) => {
    setTrajetosAdicionais(trajetosAdicionais.filter(t => t.id !== id));
  };

  const atualizarTrajeto = (id: string, campo: string, valor: string | number) => {
    setTrajetosAdicionais(
      trajetosAdicionais.map(t => 
        t.id === id ? { ...t, [campo]: valor } : t
      )
    );
  };

  const validarFormulario = (): string | null => {
    if (!veiculoSelecionado) return "Selecione um veículo";
    if (!consumoKmL || parseFloat(consumoKmL) <= 0) return "Informe o consumo do veículo";
    if (!precoCombustivel || parseFloat(precoCombustivel) <= 0) return "Informe o preço do combustível";
    if (!enderecoBase.nome || !enderecoBase.endereco) return "Preencha o endereço base";
    if (!enderecoObra.nome || !enderecoObra.endereco) return "Preencha o endereço da obra";
    if (!diasUteis || parseInt(diasUteis) <= 0) return "Informe os dias úteis";
    return null;
  };

  const calcularEstimativa = async () => {
    const erro = validarFormulario();
    if (erro) {
      toast({
        title: "Validação",
        description: erro,
        variant: "destructive"
      });
      return;
    }

    setCalculando(true);
    setResultado(null);

    try {
      const config = {
        veiculoId: veiculoSelecionado,
        placa: veiculoAtual!.placa,
        modelo: veiculoAtual!.modelo,
        consumoMedioKmL: parseFloat(consumoKmL),
        tipoCombustivel: tipoCombustivel as 'gasolina' | 'diesel' | 'etanol' | 'flex',
        cartaoId: cartaoVeiculo?.id.toString(),
        limiteAtualCartao: cartaoVeiculo?.limiteCredito
      };

      const enderecoBaseObj: EnderecoRota = {
        id: "base",
        nome: enderecoBase.nome,
        endereco: enderecoBase.endereco,
        tipo: "base"
      };

      const enderecoObraObj: EnderecoRota = {
        id: "obra",
        nome: enderecoObra.nome,
        endereco: enderecoObra.endereco,
        tipo: "obra"
      };

      const trajetosObj: EnderecoRota[] = trajetosAdicionais.map(t => ({
        id: t.id,
        nome: t.nome,
        endereco: t.endereco,
        tipo: "adicional" as const,
        frequenciaSemanal: t.frequenciaSemanal
      }));

      const estimativa = await calcularEstimativaCompleta(
        config,
        enderecoBaseObj,
        enderecoObraObj,
        trajetosObj,
        parseFloat(precoCombustivel),
        margemSeguranca,
        parseInt(diasUteis),
        frequenciaDiaria
      );

      if (estimativa) {
        setResultado(estimativa);
        toast({
          title: "Cálculo concluído",
          description: "Estimativa calculada com sucesso"
        });
      } else {
        toast({
          title: "Erro no cálculo",
          description: "Não foi possível calcular a estimativa",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao calcular estimativa",
        variant: "destructive"
      });
    } finally {
      setCalculando(false);
    }
  };

  const limparFormulario = () => {
    setVeiculoSelecionado("");
    setConsumoKmL("9");
    setTipoCombustivel("flex");
    setPrecoCombustivel("");
    setEnderecoBase({ nome: "", endereco: "" });
    setEnderecoObra({ nome: "", endereco: "" });
    setFrequenciaDiaria(2);
    setDiasUteis("22");
    setMargemSeguranca(20);
    setTrajetosAdicionais([]);
    setResultado(null);
  };

  const salvarCalculo = () => {
    if (resultado && onCalculoSalvo) {
      onCalculoSalvo(resultado);
      toast({
        title: "Cálculo salvo",
        description: "Estimativa adicionada ao histórico"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Seleção de Veículo */}
      <Card>
        <CardHeader>
          <CardTitle>Seleção de Veículo</CardTitle>
          <CardDescription>Escolha o veículo para calcular a estimativa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="veiculo">Veículo</Label>
              <Select value={veiculoSelecionado} onValueChange={setVeiculoSelecionado}>
                <SelectTrigger id="veiculo">
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {veiculos.filter(v => v.status === "Ativo").map(veiculo => (
                    <SelectItem key={veiculo.id} value={veiculo.id.toString()}>
                      {veiculo.placa} - {veiculo.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {cartaoVeiculo && (
              <div className="space-y-2">
                <Label>Cartão Vinculado</Label>
                <div className="p-3 border rounded-md bg-muted">
                  <p className="text-sm font-medium">{cartaoVeiculo.numeroCartao}</p>
                  <p className="text-sm text-muted-foreground">
                    Limite: R$ {cartaoVeiculo.limiteCredito.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant={cartaoVeiculo.status === "Ativo" ? "default" : "secondary"} className="mt-1">
                    {cartaoVeiculo.status}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Veículo */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="consumo">Consumo Médio (km/l)</Label>
              <Input
                id="consumo"
                type="number"
                step="0.1"
                value={consumoKmL}
                onChange={(e) => setConsumoKmL(e.target.value)}
                placeholder="9.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo-combustivel">Tipo de Combustível</Label>
              <Select value={tipoCombustivel} onValueChange={setTipoCombustivel}>
                <SelectTrigger id="tipo-combustivel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="etanol">Etanol</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preco-combustivel">Preço Combustível (R$/litro)</Label>
              <Input
                id="preco-combustivel"
                type="number"
                step="0.01"
                value={precoCombustivel}
                onChange={(e) => setPrecoCombustivel(e.target.value)}
                placeholder="5.89"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereços */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-base">Nome</Label>
              <Input
                id="nome-base"
                value={enderecoBase.nome}
                onChange={(e) => setEnderecoBase({ ...enderecoBase, nome: e.target.value })}
                placeholder="Ex: Escritório Central"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco-base">Endereço Completo</Label>
              <Textarea
                id="endereco-base"
                value={enderecoBase.endereco}
                onChange={(e) => setEnderecoBase({ ...enderecoBase, endereco: e.target.value })}
                placeholder="Rua, Número - Bairro, Cidade - UF"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço da Obra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-obra">Nome</Label>
              <Input
                id="nome-obra"
                value={enderecoObra.nome}
                onChange={(e) => setEnderecoObra({ ...enderecoObra, nome: e.target.value })}
                placeholder="Ex: Obra XYZ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco-obra">Endereço Completo</Label>
              <Textarea
                id="endereco-obra"
                value={enderecoObra.endereco}
                onChange={(e) => setEnderecoObra({ ...enderecoObra, endereco: e.target.value })}
                placeholder="Rua, Número - Bairro, Cidade - UF"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuração Trajeto Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração Trajeto Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="frequencia">Frequência Diária (viagens)</Label>
              <Select value={frequenciaDiaria.toString()} onValueChange={(v) => setFrequenciaDiaria(parseInt(v))}>
                <SelectTrigger id="frequencia">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (só ida ou só volta)</SelectItem>
                  <SelectItem value="2">2x (ida e volta)</SelectItem>
                  <SelectItem value="3">3x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dias-uteis">Dias Úteis no Mês</Label>
              <Input
                id="dias-uteis"
                type="number"
                value={diasUteis}
                onChange={(e) => setDiasUteis(e.target.value)}
                placeholder="22"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trajetos Adicionais */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trajetos Adicionais</CardTitle>
              <CardDescription>Adicione trajetos extras que o veículo fará no mês</CardDescription>
            </div>
            <Button onClick={adicionarTrajeto} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {trajetosAdicionais.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum trajeto adicional cadastrado
            </p>
          ) : (
            trajetosAdicionais.map((trajeto) => (
              <div key={trajeto.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Trajeto Adicional</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removerTrajeto(trajeto.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Input
                    value={trajeto.nome}
                    onChange={(e) => atualizarTrajeto(trajeto.id, 'nome', e.target.value)}
                    placeholder="Nome do local"
                  />
                  <Input
                    value={trajeto.endereco}
                    onChange={(e) => atualizarTrajeto(trajeto.id, 'endereco', e.target.value)}
                    placeholder="Endereço"
                    className="md:col-span-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequência Semanal: {trajeto.frequenciaSemanal}x por semana</Label>
                  <Input
                    type="number"
                    min="1"
                    value={trajeto.frequenciaSemanal}
                    onChange={(e) => atualizarTrajeto(trajeto.id, 'frequenciaSemanal', parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Margem de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Margem de Segurança</CardTitle>
          <CardDescription>
            Percentual adicional para cobrir imprevistos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Margem: {margemSeguranca}%</Label>
              {resultado && (
                <span className="text-sm text-muted-foreground">
                  + R$ {resultado.valorMargemSeguranca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <Slider
              value={[margemSeguranca]}
              onValueChange={(value) => setMargemSeguranca(value[0])}
              min={0}
              max={50}
              step={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={calcularEstimativa} 
          disabled={calculando}
          className="flex-1 min-w-[200px]"
        >
          {calculando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              <Route className="h-4 w-4 mr-2" />
              Calcular Estimativa
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={limparFormulario}
          disabled={calculando}
        >
          Limpar
        </Button>
      </div>

      {/* Resultados */}
      {resultado && (
        <>
          {/* Alertas */}
          {resultado.distanciaTotalMensalKm > 3000 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Distância mensal elevada ({resultado.distanciaTotalMensalKm.toLocaleString('pt-BR')} km)
              </AlertDescription>
            </Alert>
          )}

          {resultado.limiteAtualCartao && resultado.diferencaLimite && resultado.diferencaLimite < 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limite Insuficiente</AlertTitle>
              <AlertDescription>
                O limite atual do cartão é menor que a estimativa calculada
              </AlertDescription>
            </Alert>
          )}

          {/* Rota Principal */}
          <Card>
            <CardHeader>
              <CardTitle>Rota Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Trajeto</p>
                  <p className="font-medium">{resultado.rotaPrincipal.origem} → {resultado.rotaPrincipal.destino}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distância por viagem</p>
                  <p className="font-medium">{resultado.rotaPrincipal.distanciaKm} km</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo estimado</p>
                  <p className="font-medium">{resultado.rotaPrincipal.duracaoMin} min</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Viagens no mês</p>
                  <p className="font-medium">{resultado.rotaPrincipal.viagensMensaisIda + resultado.rotaPrincipal.viagensMensaisVolta}x</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Distância mensal total</p>
                  <p className="text-xl font-bold">{resultado.rotaPrincipal.distanciaMensalTotal.toLocaleString('pt-BR')} km</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Custo mensal</p>
                  <p className="text-xl font-bold">R$ {resultado.rotaPrincipal.custoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trajetos Adicionais */}
          {resultado.trajetosAdicionais.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trajetos Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trajeto</TableHead>
                      <TableHead>Distância</TableHead>
                      <TableHead>Freq. Mensal</TableHead>
                      <TableHead>Custo Mensal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultado.trajetosAdicionais.map((trajeto, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{trajeto.origem} → {trajeto.destino}</TableCell>
                        <TableCell>{trajeto.distanciaKm} km</TableCell>
                        <TableCell>{trajeto.viagensMensaisIda + trajeto.viagensMensaisVolta}x</TableCell>
                        <TableCell>R$ {trajeto.custoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Totalizadores */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Totalizadores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">📍 Distância Total Mensal</p>
                  <p className="text-2xl font-bold">{resultado.distanciaTotalMensalKm.toLocaleString('pt-BR')} km</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">⛽ Litros Necessários</p>
                  <p className="text-2xl font-bold">{resultado.litrosNecessarios.toLocaleString('pt-BR')} L</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">💰 Custo Base</p>
                  <p className="text-2xl font-bold">R$ {resultado.custoEstimadoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">🛡️ Margem Segurança ({resultado.margemSegurancaPct}%)</p>
                  <p className="font-medium">R$ {resultado.valorMargemSeguranca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">🎯 Estimativa Total</p>
                  <p className="text-3xl font-bold text-primary">
                    R$ {resultado.custoEstimadoComMargem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparação com Limite Atual */}
          {resultado.limiteAtualCartao && (
            <Card>
              <CardHeader>
                <CardTitle>Comparação com Limite Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Limite Atual</p>
                    <p className="text-xl font-bold">R$ {resultado.limiteAtualCartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimativa</p>
                    <p className="text-xl font-bold">R$ {resultado.custoEstimadoComMargem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diferença</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xl font-bold ${resultado.diferencaLimite! >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {Math.abs(resultado.diferencaLimite!).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant={resultado.diferencaLimite! >= 0 ? "default" : "destructive"}>
                        {resultado.diferencaLimite! >= 0 ? "Suficiente" : "Insuficiente"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Utilização do limite</span>
                    <span>{Math.min(100, (resultado.custoEstimadoComMargem / resultado.limiteAtualCartao) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(100, (resultado.custoEstimadoComMargem / resultado.limiteAtualCartao) * 100)} 
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões Pós-Cálculo */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={salvarCalculo} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Salvar no Histórico
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
