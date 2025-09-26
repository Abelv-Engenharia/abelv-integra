import React, { useState, useEffect } from "react";
import { Comunicado } from "@/types/comunicados";
import ComunicadoModal from "./ComunicadoModal";

interface ComunicadosSequenceProps {
  comunicados: Comunicado[];
  onComplete: () => void;
}

const ComunicadosSequence: React.FC<ComunicadosSequenceProps> = ({
  comunicados,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (comunicados.length > 0) {
      setIsOpen(true);
    }
  }, [comunicados]);

  const handleCiencia = () => {
    if (currentIndex < comunicados.length - 1) {
      // Há mais comunicados, avançar para o próximo
      setCurrentIndex(prev => prev + 1);
    } else {
      // Último comunicado, fechar sequência
      setIsOpen(false);
      onComplete();
    }
  };

  if (comunicados.length === 0 || !isOpen) {
    return null;
  }

  const currentComunicado = comunicados[currentIndex];

  return (
    <ComunicadoModal
      comunicado={currentComunicado}
      open={isOpen}
      onCiencia={handleCiencia}
    />
  );
};

export default ComunicadosSequence;