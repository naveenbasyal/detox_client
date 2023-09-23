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
    setToggleWriteEntries(false);
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-primary"
        onClick={() => setToggleWriteEntries(!toggleWriteEntries)}
      >
        {toggleWriteEntries ? "Cancel" : "Write a post"}
      </button>

      {toggleWriteEntries && (
        <form onSubmit={handleCreatePost} className="mt-3">
          <div className="row">
            {/* ______ Mood ______ */}
            <div className="col-lg-4 col-md-5 col-sm-12">
              <div className="mb-3">
                <label htmlFor="mood" className="form-label">
                  Mood:
                </label>
                <select
                  className="form-select"
                  name="mood"
                  onChange={handleChange}
                  value={data.mood}
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
            </div>
            {/* ______ Visibility ______ */}

            <div className="col-lg-4 col-md-5 col-sm-12">
              <div className="mb-3">
                <label htmlFor="visibility" className="form-label">
                  Visibility:
                </label>
                <select
                  className="form-select"
                  name="visibility"
                  onChange={handleChange}
                  value={data.visibility}
                >
                  <option value="">Choose visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
          <textarea
            className="form-control"
            onChange={handleChange}
            name="content"
            cols="30"
            rows="5"
            placeholder="Write your experience here..."
            value={data.content}
          ></textarea>

          <button
            type="submit"
            className="btn btn-success"
            disabled={createEntryLoading}
          >
            {createEntryLoading ? "Posting..." : "Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateEntry;
