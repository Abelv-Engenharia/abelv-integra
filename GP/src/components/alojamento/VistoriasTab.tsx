import { useState } from "react";
import { Plus, Edit, Trash2, Download, Paperclip, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Dados mockados
const vistorias = [
  {
    id: "VS001",
    contrato: "CT001 - Pousada Boa Vista",
    data: "2024-01-15",
    tipo: "inicial",
    responsavel: "João Silva",
    documentoAnexo: "vistoria_001.pdf"
  },
  {
    id: "VS002", 
    contrato: "CT002 - Hotel Executivo",
    data: "2024-02-10",
    tipo: "inicial",
    responsavel: "Maria Santos",
    documentoAnexo: "vistoria_002.pdf"
  },
  {
    id: "VS003",
    contrato: "CT001 - Pousada Boa Vista",
    data: "2024-06-15",
    tipo: "periodica",
    responsavel: "Carlos Oliveira",
    documentoAnexo: null
  }
];

const contratosSemVistoria = [
  { id: "CT003", nome: "Alojamento Industrial" },
  { id: "CT004", nome: "Residencial Norte" }
];

export const VistoriasTab = () => {
  const [busca, setBusca] = useState("");

  const vistoriasFiltradas = vistorias.filter(vistoria =>
    vistoria.id.toLowerCase().includes(busca.toLowerCase()) ||
    vistoria.contrato.toLowerCase().includes(busca.toLowerCase()) ||
    vistoria.responsavel.toLowerCase().includes(busca.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "inicial": return "bg-blue-100 text-blue-700";
      case "periodica": return "bg-green-100 text-green-700";
      case "final": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* Alertas de contratos sem vistoria */}
      {contratosSemVistoria.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Alertas - Contratos sem Vistoria
            </CardTitle>
            <CardDescription>
              Os seguintes contratos não possuem vistoria anexada:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contratosSemVistoria.map((contrato) => (
                <div key={contrato.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm font-medium">{contrato.id} - {contrato.nome}</span>
                  <Button size="sm" variant="outline">
                    Anexar Vistoria
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Vistorias</h3>
          <p className="text-sm text-muted-foreground">Registro de vistorias realizadas</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório de Vistorias
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Vistoria
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar por ID, contrato ou responsável..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Vistoria</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Documento Anexo</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vistoriasFiltradas.map((vistoria) => (
              <TableRow key={vistoria.id}>
                <TableCell className="font-medium font-mono">{vistoria.id}</TableCell>
                <TableCell>{vistoria.contrato}</TableCell>
                <TableCell>{new Date(vistoria.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge className={getTipoColor(vistoria.tipo)}>
                    {vistoria.tipo.charAt(0).toUpperCase() + vistoria.tipo.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{vistoria.responsavel}</TableCell>
                <TableCell>
                  {vistoria.documentoAnexo ? (
                    <div className="flex items-center gap-1 text-sm text-primary cursor-pointer hover:underline">
                      <Paperclip className="h-3 w-3" />
                      {vistoria.documentoAnexo}
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs">
                      Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {vistoriasFiltradas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma vistoria encontrada com os filtros aplicados.
        </div>
      )}
    </div>
  );
};