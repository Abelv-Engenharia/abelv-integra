import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CalendarIcon, 
  Car, 
  Camera, 
  FileCheck, 
  Upload, 
  CircleHelp,
  Gauge,
  Battery,
  FileText,
  Zap
} from "lucide-react";

import { useVeiculosChecklists } from "@/hooks/gestao-pessoas/useVeiculosChecklists";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

export function VehicleChecklist() {
  const { criarChecklist, isCreating } = useVeiculosChecklists();
  
  const [date, setDate] = useState<Date>(new Date());
  const [operationType, setOperationType] = useState<string>("");
  const [plate, setPlate] = useState<string>("");
  const [brandModel, setBrandModel] = useState<string>("");
  const [condutor, setCondutor] = useState<string>("");
  const [emailCondutor, setEmailCondutor] = useState<string>("");
  const [fuelLevel, setFuelLevel] = useState<string>("");
  const [odometer, setOdometer] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [uploads, setUploads] = useState<{[key: number]: File[]}>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = (positionIndex: number, files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf',
      'video/mp4'
    ];

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 5MB`,
          variant: "destructive"
        });
        return;
      }

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf|mp4)$/i)) {
        toast({
          title: "Tipo de arquivo não permitido", 
          description: `${file.name} não é um tipo de arquivo válido. Use: JPG, PNG, WEBP, PDF ou MP4`,
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
    // Validação dos campos obrigatórios
    if (!date || !operationType || !plate.trim() || !brandModel.trim() || !condutor.trim() || !emailCondutor.trim() || !odometer.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Verificar se CNH foi enviada (posição 13)
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

      // Preparar dados do checklist
      const checklistData = {
        data_checklist: format(date, "yyyy-MM-dd"),
        placa: plate.toUpperCase(),
        veiculo_id: null,
        marca_modelo: brandModel,
        condutor_nome: condutor,
        condutor_id: null,
        tipo_operacao: (operationType === 'retirada' ? 'Retirada' : 'Devolução') as "Retirada" | "Devolução",
        nivel_combustivel: fuelLevel || null,
        hodometro: odometer ? parseInt(odometer) : null,
        observacoes: observations || null,
        observacoes_detalhadas: observations || null,
        status: 'Concluído' as const,
        data_limite: null,
        tentativas_cobranca: 0,
      };

      setUploadProgress(30);

      // Criar checklist com upload de fotos
      criarChecklist(
        {
          checklist: checklistData,
          fotos: uploads,
        },
        {
          onSuccess: () => {
            setUploadProgress(100);
            // Limpar formulário
            setTimeout(() => {
              setDate(new Date());
              setOperationType("");
              setPlate("");
              setBrandModel("");
              setCondutor("");
              setEmailCondutor("");
              setFuelLevel("");
              setOdometer("");
              setObservations("");
              setUploads({});
              setUploadProgress(0);
            }, 1000);
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
          </CardHeader>
        </Card>

        {/* Bloco 1 - Dados Gerais */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileCheck className="h-5 w-5" />
              Dados Gerais do Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date" className={!date ? "text-destructive" : ""}>
                  Data *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className={!operationType ? "text-destructive" : ""}>
                  Tipo de Operação *
                </Label>
                <RadioGroup value={operationType} onValueChange={setOperationType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retirada" id="retirada" />
                    <Label htmlFor="retirada">Retirada do Veículo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="devolucao" id="devolucao" />
                    <Label htmlFor="devolucao">Devolução do Veículo</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plate" className={!plate.trim() ? "text-destructive" : ""}>
                  Placa *
                </Label>
                <Input 
                  id="plate"
                  placeholder="ABC-1234"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className={!plate.trim() ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-model" className={!brandModel.trim() ? "text-destructive" : ""}>
                  Marca/Modelo *
                </Label>
                <Input 
                  id="brand-model"
                  placeholder="Ex: Toyota Corolla"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  className={!brandModel.trim() ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="condutor" className={!condutor.trim() ? "text-destructive" : ""}>
                  Nome do Condutor *
                </Label>
                <Input 
                  id="condutor"
                  placeholder="Nome completo do condutor"
                  value={condutor}
                  onChange={(e) => setCondutor(e.target.value)}
                  className={!condutor.trim() ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-condutor" className={!emailCondutor.trim() ? "text-destructive" : ""}>
                  E-mail do Condutor *
                </Label>
                <Input 
                  id="email-condutor"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={emailCondutor}
                  onChange={(e) => setEmailCondutor(e.target.value)}
                  className={!emailCondutor.trim() ? "border-destructive" : ""}
                />
              </div>
            </div>

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
          </CardContent>
        </Card>

        {/* Bloco 2 - Fotos por Posição */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Camera className="h-5 w-5" />
              Fotos do Veículo por Posição
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
                    {/* Reference Icon */}
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
                        Clique para adicionar arquivo
                        <Input
                          id={`upload-${index}`}
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf,video/mp4"
                          onChange={(e) => handleFileUpload(index, e.target.files)}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Máx: 5MB | Formatos: JPG, PNG, WEBP, PDF, MP4
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

        {/* Bloco 3 - Informações Complementares */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileCheck className="h-5 w-5" />
              Informações Complementares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="observations">Observações Adicionais</Label>
              <Textarea 
                id="observations"
                placeholder="Digite observações adicionais..."
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <Card className="shadow-lg">
          <CardContent className="pt-6 space-y-4">
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <Zap className="h-4 w-4 inline mr-1" />
                    Salvando checklist...
                  </span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-4">
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isCreating || uploadProgress > 0}
              >
                <FileCheck className="mr-2 h-5 w-5" />
                {isCreating ? "Salvando..." : "Salvar Checklist"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}