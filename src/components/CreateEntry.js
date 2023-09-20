import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDailyEntries } from "../store/slices/dailyEntriesSlice";

const CreateEntry = () => {
  const dispatch = useDispatch();
  const [toggleWriteEntries, setToggleWriteEntries] = useState(false);
  const { createEntryLoading } = useSelector((state) => state?.dailyEntries);
  const [data, setData] = useState({
    content: "",
    mood: "",
    visibility: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    dispatch(createDailyEntries(data));
    setData({
      content: "",
      mood: "",
      visibility: "",
    });
  };

  return (
    <div>
      <button onClick={() => setToggleWriteEntries(!toggleWriteEntries)}>
        {toggleWriteEntries ? "Cancel" : "Write a post"}
      </button>

      {toggleWriteEntries && (
        <form onSubmit={handleCreatePost}>
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
            {createEntryLoading ? "Posting" : "Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateEntry;
