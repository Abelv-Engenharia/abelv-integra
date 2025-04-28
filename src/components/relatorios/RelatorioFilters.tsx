
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarRange, Calendar as CalendarIcon, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

type RelatorioFiltersProps = {
  onFilter: (filters: any) => void;
  filterOptions: {
    periods: { value: string; label: string }[];
    additionalFilters?: { 
      id: string; 
      label: string; 
      options: { value: string; label: string }[] 
    }[];
  };
};

export function RelatorioFilters({ onFilter, filterOptions }: RelatorioFiltersProps) {
  const [period, setPeriod] = React.useState<string>("last-30");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined
  });
  const [additionalFilters, setAdditionalFilters] = React.useState<Record<string, string>>({});

  const applyFilters = () => {
    onFilter({
      period,
      dateRange,
      ...additionalFilters
    });
    
    toast({
      title: "Filtros aplicados",
      description: "Os dados foram filtrados conforme selecionado."
    });
  };
  
  const generatePDF = () => {
    toast({
      title: "Gerando PDF",
      description: "O relatório PDF será baixado em instantes."
    });
    
    // In a real app, this would trigger a PDF generation API call
    setTimeout(() => {
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório foi gerado e está pronto para download."
      });
    }, 1500);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.periods.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {period === "custom" && (
              <div className="space-y-2 col-span-2">
                <Label>Período personalizado</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            {filterOptions.additionalFilters?.map((filter) => (
              <div className="space-y-2" key={filter.id}>
                <Label htmlFor={filter.id}>{filter.label}</Label>
                <Select 
                  onValueChange={(value) => 
                    setAdditionalFilters({...additionalFilters, [filter.id]: value})
                  }
                >
                  <SelectTrigger id={filter.id}>
                    <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <Button onClick={applyFilters} variant="default">
              <Filter className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            
            <Button onClick={generatePDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
