
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface InspecaoAgenda {
  id: string;
  data: string;
  responsavel_inspecao: string;
  status: string;
  inspecao_programada: string | null;
}

export default function AgendaHSA() {
  const [inspecoes, setInspecoes] = useState<InspecaoAgenda[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInspecoes = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("execucao_hsa")
        .select("id, data, responsavel_inspecao, status, inspecao_programada");
      setIsLoading(false);
      if (data) {
        setInspecoes(data as InspecaoAgenda[]);
      }
    };
    fetchInspecoes();
  }, []);

  // Agrupa inspeções por data no formato yyyy-MM-dd
  const groupedByDay: Record<string, InspecaoAgenda[]> = {};
  inspecoes.forEach((inspecao) => {
    const day = format(new Date(inspecao.data), "yyyy-MM-dd");
    if (!groupedByDay[day]) groupedByDay[day] = [];
    groupedByDay[day].push(inspecao);
  });

  // Componente personalizado para o conteúdo do dia
  const CustomDayContent = ({ date }: { date: Date }) => {
    const dayKey = format(date, "yyyy-MM-dd");
    const eventosDoDia = groupedByDay[dayKey] || [];
    const isToday = isSameDay(date, new Date());

    return (
      <div className="flex flex-col h-full w-full p-2">
        <span className={`font-medium self-start ${isToday ? 'text-blue-600 font-bold' : ''}`}>{date.getDate()}</span>
        <div className="flex-grow overflow-y-auto text-[10px] mt-1 space-y-0">
          {eventosDoDia.map((inspecao) => (
            <div
              key={inspecao.id}
              className="rounded p-0.5 bg-green-50 border border-green-200 text-gray-800"
              title={`${inspecao.inspecao_programada || 'Inspeção'} - ${inspecao.status}`}
            >
              <p className="font-bold truncate">{inspecao.responsavel_inspecao}</p>
              <p className="truncate text-gray-600">{inspecao.inspecao_programada || 'Não Programada'}</p>
            </div>
          ))}
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
