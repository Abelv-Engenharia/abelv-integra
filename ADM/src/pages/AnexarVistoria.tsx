import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function AnexarVistoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      const arquivosValidos = filesArray.filter(file => {
        const isPDF = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");
        return isPDF || isImage;
      });

      if (arquivosValidos.length !== filesArray.length) {
        toast({
          title: "Atenção",
          description: "Apenas arquivos PDF e imagens são permitidos.",
          variant: "destructive",
        });
      }

      setArquivosSelecionados([...arquivosSelecionados, ...arquivosValidos]);
    }
  };

  const removerArquivo = (index: number) => {
    setArquivosSelecionados(arquivosSelecionados.filter((_, i) => i !== index));
  };

  const handleSalvar = () => {
    if (arquivosSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "É necessário anexar pelo menos um arquivo.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Arquivos anexados com sucesso!",
    });
    navigate("/vistorias-alojamento");
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/vistorias-alojamento")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Anexar Vistoria</h1>
            <p className="text-muted-foreground">Vistoria {id}</p>
          </div>
        </div>

        {/* Formulário de Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload de Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="arquivos">Arquivos da Vistoria</Label>
              <p className="text-sm text-muted-foreground">
                Anexe documentos da vistoria (PDF, imagens). Você pode selecionar múltiplos arquivos.
              </p>
              
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="arquivos"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste arquivos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, PNG, JPG ou JPEG
                    </p>
                  </div>
                  <input
                    id="arquivos"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Lista de arquivos selecionados */}
            {arquivosSelecionados.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos Selecionados ({arquivosSelecionados.length})</Label>
                <div className="space-y-2">
                  {arquivosSelecionados.map((arquivo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-accent/20"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{arquivo.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(arquivo.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerArquivo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/vistorias-alojamento")}
          >
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>
            <Upload className="h-4 w-4 mr-2" />
            Salvar Anexos
          </Button>
        </div>
      </div>
    </div>
  );
}
