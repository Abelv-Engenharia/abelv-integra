
import DesviosBarChart from "@/components/desvios/DesviosBarChart";
import DesviosPieChart from "@/components/desvios/DesviosPieChart";
import DesviosAreaChart from "@/components/desvios/DesviosAreaChart";
import DesviosByRisk from "@/components/desvios/DesviosByRisk";

const DesviosChartRows = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosBarChart />
        <DesviosPieChart />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <DesviosAreaChart />
        <DesviosByRisk />
      </div>
    </>
  );
};

export default DesviosChartRows;
