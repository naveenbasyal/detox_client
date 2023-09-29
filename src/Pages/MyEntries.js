import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDailyEntries,
  updateEntryById,
} from "../store/slices/dailyEntriesSlice";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Loader from "../components/Loader";
import { formatDistanceToNow } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import MoodIcon from "@mui/icons-material/Mood";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
      <h1 className="fw-bold card-header mb-4">My Entries</h1>
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
        <Loader />
      ) : (
        entries?.map(({ createdAt, _id, content, mood, visibility }) => {
          if (createdAt) {
            var timeAgo = formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            });
          }

          const moodEmoji =
            mood === "happy"
              ? "😄"
              : mood === "sad"
              ? "😢"
              : mood === "angry"
              ? "😠"
              : mood === "excited"
              ? "🤩"
              : mood === "tired"
              ? "😴"
              : mood === "bored"
              ? "😐"
              : mood === "relaxed"
              ? "😌"
              : mood === "stressed"
              ? "😫"
              : "";

          const visibilityEmoji =
            visibility === "public"
              ? "🌎"
              : visibility === "private"
              ? "🔒"
              : "";

          return (
            <Card key={_id} className="my-3">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <strong>
                    <VisibilityIcon /> Visibility:
                  </strong>
                  <span className="ms-1">
                    {visibility} {visibilityEmoji}
                  </span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>
                    <EditIcon /> Content:
                  </strong>
                  <span className="ms-1">{content}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>
                    <MoodIcon /> Mood:
                  </strong>
                  <span className="ms-1">
                    {mood} {moodEmoji}
                  </span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>
                    <span role="img" aria-label="Date Posted">
                      📅
                    </span>
                    Date Posted:
                  </strong>
                  <span className="ms-1">{timeAgo}</span>
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditEntry(_id)}
                className="mb-3  ms-4 text-sm"
              >
                Edit
              </Button>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default MyEntries;
