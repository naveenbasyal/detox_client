import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPublicEntries } from "../../store/slices/dailyEntriesSlice";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ThreeDots } from "react-loader-spinner";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

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

  const [visibleEntries, setVisibleEntries] = useState(5);

  useEffect(() => {
    dispatch(getAllPublicEntries());
  }, []);

  const handleShowMore = () => {
    setVisibleEntries(visibleEntries + 5);
  };

  return (
    <div
      className="mt-4"
      // style={{ height: "65vh", overflow: "scroll" }}
    >
      {loading ? (
        <ThreeDots
          height="64"
          width="64"
          radius="9"
          color="#B9B4C7"
          ariaLabel="three-dots-loading"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          wrapperClassName=""
          visible={true}
        />
      ) : (
        <>
          {publicEntries?.length === 0 ? (
            <p className="text-center my-5">No Posts to show !!</p>
          ) : (
            publicEntries
              ?.slice(0, visibleEntries)
              .map(
                ({
                  content,
                  createdAt,
                  mood,
                  _id,
                  userId: { username, picture, _id: userId },
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
                            <LazyLoadImage
                              src={picture}
                              alt="userImage"
                              effect="opacity"
                              className="rounded-circle me-3"
                              width="50px"
                              height="50px"
                              style={{
                                objectFit: "cover",
                              }}
                            />
                            <p className="mb-0 ms-2">
                              <strong className="text-black">{username}</strong>
                              <strong className="text-secondary">
                                &nbsp;is feeling{" "}
                                {moodEmojis[mood.toLowerCase()]} {mood}
                              </strong>
                            </p>
                          </Link>
                        </div>
                        <hr />
                        <p className="mb-0">
                          <strong>
                            <i className="fa-regular fa-clock"></i>&nbsp;
                          </strong>
                          {timeAgo}
                        </p>
                        <p className="mb-0">
                          <strong>
                            <i className="fa-solid fa-message"></i>&nbsp;{" "}
                          </strong>

                          {content}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
          )}

          {publicEntries?.length > 0 &&
            visibleEntries >= publicEntries?.length && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p className="text-center">You're all caught up!</p>
              </div>
            )}

          {visibleEntries < publicEntries?.length && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button onClick={handleShowMore} className="btn btn-primary mb-2">
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicEntries;
