import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { InspectUserProfile } from "../../store/slices/userSlice";

const InspectUser = () => {
  const id = useParams()?.id;
  const dispatch = useDispatch();
  const { inspectUserProfile: user, loading } = useSelector(
    (state) => state?.user
  );

  useEffect(() => {
    dispatch(InspectUserProfile(id));
  }, [id]);

  return (
    <div className="container mt-4">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <img
                src={user?.picture}
                alt=""
                className="rounded-circle me-3"
                style={{ width: "6rem", height: "6rem",objectFit:"cover" }}
              />
              <div>
                <h2 className="card-title">{user?.username}</h2>
                <p className="card-subtitle text-muted">Level: {user?.level}</p>
                <p className="card-subtitle text-muted">Score: {user?.points}</p>
              </div>
            </div>
            <hr />
            <h3>User Details</h3>
            <p className="card-text">Name: {user?.username}</p>
            <p className="card-text">Email: {user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectUser;
