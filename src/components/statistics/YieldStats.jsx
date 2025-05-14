import React from "react";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";

function Stats() {
  return (
    <main className="row">
      <div className="col-12 col-md-12 col-lg-12 col-sm-12 stats">
        <BarGraph />
        <PieChart />
      </div>
    </main>
  );
}

export default Stats;
