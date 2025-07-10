
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoUpload } from "./PhotoUpload";
import { Funcionario, CCA, FuncionarioFormData } from "@/types/funcionarios";

interface FuncionarioFormProps {
  editingFuncionario: Funcionario | null;
  ccas: CCA[];
  isLoading: boolean;
  onSubmit: (formData: FuncionarioFormData, photoFile: File | null, photoRemoved: boolean) => void;
  onCancel: () => void;
}

export const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  editingFuncionario,
  ccas,
  isLoading,
  onSubmit,
  onCancel
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [formData, setFormData] = useState<FuncionarioFormData>({
    nome: "",
    funcao: "",
    matricula: "",
    cca_id: "none",
    data_admissao: ""
  });

  useEffect(() => {
    if (editingFuncionario) {
      setFormData({
        nome: editingFuncionario.nome,
        funcao: editingFuncionario.funcao,
        matricula: editingFuncionario.matricula,
        cca_id: editingFuncionario.cca_id?.toString() || "none",
        data_admissao: editingFuncionario.data_admissao ?? ""
      });
      setPhotoPreview(editingFuncionario.foto || null);
      setPhotoRemoved(false);
    } else {
      setFormData({ nome: "", funcao: "", matricula: "", cca_id: "none", data_admissao: "" });
      setPhotoPreview(null);
      setPhotoFile(null);
      setPhotoRemoved(false);
    }
  }, [editingFuncionario]);

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      setPhotoFile(file);
      setPhotoRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhotoRemoved(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, photoFile, photoRemoved);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhotoUpload
        photoPreview={photoPreview}
        editingFuncionario={editingFuncionario}
        photoRemoved={photoRemoved}
        onPhotoChange={handlePhotoChange}
        onRemovePhoto={handleRemovePhoto}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="funcao">Função</Label>
          <Input
            id="funcao"
            value={formData.funcao}
            onChange={(e) => setFormData(prev => ({ ...prev, funcao: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Matrícula e Data de Admissão lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matricula">Matrícula</Label>
          <Input
            id="matricula"
            value={formData.matricula}
            onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="data_admissao">Data de admissão</Label>
          <Input
            id="data_admissao"
            type="date"
            value={formData.data_admissao ? formData.data_admissao : ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                data_admissao: e.target.value
              }))
            }
          />
        </div>
      </div>

      {/* CCA logo abaixo */}
      <div>
        <Label htmlFor="cca">CCA</Label>
        <Select
          value={formData.cca_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, cca_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um CCA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum CCA</SelectItem>
            {ccas.map((cca) => (
              <SelectItem key={cca.id} value={cca.id.toString()}>
                {cca.codigo} - {cca.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};
