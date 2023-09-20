import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getChallengeById,
  submitChallenge,
} from "../../store/slices/challengesSlice";

import { createDailyEntries } from "../../store/slices/dailyEntriesSlice";

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
    GetSingleChallenge();
  }, [isSubmitted]);

  const GetSingleChallenge = async () => {
    const data = await dispatch(getChallengeById(id));
    if (data?.payload) {
      console.log(data?.payload);
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

  return (
    <div>
      {/* Challenge ke Details */}
      {singleChallenge?.challenge && (
        <div>
          <h3>Challenge Points : {singleChallenge?.challenge?.points}</h3>
          <p>Name:{singleChallenge?.challenge?.title}</p>
          <p>description:{singleChallenge?.challenge?.description}</p>
          <p>startdate:{singleChallenge?.challenge?.startdate}</p>
          <p>enddate:{singleChallenge?.challenge?.enddate}</p>
        </div>
      )}

      {isSubmitted ? (
        <h4>You have submitted this challenge</h4>
      ) : (
        // {/* write the content for the challenge */}
        <form onSubmit={handleSubmitChallenge}>
          <textarea
            onChange={handleChange}
            name="content"
            cols="30"
            rows="10"
            placeholder="write your experience here..."
          ></textarea>
          <br />
          <span>Mood: </span>
          <select name="mood" onChange={handleChange}>
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
          <br />
          <span>Visibility: </span>

          <select name="visibility" onChange={handleChange}>
            <option value="">Choose visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <br />
          <button type="submit">
            {createEntryLoading ? "Loading..." : "Submit "}
          </button>
        </form>
      )}
    </div>
  );
};

export default GetSingleChallenge;
