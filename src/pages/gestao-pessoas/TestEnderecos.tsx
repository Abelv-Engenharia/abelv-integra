import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, MapPin, RefreshCw } from "lucide-react";
import { GeocodingCacheService } from "@/services/gestao-pessoas/GeocodingCacheService";

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

export default function TestEnderecos() {
  const [endereco, setEndereco] = useState("");
  const [testando, setTestando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso: boolean;
    coords?: { lat: number; lng: number };
    displayName?: string;
    erro?: string;
    usouCache?: boolean;
  } | null>(null);

  const [cacheStats, setCacheStats] = useState(GeocodingCacheService.getStats());

  const testarGeocodificacao = async () => {
    if (!endereco.trim()) {
      setResultado({
        sucesso: false,
        erro: "Digite um endereço para testar"
      });
      return;
    }

    setTestando(true);
    setResultado(null);

    try {
      // Verificar cache primeiro
      const cached = GeocodingCacheService.get(endereco);
      if (cached) {
        setResultado({
          sucesso: true,
          coords: { lat: cached.lat, lng: cached.lng },
          displayName: cached.display_name,
          usouCache: true
        });
        setTestando(false);
        return;
      }

      // Delay para respeitar rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Geocodificar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`,
        {
          headers: {
            'User-Agent': 'GestaoVeiculos/1.0'
          }
        }
      );

      if (!response.ok) {
        setResultado({
          sucesso: false,
          erro: `Erro na API: ${response.status}`
        });
        setTestando(false);
        return;
      }

      const data: GeocodingResult[] = await response.json();

      if (data.length === 0) {
        setResultado({
          sucesso: false,
          erro: "Endereço não encontrado. Verifique se está completo."
        });
        setTestando(false);
        return;
      }

      const coords = {
        lat: typeof data[0].lat === 'string' ? parseFloat(data[0].lat) : data[0].lat,
        lng: typeof data[0].lon === 'string' ? parseFloat(data[0].lon) : data[0].lon
      };

      // Salvar no cache
      GeocodingCacheService.set(endereco, coords.lat, coords.lng, data[0].display_name);
      setCacheStats(GeocodingCacheService.getStats());

      setResultado({
        sucesso: true,
        coords,
        displayName: data[0].display_name,
        usouCache: false
      });
    } catch (error) {
      setResultado({
        sucesso: false,
        erro: `Erro ao conectar: ${error}`
      });
    } finally {
      setTestando(false);
    }
  };

  const limparCache = () => {
    GeocodingCacheService.clearAll();
    setCacheStats(GeocodingCacheService.getStats());
    setResultado(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt;
        <span className="text-foreground font-medium"> Teste de Endereços</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Teste de Geocodificação</h1>
        <p className="text-muted-foreground mt-2">
          Valide endereços antes de usar no cálculo de rotas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Formulário */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Testar Endereço</CardTitle>
            <CardDescription>
              Digite um endereço completo para verificar se será encontrado pela API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endereco-teste">Endereço Completo</Label>
              <Textarea
                id="endereco-teste"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Exemplo: Avenida Paulista, 1578 - Bela Vista, São Paulo - SP, Brasil"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Formato recomendado: Rua [Nome], [Nº] - [Bairro], [Cidade] - [UF], Brasil
              </p>
            </div>

            <Button
              onClick={testarGeocodificacao}
              disabled={testando || !endereco.trim()}
              className="w-full"
            >
              {testando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Testar Geocodificação
                </>
              )}
            </Button>

            {/* Resultado */}
            {resultado && (
              <Alert variant={resultado.sucesso ? "default" : "destructive"}>
                {resultado.sucesso ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle className="flex items-center gap-2">
                  {resultado.sucesso ? "Endereço Encontrado!" : "Erro na Geocodificação"}
                  {resultado.usouCache && (
                    <Badge variant="secondary" className="text-xs">Cache</Badge>
                  )}
                </AlertTitle>
                <AlertDescription className="space-y-2 mt-2">
                  {resultado.sucesso ? (
                    <>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Coordenadas:</p>
                        <p className="font-mono text-xs">
                          Lat: {resultado.coords?.lat.toFixed(6)} | 
                          Lng: {resultado.coords?.lng.toFixed(6)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Nome Completo:</p>
                        <p className="text-xs">{resultado.displayName}</p>
                      </div>
                      {resultado.usouCache && (
                        <p className="text-xs text-muted-foreground">
                          ✅ Resultado obtido do cache local (sem chamada à API)
                        </p>
                      )}
                    </>
                  ) : (
                    <p>{resultado.erro}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas do Cache */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cache Local</CardTitle>
            <CardDescription>
              Endereços armazenados por 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">{cacheStats.total} endereços</span>
              </div>
              {cacheStats.oldest && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mais antigo:</span>
                    <span className="text-xs">
                      {cacheStats.oldest.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mais recente:</span>
                    <span className="text-xs">
                      {cacheStats.newest?.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={limparCache}
              disabled={cacheStats.total === 0}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>

            <Alert>
              <AlertDescription className="text-xs">
                O cache reduz chamadas à API e acelera cálculos de rotas repetidas.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Exemplos */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Endereços Válidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Avenida Paulista, 1578 - Bela Vista, São Paulo - SP, Brasil",
              "Rua XV de Novembro, 500 - Centro, Curitiba - PR, Brasil",
              "Avenida Atlântica, 1020 - Copacabana, Rio de Janeiro - RJ, Brasil",
              "Rua da Consolação, 3701 - Consolação, São Paulo - SP, Brasil"
            ].map((exemplo, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setEndereco(exemplo)}
                className="justify-start text-left h-auto py-2"
              >
                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                <span className="text-xs">{exemplo}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
