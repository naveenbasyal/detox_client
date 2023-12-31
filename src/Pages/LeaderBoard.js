import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserProfile, getAllUsers } from "../store/slices/userSlice";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { AdminPanelSettings, Delete } from "@mui/icons-material";
import fetchToken from "../utils/fetchToken";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import MainLoader from "../components/MainLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const {
    leaderboard: users,
    loading,
    deleteUserLoading,
  } = useSelector((state) => state?.user);
  const { loading: entryLoading } = useSelector((state) => state?.dailyEntries);
  const [admin, setAdmin] = useState(null);
  const myId = fetchToken()?.id;
  const [toggleShowAll, setToggleShowAll] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    const res = bcrypt.compareSync(
      process.env.REACT_APP_ADMIN,
      localStorage.getItem("admin")
    );
    if (res) {
      setAdmin(true);
    }
  };

  useEffect(() => {
    if (!users) {
      dispatch(getAllUsers());
    }
  }, [users]);

  const deleteUser = (id) => {
    setUserIdToDelete(id);
    setOpenDialog(true);
  };

  const handleConfirmation = async () => {
    if (userIdToDelete) {
      const result = await dispatch(deleteUserProfile(userIdToDelete));
      if (result?.payload?.message) {
        toast.success(result?.payload?.message, {
          theme: "dark",
        });
      }
      setOpenDialog(false);
    }
  };

  return (
    <div className="container mb-5">
      <h2 className="mt-4 mb-3 fw-bold">LeaderBoard</h2>
      {loading || entryLoading ? (
        <MainLoader />
      ) : (
        <>
          {admin && (
            <div className="d-flex justify-content-end my-4">
              <button
                className="btn btn-primary text-white"
                onClick={() => setToggleShowAll(!toggleShowAll)}
              >
                {toggleShowAll ? "Show Verified Only" : "Show All"}
              </button>
            </div>
          )}
          <table className="table">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Level</th>
                <th scope="col">Score</th>
                {admin && <th scope="col">Delete</th>}
              </tr>
            </thead>
            <tbody>
              {toggleShowAll
                ? users?.map((user, index) => (
                    <tr key={user._id}>
                      {/* ________ UserImage __________ */}
                      <td className="d-flex align-items-center">
                        <LazyLoadImage
                          src={user.picture}
                          alt={user.username}
                          className="me-3 rounded-circle"
                          width="44px"
                          height="44px"
                          effect="blur"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        <Link
                          to={`/user/${user._id}`}
                          className="text-decoration-none text-black ms-3 d-flex"
                        >
                          <span className="me-1">{user.username}</span>
                        </Link>
                      </td>
                      {/* ________ Level __________ */}

                      <td>{user.level}</td>
                      {/* ________ points __________ */}

                      <td>
                        {user.points}{" "}
                        {/* {index === 0 ? (
                          <span role="img" aria-label="star">
                            🥇
                          </span>
                        ) : index === 1 ? (
                          <span role="img" aria-label="star">
                            🥈
                          </span>
                        ) : (
                          <span role="img" aria-label="star">
                            ⚡
                          </span>
                        )} */}
                      </td>

                      {admin ? (
                        <td>
                          {user?.admin ? (
                            <AdminPanelSettings
                              color="primary"
                              className="text-primary"
                            />
                          ) : (
                            <Delete
                              onClick={() => deleteUser(user._id)}
                              style={{ cursor: "pointer", color: "red" }}
                              color="red"
                              className="text-danger"
                            />
                          )}
                        </td>
                      ) : null}
                    </tr>
                  ))
                : users?.map(
                    (user, index) =>
                      user.verified && (
                        <tr key={user._id}>
                          {/* ________ UserImage __________ */}
                          <td className="d-flex align-items-center">
                            <LazyLoadImage
                              src={user.picture}
                              alt={user.username}
                              className="me-3 rounded-circle"
                              width="44px"
                              height="44px"
                              effect="blur"
                              style={{
                                objectFit: "cover",
                              }}
                            />
                            <Link
                              to={`/user/${user._id}`}
                              className="text-decoration-none text-black ms-3 d-flex"
                            >
                              <span className="me-1">{user.username}</span>
                            </Link>
                          </td>
                          {/* ________ Level __________ */}

                          <td>{user.level}</td>
                          {/* ________ points __________ */}

                          <td>
                            {user.points}{" "}
                            {/* {index === 0 ? (
                              <span role="img" aria-label="star">
                                🥇
                              </span>
                            ) : index === 1 ? (
                              <span role="img" aria-label="star">
                                🥈
                              </span>
                            ) : (
                              <span role="img" aria-label="star">
                                ⚡
                              </span>
                            )} */}
                          </td>

                          {admin ? (
                            <td>
                              {user?.admin ? (
                                <AdminPanelSettings
                                  color="primary"
                                  className="text-primary"
                                />
                              ) : (
                                <Delete
                                  onClick={() => deleteUser(user._id)}
                                  style={{ cursor: "pointer", color: "red" }}
                                  color="red"
                                  className="text-danger"
                                />
                              )}
                            </td>
                          ) : null}
                        </tr>
                      )
                  )}
            </tbody>
          </table>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <div className="fs-5 fw-bold px-3 mt-3 text-secondary">
          Confirm Delete
        </div>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} className="text-dark">
            Cancel
          </Button>
          <button
            onClick={handleConfirmation}
            className="btn btn-danger text-white"
          >
            {deleteUserLoading ? (
              <ThreeDots height={24} width={24} color="#000" />
            ) : (
              "Delete"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaderBoard;
