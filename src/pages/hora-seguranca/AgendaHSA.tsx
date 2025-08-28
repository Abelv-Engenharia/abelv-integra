
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InspecaoAgenda {
  id: string;
  data: string;
  responsavel_inspecao: string;
  status: string;
  inspecao_programada: string | null;
}

const getInspecaoStatusColor = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return "bg-green-100 border-green-200 text-green-800";
    case "REALIZADA (NÃO PROGRAMADA)":
      return "bg-orange-100 border-orange-200 text-orange-800";
    case "A REALIZAR":
      return "bg-blue-100 border-blue-200 text-blue-800";
    case "NÃO REALIZADA":
      return "bg-red-100 border-red-200 text-red-800";
    case "CANCELADA":
      return "bg-gray-200 border-gray-300 text-gray-800";
    default:
      return "bg-gray-100 border-gray-200 text-gray-800";
  }
};

const legendItems = [
  { status: "REALIZADA", label: "Realizada", colorClasses: "bg-green-100 border-green-200" },
  { status: "REALIZADA (NÃO PROGRAMADA)", label: "Realizada (Não Prog.)", colorClasses: "bg-orange-100 border-orange-200" },
  { status: "A REALIZAR", label: "A Realizar", colorClasses: "bg-blue-100 border-blue-200" },
  { status: "NÃO REALIZADA", label: "Não Realizada", colorClasses: "bg-red-100 border-red-200" },
  { status: "CANCELADA", label: "Cancelada", colorClasses: "bg-gray-200 border-gray-300" },
];

export default function AgendaHSA() {
  const [inspecoes, setInspecoes] = useState<InspecaoAgenda[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userCCAs = [] } = useUserCCAs();
  const [ccaFilter, setCcaFilter] = useState<string>("todos");

  useEffect(() => {
    const fetchInspecoes = async () => {
      setIsLoading(true);
      
      if (userCCAs.length === 0) {
        setInspecoes([]);
        setIsLoading(false);
        return;
      }

      // Aplicar filtro por CCAs permitidos e filtro selecionado
      const allowedCcaIds = userCCAs.map(cca => cca.id);
      let query = supabase
        .from("execucao_hsa")
        .select("id, data, responsavel_inspecao, status, inspecao_programada");

      if (ccaFilter && ccaFilter !== "todos") {
        query = query.eq('cca_id', Number(ccaFilter));
      } else {
        query = query.in('cca_id', allowedCcaIds);
      }

      const { data, error } = await query;
      setIsLoading(false);
      if (data) {
        setInspecoes(data as InspecaoAgenda[]);
      }
    };
    fetchInspecoes();
  }, [userCCAs, ccaFilter]);

  // Função para formatar a data corretamente, evitando problemas de timezone
  const formatDateSafely = (dateString: string) => {
    if (!dateString) return "";
    // Adiciona 'T00:00:00' para garantir que seja tratada como data local
    return format(new Date(dateString + 'T00:00:00'), "yyyy-MM-dd");
  };

  // Agrupa inspeções por data no formato yyyy-MM-dd
  const groupedByDay: Record<string, InspecaoAgenda[]> = {};
  inspecoes.forEach((inspecao) => {
    const day = formatDateSafely(inspecao.data);
    if (day && !groupedByDay[day]) groupedByDay[day] = [];
    if (day) groupedByDay[day].push(inspecao);
  });

  // Componente personalizado para o conteúdo do dia
  const CustomDayContent = ({ date }: { date: Date }) => {
    const dayKey = format(date, "yyyy-MM-dd");
    const eventosDoDia = groupedByDay[dayKey] || [];
    const isToday = isSameDay(date, new Date());

    return (
      <div className="flex flex-col h-full w-full p-1">
        <span className={`font-medium self-start text-xs ${isToday ? 'text-blue-600 font-bold' : ''}`}>{date.getDate()}</span>
        <div className="flex-grow overflow-y-auto text-[9px] mt-1 space-y-0.5 max-h-32">
          {eventosDoDia.slice(0, 4).map((inspecao) => (
            <div
              key={inspecao.id}
              className={`rounded p-0.5 h-8 flex flex-col justify-center overflow-hidden ${getInspecaoStatusColor(inspecao.status)}`}
              title={`${inspecao.responsavel_inspecao} - ${inspecao.inspecao_programada || 'Não Programada'} - ${inspecao.status}`}
            >
              <p className="font-bold truncate leading-none text-[8px]">{inspecao.responsavel_inspecao}</p>
              <p className="truncate opacity-80 leading-none text-[7px]">{inspecao.inspecao_programada || 'Não Programada'}</p>
            </div>
          ))}
          {eventosDoDia.length > 4 && (
            <div className="text-center text-[7px] text-muted-foreground">
              +{eventosDoDia.length - 4} mais
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );

  if (userCCAs.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto py-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Agenda HSA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-600">
              Você não possui permissão para visualizar dados de nenhum CCA.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Agenda HSA</CardTitle>
          <p className="text-sm text-muted-foreground">
            Calendário de inspeções de Hora da Segurança.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="grid gap-1 w-full max-w-xs">
              <label htmlFor="cca" className="text-sm font-medium">CCA</label>
              <Select value={ccaFilter} onValueChange={setCcaFilter}>
                <SelectTrigger id="cca">
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  {userCCAs
                    .slice()
                    .sort((a, b) => a.codigo.localeCompare(b.codigo, undefined, { numeric: true }))
                    .map((cca) => (
                      <SelectItem key={cca.id} value={cca.id.toString()}>
                        {`${cca.codigo} - ${cca.nome}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 border-b pb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Legenda:</h3>
            {legendItems.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.colorClasses}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-0 border rounded-md"
            locale={ptBR}
            showOutsideDays
            classNames={{
              months: "flex flex-col sm:flex-row",
              month: "w-full space-y-4 p-4",
              table: "w-full border-collapse",
              head_row: "flex w-full border-b",
              head_cell: "text-muted-foreground w-[14.28%] font-normal text-sm p-2 text-center",
              row: "flex w-full divide-x divide-gray-200",
              cell: "h-40 w-[14.28%] p-0 relative border-t border-gray-200",
              day: "w-full h-full",
              day_selected: "bg-primary/10 text-primary",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-30",
            }}
            components={{ DayContent: CustomDayContent }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
