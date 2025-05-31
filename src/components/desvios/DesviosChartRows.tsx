
import DesviosBarChart from "@/components/desvios/DesviosBarChart";
import DesviosByDisciplineChart from "@/components/desvios/DesviosByDisciplineChart";
import DesviosClassificationChart from "@/components/desvios/DesviosClassificationChart";
import DesviosByCompanyChart from "@/components/desvios/DesviosByCompanyChart";
import DesviosByEventChart from "@/components/desvios/DesviosByEventChart";

const DesviosChartRows = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosBarChart />
        <DesviosByDisciplineChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosClassificationChart />
        <DesviosByCompanyChart />
      </div>
      <div className="grid gap-4">
        <DesviosByEventChart />
      </div>
    </>
  );
};

export default DesviosChartRows;
