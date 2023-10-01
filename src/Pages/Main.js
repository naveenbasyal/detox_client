import React from "react";
import CreateEntry from "../components/CreateEntry";
import PublicEntries from "../components/Entries/PublicEntries";
import Explore from "../components/challenges/ExploreChallenges";

const Main = () => {
  return (
    <section className="main">
      <div className="container">
        <CreateEntry />

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">People's experiences</h2>
              </div>
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
    </section>
  );
};

export default Main;
