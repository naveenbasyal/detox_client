import React from "react";
import CreateEntry from "../components/CreateEntry";
import PublicEntries from "../components/Entries/PublicEntries";
import Explore from "../components/challenges/ExploreChallenges";
import MainLoader from "../components/MainLoader";
import { useSelector } from "react-redux";

const Main = () => {
  const { loading } = useSelector(({ dailyEntries }) => dailyEntries);
  const { loading: userLoading } = useSelector((state) => state?.user);
  

  return (
    <section className="main mb-5">
      {userLoading ? (
        <MainLoader />
      ) : (
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
      )}
    </section>
  );
};

export default Main;
