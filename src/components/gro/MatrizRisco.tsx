
import React from "react";
import { cn } from "@/lib/utils";

const levels = [
  { value: "trivial", color: "bg-green-400", label: "Trivial" },
  { value: "toleravel", color: "bg-lime-400", label: "Tolerável" },
  { value: "moderado", color: "bg-yellow-300", label: "Moderado" },
  { value: "substancial", color: "bg-orange-400", label: "Substancial" },
  { value: "intoleravel", color: "bg-red-500", label: "Intolerável" },
];

// Nova categorização: trivial, tolerável, moderado, substancial, intolerável
function categorizarRisco(prob: number, sev: number) {
  const risco = prob * sev;
  if (risco <= 2) return "trivial";
  if (risco <= 5) return "toleravel";
  if (risco <= 10) return "moderado";
  if (risco <= 15) return "substancial";
  return "intoleravel";
}

type MatrizRiscoProps = {
  probabilidade: number;
  setProbabilidade: (n: number) => void;
  severidade: number;
  setSeveridade: (n: number) => void;
};

export default function MatrizRisco({
  probabilidade,
  setProbabilidade,
  severidade,
  setSeveridade,
}: MatrizRiscoProps) {
  const categoria = categorizarRisco(probabilidade, severidade);

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        {/* Probabilidade */}
        <div>
          <label className="font-semibold block mb-1">Probabilidade</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={probabilidade}
            onChange={e => setProbabilidade(Number(e.target.value))}
          >
            <option value={1}>Muito Baixa (1)</option>
            <option value={2}>Baixa (2)</option>
            <option value={3}>Média (3)</option>
            <option value={4}>Alta (4)</option>
            <option value={5}>Muito Alta (5)</option>
          </select>
        </div>
        {/* Severidade */}
        <div>
          <label className="font-semibold block mb-1">Severidade</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={severidade}
            onChange={e => setSeveridade(Number(e.target.value))}
          >
            <option value={1}>Muito Baixa (1)</option>
            <option value={2}>Baixa (2)</option>
            <option value={3}>Média (3)</option>
            <option value={4}>Alta (4)</option>
            <option value={5}>Muito Alta (5)</option>
          </select>
        </div>
      </div>
      {/* Exibição do nível */}
      <div className="mt-2">
        <div className="flex items-center gap-3">
          <span className={cn(
            "inline-block rounded px-3 py-1 text-white font-semibold",
            levels.find(l => l.value === categoria)?.color
          )}>
            {levels.find(l => l.value === categoria)?.label}
          </span>
          <span className="text-sm text-muted-foreground">
            (Resultado: {probabilidade} × {severidade} = {probabilidade * severidade})
          </span>
        </div>
      </div>
    </div>
  );
}
