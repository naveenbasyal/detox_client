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
        toast.success(result?.payload?.message);
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
            {users?.map(
              (user, index) =>
                user.verified && (
                  <tr key={user._id}>
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

                    <td>{user.level}</td>
                    <td>
                      {user.points}{" "}
                      {index === 0 ? (
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
                      )}
                    </td>
                    {user?.admin ? (
                      <td>
                        <AdminPanelSettings color="primary" className="text-primary" />
                      </td>
                    ) : (
                      <td onClick={() => deleteUser(user._id)}>
                        <Delete style={{ cursor: "pointer", color: "red" }} color="red" className="text-danger"/>
                      </td>
                    )}
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} className="text-dark">
            Cancel
          </Button>
          <button onClick={handleConfirmation} className="btn btn-danger text-white">
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
