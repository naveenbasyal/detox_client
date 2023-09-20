import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDailyEntries,
  updateEntryById,
} from "../store/slices/dailyEntriesSlice";

const MyEntries = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.auth);
  const {
    dailyEntries: entries,
    loading,
    updateEntryLoading,
  } = useSelector((state) => state?.dailyEntries);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    id: "",
    content: "",
    mood: "",
    visibility: "",
  });
  useEffect(() => {
    if (isLogin && entries.length == 0) {
      dispatch(getDailyEntries());
    }
  }, [isLogin]);

  const handleEditEntry = (id) => {
    setEditing(true);
    const entry = entries.find((entry) => entry._id === id);
    setEditValues({
      id,
      content: entry.content,
      mood: entry.mood,
      visibility: entry.visibility,
    });
  };
  const handleEditChange = (e) => {
    setEditValues({
      ...editValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitEditedEntry = async (e) => {
    e.preventDefault();
    const response = await dispatch(updateEntryById(editValues));
    // toast lgaayiyo isko ⬇️
    alert(response?.payload?.message);
    setEditing(false);
  };
  return (
    <div>
      <h1>MyEntries</h1>
      {/* ⬇️isko overlay  bnade model editing wale ko */}
      {editing && (
        <div>
          <h2>Edit Entry</h2>
          <form onSubmit={handleSubmitEditedEntry}>
            <input
              type="text"
              placeholder="content"
              value={editValues?.content}
              onChange={handleEditChange}
            />
            <select
              name="mood"
              value={editValues?.mood}
              onChange={handleEditChange}
            >
              <option value="">Please Choose your mood</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="angry">Angry</option>
              <option value="excited">Excited</option>
              <option value="tired">Tired</option>
              <option value="bored">Bored</option>
              <option value="relaxed">Relaxed</option>
              <option value="stressed">Stressed</option>
            </select>
            <select
              name="visibility"
              value={editValues?.visibility}
              onChange={handleEditChange}
            >
              <option value="">Please Choose your visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <button type="submit">
              {updateEntryLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        entries?.map(({ createdAt, _id, content, mood, visibility }) => {
          return (
            <div key={_id}>
              <p>
                <strong>Date:</strong> {createdAt}
              </p>
              <p>
                <strong>Content:</strong> {content}
              </p>
              <p>
                <strong>Mood:</strong> {mood}
              </p>
              <p>
                <strong>Visibility:</strong> {visibility}
              </p>
              <button onClick={() => handleEditEntry(_id)}>Edit</button>
              <br />
              <hr />
              <br />
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyEntries;
