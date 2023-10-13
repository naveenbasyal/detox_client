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
import { format, set } from "date-fns";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MainLoader from "../components/MainLoader";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = format(date, "dd/MM/yyyy HH:mm a  ");
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

    toast.success(response?.payload?.message);
    setEditModalOpen(false);
  };
  // _____________ DELETION PART _____________

  const handleDeleteChallenge = async (id) => {
    const res = await dispatch(deleteChallenge(id));
    toast.success(res?.payload?.message);
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
    enddate: Yup.date().required("End Date is required"),
  });

  return (
    <div className="container mt-4">
      {/* Create Challenge */}
      {loading ? (
        <MainLoader />
      ) : (
        <div className="row justify-content-between">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <h2 className="fw-bolder mb-2">Create Challenge</h2>
            <Formik
              initialValues={{
                title: "",
                description: "",
                points: 10,
                enddate: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const res = await dispatch(createChallenge(values));
                toast(res?.payload?.message);
                resetForm();
              }}
            >
              {({ values, handleChange, setFieldValue }) => (
                <Form className="mb-4 py-4 px-3 card">
                  <div className="mb-2">
                    <label htmlFor="title" className=" form-label text-light">
                      Title
                    </label>
                    <Field
                      type="text"
                      id="title"
                      placeholder="Enter title"
                      name="title"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <hr />
                  <div className="mb-2">
                    <label
                      htmlFor="description"
                      className=" form-label text-light"
                    >
                      Description
                    </label>

                    <ReactQuill
                      className="text-white"
                      name="description "
                      id="description"
                      placeholder="Enter Description properly"
                      theme="snow"
                      onChange={(value) => setFieldValue("description", value)}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                      ]}
                    />

                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <hr />

                  <div className="mb-2">
                    <label htmlFor="points" className=" form-label text-light">
                      Points
                    </label>
                    <Field
                      type="number"
                      placeholder="Enter points"
                      id="points"
                      name="points"
                      className="form-control text-dark"
                    />
                    <ErrorMessage
                      name="points"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <hr />

                  <div className="mb-2">
                    <label htmlFor="enddate" className=" form-label text-light">
                      End Date
                    </label>
                    <Field
                      type="date"
                      id="enddate"
                      name="enddate"
                      className="form-control text-dark"
                    />

                    <ErrorMessage
                      name="enddate"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <hr />

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={createLoading}
                  >
                    {createLoading ? "Creating..." : "Create Challenge"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="col-lg-5 col-md-6 col-sm-12 challenge ">
            <h2 className="fw-bolder card-header">All Challenges</h2>
            {challenges?.length === 0 && (
              <p className="text-center mb-4">
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
                <div key={_id} className="mb-4 p-3 card">
                  <h4 className="pb-2">
                    <strong>Title: </strong>
                    {title}
                  </h4>
                  <hr />
                  <strong className="text-muted">Description: </strong>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  ></div>
                  <hr />

                  <p>
                    <strong>Start Date : </strong>{" "}
                    {formatDate(startdate, "dd/MM/yyyy")}
                  </p>
                  <hr />

                  <p>
                    <strong>End Date : </strong> {formatDate(enddate)}
                  </p>
                  <hr />

                  <p>
                    <strong>Points:</strong> {points}
                  </p>
                  <hr />

                  <div className="d-flex">
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
              <div className="mb-2 ">
                <label htmlFor="title" className="form-label text-dark">
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="form-control text-dark"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="description" className="form-label text-dark">
                  Description
                </label>
                <Field
                  as="textarea"
                  rows="5"
                  id="description"
                  name="description"
                  className="form-control text-dark"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="points" className="form-label text-dark">
                  Points
                </label>
                <Field
                  type="number"
                  id="points"
                  name="points"
                  className="form-control text-dark"
                />
                <ErrorMessage
                  name="points"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="enddate" className="form-label text-dark">
                  End Date
                </label>
                <Field
                  type="date"
                  id="enddate"
                  name="enddate"
                  className="form-control text-dark"
                />
              </div>
              <DialogActions>
                <Button onClick={handleCloseEditModal} className="text-dark">
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
        style={{ width: "100%" }}
      >
                <div className="fs-5 fw-bold px-3 mt-3 text-secondary">Confirm Delete</div>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this challenge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} className="text-dark">
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
