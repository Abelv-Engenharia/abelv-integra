
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MatrizRisco from "@/components/gro/MatrizRisco";
import { toast } from "@/hooks/use-toast";

const metodologias = [
  { value: "matriz", label: "Matriz de Risco" },
  { value: "fmea", label: "FMEA (Análise de Modos e Efeitos de Falha)" },
  { value: "hazop", label: "HAZOP" },
];

function categorizarRisco(prob: number, sev: number) {
  const risco = prob * sev;
  if (risco <= 2) return "Trivial";
  if (risco <= 5) return "Tolerável";
  if (risco <= 10) return "Moderado";
  if (risco <= 15) return "Substancial";
  return "Intolerável";
}

export default function GroAvaliacaoRiscos() {
  const [metodologia, setMetodologia] = useState("matriz");
  const [prob, setProb] = useState(1);
  const [sev, setSev] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast({
      title: "Avaliação registrada!",
      description: (
        <div>
          Metodologia: <b>{metodologias.find(m=>m.value===metodologia)?.label}</b><br/>
          Probabilidade: {prob} <br/>
          Severidade: {sev} <br/>
          Nível de risco: <b>{categorizarRisco(prob, sev)}</b>
        </div>
      )
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Avaliação de Riscos Ocupacionais</h1>
      <p className="mb-6 text-muted-foreground">
        Preencha os campos e selecione a metodologia desejada para avaliar o risco conforme a NR-01 e ISO 45001.
      </p>
      <Card className="p-5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Metodologia</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={metodologia}
              onChange={e => setMetodologia(e.target.value)}
            >
              {metodologias.map(m => (
                <option value={m.value} key={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <MatrizRisco
            probabilidade={prob}
            setProbabilidade={setProb}
            severidade={sev}
            setSeveridade={setSev}
          />
          <Button type="submit" className="w-full">Registrar Avaliação</Button>
        </form>
      </Card>
    </div>
  );
}
