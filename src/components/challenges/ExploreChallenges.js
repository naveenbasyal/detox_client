import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChallenges } from "../../store/slices/challengesSlice";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import fetchToken from "../../utils/fetchToken";

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
    <div>
      {loading
        ? "Loading..."
        : challenges?.map((challenge, index) => {
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
              <div key={index}>
                <h5 style={{ display: "flex", flexWrap: "wrap" }}>
                  {/* show Except me */}
                  {participants?.map((p) => {
                    return (
                      <span key={p}>
                        <Link to={`/user/${p}`}>{p === myId ? "You " : p}</Link>
                        ,&nbsp;
                      </span>
                    );
                  })}
                  {participants.length > 0 && (
                    <span>&nbsp; accepted the challenge</span>
                  )}
                </h5>
                <h4>Challenge Points: {points}</h4>
                <p>Name: {title}</p>
                <p>description: {description}</p>
                <p>
                  startdate:{" "}
                  {new Date(startdate).toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p>
                  enddate:{" "}
                  {new Date(enddate).toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>

                {notStarted ? (
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    Challenge yet to start
                  </p>
                ) : expired ? (
                  <p style={{ color: "red", fontWeight: "bold" }}>
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
                        return <p>Challenge expired</p>;
                      } else {
                        return (
                          <p>
                            Ends in {days} days, {hours} hours, {minutes}{" "}
                            minutes, {seconds} seconds
                          </p>
                        );
                      }
                    }}
                  />
                )}

                {!notStarted && !expired && (
                  <button style={{ background: "green", color: "white" }}>
                    <Link
                      style={{ color: "white" }}
                      to={`/explore/challenge/${_id}`}
                    >
                      Accept challenge
                    </Link>
                  </button>
                )}
                <hr />
              </div>
            );
          })}
    </div>
  );
};

export default ExploreChallenges;
