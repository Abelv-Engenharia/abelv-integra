import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RNCForm } from "@/components/sgq/RNCForm";
import { useRNCData } from "@/hooks/sgq/useRNCData";
import { RNC } from "@/types/sgq";
import { Card, CardContent } from "@/components/ui/card";

export default function EditarRNC() {
  const { id } = useParams();
  const { getRNC } = useRNCData();
  const [rnc, setRnc] = useState<RNC | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRNC = async () => {
      if (id) {
        const data = await getRNC(id);
        setRnc(data);
        setLoading(false);
      }
    };
    loadRNC();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!rnc) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">RNC não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RNCForm initialData={rnc} isEditMode={true} />;
}
