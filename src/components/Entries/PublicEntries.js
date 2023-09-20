import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPublicEntries } from "../../store/slices/dailyEntriesSlice";
import { Link } from "react-router-dom";

const PublicEntries = () => {
  const dispatch = useDispatch();
  const { publicEntries, loading } = useSelector(
    ({ dailyEntries }) => dailyEntries
  );

  useEffect(() => {
    dispatch(getAllPublicEntries());
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        publicEntries?.map(
          ({
            content,
            createdAt,
            mood,
            visibility,
            _id,
            userId: { username, picture, level, points,_id:userId },
          }) => {
            return (
              <div key={_id}>
                <div className="userInfo" style={{ display: "flex",alignItems:"center" }}>
                  <Link to={`/profile/${userId}`}>
                      <img
                        src={picture}
                        alt="userImage"
                        loading="lazy"
                        style={{ width: "2.5rem", borderRadius: "50%" }}
                      />
                      <p>
                        <strong>{username}</strong> feeling <strong>{mood}</strong>
                      </p>
                  </Link>
                  {/* <p>&nbsp;
                    <strong>Level:</strong> {level}
                  </p>
                  <p>&nbsp;
                    <strong>Points:</strong> {points}
                  </p> */}
                </div>
                <p>
                  <strong>Date:</strong> {createdAt}
                </p>
                <p>
                  <strong>Message:</strong> {content}
                </p>
                {/* <p>
                  <strong>Mood:</strong> {mood}
                </p> */}
                {/* <p>
                  <strong>Visibility:</strong> {visibility}
                </p> */}
                <hr />
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default PublicEntries;
