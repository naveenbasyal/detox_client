import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDailyEntries,
  updateEntryById,
} from "../store/slices/dailyEntriesSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

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
    if (isLogin && entries.length === 0) {
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
    alert(response?.payload?.message);
    setEditing(false);
  };

  return (
    <div className="container my-4">
      <h1 className="fw-bold mb-3">MyEntries</h1>
      {editing && (
        <Dialog open={editing} onClose={() => setEditing(false)}>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmitEditedEntry}>
              <TextField
                label="Content"
                variant="standard"
                fullWidth
                name="content"
                value={editValues?.content}
                onChange={handleEditChange}
              />
              <FormControl fullWidth variant="standard">
                <InputLabel>Mood</InputLabel>
                <Select
                  label="Mood"
                  name="mood"
                  value={editValues?.mood}
                  onChange={handleEditChange}
                >
                  <MenuItem value="">Please Choose your mood</MenuItem>
                  <MenuItem value="happy">Happy</MenuItem>
                  <MenuItem value="sad">Sad</MenuItem>
                  <MenuItem value="angry">Angry</MenuItem>
                  <MenuItem value="excited">Excited</MenuItem>
                  <MenuItem value="tired">Tired</MenuItem>
                  <MenuItem value="bored">Bored</MenuItem>
                  <MenuItem value="relaxed">Relaxed</MenuItem>
                  <MenuItem value="stressed">Stressed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="standard">
                <InputLabel>Visibility</InputLabel>
                <Select
                  label="Visibility"
                  name="visibility"
                  value={editValues?.visibility}
                  onChange={handleEditChange}
                >
                  <MenuItem value="">Please Choose your visibility</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
              <DialogActions>
                <Button onClick={() => setEditing(false)} color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={updateEntryLoading}
                >
                  {updateEntryLoading ? "Updating..." : "Submit"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditEntry(_id)}
                className="me-2"
              >
                Edit
              </Button>
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
