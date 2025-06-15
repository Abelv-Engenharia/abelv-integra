
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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
  const CustomDayContent = (props: { date: Date }) => {
    const date = props.date;
    const key = format(date, "yyyy-MM-dd");
    const eventos = groupedByDay[key];
    return (
      <div className="relative flex flex-col items-center">
        <span>{date.getDate()}</span>
        <div className="absolute z-10 top-6 left-1 right-1">
          {eventos && eventos.length > 0 && (
            <div className="flex flex-col gap-1">
              {eventos.map((inspecao) => (
                <div
                  key={inspecao.id}
                  className="rounded px-1 py-0.5 bg-green-100 border text-xs text-green-900 border-green-400 flex flex-col"
                  title={`Status: ${inspecao.status}${inspecao.inspecao_programada ? " • " + inspecao.inspecao_programada : ""}`}
                >
                  <span className="font-semibold">{inspecao.responsavel_inspecao}</span>
                  <span className="text-[10px]">{inspecao.status}</span>
                  {inspecao.inspecao_programada && (
                    <span className="text-[10px] text-gray-500">{inspecao.inspecao_programada}</span>
                  )}
                </div>
              ))}
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

  return (
    <div className="container max-w-3xl mx-auto py-6 animate-fade-in">
      <Card className="mb-6">
        <CardTitle className="text-2xl py-4 px-4">Agenda HSA</CardTitle>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Veja todas as inspeções de Hora da Segurança agendadas, agrupadas por responsável.
            <br />
            Clique em um dia para realçar as inspeções daquele dia.
          </p>
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-3 pointer-events-auto bg-white rounded-lg"
              locale={ptBR}
              showOutsideDays
              modifiers={{ hasInspecao: (date) => Boolean(groupedByDay[format(date, "yyyy-MM-dd")]) }}
              modifiersClassNames={{
                hasInspecao: "outline outline-green-400/70 outline-2",
              }}
              components={{ DayContent: CustomDayContent }}
            />
            {/* Lista detalhada das inspeções no dia selecionado */}
            {selectedDate && (
              <div className="mt-6 w-full">
                <h3 className="font-bold text-lg mb-2 text-center">
                  Inspeções do dia {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                </h3>
                {groupedByDay[format(selectedDate, "yyyy-MM-dd")] ? (
                  <ul className="space-y-2">
                    {groupedByDay[format(selectedDate, "yyyy-MM-dd")].map((inspecao) => (
                      <li key={inspecao.id} className="border rounded p-2 bg-green-50 flex justify-between items-center">
                        <span>
                          <span className="font-semibold">{inspecao.responsavel_inspecao}</span>
                          {" — "}
                          <span className="text-xs text-gray-500">{inspecao.status}</span>
                        </span>
                        {inspecao.inspecao_programada && (
                          <Badge>{inspecao.inspecao_programada}</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma inspeção agendada neste dia.
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
