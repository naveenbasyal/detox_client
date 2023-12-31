import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { InspectUserProfile } from "../../store/slices/userSlice";
import Loader from "../Loader";
// format createdAt
import { formatDistance, formatDistanceToNow } from "date-fns";
import {
  getAllEntriesForCalendar,
  getPublicEntriesById,
} from "../../store/slices/dailyEntriesSlice";
import MainLoader from "../MainLoader";
import Calendar from "../Entries/Calendar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const InspectUser = () => {
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
  const id = useParams()?.id;

  const dispatch = useDispatch();
  const {
    inspectUserProfile: user,
    loading,
    inspectLoading,
  } = useSelector((state) => state?.user);
  const {
    userPublicEntries,
    publicEntryLoading,
    entriesForCalendar: entries,
  } = useSelector(({ dailyEntries }) => dailyEntries);

  useEffect(() => {
    dispatch(InspectUserProfile(id));

    dispatch(getAllEntriesForCalendar(id));
    dispatch(getPublicEntriesById(id));
  }, [id]);

  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  return (
    <div className="container mt-4 mb-5">
      {inspectLoading ? (
        <MainLoader />
      ) : (
        user && (
          <>
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <LazyLoadImage
                    src={user?.picture}
                    alt={user?.username}
                    className="rounded-circle me-5"
                    width="100px"
                    height="100px"
                    effect="blur"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  <div className="ms-4">
                    <h2 className="card-title">{user?.username}</h2>
                    <p className="card-subtitle fs-5">
                      <strong>Level:</strong> {user?.level}
                    </p>
                    <p className="card-subtitle fs-5">
                      <strong>Score:</strong> {user?.points}
                    </p>
                  </div>
                </div>
                <hr />
                <h3 className="text-white fs-4 fw-lighter">User Details</h3>
                <p className="card-text fs-5">
                  <strong>Name : </strong> {user?.username}
                </p>
                <p className="card-text fs-5">
                  <strong>Email : </strong> &nbsp;
                  <a href="mailto:">{user?.email}</a>
                </p>
                <p className="card-text fs-5">
                  <strong>Joined on : </strong>
                  {user?.createdAt && isValidDate(user.createdAt)
                    ? formatDistance(new Date(user.createdAt), new Date(), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="my-3">
              <Calendar userProfile={user} entries={entries} />
            </div>
            {userPublicEntries?.length > 0 && (
              <div>
                <div className="my-4 text-center fs-5">
                  <strong>Entries by {user?.username}</strong>
                </div>
                <div className="row justify-content-around">
                  {userPublicEntries.length === 0 && (
                    <div className="text-muted text-center my-4">
                      No public entries yet.
                    </div>
                  )}
                  {userPublicEntries?.map(
                    ({ content, mood, visibility, createdAt, _id }) => {
                      const timeAgo = formatDistanceToNow(new Date(createdAt), {
                        addSuffix: true,
                      });
                      return (
                        <div
                          key={_id}
                          className="card mb-3 col-lg-5 col-md-5 col-sm-12"
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <p className="mb-0">
                                <strong className=" d-flex align-items-center">
                                  &nbsp;Feeling {moodEmojis[mood.toLowerCase()]}{" "}
                                  {mood}
                                  &nbsp;&nbsp;
                                  <i className="fa-regular fa-clock"></i>&nbsp;
                                  {timeAgo}
                                </strong>
                              </p>
                            </div>
                            <hr />

                            <p className="mb-0">
                              <strong>
                                <i className="fa-solid fa-message"></i>&nbsp;{" "}
                              </strong>
                              {"  "}
                              {content}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default InspectUser;
