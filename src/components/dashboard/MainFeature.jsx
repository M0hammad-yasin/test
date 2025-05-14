import React from "react";
import RightSidebar from "./RightSidebar";
import EnvConditions from "./EnvConditions";
import EnvFactors from "./EnvFactors";
import PlantGrowth from "./PlantGrowth";
import Duration from "./Duration";
import GrowthStats from "./GrowthStats";

function Main() {
  return (
    <main className="row mainFeatures">
      <div className="col-12 col-md-10 col-lg-10">
        <div className="row gx-3">
          <div className="col-12 col-md-4 col-lg-4">
            <EnvConditions />
            <EnvFactors />
          </div>
          <div className="col-12 col-md-8 col-lg-8">
            <PlantGrowth />
            <Duration />
            <GrowthStats />
          </div>
        </div>
      </div>
      <RightSidebar />
    </main>
  );
}
export default Main;
