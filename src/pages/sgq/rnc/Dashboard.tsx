import { RNCHeader } from "@/components/sgq/RNCHeader";
import { RNCDashboard } from "@/components/sgq/RNCDashboard";

const SGQRNCDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <RNCHeader />
      <RNCDashboard />
    </div>
  );
};

export default SGQRNCDashboard;
