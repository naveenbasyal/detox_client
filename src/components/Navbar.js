import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuthSlice } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import fetchToken from "../utils/fetchToken";
import { getUserProfile, logoutUserSlice } from "../store/slices/userSlice";
import { logoutEntrySlice } from "../store/slices/dailyEntriesSlice";
import bcrypt from "bcryptjs";
import { logoutChallengesSlice } from "../store/slices/challengesSlice";
import brand_logo from "../assets/images/brand.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state?.auth);
  const { userProfile } = useSelector((state) => state?.user);

  const userImage = userProfile?.picture;

  
  const id = fetchToken()?.id;
  const [admin, setAdmin] = useState(null);

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
        <img src={brand_logo} alt="DeToxifyMe" style={{height:"42px"}}/>
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
                {admin === true && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/challenges">
                      Admin (only for Admin)
                    </Link>
                  </li>
                )}
                <Link
                  className="nav-item mx-4"
                  to={`/profile/${userProfile?._id}`}
                >
                  <img
                    src={userImage} // Display the user's image here
                    alt="User Profile"
                    className="me-3 rounded-circle"
                    style={{
                      width: "34px",
                      height: "34px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
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
