import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { useDocuments } from "@/hooks/useDocuments";

const Dashboard = () => {
  const { documents } = useDocuments();

  return (
    <div className="container mx-auto p-6">
      <DashboardComponent documents={documents} />
    </div>
  );
};

export default Dashboard;
