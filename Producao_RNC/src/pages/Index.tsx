import { RNCHeader } from "@/components/RNCHeader";
import { RNCDashboard } from "@/components/RNCDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <RNCHeader />
      <RNCDashboard />
    </div>
  );
};

export default Index;
