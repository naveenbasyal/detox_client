import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuthSlice } from "../store/slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fetchToken from "../utils/fetchToken";
import { getUserProfile, logoutUserSlice } from "../store/slices/userSlice";
import { logoutEntrySlice } from "../store/slices/dailyEntriesSlice";
import bcrypt from "bcryptjs";
import { logoutChallengesSlice } from "../store/slices/challengesSlice";
import brand_logo from "../assets/images/brand.png";
import io from "socket.io-client";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  AccountCircleTwoTone,
  Person2Rounded,
  VerifiedUserRounded,
} from "@mui/icons-material";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // for chats
  const [unreadMessageCount, setUnreadMessageCount] = useState(0); // State to store unread message count
  const socket = io(process.env.REACT_APP_SERVER_PORT, {
    transports: ["websocket"],
  });

  // auth
  const { isLogin } = useSelector((state) => state?.auth);
  const { userProfile } = useSelector((state) => state?.user);

  const userImage = userProfile?.picture;

  const id = fetchToken()?.id;
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Retrieve unread message count from local storage
    const storedUnreadMessageCount = localStorage.getItem("unreadMessageCount");
    if (storedUnreadMessageCount !== null) {
      setUnreadMessageCount(parseInt(storedUnreadMessageCount, 10));
    }

    socket.on("chat message", (messageData) => {
      if (
        messageData.userId !== userProfile?._id &&
        location.pathname !== "/chat"
      ) {
        setUnreadMessageCount((prevCount) => prevCount + 1);
        // Save updated unread message count to local storage
        localStorage.setItem("unreadMessageCount", unreadMessageCount + 1);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [userProfile, location.pathname]);

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

  const handleLogout = () => {
    dispatch(logoutAuthSlice());
    dispatch(logoutUserSlice());
    dispatch(logoutEntrySlice());
    dispatch(logoutChallengesSlice());
    localStorage.removeItem("admin");
    // Clear the unread message count from local storage on logout
    localStorage.removeItem("unreadMessageCount");
    setUnreadMessageCount(0); // Reset the unread message count in state
    navigate("/login");
  };

  useEffect(() => {
    id && dispatch(getUserProfile(id));
  }, [id]);
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        position: "sticky",
        top: "0",
        zIndex: "100",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <LazyLoadImage src={brand_logo} alt="DeToxifyMe" height="42px" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fw-bold">
            {isLogin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myentries">
                    My Entries
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/profile/${id}`}>
                    My Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    LeaderBoard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/explore">
                    Explore
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/chat"
                    onClick={() => {
                      setUnreadMessageCount(0);
                      localStorage.removeItem("unreadMessageCount");
                    }}
                  >
                    Chat{" "}
                    {unreadMessageCount > 0 && ( // Display unread message count
                      <span className="badge bg-danger ms-2">
                        {unreadMessageCount}
                      </span>
                    )}
                  </Link>
                </li>
                {admin === true && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/challenges">
                      Admin (only for Admin)
                    </Link>
                  </li>
                )}
                <Link
                  className="nav-item mx-4 d-flex align-items-center justify-content-center"
                  to={`/profile/${userProfile?._id}`}
                >
                  {userImage ? (
                    <LazyLoadImage
                      src={userImage}
                      alt="User Profile"
                      className="me-3 rounded-circle"
                      width="34px"
                      height="34px"
                      style={{
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <AccountCircleTwoTone
                      color="red"
                      className="me-3 rounded-circle"
                      style={{
                        width: "34px",
                        background: "#c4c3c3",
                        color: "#4b4b4b",
                        height: "34px",
                      }}
                    />
                  )}
                </Link>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
