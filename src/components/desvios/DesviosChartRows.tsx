
import DesviosPieChart from "@/components/desvios/DesviosPieChart";
import DesviosByCompanyChart from "@/components/desvios/DesviosByCompanyChart";
import DesviosClassificationChart from "@/components/desvios/DesviosClassificationChart";
import DesviosByDisciplineChart from "@/components/desvios/DesviosByDisciplineChart";
import DesviosByEventChart from "@/components/desvios/DesviosByEventChart";
import DesviosByProcessoChart from "@/components/desvios/DesviosByProcessoChart";
import DesviosByBaseLegalChart from "@/components/desvios/DesviosByBaseLegalChart";

const DesviosChartRows = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosPieChart />
        <DesviosByDisciplineChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosClassificationChart />
        <DesviosByCompanyChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosByEventChart />
        <DesviosByProcessoChart />
      </div>
      <div className="w-full">
        <DesviosByBaseLegalChart />
      </div>
    </>
  );
};

export default DesviosChartRows;
