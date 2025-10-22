import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Car, 
  Camera, 
  Upload, 
  CircleHelp,
  Gauge,
  Battery,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

import { useChecklistTokens } from "@/hooks/gestao-pessoas/useChecklistTokens";
import { useVeiculosChecklists } from "@/hooks/gestao-pessoas/useVeiculosChecklists";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const vehiclePositions = [
  { name: "Frente", icon: Car, description: "Vista frontal completa do veículo" },
  { name: "Lateral dianteira direita", icon: Car, description: "Lateral direita - parte frontal" },
  { name: "Pneu dianteiro direito", icon: CircleHelp, description: "Foto detalhada do pneu" },
  { name: "Lateral traseira direita", icon: Car, description: "Lateral direita - parte traseira" },
  { name: "Pneu traseiro direito", icon: CircleHelp, description: "Foto detalhada do pneu" },
  { name: "Traseira", icon: Car, description: "Vista traseira completa do veículo" },
  { name: "Estepe", icon: CircleHelp, description: "Foto do pneu estepe no compartimento" },
  { name: "Lateral traseira esquerda", icon: Car, description: "Lateral esquerda - parte traseira" },
  { name: "Pneu traseiro esquerdo", icon: CircleHelp, description: "Foto detalhada do pneu" },
  { name: "Lateral dianteira esquerda", icon: Car, description: "Lateral esquerda - parte frontal" },
  { name: "Pneu dianteiro esquerdo", icon: CircleHelp, description: "Foto detalhada do pneu" },
  { name: "Painel de instrumentos (com ignição ligada)", icon: Gauge, description: "Painel ligado mostrando hodômetro e indicadores" },
  { name: "Bateria", icon: Battery, description: "Foto da bateria no compartimento do motor" },
  { name: "CNH do condutor (upload de documento)", icon: FileText, description: "Upload do documento CNH do condutor" }
];

const fuelLevels = [
  { value: "E", label: "E" },
  { value: "1/4", label: "¼" },
  { value: "1/2", label: "½" },
  { value: "3/4", label: "¾" },
  { value: "F", label: "F" }
];

