
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserCCAs } from "@/hooks/useUserCCAs";

interface SMSDashboardFiltersProps {
  year: string;
  month: string;
  ccaId: string;
  setYear: (year: string) => void;
  setMonth: (month: string) => void;
  setCcaId: (ccaId: string) => void;
}

const SMSDashboardFilters = ({
  year,
  month,
  ccaId,
  setYear,
  setMonth,
  setCcaId
}: SMSDashboardFiltersProps) => {
  const { data: userCCAs = [] } = useUserCCAs();

  // Sort CCAs from smallest to largest by codigo
  const sortedCCAs = [...userCCAs].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Filtros</CardTitle>
        <CardDescription>
          Selecione os filtros para visualizar os dados (atualizados automaticamente)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-1">
            <label htmlFor="year" className="text-sm font-medium">
              Ano
            </label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Todos os anos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 2).toString()}>{new Date().getFullYear() - 2}</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</SelectItem>
                <SelectItem value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="month" className="text-sm font-medium">
              Mês
            </label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Maio</SelectItem>
                <SelectItem value="6">Junho</SelectItem>
                <SelectItem value="7">Julho</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <label htmlFor="cca" className="text-sm font-medium">
              CCA
            </label>
            <Select value={ccaId} onValueChange={setCcaId}>
              <SelectTrigger id="cca">
                <SelectValue placeholder="Todos os CCAs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {sortedCCAs.map((cca) => (
                  <SelectItem key={cca.id} value={cca.id.toString()}>
                    {cca.codigo} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SMSDashboardFilters;
