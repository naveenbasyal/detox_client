import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../store/slices/userSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const { leaderboard: users, loading } = useSelector((state) => state?.user);

  useEffect(() => {
    if (!users) {
      dispatch(getAllUsers());
    }
  }, [users]);

  return (
    <div className="container">
      <h2 className="mt-4 mb-3 fw-bold">LeaderBoard</h2>
      {loading ? (
        <Loader />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Level</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr key={user._id}>
                <td className="d-flex align-items-center">
                  <img
                    src={user.picture}
                    alt={user.username}
                    className="me-3 rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <Link
                    to={`/user/${user._id}`}
                    className="text-decoration-none text-black"
                  >
                    <h5 className="me-5">{user.username}</h5>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderBoard;
