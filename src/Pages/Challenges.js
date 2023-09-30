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
import { format } from "date-fns";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MainLoader from "../components/MainLoader";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = format(date, "MMM d, yyyy HH'h' mm'm' ss's'");
  return formattedDate;
};

const Challenges = () => {
  const dispatch = useDispatch();
  const { loading, createLoading, challenges, editLoading, deleteLoading } =
    useSelector((state) => state?.challenges);

  useEffect(() => {
    dispatch(getAllChallenges());
  }, []);

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
  const handleSubmitEditedChallenge = async (values) => {
    const response = await dispatch(updateChallenge(values));
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

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    points: Yup.number()
      .min(5, "Points must be at least 5")
      .required("Points is required"),
  });

  return (
    <div className="container mt-4">
      {/* Create Challenge */}
      {loading ? (
        <MainLoader />
      ) : (
        <div
          className="row justify-content-between
      "
        >
          <div className="col-lg-4 col-md-6 col-sm-12">
            <h2 className="fw-bolder border card-header mb-2">
              Create Challenge
            </h2>
            <Formik
              initialValues={{
                title: "",
                description: "",
                points: 10,
                enddate: "31-Dec-2023",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const res = await dispatch(createChallenge(values));
                alert(res?.payload?.message);
                resetForm();
              }}
            >
              <Form className="mb-4 border p-2">
                <div className="mb-2">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="points" className="form-label">
                    Points
                  </label>
                  <Field
                    type="number"
                    id="points"
                    name="points"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="points"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="enddate" className="form-label">
                    End Date
                  </label>
                  <Field
                    type="date"
                    id="enddate"
                    name="enddate"
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createLoading}
                >
                  {createLoading ? "Creating..." : "Create Challenge"}
                </button>
              </Form>
            </Formik>
          </div>
          <div className="col-lg-5 col-md-6 col-sm-12">
            {/* Display All Challenges */}
            <h2 className="fw-bolder card-header">All Challenges</h2>
            {challenges?.length === 0 && (
              <p className="text-center my-4">
                You have no challenges yet. Please create one.
              </p>
            )}
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
                <div key={_id} className="my-4 p-3 border">
                  <h4 className="mb-4 border-bottom pb-2">
                    <strong>Title: </strong>
                    {title}
                  </h4>
                  <p>
                    <strong>Description: </strong>
                    {description}
                  </p>
                  <p>Start Date: {formatDate(startdate)}</p>
                  <p>End Date: {formatDate(enddate)}</p>
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
      )}
      {/* Edit Challenge Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Challenge</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editChallenge}
            validationSchema={validationSchema}
            onSubmit={handleSubmitEditedChallenge}
          >
            <Form>
              <div className="mb-2">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="points" className="form-label">
                  Points
                </label>
                <Field
                  type="number"
                  id="points"
                  name="points"
                  className="form-control"
                />
                <ErrorMessage
                  name="points"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="enddate" className="form-label">
                  End Date
                </label>
                <Field
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control"
                />
              </div>
              <DialogActions>
                <Button onClick={handleCloseEditModal} color="secondary">
                  Cancel
                </Button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editLoading}
                >
                  {editLoading ? "Updating..." : "Update"}
                </button>
              </DialogActions>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Delete Challenge Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        style={{ width: "50%" }}
      >
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
