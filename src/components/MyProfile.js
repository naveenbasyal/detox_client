import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile } from "../store/slices/userSlice";
import axios from "axios";
import fetchToken from "../utils/fetchToken";

import { Box, Button, Input, InputLabel } from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import MainLoader from "./MainLoader";
import Calendar from "./Entries/Calendar";
import { getDailyEntries } from "../store/slices/dailyEntriesSlice";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { id } = fetchToken();
  const dispatch = useDispatch();
  const {
    userProfile: user,
    loading,
    editprofileLoading,
  } = useSelector((state) => state?.user);

  const [userValues, setUserValues] = useState({
    username: "",
    picture: "",
  });

  const [uploadProgress, setUploadProgress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile(id));
    dispatch(getDailyEntries());
  }, [id]);

  useEffect(() => {
    if (user) {
      setUserValues({
        username: user.username,
        picture: user.picture,
      });
    }
  }, [user]);

  const handleEditChange = (e) => {
    setUserValues({
      ...userValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    if (id !== user?._id) {
      alert("You can't edit someone else's profile");
      return;
    }
    const file = e.target.files[0];
    const formData = new FormData();
    setUploadProgress(0);
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_CLOUD_URL}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        }
      );

      dispatch(
        updateUserProfile({
          id,
          picture: response?.data?.url,
          username: userValues?.username,
        })
      );
      setUserValues({
        ...userValues,
        picture: response?.data?.url,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id !== user?._id) {
      alert("You can't edit someone else's profile");
      setIsEditing(false);
      setUploadProgress(null);
      return;
    }
    const res = await dispatch(updateUserProfile({ id, ...userValues }));

    if (res?.payload?.message) {
      toast.success(res?.payload?.message);
    } else {
      toast.error("Something went wrong");
    }
    setIsEditing(false);
    setUploadProgress(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 fw-bolder text-center">User Profile</h2>

      {loading ? (
        <MainLoader />
      ) : (
        <>
          <div className="row">
            <div className="col-lg-3 col-sm-12 col-md-4 mt-3 d-flex flex-column align-items-center ">
              <img
                src={userValues?.picture}
                alt=""
                className="img-fluid rounded-circle my-1"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  onChange={handleImageUpload}
                />
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadOutlined />}
                  className="ms-2 text-capitalize"
                  width="50%"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  Upload new image?
                </Button>
              </Box>
              {uploadProgress && (
                <div className="my-3">
                  {uploadProgress === 100 ? (
                    <p className="alert-success">Image Uploaded Successfully</p>
                  ) : (
                    <p className="alert alert-info">
                      Uploading Image..Please do not go back or refresh!!
                    </p>
                  )}
                  <div className="d-flex">
                    <progress
                      value={uploadProgress}
                      max="100"
                      className="mt-2"
                    />
                    <span>{uploadProgress && `${uploadProgress}%`}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-4 col-md-5 col-sm-12 mt-3 d-flex flex-column justify-content-center">
              <div>
                {isEditing ? (
                  <>
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userValues?.username}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={editprofileLoading}
                      className="btn btn-primary mt-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary mt-2 ms-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Username : </strong> {user?.username}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline-primary my-2"
                    >
                      Edit Username
                    </button>
                  </>
                )}
              </div>
              <p>
                <strong>Level :</strong> {user?.level}
              </p>
              <p>
                <strong>Points :</strong> {user?.points}
              </p>
              <p>
                <strong>Email :</strong> {user?.email}
              </p>
            </div>
          </div>

          {/*  _________ Calendar HeatMap _______ */}
          <div className="my-4">
            <Calendar />
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
