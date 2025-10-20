import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Car, Camera, FileCheck, Upload, Maximize2 } from "lucide-react";

import ChecklistDataService from "@/services/ChecklistDataService";

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
  { name: "Frente", image: "/vehicle-examples/frente.jpg" },
  { name: "Lateral dianteira direita", image: "/vehicle-examples/lateral-dianteira-direita.jpg" },
  { name: "Pneu dianteiro direito", image: "/vehicle-examples/pneu-dianteiro-direito.jpg" },
  { name: "Lateral traseira direita", image: "/vehicle-examples/lateral-traseira-direita.jpg" },
  { name: "Pneu traseiro direito", image: "/vehicle-examples/pneu-traseiro-direito.jpg" },
  { name: "Traseira", image: "/vehicle-examples/traseira.jpg" },
  { name: "Estepe", image: "/vehicle-examples/estepe.jpg" },
  { name: "Lateral traseira esquerda", image: "/vehicle-examples/lateral-traseira-esquerda.jpg" },
  { name: "Pneu traseiro esquerdo", image: "/vehicle-examples/pneu-traseiro-esquerdo.jpg" },
  { name: "Lateral dianteira esquerda", image: "/vehicle-examples/lateral-dianteira-esquerda.jpg" },
  { name: "Pneu dianteiro esquerdo", image: "/vehicle-examples/pneu-dianteiro-esquerdo.jpg" },
  { name: "Painel de instrumentos (com ignição ligada)", image: "/vehicle-examples/painel-instrumentos.jpg" },
  { name: "Bateria", image: "/vehicle-examples/bateria.jpg" },
  { name: "CNH do condutor (upload de documento)", image: "/vehicle-examples/cnh-condutor.jpg" }
];

const fuelLevels = [
  { value: "E", label: "E" },
  { value: "1/4", label: "¼" },
  { value: "1/2", label: "½" },
  { value: "3/4", label: "¾" },
  { value: "F", label: "F" }
];

export function VehicleChecklist() {
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

  const handleFileUpload = (positionIndex: number, files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'video/mp4',
      'audio/mpeg',
      'audio/mp3'
    ];

    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 2MB`,
          variant: "destructive"
        });
        return;
      }

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(doc|docx|xls|xlsx|ppt|pptx|pdf|jpg|jpeg|png|mp4|mp3)$/i)) {
        toast({
          title: "Tipo de arquivo não permitido", 
          description: `${file.name} não é um tipo de arquivo válido`,
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
      // Processar fotos para armazenamento
      const fotosProcessadas: {[posicao: number]: {arquivos: string[], files: File[]}} = {};
      
      for (const [posicao, arquivos] of Object.entries(uploads)) {
        if (arquivos.length > 0) {
          fotosProcessadas[parseInt(posicao)] = {
            arquivos: arquivos.map(file => file.name),
            files: arquivos
          };
        }
      }

      // Calcular data limite (1 dia após a data atual)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 1);

      // Salvar no controle de checklists
      const checklistId = ChecklistDataService.salvarChecklist({
        data: format(date, "dd/MM/yyyy"),
        placa: plate.toUpperCase(),
        condutor,
        tipo: operationType === 'retirada' ? 'Retirada' : 'Devolução',
        status: 'Concluído',
        datalimite: format(dataLimite, "dd/MM/yyyy"),
        observacoes: observations || 'Nenhuma observação',
        tentativascobranca: 0,
        fotos: fotosProcessadas,
        dadosoriginais: {
          nivelcombustivel: fuelLevel,
          hodometro: odometer,
          observacoesdetalhadas: observations,
          marcamodelo: brandModel
        }
      });

      toast({
        title: "Checklist salvo!",
        description: "O checklist foi salvo e adicionado ao controle automaticamente",
      });

      // Limpar formulário
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

    } catch (error) {
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
                    {/* Reference Image */}
                    <div className="mb-3">
                      <div className="relative group">
                        <img 
                          src={position.image} 
                          alt={`Exemplo de ${position.name.toLowerCase()}`}
                          className="w-full h-32 object-cover rounded-md border border-muted cursor-pointer transition-all hover:scale-105 hover:shadow-md"
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">{position.name}</h3>
                              <img 
                                src={position.image} 
                                alt={`Exemplo ampliado de ${position.name.toLowerCase()}`}
                                className="w-full max-h-96 object-contain rounded-md"
                              />
                              <p className="text-sm text-muted-foreground text-center">
                                Esta é a área que deve ser fotografada no veículo
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center font-medium">
                        Exemplo da área a ser fotografada
                      </p>
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
                          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.mp4,.mp3"
                          onChange={(e) => handleFileUpload(index, e.target.files)}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Máx: 2MB | Formatos: Word, Excel, PPT, PDF, Imagem, Vídeo, Áudio
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

        {/* Botão de Submissão */}
        <div className="text-center pb-6">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg px-8 py-6 text-lg font-semibold"
            size="lg"
          >
            Salvar Checklist
          </Button>
        </div>
      </div>
    </div>
  );
}