export default function ChecklistVeiculosPublico() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { validarToken, marcarTokenUsado } = useChecklistTokens();
  const { criarChecklist, isCreating } = useVeiculosChecklists();

  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const [fuelLevel, setFuelLevel] = useState<string>("");
  const [odometer, setOdometer] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [uploads, setUploads] = useState<{[key: number]: File[]}>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await validarToken(token);
      if (data) {
        setTokenData(data);
        
        // Calcular tempo restante
        const validadeDate = new Date(data.validade);
        const agora = new Date();
        const diff = validadeDate.getTime() - agora.getTime();
        setTimeRemaining(Math.max(0, Math.floor(diff / 1000))); // em segundos
      }
      setLoading(false);
    };

    checkToken();
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (positionIndex: number, files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 5MB`,
          variant: "destructive"
        });
        return;
      }

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        toast({
          title: "Tipo de arquivo não permitido",
          description: `${file.name} não é uma imagem válida. Use: JPG, PNG ou WEBP`,
          variant: "destructive"
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setUploads(prev => ({
        ...prev,
        [positionIndex]: [...(prev[positionIndex] || []), ...validFiles]
      }));
    }
  };

  const removeFile = (positionIndex: number, fileIndex: number) => {
    setUploads(prev => ({
      ...prev,
      [positionIndex]: (prev[positionIndex] || []).filter((_, index) => index !== fileIndex)
    }));
  };

  const handleSubmit = async () => {
    if (!tokenData || !token) return;

    if (!odometer.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o hodômetro",
        variant: "destructive"
      });
      return;
    }

    if (!uploads[13] || uploads[13].length === 0) {
      toast({
        title: "CNH obrigatória",
        description: "É obrigatório fazer upload da CNH do condutor",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadProgress(10);

      const checklistData = {
        data_checklist: format(new Date(), "yyyy-MM-dd"),
        placa: tokenData.placa,
        veiculo_id: null,
        marca_modelo: tokenData.marca_modelo,
        condutor_nome: tokenData.condutor_nome,
        condutor_id: null,
        tipo_operacao: tokenData.tipo_operacao,
        nivel_combustivel: fuelLevel || null,
        hodometro: odometer ? parseInt(odometer) : null,
        observacoes: observations || null,
        observacoes_detalhadas: observations || null,
        status: 'Concluído' as const,
        data_limite: null,
        tentativas_cobranca: 0,
      };

      setUploadProgress(30);

      criarChecklist(
        {
          checklist: checklistData,
          fotos: uploads,
        },
        {
          onSuccess: (data) => {
            setUploadProgress(100);
            marcarTokenUsado({ token, checklistId: data.id });
            setSubmitted(true);
          },
          onError: () => {
            setUploadProgress(0);
          },
        }
      );

      setUploadProgress(60);
    } catch (error) {
      setUploadProgress(0);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o checklist",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Clock className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Validando acesso...</p>
        </div>
      </div>
    );
  }

  if (!tokenData || timeRemaining <= 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Link Inválido ou Expirado</h2>
            <p className="text-muted-foreground">
              Este link não é válido ou já expirou. Entre em contato com o responsável para obter um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold">Checklist Enviado!</h2>
            <p className="text-muted-foreground">
              Seu checklist foi enviado com sucesso. Obrigado!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Car className="h-6 w-6" />
              Checklist de Veículo
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm mt-2">
              <Clock className="h-4 w-4" />
              <span>Tempo restante: {formatTime(timeRemaining)}</span>
            </div>
          </CardHeader>
        </Card>

        {/* Dados Pré-preenchidos */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Dados do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Placa:</strong> {tokenData.placa}</p>
            <p><strong>Marca/Modelo:</strong> {tokenData.marca_modelo}</p>
            <p><strong>Condutor:</strong> {tokenData.condutor_nome}</p>
            <p><strong>Tipo de Operação:</strong> {tokenData.tipo_operacao}</p>
          </CardContent>
        </Card>

        {/* Informações Básicas */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informações do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nível de Combustível</Label>
              <div className="flex gap-2">
                {fuelLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={fuelLevel === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFuelLevel(level.value)}
                    className="flex-1"
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer" className={!odometer.trim() ? "text-destructive" : ""}>
                KM / Hodômetro *
              </Label>
              <Input
                id="odometer"
                type="number"
                placeholder="Ex: 45000"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className={!odometer.trim() ? "border-destructive" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fotos */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Camera className="h-5 w-5" />
              Fotos do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehiclePositions.map((position, index) => (
                <Card key={index} className="border-muted bg-muted/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-primary">
                      {position.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="mb-3">
                      <div className="bg-primary/10 rounded-lg p-4 text-center">
                        <position.icon className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <p className="text-xs text-muted-foreground font-medium">
                          {position.description}
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <Label
                        htmlFor={`upload-${index}`}
                        className="cursor-pointer text-sm text-muted-foreground hover:text-primary"
                      >
                        Tirar foto ou selecionar
                        <Input
                          id={`upload-${index}`}
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleFileUpload(index, e.target.files)}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Máx: 5MB | Formato: Imagens
                      </p>
                    </div>

                    {uploads[index] && uploads[index].length > 0 && (
                      <div className="space-y-1">
                        {uploads[index].map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between text-xs bg-muted rounded p-2">
                            <span className="truncate flex-1">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, fileIndex)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Observações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Digite observações adicionais..."
              rows={4}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Progress e Botão Submit */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Card>
            <CardContent className="pt-6">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Enviando checklist... {uploadProgress}%
              </p>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isCreating || uploadProgress > 0}
          className="w-full"
          size="lg"
        >
          {isCreating ? "Enviando..." : "Enviar Checklist"}
        </Button>
      </div>
    </div>
  );
}
