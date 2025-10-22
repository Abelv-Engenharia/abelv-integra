import { useState } from "react";
import { DocumentTable } from "@/components/DocumentTable";
import { DocumentForm } from "@/components/DocumentForm";
import { useDocuments } from "@/hooks/useDocuments";
import { useNavigate } from "react-router-dom";
import type { Document } from "@/types/document";

const Documents = () => {
  const { documents, addDocument, updateDocument } = useDocuments();
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAddDocument = () => {
    setEditingDocument(null);
    setShowForm(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setShowForm(true);
  };

  const handleSubmitDocument = (documentData: Omit<Document, "id" | "createdAt" | "updatedAt">) => {
    if (editingDocument) {
      updateDocument(editingDocument.id, documentData);
    } else {
      addDocument(documentData);
    }
    setShowForm(false);
    setEditingDocument(null);
  };

  const handleSelectDocument = (documentId: string, selected: boolean) => {
    if (selected) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDocuments(documents.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleEmitGRD = () => {
    navigate("/grds", { state: { selectedDocuments } });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Documentos</h1>
        <p className="text-muted-foreground">Gerencie seus documentos técnicos</p>
      </div>

      {showForm ? (
        <DocumentForm
          document={editingDocument}
          onSubmit={handleSubmitDocument}
          onCancel={() => {
            setShowForm(false);
            setEditingDocument(null);
          }}
        />
      ) : (
        <DocumentTable
          documents={documents}
          onEditDocument={handleEditDocument}
          onNewDocument={handleAddDocument}
          onEmitGRD={handleEmitGRD}
          selectedDocuments={selectedDocuments}
          onSelectDocument={handleSelectDocument}
          onSelectAll={handleSelectAll}
        />
      )}
    </div>
  );
};

export default Documents;
