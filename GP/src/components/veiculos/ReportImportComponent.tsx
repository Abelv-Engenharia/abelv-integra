import { useState } from "react"
import { Upload, Download, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface ReportImportComponentProps {
  onImportComplete?: (data: any[]) => void
}

export function ReportImportComponent({ onImportComplete }: ReportImportComponentProps) {
  const [loading, setLoading] = useState(false)
  const [searchPlaca, setSearchPlaca] = useState("")
  const [reportData, setReportData] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const { toast } = useToast()

  // Mock data para demonstração
  const mockReportData = [
    {
      id: 1,
      placa: "ABC-1234",
      dataUtilizacao: "2024-02-15",
      local: "Praça da Sé - SP",
      tipoServico: "Estacionamento",
      valor: 15.50,
      locadora: "Localiza",
      foraPerimetro: false
    },
    {
      id: 2,
      placa: "DEF-5678", 
      dataUtilizacao: "2024-02-15",
      local: "Shopping Iguatemi - RJ",
      tipoServico: "Estacionamento",
      valor: 25.00,
      locadora: "Hertz",
      foraPerimetro: true // Fora do perímetro permitido
    },
    {
      id: 3,
      placa: "ABC-1234",
      dataUtilizacao: "2024-02-14",
      local: "Rodovia Castello Branco - KM 30",
      tipoServico: "Pedágio",
      valor: 12.80,
      locadora: "Localiza",
      foraPerimetro: false
    }
  ]

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // Simular processamento do arquivo
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular importação dos dados
      setReportData(mockReportData)
      
      // Detectar alertas (utilizações fora do perímetro)
      const foraPerimetro = mockReportData.filter(item => item.foraPerimetro)
      setAlerts(foraPerimetro)
      
      onImportComplete?.(mockReportData)
      
      toast({
        title: "Importação Concluída",
        description: `${mockReportData.length} registros importados. ${foraPerimetro.length} alertas de perímetro detectados.`,
      })
    } catch (error) {
      toast({
        title: "Erro na Importação",
        description: "Erro ao processar o arquivo. Verifique o formato.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    // Simular download do relatório
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Placa,Data,Local,Tipo,Valor,Locadora\n" +
      reportData.map(row => 
        `${row.placa},${row.dataUtilizacao},${row.local},${row.tipoServico},${row.valor},${row.locadora}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "relatorio_pedagios_estacionamentos.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Download Iniciado",
      description: "Relatório está sendo baixado.",
    })
  }

  const filteredData = reportData.filter(item => 
    item.placa.toLowerCase().includes(searchPlaca.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Importação de Arquivo */}
      <Card>
        <CardHeader>
          <CardTitle>Importar Relatório das Locadoras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileImport}
                disabled={loading}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={downloadReport}
              disabled={reportData.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Relatório
            </Button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="h-4 w-4 animate-pulse" />
              Processando arquivo...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas de Perímetro */}
      {alerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{alerts.length} utilização(ões) fora do perímetro detectada(s):</strong>
            <ul className="mt-2 list-disc list-inside">
              {alerts.map(alert => (
                <li key={alert.id}>
                  {alert.placa} - {alert.local} - R$ {alert.valor.toFixed(2)}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Busca e Tabela */}
      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registros Importados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por placa..."
                  value={searchPlaca}
                  onChange={(e) => setSearchPlaca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Locadora</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.placa}</TableCell>
                      <TableCell>{new Date(item.dataUtilizacao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{item.local}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipoServico}</Badge>
                      </TableCell>
                      <TableCell>R$ {item.valor.toFixed(2)}</TableCell>
                      <TableCell>{item.locadora}</TableCell>
                      <TableCell>
                        {item.foraPerimetro ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Fora Perímetro
                          </Badge>
                        ) : (
                          <Badge variant="default">Normal</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}