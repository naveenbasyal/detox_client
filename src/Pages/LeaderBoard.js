import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../store/slices/userSlice";
import { Link } from "react-router-dom";

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const { leaderboard: users, loading } = useSelector((state) => state?.user);

  useEffect(() => {
    if (!users) {
      dispatch(getAllUsers());
    }
  }, [users]);

  return (
    <div>
      <h2>LeaderBoard</h2>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <ol>
          {users?.map((user) => {
            return (
              <Link to={`/user/${user._id}`} key={user._id}>
                <li >
                  <img src={user.picture} alt="" style={{ width: "4rem" }} />
                  <p>
                    <strong>Name:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Level:</strong> {user.level}
                  </p>
                  <p>
                    <strong>Score:</strong> {user.points}
                  </p>
                  <hr />
                </li>
              </Link>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default LeaderBoard;
