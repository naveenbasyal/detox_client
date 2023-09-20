import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuthSlice } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import fetchToken from "../utils/fetchToken";
import { getUserProfile, logoutUserSlice } from "../store/slices/userSlice";
import { logoutEntrySlice } from "../store/slices/dailyEntriesSlice";
import bcrypt from "bcryptjs";
import { logoutChallengesSlice } from "../store/slices/challengesSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state?.auth);
  const [admin, setAdmin] = useState(null);

  const id = fetchToken()?.id;

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
    <div>
      {isLogin && (
        <>
          <Link to={`/`}>Home</Link> --------
          <Link to={`/myentries`}>My Entries</Link>--------
          <Link to={`/profile/${id}`}>MyProfile</Link>--------
          <Link to={`/leaderboard`}>LeaderBoard</Link>---------
          <Link to={`/explore`}>Explore</Link>---------
          {admin === true && (
            <Link to={`/challenges`}>Admin(only for Admin)</Link>
          )}
          -------
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
