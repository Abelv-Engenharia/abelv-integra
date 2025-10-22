import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import { useViaCep } from "@/hooks/gestao-pessoas/useViaCep";
import { toast } from "@/hooks/use-toast";

interface AddressInputProps {
  label: string;
  name: string;
  endereco: string;
  onEnderecoChange: (endereco: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function AddressInput({
  label,
  name,
  endereco,
  onEnderecoChange,
  placeholder = "Digite o endereço completo",
  required = false
}: AddressInputProps) {
  const [modoManual, setModoManual] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  
  const { buscarEndereco, loading: loadingCep, error: errorCep } = useViaCep();

  const aplicarCoordenadas = () => {
    if (latitude && longitude) {
      onEnderecoChange(`${latitude},${longitude}`);
    }
  };

  const obterLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erro",
        description: "Geolocalização não é suportada pelo seu navegador",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        onEnderecoChange(`${lat},${lng}`);
        toast({
          title: "Localização Obtida",
          description: "Coordenadas atualizadas com sucesso"
        });
      },
      (error) => {
        toast({
          title: "Erro",
          description: "Não foi possível obter sua localização: " + error.message,
          variant: "destructive"
        });
      }
    );
  };

  const buscarCep = async () => {
    if (!cep) {
      toast({
        title: "CEP vazio",
        description: "Digite um CEP para buscar",
        variant: "destructive"
      });
      return;
    }

    const resultado = await buscarEndereco(cep);
    
    if (resultado) {
      // Montar endereço completo
      const enderecoCompleto = `${resultado.logradouro}${numero ? ', ' + numero : ''}${complemento ? ' - ' + complemento : ''} - ${resultado.bairro}, ${resultado.cidade} - ${resultado.uf}, Brasil`;
      onEnderecoChange(enderecoCompleto);
      
      toast({
        title: "CEP Encontrado",
        description: "Endereço preenchido automaticamente"
      });
    } else {
      toast({
        title: "CEP não encontrado",
        description: errorCep || "Verifique o CEP digitado",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Modo Manual</span>
          <Switch
            checked={modoManual}
            onCheckedChange={setModoManual}
          />
        </div>
      </div>

      {!modoManual ? (
        <>
          {/* Busca por CEP */}
          <div className="space-y-2 p-3 bg-muted/50 rounded-md">
            <Label className="text-xs font-medium">Buscar por CEP</Label>
            <div className="grid grid-cols-12 gap-2">
              <Input
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
                className="col-span-3"
              />
              <Input
                placeholder="Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="col-span-2"
              />
              <Input
                placeholder="Complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="col-span-4"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={buscarCep}
                disabled={loadingCep || !cep}
                className="col-span-3"
              >
                {loadingCep ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Campo de endereço manual */}
          <div className="space-y-2">
            <Label htmlFor={name}>Ou digite o endereço completo</Label>
            <Textarea
              id={name}
              value={endereco}
              onChange={(e) => onEnderecoChange(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className={required && !endereco ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Exemplo: Rua XV de Novembro, 500 - Centro, Curitiba - PR, Brasil
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${name}-lat`} className="text-xs">Latitude</Label>
              <Input
                id={`${name}-lat`}
                type="number"
                step="0.000001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-25.437"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${name}-lng`} className="text-xs">Longitude</Label>
              <Input
                id={`${name}-lng`}
                type="number"
                step="0.000001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-49.273"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={aplicarCoordenadas}
              disabled={!latitude || !longitude}
              className="flex-1"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Aplicar Coordenadas
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={obterLocalizacaoAtual}
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Localização Atual
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Use o modo manual para inserir coordenadas precisas ou obter sua localização atual
          </p>
        </div>
      )}
    </div>
  );
}
