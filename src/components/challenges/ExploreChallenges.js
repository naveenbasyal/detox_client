import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChallenges } from "../../store/slices/challengesSlice";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import fetchToken from "../../utils/fetchToken";
import { ThreeDots } from "react-loader-spinner";

const ExploreChallenges = () => {
  const dispatch = useDispatch();
  const { challenges, loading } = useSelector((state) => state?.challenges);
  const myId = fetchToken()?.id;

  const isChallengeNotStarted = (startdate) => {
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return (
      currentTime <
      new Date(startdate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
  };

  const isChallengeExpired = (enddate) => {
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return (
      currentTime >
      new Date(enddate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
  };

  useEffect(() => {
    if (challenges.length === 0) {
      dispatch(getAllChallenges());
    }
  }, []);

  return (
    <div className="container">
      <h3 className="my-4">Explore Challenges</h3>
      {loading ? (
        <ThreeDots color="#B9B4C7" width="64px" height={"64px"}/>
      ) : (
        challenges?.map((challenge, index) => {
          if (challenge) {
            var {
              _id,
              title,
              description,
              points,
              createdAt: startdate,
              enddate,
              participants,
            } = challenge;
          }
          const notStarted = isChallengeNotStarted(startdate);
          const expired = isChallengeExpired(enddate);

          return (
            <div key={index} className="card m-4">
              <div className="card-body bg-light">
                <h5 className="card-title">
                  {participants?.map((p, idx) => {
                    return (
                      <span key={p}>
                        <Link to={`/user/${p}`}>{p === myId ? "You " : p}</Link>
                        {idx < participants.length - 1 && ", "}
                      </span>
                    );
                  })}
                  {participants.length > 0 && "accepted the challenge"}
                </h5>
                <h4 className="card-subtitle mb-2 text-muted">
                  Challenge Points: {points}
                </h4>
                <p className="card-text">
                  <strong>Name:</strong> {title}
                </p>
                <p className="card-text">
                  <strong>Description:</strong> {description}
                </p>
                <p className="card-text">
                  <strong>Start Date:</strong>{" "}
                  {new Date(startdate).toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p className="card-text">
                  <strong>End Date:</strong>{" "}
                  {new Date(enddate).toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>

                {notStarted ? (
                  <p className="text-success font-weight-bold">
                    Challenge yet to start
                  </p>
                ) : expired ? (
                  <p className="text-danger font-weight-bold">
                    Challenge expired
                  </p>
                ) : (
                  <Countdown
                    date={new Date(enddate).toLocaleString("en-US", {
                      timeZone: "Asia/Kolkata",
                    })}
                    renderer={({
                      days,
                      hours,
                      minutes,
                      seconds,
                      completed,
                    }) => {
                      if (completed) {
                        return (
                          <p className="text-danger font-weight-bold">
                            Challenge expired
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-danger">
                            Ends in {days} days, {hours} hours, {minutes}{" "}
                            minutes, {seconds} seconds
                          </p>
                        );
                      }
                    }}
                  />
                )}

                {!notStarted && !expired && (
                  <button className="btn btn-success">
                    <Link
                      to={`/explore/challenge/${_id}`}
                      className="text-white text-decoration-none"
                    >
                      Accept challenge
                    </Link>
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ExploreChallenges;
