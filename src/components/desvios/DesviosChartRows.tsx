
import DesviosAreaChart from "./DesviosAreaChart";
import DesviosBarChart from "./DesviosBarChart";
import DesviosByRisk from "./DesviosByRisk";
import DesviosPieChart from "./DesviosPieChart";
import DesviosByDisciplineChart from "./DesviosByDisciplineChart";
import DesviosByCompanyChart from "./DesviosByCompanyChart";
import DesviosClassificationChart from "./DesviosClassificationChart";
import DesviosByEventChart from "./DesviosByEventChart";
import DesviosByProcessoChart from "./DesviosByProcessoChart";
import DesviosByBaseLegalChart from "./DesviosByBaseLegalChart";

const DesviosChartRows = () => {
  return (
    <div className="space-y-6">
      {/* Primeira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <DesviosAreaChart />
        <DesviosBarChart />
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <DesviosByRisk />
        <DesviosPieChart />
      </div>

      {/* Terceira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <DesviosByDisciplineChart />
        <DesviosByCompanyChart />
      </div>

      {/* Quarta linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <DesviosClassificationChart />
        <DesviosByEventChart />
      </div>

      {/* Quinta linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <DesviosByProcessoChart />
        <DesviosByBaseLegalChart />
      </div>
    </div>
  );
};

export default DesviosChartRows;
