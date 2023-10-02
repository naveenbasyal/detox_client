import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChallenges } from "../../store/slices/challengesSlice";
import { Link, useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import fetchToken from "../../utils/fetchToken";
import { formatDistanceToNow } from "date-fns";
import MainLoader from "../MainLoader";
import { ThreeDots } from "react-loader-spinner";

const ExploreChallenges = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { challenges, loading } = useSelector((state) => state?.challenges);
  const myId = fetchToken()?.id;

  const isChallengeExpired = (enddate) => {
    const currentTime = new Date().getTime(); // Current time in milliseconds
    const endDateTime = new Date(enddate).getTime(); // End date time in milliseconds

    // Compare the two times
    return currentTime >= endDateTime;
  };

  useEffect(() => {
    if (challenges.length === 0) {
      dispatch(getAllChallenges());
    }
  }, []);

  const isAccepted = (participants) => {
    return participants?.includes(myId);
  };

  return (
    <div className={`my-4 ${location.pathname === "/explore" && "container"}`}>
      {location.pathname === "/explore" && (
        <h2 className="my-4 text-center text-white fw-bolder">Explore Challenges</h2>
      )}

      {loading ? (
        <ThreeDots
          height="64"
          width="64"
          radius="9"
          color="#B9B4C7"
          ariaLabel="three-dots-loading"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          wrapperClassName=""
          visible={true}
        />
      ) : challenges?.length === 0 ? (
        <p className="text-center my-5">No Challenges to show !!</p>
      ) : (
        challenges?.map(
          ({ _id, title, points, createdAt, enddate, participants }, index) => {
            const expired = isChallengeExpired(enddate);
            const timeago = formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            });

            return (
              <div key={index} className="card m-2">
                <div className="card-body ">
                  <p className="card-text">
                    <strong>Challenge Name : </strong> {title}
                  </p>
                  <p className="card-text">
                    <strong>Challenge Points : </strong> {points}
                  </p>
                  <p className="text-muted">
                    <span>Started {timeago} </span>
                  </p>
                  {isAccepted(participants) && (
                    <p className="text-success font-weight-bold ">
                      You have accepted this challenge
                    </p>
                  )}
                  {!expired && (
                    <button
                      className={`btn btn-${
                        isAccepted(participants) ? "primary" : "success"
                      }`}
                    >
                      <Link
                        to={`/explore/challenge/${_id}`}
                        className="text-white text-decoration-none"
                      >
                        {isAccepted(participants)
                          ? "See Challenge"
                          : "Accept Challenge"}
                      </Link>
                    </button>
                  )}

                  {expired ? (
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
                            <p className="text-danger mt-3 mb-0">
                              Ends in {days} days, {hours} hours, {minutes}{" "}
                              minutes &nbsp;
                              <i className="fa-regular fa-clock fa-spin"></i>
                            </p>
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default ExploreChallenges;
