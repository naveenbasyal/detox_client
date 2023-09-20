import React from "react";
import CreateEntry from "../components/CreateEntry";
import PublicEntries from "../components/Entries/PublicEntries";
import Explore from "../components/challenges/ExploreChallenges";

const Main = () => {
  return (
    <div>
      <br />
      <br />
      <br />

      <CreateEntry />
      <br />
      <br />
      <div style={{ display: "flex" }}>
        <div>
          <h2>People's experiences</h2>
          <PublicEntries />
        </div>
        <div>
          <h2>Challenges</h2>
          <Explore />
        </div>
      </div>
    </div>
  );
};

export default Main;
