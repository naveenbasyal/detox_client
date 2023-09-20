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
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h2>User Profile</h2>
          <img src={user?.picture} alt="" style={{ width: "4rem" }} />
          <h3>Level: {user?.level}</h3>
          <h3>Points: {user?.points}</h3>
          <p>Name: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </>
      )}
    </div>
  );
};

export default InspectUser;
