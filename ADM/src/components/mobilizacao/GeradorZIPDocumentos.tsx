import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import type { StatusColaborador } from "@/types/mobilizacao";

interface GeradorZIPDocumentosProps {
  colaborador: StatusColaborador;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export default function GeradorZIPDocumentos({ 
  colaborador, 
  size = "sm", 
  variant = "ghost" 
}: GeradorZIPDocumentosProps) {
  const [gerando, setGerando] = useState(false);

  const handleExportarZIP = async () => {
    setGerando(true);
    
    try {
      // Simula processo de geração de ZIP
      toast({
        title: "Gerando ZIP",
        description: `Preparando documentos de ${colaborador.colaborador.nome}...`
      });

      // Mock da API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simula verificação de documentos válidos
      const documentosValidos = Object.entries(colaborador.documentos)
        .filter(([, doc]) => doc.status === 'ok')
        .length;

      if (documentosValidos === 0) {
        toast({
          title: "Nenhum documento válido",
          description: "Este colaborador não possui documentos válidos para exportar.",
          variant: "destructive"
        });
        return;
      }

      // Gera nome do arquivo seguindo o padrão
      const nomeArquivo = `DOCS_${colaborador.colaborador.re}_${colaborador.colaborador.nome.replace(/\s+/g, '')}_${colaborador.colaborador.obra_cca}_${new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')}.zip`;

      // Simula download (em um cenário real, seria um link assinado)
      const downloadUrl = `https://storage.exemplo.com/temp/${nomeArquivo}`;
      
      // Mock do download
      const link = document.createElement('a');
      link.href = '#'; // Em produção seria o downloadUrl
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "ZIP Gerado com Sucesso",
        description: `${documentosValidos} documento(s) incluído(s). Download iniciado.`
      });

      // Registra auditoria (mock)
      console.log('Auditoria registrada:', {
        usuario_id: 'user123',
        colaborador_id: colaborador.colaborador.id,
        tipo: 'ZIP_DOCS',
        dt_evento: new Date().toISOString(),
        resultado: 'sucesso',
        detalhes: `${documentosValidos} documentos incluídos`
      });

    } catch (error) {
      toast({
        title: "Erro ao gerar ZIP",
        description: "Ocorreu um erro ao processar os documentos. Tente novamente.",
        variant: "destructive"
      });
      
      console.error('Erro na geração do ZIP:', error);
    } finally {
      setGerando(false);
    }
  };

  const documentosValidos = Object.values(colaborador.documentos)
    .filter(doc => doc.status === 'ok').length;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleExportarZIP}
          disabled={gerando || documentosValidos === 0}
        >
          {gerando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {documentosValidos === 0 
          ? "Nenhum documento válido para exportar"
          : `Exportar ZIP (${documentosValidos} documento${documentosValidos > 1 ? 's' : ''})`
        }
      </TooltipContent>
    </Tooltip>
  );
}