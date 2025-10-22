import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation } from "lucide-react";

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

  const aplicarCoordenadas = () => {
    if (latitude && longitude) {
      onEnderecoChange(`${latitude},${longitude}`);
    }
  };

  const obterLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        onEnderecoChange(`${lat},${lng}`);
      },
      (error) => {
        alert("Não foi possível obter sua localização: " + error.message);
      }
    );
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
