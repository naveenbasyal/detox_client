import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPublicEntries } from "../../store/slices/dailyEntriesSlice";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThreeDots } from "react-loader-spinner";

const moodEmojis = {
  excited: "😃",
  normal: "😐",
  happy: "😊",
  sad: "😢",
  angry: "😡",
  tired: "😴",
  bored: "😕",
  relaxed: "😌",
  stressed: "😓",
};

const PublicEntries = () => {
  const dispatch = useDispatch();
  const { publicEntries, loading } = useSelector(
    ({ dailyEntries }) => dailyEntries
  );

  
  useEffect(() => {
    dispatch(getAllPublicEntries());
  }, []);

  return (
    <div className="container mt-4">
      {loading ? (
        <ThreeDots
          height="64"
          width="64"
          radius="9"
          color="#B9B4C7"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      ) : (
        publicEntries?.map(
          ({
            content,
            createdAt,
            mood,
            visibility,
            _id,
            userId: { username, picture, level, points, _id: userId },
          }) => {
            const timeAgo = formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
            });

            return (
              <div key={_id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/user/${userId}`}
                      className="text-decoration-none d-flex align-items-center"
                    >
                      <img
                        src={picture}
                        alt="userImage"
                        className="rounded-circle me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <p className="mb-0">
                        <strong className="text-black">{username}</strong>
                        <strong className="text-secondary">
                          &nbsp;is feeling {moodEmojis[mood.toLowerCase()]}{" "}
                          {mood}
                        </strong>
                      </p>
                    </Link>
                  </div>
                  <hr />
                  <p className="mb-0">
                    <strong>
                      <i class="fa-regular fa-clock"></i>&nbsp;
                    </strong>
                    {timeAgo}
                  </p>
                  <p className="mb-0">
                    <strong>
                      <i class="fa-solid fa-message"></i>&nbsp;{" "}
                    </strong>
                    {"  "}
                    {content}
                    
                  </p>
                </div>
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default PublicEntries;
