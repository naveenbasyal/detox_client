import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Main from "./Pages/Main";
import AuthGuard from "./utils/AuthGuard";
import Navbar from "./components/Navbar";
import UserProfile from "./components/MyProfile";
import { useSelector } from "react-redux";
import LeaderBoard from "./Pages/LeaderBoard";
import Challenges from "./Pages/Challenges";
import ExploreChallenges from "./components/challenges/ExploreChallenges";
import GetSingleChallenge from "./components/challenges/getSingleChallenge";
import MyEntries from "./Pages/MyEntries";
import InspectUser from "./components/leaderboard/InspectUser";
import NotFoundPage from "./Pages/NotFoundPage";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
const App = () => {
  const { isLogin } = useSelector((state) => state?.auth);
  const { admin } = useSelector((state) => state?.user);
  return (
    <Router>
      {isLogin && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard authRequired={true}>
              <Main />
            </AuthGuard>
          }
        />
        <Route
          path="/myentries"
          element={
            <AuthGuard authRequired={true}>
              <MyEntries />
            </AuthGuard>
          }
        />
        {/* _______  Challenges: Only Admin can access this _______ */}
        {isLogin && admin && (
          <Route path="/challenges" element={<Challenges />} />
        )}
        {/* _______ CHALLENGES: user can see all the challenges _______ */}

        <Route
          path="/explore"
          element={isLogin ? <ExploreChallenges /> : <Login />}
        />
        {/* _________ Get SingleChallenge________ */}
        <Route
          path="/explore/challenge/:id"
          element={isLogin ? <GetSingleChallenge /> : <Login />}
        />
        {/* ________user profile ________ */}
        <Route
          path="/profile/:id"
          element={isLogin ? <UserProfile /> : <Login />}
        />
        {/* ________ Inspect User profile ________ */}
        <Route
          path="/user/:id"
          element={isLogin ? <InspectUser /> : <Login />}
        />
        {/*  __________ LeaderBoard ____________ */}
        <Route
          path="/leaderboard/"
          element={isLogin ? <LeaderBoard /> : <Login />}
        />
        {/*----------------- Public Routes -------------------*/}
        <Route
          path="/register"
          element={
            <AuthGuard authRequired={false}>
              <SignUp />
            </AuthGuard>
          }
        />
        <Route
          path="/login"
          element={
            <AuthGuard authRequired={false}>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthGuard authRequired={false}>
              <ForgotPassword />
            </AuthGuard>
          }
        />
        <Route
          path="/resetpassword/:id/:token"
          element={
            <AuthGuard authRequired={false}>
              <ResetPassword />
            </AuthGuard>
          }
        />
        {/* ___404 Routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
