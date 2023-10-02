import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getChallengeById,
  submitChallenge,
} from "../../store/slices/challengesSlice";

import { createDailyEntries } from "../../store/slices/dailyEntriesSlice";
import Loader from "../Loader";
import { formatDistanceToNow } from "date-fns";
import MainLoader from "../MainLoader";

const GetSingleChallenge = () => {
  const id = useParams().id;
  const dispatch = useDispatch();
  const { createEntryLoading } = useSelector((state) => state?.dailyEntries);
  const { singleChallenge, loading } = useSelector(
    (state) => state?.challenges
  );
  const [isSubmitted, setIsSubmitted] = useState(singleChallenge?.isSubmitted);
  const [data, setData] = useState({
    content: "",
    mood: "",
    visibility: "",
  });

  useEffect(() => {
    getSingleChallenge();
  }, [isSubmitted]);

  const getSingleChallenge = async () => {
    const data = await dispatch(getChallengeById(id));
    if (data?.payload) {
      setIsSubmitted(data?.payload?.isSubmitted);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    dispatch(createDailyEntries(data));
    const submit = await dispatch(submitChallenge(id));
    if (submit?.payload?.challenge) {
      setIsSubmitted(true);
    }
    setData({
      content: "",
      mood: "",
      visibility: "",
    });
  };
  const timeAgo = (createdAt) =>
    formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="container mt-4 mb-5">
      {loading ? (
        <MainLoader />
      ) : (
        <>
          <div className="row justify-content-between">
            <div className="col-lg-5 col-md-5 col-sm-12">
              {singleChallenge?.challenge && (
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title mb-3">
                      Challenge Points: {singleChallenge?.challenge?.points}
                    </h3>
                    <p className="card-text">
                      <strong>Name:</strong> {singleChallenge?.challenge?.title}
                    </p>
                    <hr /> {/* Horizontal line */}
                    <strong className="card-text">Description:</strong>
                    <div
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: singleChallenge?.challenge?.description,
                      }}
                    ></div>
                    <hr /> {/* Horizontal line */}
                    <p className="card-text">
                      <strong>Started : </strong>
                      {timeAgo(singleChallenge?.challenge?.createdAt)}
                    </p>
                    <hr /> {/* Horizontal line */}
                    <p className="card-text">
                      <strong>End Date : </strong>
                      {new Date(
                        singleChallenge?.challenge?.enddate
                      ).toLocaleDateString("en-US", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-5 col-md-5 col-sm-12">
              {isSubmitted ? (
                <h4 className="text-center text-danger my-5">
                  <i className="fa-regular fa-circle-check fa-beat-fade"></i>
                  &nbsp; You have submitted this challenge
                </h4>
              ) : (
                <form onSubmit={handleSubmitChallenge} className="mt-4">
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      onChange={handleChange}
                      name="content"
                      cols="30"
                      rows="10"
                      placeholder="Write your experience here..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <span>Mood: </span>
                    <select
                      className="form-select"
                      name="mood"
                      onChange={handleChange}
                    >
                      <option value="">Choose your Mood</option>
                      <option value="excited">Excited</option>
                      <option value="normal">Normal</option>
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                      <option value="angry">Angry</option>
                      <option value="tired">Tired</option>
                      <option value="bored">Bored</option>
                      <option value="relaxed">Relaxed</option>
                      <option value="stressed">Stressed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <span>Visibility: </span>
                    <select
                      className="form-select"
                      name="visibility"
                      onChange={handleChange}
                    >
                      <option value="">Choose visibility</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {createEntryLoading ? "Loading..." : "Submit"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GetSingleChallenge;
