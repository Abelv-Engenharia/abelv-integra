import { useState } from "react";
import { GRDSelection } from "@/components/GRDSelection";
import { GRDForm } from "@/components/GRDForm";
import { GRDHistory } from "@/components/GRDHistory";
import { useDocuments } from "@/hooks/useDocuments";
import { useGRDs } from "@/hooks/useGRDs";
import type { Document, GRD } from "@/types/document";

const GRDs = () => {
  const { documents } = useDocuments();
  const { grds, addGRD } = useGRDs();
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [showGRDForm, setShowGRDForm] = useState(false);
  const [viewingGRD, setViewingGRD] = useState<GRD | null>(null);

  const handleGRDSelection = (docs: Document[]) => {
    setSelectedDocuments(docs);
    setShowGRDForm(true);
  };

  const handleSubmitGRD = (grdData: Omit<GRD, "id" | "numero" | "createdAt">): GRD => {
    const result = addGRD(grdData);
    setShowGRDForm(false);
    setSelectedDocuments([]);
    return result;
  };

  const handleBack = () => {
    setShowGRDForm(false);
    setSelectedDocuments([]);
  };

  const handleViewDetails = (grd: GRD) => {
    setViewingGRD(grd);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">GRDs</h1>
        <p className="text-muted-foreground">Gestão de Relatórios de Desempenho</p>
      </div>

      {showGRDForm ? (
        <GRDForm
          selectedDocuments={selectedDocuments}
          onSubmit={handleSubmitGRD}
          onCancel={handleBack}
          onGeneratePDF={handleViewDetails}
        />
      ) : (
        <div className="space-y-6">
          <GRDSelection 
            documents={documents} 
            onProceed={handleGRDSelection}
            onCancel={() => {}}
          />
          <GRDHistory 
            grds={grds}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export default GRDs;
