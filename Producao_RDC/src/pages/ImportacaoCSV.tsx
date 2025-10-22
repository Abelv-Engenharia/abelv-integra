import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle, AlertCircle, Download, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CSVRow {
  // Formato 1: Fluidos, Linhas, SPEC
  Fluidos?: string;
  Linhas?: string;
  SPEC?: string;
  // Formato 2: Linhas, Junta, DN
  Junta?: string;
  DN?: string;
}

interface ProcessingResult {
  fluidosInseridos: number;
  linhasInseridas: number;
  juntasInseridas: number;
  duplicatasRemovidas: number;
  juntasExistentes: number;
  erros: string[];
  tipoImportacao: 'fluidos-linhas-spec' | 'linhas-junta-dn';
}

interface Fluido {
  id: string;
  nome: string;
}

export default function ImportacaoCSV() {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [originalCsvData, setOriginalCsvData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [fluidos, setFluidos] = useState<Fluido[]>([]);
  const [selectedFluido, setSelectedFluido] = useState<string>("");
  const [importType, setImportType] = useState<'fluidos-linhas-spec' | 'linhas-junta-dn'>('fluidos-linhas-spec');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    carregarFluidos();
  }, []);

  const carregarFluidos = async () => {
    try {
      const { data, error } = await supabase
        .from('fluidos')
        .select('id, nome')
        .order('nome');

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar fluidos: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setFluidos(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar fluidos",
        variant: "destructive",
      });
    }
  };

  // Função para remover duplicatas
  const removeDuplicateJuntas = (data: CSVRow[], type: 'fluidos-linhas-spec' | 'linhas-junta-dn') => {
    const seen = new Map<string, Set<string>>();
    const filtered: CSVRow[] = [];
    let duplicatesCount = 0;

    data.forEach(row => {
      if (type === 'fluidos-linhas-spec') {
        const linha = row.Linhas!;
        const fluido = row.Fluidos!;
        const key = `${linha}-${fluido}`;
        
        if (!seen.has(linha)) {
          seen.set(linha, new Set());
        }
        
        if (!seen.get(linha)!.has(key)) {
          seen.get(linha)!.add(key);
          filtered.push(row);
        } else {
          duplicatesCount++;
        }
      } else {
        const linha = row.Linhas!;
        const junta = row.Junta!;
        
        if (!seen.has(linha)) {
          seen.set(linha, new Set());
        }
        
        if (!seen.get(linha)!.has(junta)) {
          seen.get(linha)!.add(junta);
          filtered.push(row);
        } else {
          duplicatesCount++;
        }
      }
    });

    return { filtered, duplicatesCount };
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setUploadStatus('uploading');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setUploadStatus('error');
          toast({
            title: "Erro",
            description: "O arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados.",
            variant: "destructive",
          });
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        // Detectar tipo de importação baseado nas colunas exatas
        const hasFluidosLinhasSpec = headers.length === 3 && 
          headers.includes('Fluidos') && headers.includes('Linhas') && headers.includes('SPEC');
        const hasLinhasJuntaDN = headers.length === 3 && 
          headers.includes('Linhas') && headers.includes('Junta') && headers.includes('DN');
        
        if (!hasFluidosLinhasSpec && !hasLinhasJuntaDN) {
          setUploadStatus('error');
          toast({
            title: "Erro",
            description: "O arquivo CSV deve conter exatamente as colunas: [Fluidos, Linhas, SPEC] ou [Linhas, Junta, DN]",
            variant: "destructive",
          });
          return;
        }

        const currentImportType = hasFluidosLinhasSpec ? 'fluidos-linhas-spec' : 'linhas-junta-dn';
        setImportType(currentImportType);

        const data: CSVRow[] = [];
        const newErrors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length !== headers.length) {
            newErrors.push(`Linha ${i + 1}: Número incorreto de colunas`);
            continue;
          }

          const row: CSVRow = {};

          headers.forEach((header, index) => {
            if (header === 'Fluidos' || header === 'Linhas' || header === 'SPEC' || 
                header === 'Junta' || header === 'DN') {
              (row as any)[header] = values[index];
            }
          });

          // Validar dados baseado no tipo de importação
          if (currentImportType === 'fluidos-linhas-spec') {
            if (!row.Fluidos || !row.Linhas || !row.SPEC) {
              newErrors.push(`Linha ${i + 1}: Dados obrigatórios em branco (Fluidos, Linhas, SPEC)`);
              continue;
            }
          } else if (currentImportType === 'linhas-junta-dn') {
            if (!row.Linhas || !row.Junta || !row.DN) {
              newErrors.push(`Linha ${i + 1}: Dados obrigatórios em branco (Linhas, Junta, DN)`);
              continue;
            }
          }

          data.push(row);
        }

        // Remover duplicatas
        const { filtered, duplicatesCount } = removeDuplicateJuntas(data, currentImportType);
        
        setOriginalCsvData(data);
        setCsvData(filtered);
        setErrors(newErrors);
        setResult(null);
        setUploadStatus('success');

        toast({
          title: "Arquivo processado com sucesso",
          description: `${filtered.length} linhas válidas encontradas${duplicatesCount > 0 ? `, ${duplicatesCount} duplicatas removidas` : ''}.`,
        });
      } catch (error) {
        setUploadStatus('error');
        toast({
          title: "Erro",
          description: "Erro ao processar o arquivo CSV.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (csvFile) {
      processFile(csvFile);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      });
    }
  };

  const clearFile = () => {
    setCsvData([]);
    setOriginalCsvData([]);
    setFileName("");
    setFileSize(0);
    setUploadStatus('idle');
    setErrors([]);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processImport = async () => {
    if (csvData.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingStep("Inicializando importação...");

    const importId = `import_${Date.now()}`;
    const processResult: ProcessingResult = {
      fluidosInseridos: 0,
      linhasInseridas: 0,
      juntasInseridas: 0,
      duplicatasRemovidas: originalCsvData.length - csvData.length,
      juntasExistentes: 0,
      erros: [],
      tipoImportacao: importType
    };

    // Salvar estado inicial no localStorage
    localStorage.setItem(importId, JSON.stringify({
      csvData,
      fileName,
      progress: 0,
      result: processResult,
      completed: false
    }));

    try {
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        const currentProgress = (i / csvData.length) * 100;
        setProgress(currentProgress);
        
        const displayInfo = importType === 'fluidos-linhas-spec' 
          ? `${row.Linhas} - ${row.Fluidos}`
          : `${row.Linhas} - ${row.Junta}`;
        setProcessingStep(`Processando linha ${i + 1} de ${csvData.length}: ${displayInfo}`);

        // Salvar progresso no localStorage
        localStorage.setItem(importId, JSON.stringify({
          csvData,
          fileName,
          progress: currentProgress,
          result: processResult,
          completed: false,
          currentRow: i
        }));

        try {
          if (importType === 'linhas-junta-dn') {
            // Formato 2: Linhas, Junta, DN - Carregar juntas na tabela referenciando linhas
            const juntaNumero = row.Junta!;
            const linhasNome = row.Linhas!;
            
            // Buscar a linha primeiro
            const { data: linhaExistente } = await supabase
              .from('linhas')
              .select('id')
              .eq('nome_linha', linhasNome)
              .maybeSingle();

            if (!linhaExistente) {
              processResult.erros.push(`Linha ${i + 1}: Linha ${linhasNome} não encontrada`);
              continue;
            }

            // Tentar inserir junta diretamente - se já existir, atualizar DN
            const { error: juntaError } = await supabase
              .from('juntas')
              .upsert({
                "Junta": juntaNumero,
                "DN": parseFloat(row.DN!),
                linha_id: linhaExistente.id
              }, {
                onConflict: '"Junta",linha_id'
              });

            if (juntaError) {
              processResult.erros.push(`Linha ${i + 1}: Erro ao processar junta - ${juntaError.message}`);
              continue;
            }

            processResult.juntasInseridas++;
          } else {
            // Formato 1: Fluidos, Linhas, SPEC - Criar/vincular fluidos às linhas
            // 1. Verificar/Inserir Fluido
            let fluidoId: string;
            const { data: fluidoExistente } = await supabase
              .from('fluidos')
              .select('id')
              .eq('nome', row.Fluidos!)
              .maybeSingle();

            if (fluidoExistente) {
              fluidoId = fluidoExistente.id;
            } else {
              const { data: novoFluido, error: fluidoError } = await supabase
                .from('fluidos')
                .insert({
                  nome: row.Fluidos!,
                  descricao: `Fluido importado do CSV: ${fileName}`
                })
                .select('id')
                .single();

              if (fluidoError || !novoFluido) {
                processResult.erros.push(`Linha ${i + 1}: Erro ao inserir fluido - ${fluidoError?.message}`);
                continue;
              }

              fluidoId = novoFluido.id;
              processResult.fluidosInseridos++;
            }

            // 2. Verificar/Inserir Linha com SPEC
            const { data: linhaExistente } = await supabase
              .from('linhas')
              .select('id')
              .eq('nome_linha', row.Linhas!)
              .maybeSingle();

            if (linhaExistente) {
              // Linha já existe, apenas atualizar fluido se necessário
              const { error: updateError } = await supabase
                .from('linhas')
                .update({
                  fluido_id: fluidoId,
                  tipo_material: row.SPEC!
                })
                .eq('id', linhaExistente.id);

              if (updateError) {
                processResult.erros.push(`Linha ${i + 1}: Erro ao atualizar linha - ${updateError.message}`);
                continue;
              }
            } else {
              // Criar nova linha
              const { error: linhaError } = await supabase
                .from('linhas')
                .insert({
                  nome_linha: row.Linhas!,
                  fluido_id: fluidoId,
                  tipo_material: row.SPEC!
                })
                .select('id')
                .single();

              if (linhaError) {
                processResult.erros.push(`Linha ${i + 1}: Erro ao inserir linha - ${linhaError?.message}`);
                continue;
              }

              processResult.linhasInseridas++;
            }
          }


        } catch (error) {
          processResult.erros.push(`Linha ${i + 1}: Erro inesperado - ${error}`);
        }

        // Pequeno delay para não bloquear a UI
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setProgress(100);
      setProcessingStep("Importação concluída!");
      setResult(processResult);

      // Marcar como completo
      localStorage.setItem(importId, JSON.stringify({
        csvData,
        fileName,
        progress: 100,
        result: processResult,
        completed: true
      }));

      toast({
        title: "Importação concluída",
        description: `${processResult.juntasInseridas} juntas importadas com sucesso.`,
      });

    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro durante o processamento do arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      // Limpar do localStorage após um tempo
      setTimeout(() => {
        localStorage.removeItem(importId);
      }, 30000); // 30 segundos
    }
  };

  const downloadTemplate = () => {
    const csvContent = importType === 'fluidos-linhas-spec' 
      ? "Fluidos,Linhas,SPEC\nÁgua,LINHA-001,A106-B\nÓleo,LINHA-002,A53-B"
      : "Linhas,Junta,DN\nLINHA-001,JUNTA-001,100\nLINHA-002,JUNTA-002,150";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_importacao_${importType}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Importação de CSV</h1>
            <p className="text-muted-foreground">
              Importe dados de linhas, fluidos e juntas a partir de um arquivo CSV
            </p>
          </div>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload do Arquivo
            </CardTitle>
            <CardDescription>
              Selecione um arquivo CSV com exatamente as colunas: [Fluidos, Linhas, SPEC] ou [Linhas, Junta, DN]
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Área de Drag and Drop */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : uploadStatus === 'success' 
                    ? 'border-green-500 bg-green-50' 
                    : uploadStatus === 'error'
                    ? 'border-red-500 bg-red-50'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  {uploadStatus === 'success' ? (
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  ) : uploadStatus === 'error' ? (
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                  ) : uploadStatus === 'uploading' ? (
                    <Clock className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
                  ) : (
                    <Upload className={`h-12 w-12 mx-auto ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                  
                  <div>
                    <p className="text-lg font-medium">
                      {uploadStatus === 'success' ? 'Arquivo carregado com sucesso!' :
                       uploadStatus === 'error' ? 'Erro ao carregar arquivo' :
                       uploadStatus === 'uploading' ? 'Processando arquivo...' :
                       isDragOver ? 'Solte o arquivo aqui' : 'Arraste o arquivo CSV aqui'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {uploadStatus === 'idle' || uploadStatus === 'error' 
                        ? 'ou clique para selecionar um arquivo' 
                        : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações sobre o tipo de importação */}
              {csvData.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tipo de importação detectado:</strong> {
                      importType === 'fluidos-linhas-spec' 
                        ? 'Fluidos, Linhas e SPEC - Criará/vinculará fluidos às linhas com especificação técnica'
                        : 'Linhas, Junta e DN - Atualizará juntas existentes com diâmetro nominal'
                    }
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Informações do arquivo */}
              {fileName && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{fileName}</span>
                      <Badge variant="secondary">{(fileSize / 1024).toFixed(1)} KB</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFile} disabled={isProcessing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{originalCsvData.length}</div>
                      <div className="text-xs text-blue-600">Linhas Originais</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{csvData.length}</div>
                      <div className="text-xs text-green-600">Linhas Válidas</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">{originalCsvData.length - csvData.length}</div>
                      <div className="text-xs text-yellow-600">Duplicatas Removidas</div>
                    </div>
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Erros encontrados no arquivo:</p>
                      <ul className="text-sm space-y-1">
                        {errors.slice(0, 5).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {errors.length > 5 && (
                          <li>• ... e mais {errors.length - 5} erros</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {csvData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview dos Dados</CardTitle>
              <CardDescription>
                Visualize os dados que serão importados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {importType === 'fluidos-linhas-spec' ? (
                          <>
                            <TableHead>Fluidos</TableHead>
                            <TableHead>Linhas</TableHead>
                            <TableHead>SPEC</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>Linhas</TableHead>
                            <TableHead>Junta</TableHead>
                            <TableHead>DN</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 10).map((row, index) => (
                        <TableRow key={index}>
                          {importType === 'fluidos-linhas-spec' ? (
                            <>
                              <TableCell>{row.Fluidos}</TableCell>
                              <TableCell>{row.Linhas}</TableCell>
                              <TableCell>{row.SPEC}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{row.Linhas}</TableCell>
                              <TableCell>{row.Junta}</TableCell>
                              <TableCell>{row.DN}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {csvData.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      ... e mais {csvData.length - 10} linhas
                    </p>
                  )}
                </div>

                <Button 
                  onClick={processImport} 
                  disabled={isProcessing || csvData.length === 0}
                  className="w-full"
                >
                  {isProcessing ? "Processando..." : "Iniciar Importação"}
                </Button>

                {isProcessing && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso da Importação</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        {progress === 100 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 animate-spin" />
                        )}
                        {processingStep}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resultado da Importação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.fluidosInseridos}</div>
                  <div className="text-xs text-blue-600">Fluidos Criados</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.linhasInseridas}</div>
                  <div className="text-xs text-green-600">Linhas Criadas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{result.juntasInseridas}</div>
                  <div className="text-xs text-purple-600">
                    {importType === 'fluidos-linhas-spec' ? 'Linhas Criadas/Atualizadas' : 'Juntas Atualizadas'}
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{result.duplicatasRemovidas}</div>
                  <div className="text-xs text-yellow-600">Duplicatas Removidas</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{result.juntasExistentes}</div>
                  <div className="text-xs text-gray-600">
                    {importType === 'fluidos-linhas-spec' ? 'Registros Já Existentes' : 'Juntas Já com DN'}
                  </div>
                </div>
              </div>

              {result.erros.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Erros durante a importação:</p>
                      <ul className="text-sm space-y-1">
                        {result.erros.slice(0, 10).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {result.erros.length > 10 && (
                          <li>• ... e mais {result.erros.length - 10} erros</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}