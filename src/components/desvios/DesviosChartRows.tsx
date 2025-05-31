
import DesviosPieChart from "@/components/desvios/DesviosPieChart";
import DesviosByCompanyChart from "@/components/desvios/DesviosByCompanyChart";
import DesviosClassificationChart from "@/components/desvios/DesviosClassificationChart";
import DesviosByDisciplineChart from "@/components/desvios/DesviosByDisciplineChart";
import DesviosByEventChart from "@/components/desvios/DesviosByEventChart";
import DesviosByBaseLegalChart from "@/components/desvios/DesviosByBaseLegalChart";

const DesviosChartRows = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosPieChart />
        <DesviosByCompanyChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosClassificationChart />
        <DesviosByDisciplineChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosByEventChart />
        <DesviosByBaseLegalChart />
      </div>
    </>
  );
};

export default DesviosChartRows;
