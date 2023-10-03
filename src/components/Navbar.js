import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuthSlice } from "../store/slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import fetchToken from "../utils/fetchToken";
import { getUserProfile, logoutUserSlice } from "../store/slices/userSlice";
import { logoutEntrySlice } from "../store/slices/dailyEntriesSlice";
import bcrypt from "bcryptjs";
import { logoutChallengesSlice } from "../store/slices/challengesSlice";
import brand_logo from "../assets/images/favicon.png";
import io from "socket.io-client";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  AccountCircleTwoTone,
  AdminPanelSettings,
  Chat,
  Explore,
  HomeRounded,
  Leaderboard,
  NotesRounded,
  Person2Rounded,
} from "@mui/icons-material";
import "./Styles/Navbar.css";

const Navbar = () => {
  const id = fetchToken()?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let menuRef = useRef();

  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  // for chats
  const [unreadMessageCount, setUnreadMessageCount] = useState(0); // State to store unread message count
  const socket = io(process.env.REACT_APP_SERVER_PORT, {
    transports: ["websocket"],
  });
  // auth
  const { isLogin } = useSelector((state) => state?.auth);
  const { userProfile } = useSelector((state) => state?.user);
  const userImage = userProfile?.picture;

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // Retrieve unread message count from local storage
  useEffect(() => {
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
    console.log("res", res);
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

    setUnreadMessageCount(0); // Reset the unread message count in state
    navigate("/login");
  };

  useEffect(() => {
    id && dispatch(getUserProfile(id));
  }, [id]);
  return (
    <>
      <nav
        className="navbar-light py-3"
        style={{
          position: "sticky",
          top: "0",
          zIndex: "100",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="container d-flex align-items-center">
          <Link
            to="/"
            className="d-flex align-items-center justify-content-center navbar-brand fw-bold"
          >
            <LazyLoadImage src={brand_logo} alt="DeToxifyMe" height="39px" />
            <strong
              className="fs-3p ms-2 fw-bolder"
              style={{ letterSpacing: "1.7px" }}
            >
              Detoxify<span className="active-link">Me</span>
            </strong>
          </Link>

          <div
            className="d-flex set"
            style={{ position: "absolute", right: "10rem" }}
          >
            <div className="desktop p-1 me-5">
              <ul
                className="m-0 d-flex fw-bold "
                style={{ fontSize: "17px", letterSpacing: ".7px" }}
              >
                {isLogin && (
                  <>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname === "/" ? "active-link" : ""
                        }`}
                        to="/"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname === "/myentries"
                            ? "active-link"
                            : ""
                        }`}
                        to="/myentries"
                      >
                        My Entries
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname === "/leaderboard"
                            ? "active-link"
                            : ""
                        }`}
                        to="/leaderboard"
                      >
                        LeaderBoard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname === "/explore" ? "active-link" : ""
                        }`}
                        to="/explore"
                      >
                        Explore
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          location.pathname === "/chat" ? "active-link" : ""
                        }`}
                        to="/chat"
                        onClick={() => {
                          setUnreadMessageCount(0);
                          localStorage.removeItem("unreadMessageCount");
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          Chat
                          {unreadMessageCount > 0 && (
                            <span
                              className="badge-count bg-danger"
                              style={{
                                padding: "0.15rem 0.45rem",
                              }}
                            >
                              {unreadMessageCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                    {admin === true && (
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${
                            location.pathname === "/challenges"
                              ? "active-link"
                              : ""
                          }`}
                          to="/challenges"
                        >
                          Admin
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
            {/* ___________ Image dropdown ___________ */}
            <div className="menu-container" ref={menuRef}>
              <div
                className="menu-trigger"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                {userImage ? (
                  <LazyLoadImage
                    src={userImage}
                    alt="User Profile"
                    className="me-3 rounded-circle"
                    width="34px"
                    effect="blur"
                    height="34px"
                    style={{
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <AccountCircleTwoTone
                    color="red"
                    className="rounded-circle"
                    style={{
                      width: "34px",
                      background: "#c4c3c3",
                      color: "#4b4b4b",
                      height: "34px",
                    }}
                  />
                )}
              </div>

              <div
                className={`dropdown-menus ${open ? "actives" : "inactive"}`}
              >
                <h3 className="text-dark">
                  {userProfile?.username}
                  <br />
                </h3>
                <ul>
                  <li className="dropdownItem">
                    <Link
                      className="text-decoration-none"
                      to={`/profile/${id}`}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <span
                        className={
                          location.pathname === `/profile/${id}`
                            ? "active-link"
                            : "text-dark"
                        }
                      >
                        <Person2Rounded />
                      </span>
                      &nbsp;
                      <span
                        className={
                          location.pathname === `/profile/${id}`
                            ? "active-link"
                            : "text-dark"
                        }
                      >
                        My Profile
                      </span>
                    </Link>
                  </li>
                  <li className="dropdownItem">
                    <Link
                      className="text-decoration-none"
                      to={`/myentries`}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <span
                        className={
                          location.pathname === `/myentries/`
                            ? "active-link"
                            : "text-dark"
                        }
                      >
                        <NotesRounded />
                      </span>
                      &nbsp;
                      <span
                        className={
                          location.pathname === `/myentries`
                            ? "active-link"
                            : "text-dark"
                        }
                      >
                        My Entries
                      </span>
                    </Link>
                  </li>
                  
                  {admin == true && (
                    <li className="dropdownItem">
                      <Link
                        className="text-decoration-none"
                        to="/challenges"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <span
                          className={
                            location.pathname === `/challenges`
                              ? "active-link "
                              : "text-dark "
                          }
                        >
                          <AdminPanelSettings />
                        </span>
                        &nbsp;
                        <span
                          className={
                            location.pathname === `/challenges`
                              ? "active-link "
                              : "text-dark "
                          }
                        >
                          Admin
                        </span>
                      </Link>
                    </li>
                  )}
                  <li className="dropdownItem">
                    <button
                      className="btn btn-danger text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* ------------ MobileNavbar -------------- */}
      <div className="container position-relative mobile ">
        <div
          className="mobile-menu position-fixed bottom-0 w-100 rounded-5"
          style={{
            backdropFilter: "blur(10px)",
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
            left: 0,
            right: 0,
            padding: ".5rem .6rem",
          }}
        >
          <ul className="d-flex justify-content-around fw-bold text-decoration-none list-unstyled">
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                <HomeRounded />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  location.pathname === "/myentries" ? "active" : ""
                }`}
                to="/myentries"
              >
                <NotesRounded />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  location.pathname === "/leaderboard" ? "active" : ""
                }`}
                to="/leaderboard"
              >
                <Leaderboard />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  location.pathname === "/explore" ? "active" : ""
                }`}
                to="/explore"
              >
                <Explore />
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link  ${
                  location.pathname === "/chat" ? "active" : ""
                }`}
                to="/chat"
                onClick={() => {
                  setUnreadMessageCount(0);
                  localStorage.removeItem("unreadMessageCount");
                }}
              >
                <div style={{ position: "relative" }}>
                  <Chat />
                  {unreadMessageCount > 0 && (
                    <span className="badge-count bg-danger">
                      {unreadMessageCount}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
