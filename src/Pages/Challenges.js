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
    <div className="container mt-4">
      {/* Create Challenge */}
      <div
        className="row justify-content-between
      "
      >
        <div className="col-lg-4 col-md-6 col-sm-12">
          <h2 className="fw-bolder">Create Challenge</h2>
          <form onSubmit={handleCreateChallenge} className="mb-4">
            <TextField
              label="Title"
              variant="standard"
              fullWidth
              name="title"
              value={newChallenge.title}
              onChange={handleChange}
            />
            <TextField
              label="Description"
              variant="standard"
              fullWidth
              multiline
              rows={4}
              name="description"
              value={newChallenge.description}
              onChange={handleChange}
            />
            <TextField
              label="Points"
              variant="standard"
              fullWidth
              type="number"
              name="points"
              value={newChallenge.points}
              onChange={handleChange}
            />
            <TextField
              label="End Date"
              variant="standard"
              fullWidth
              type="date"
              name="enddate"
              value={newChallenge.enddate}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="mt-2"
            >
              {loading ? "Creating..." : "Create Challenge"}
            </Button>
          </form>
        </div>
        <div className="col-lg-5 col-md-6 col-sm-12">
          {/* Display All Challenges */}
          <h2 className="fw-bolder">All Challenges</h2>
          {challenges?.map((challenge) => {
            if (challenge) {
              var {
                _id,
                title,
                description,
                createdAt: startdate,
                enddate,
                points,
              } = challenge;
            }
            return (
              <div key={_id} className="mb-4">
                <h4>
                  <strong>Title: </strong>
                  {title}
                </h4>
                <p>
                  <strong>Description: </strong>
                  {description}
                </p>
                <p>Start Date: {startdate}</p>
                <p>End Date: {enddate}</p>
                <p>Points: {points}</p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditChallenge(_id)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => openDeleteModal(_id)}
                >
                  Delete
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Challenge Modal */}
      <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Challenge</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmitEditedChallenge}>
            <TextField
              label="Title"
              variant="standard"
              fullWidth
              name="title"
              value={editChallenge.title}
              onChange={handleEditChange}
            />
            <TextField
              label="Description"
              variant="standard"
              fullWidth
              multiline
              rows={4}
              name="description"
              value={editChallenge.description}
              onChange={handleEditChange}
            />
            <TextField
              label="Points"
              variant="standard"
              fullWidth
              type="number"
              name="points"
              value={editChallenge.points}
              onChange={handleEditChange}
            />
            <TextField
              label="End Date"
              variant="standard"
              fullWidth
              type="date"
              name="enddate"
              value={editChallenge.enddate}
              onChange={handleEditChange}
            />
            <DialogActions>
              <Button onClick={handleCloseEditModal} color="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={editLoading}
              >
                {editLoading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Challenge Modal */}
      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this challenge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteChallenge(deleteChallengeId)}
            variant="contained"
            color="primary"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Challenges;
