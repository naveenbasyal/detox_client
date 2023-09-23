import React from "react";
import CreateEntry from "../components/CreateEntry";
import PublicEntries from "../components/Entries/PublicEntries";
import Explore from "../components/challenges/ExploreChallenges";

const Main = () => {
  return (
    <div className="container mt-4">
      <CreateEntry />

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">People's experiences</h2>
            </div>
            {/* <div className="card-body"> */}
            {/* </div> */}
          </div>
          <PublicEntries />
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Challenges</h2>
            </div>
          </div>
          <Explore />
        </div>
      </div>
    </div>
  );
};

export default Main;
