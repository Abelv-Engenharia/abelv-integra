import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Upload } from "lucide-react";
import { useSupabaseDocuments } from "@/hooks/useSupabaseDocuments";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FileMatch {
  fileName: string;
  file?: File;
  document?: any;
  status: "matched" | "unmatched";
}

interface FileMatchingTableProps {
  matches: FileMatch[];
}

export const FileMatchingTable = ({ matches }: FileMatchingTableProps) => {
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useSupabaseDocuments();

  const handleConfirmImport = async () => {
    setUploading(true);
    
    try {
      const matchedItems = matches.filter(m => m.status === "matched" && m.file);
      
      for (const match of matchedItems) {
        if (match.file && match.document) {
          // Upload to document-uploads bucket first
          const filePath = `${match.document.id}/${match.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('document-uploads')
            .upload(filePath, match.file);

          if (uploadError) {
            console.error("Erro no upload:", uploadError);
            toast.error(`Erro ao fazer upload de ${match.fileName}`);
            continue;
          }

          // Then associate with document
          await uploadFile(match.document.id, match.file, match.document.versao_atual);
        }
      }

      toast.success(`${matchedItems.length} arquivo(s) importado(s) com sucesso`);
    } catch (error) {
      console.error("Erro na importação:", error);
      toast.error("Erro ao importar arquivos");
    } finally {
      setUploading(false);
    }
  };

  const matchedCount = matches.filter(m => m.status === "matched").length;
  const unmatchedCount = matches.filter(m => m.status === "unmatched").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arquivos Processados</CardTitle>
        <CardDescription>
          {matchedCount} correspondência(s) encontrada(s) • {unmatchedCount} sem correspondência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{match.fileName}</TableCell>
                  <TableCell>
                    {match.document ? (
                      <div>
                        <div className="font-medium">{match.document.numero}</div>
                        <div className="text-sm text-muted-foreground">
                          {match.document.titulo}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {match.status === "matched" ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Encontrado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Não encontrado
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleConfirmImport} 
            disabled={matchedCount === 0 || uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Importando..." : `Confirmar e Importar (${matchedCount})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
