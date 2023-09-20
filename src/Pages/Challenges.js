import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  updateChallenge,
} from "../store/slices/challengesSlice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const Challenges = () => {
  const dispatch = useDispatch();
  const { loading, challenges, editLoading, deleteLoading } = useSelector(
    (state) => state?.challenges
  );

  useEffect(() => {
    dispatch(getAllChallenges());
  }, []);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    points: 10,
    enddate: "2023-12-20",
  });
  const [editChallenge, setEditChallenge] = useState({
    id: "",
    title: "",
    description: "",
    points: "",
    enddate: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteChallengeId, setDeleteChallengeId] = useState(null);

  // _____________ CREATION PART _____________

  const handleChange = (e) => {
    setNewChallenge({
      ...newChallenge,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    const res = await dispatch(createChallenge(newChallenge));
    alert(res?.payload?.message);
    setNewChallenge({
      title: "",
      description: "",
      points: 10,
      enddate: "",
    });
  };

  // _____________ EDITING PART _____________
  const handleEditChange = (e) => {
    setEditChallenge({
      ...editChallenge,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditChallenge = (id) => {
    setEditModalOpen(true);
    const challenge = challenges.find((challenge) => challenge._id === id);
    setEditChallenge({
      id,
      title: challenge.title,
      description: challenge.description,
      points: challenge.points,
      enddate: challenge.enddate,
    });
  };
  const handleSubmitEditedChallenge = async (e) => {
    e.preventDefault();
    console.log(editChallenge);
    const response = await dispatch(updateChallenge(editChallenge));
    alert(response?.payload?.message);
    setEditModalOpen(false);
  };
  // _____________ DELETION PART _____________

  const handleDeleteChallenge = async (id) => {
    const res = await dispatch(deleteChallenge(id));
    alert(res?.payload?.message);
    setDeleteModalOpen(false);
    setDeleteChallengeId(null);
  };

  // ___________ MODAL PART _____________

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const openDeleteModal = (id) => {
    setDeleteChallengeId(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteChallengeId(null);
  };

  return (
    <div>
      <h1>Challenges</h1>

      {/* Create Challenge */}
      <form onSubmit={handleCreateChallenge}>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          name="title"
          id="title"
          value={newChallenge.title}
          onChange={handleChange}
          placeholder="Enter Challenge title"
        />
        <br />
        <label htmlFor="description">Description: </label>
        <textarea
          type="text"
          rows={5}
          cols={50}
          name="description"
          id="description"
          value={newChallenge.description}
          onChange={handleChange}
          placeholder="Enter Challenge description"
        />
        <br />
        <label htmlFor="points">Points: </label>
        <input
          type="number"
          name="points"
          id="points"
          value={newChallenge.points}
          onChange={handleChange}
          placeholder="Enter Challenge points"
        />
        <br />
        <br />
        <label htmlFor="enddate">End Date: </label>
        <input
          type="date"
          name="enddate"
          id="enddate"
          value={newChallenge.enddate}
          onChange={handleChange}
          placeholder="Enter Challenge end date"
        />
        <br />
        <button type="submit">
          {loading ? "Creating ..." : "Create Challenge"}
        </button>
      </form>
      <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Challenge</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitEditedChallenge}>
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              id="title"
              value={editChallenge.title}
              onChange={handleEditChange}
              placeholder="Enter Challenge title"
            />
            <br />
            <label htmlFor="description">Description: </label>
            <textarea
              type="text"
              rows={5}
              cols={50}
              name="description"
              id="description"
              value={editChallenge.description}
              onChange={handleEditChange}
              placeholder="Enter Challenge description"
            />
            <br />
            <label htmlFor="points">Points: </label>
            <input
              type="number"
              name="points"
              id="points"
              value={editChallenge.points}
              onChange={handleEditChange}
              placeholder="Enter Challenge points"
            />
            <br />
            <br />
            <label htmlFor="enddate">End Date: </label>
            <input
              type="date"
              name="enddate"
              id="enddate"
              value={editChallenge.enddate}
              onChange={handleEditChange}
              placeholder="Enter Challenge end date"
            />
            <br />
            <button type="submit">
              {editLoading ? "Updating ..." : "Update "}
            </button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Deleting Modal */}
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this challenge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteChallenge(deleteChallengeId)}
            color="primary"
          >
            {deleteLoading ? "Deleting ..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* __________ All Challenges -------- */}

      {challenges?.map((challenge) => {
        if (challenge) {
          var { _id, title, description, startdate, enddate, points } =
            challenge;
        }
        return (
          <div key={_id}>
            <p>
              <strong>Name:</strong> {title}
            </p>
            <p>
              <strong>Description:</strong> {description}
            </p>
            <p>
              <strong>startdate:</strong> {startdate}
            </p>
            <p>
              <strong>enddate:</strong> {enddate}
            </p>
            <p>
              <strong>points:</strong> {points}
            </p>
            <button onClick={() => handleEditChallenge(_id)}>Edit</button>
            <button onClick={() => openDeleteModal(_id)}>Delete</button>

            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default Challenges;
