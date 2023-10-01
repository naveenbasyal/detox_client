import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import notifySound from "../assets/notify.mp3";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "../Styles/chat.css";
import "react-tooltip/dist/react-tooltip.css";
import { format } from "date-fns";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userProfile: user } = useSelector((state) => state?.user);
  const socket = io(process.env.REACT_APP_SERVER_PORT, {
    transports: ["websocket"],
  });
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/chat/messages`
      );
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    socket.on("chat message", (messageData) => {
      if (messageData.userId !== user?._id) {
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${messageData.username}: ${messageData.message}`,
            icon: messageData.userImage,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("New Message", {
                body: `<b>${messageData.username}</b>: ${messageData.message}`,
                icon: messageData.userImage,
              });
            } else {
              toast.info(
                `New message from ${messageData.username}: ${messageData.message}`
              );
            }
          });
        }
      }

      setMessages((prev) => [...prev, messageData]);
    });

    fetchChatMessages();
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    socket.emit("chat message", {
      message,
      userId: user?._id,
      username: user?.username,
      userImage: user?.picture,
      timestamp: Date.now(),
    });
    setMessage("");
  };
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="container mt-3">
      <Tooltip
        place="top"
        type="light"
        effect="solid"
        className="tooltip"
        backgroundColor="#fff"
        id="myTooltip"
      />
      <div className="row justify-content-center">
        <div className="col-md-8 col-sm-12 col-lg-5 mt-2 mb-1">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Welcome, {user?.username}!</h3>
            </div>
            <div
              className="card-body"
              style={{
                height: "70vh",
                overflowY: "scroll",
                background:
                  " #efe7dd url(https://cloud.githubusercontent.com/assets/398893/15136779/4e765036-1639-11e6-9201-67e728e86f39.jpg) repeat",
              }}
              ref={chatContainerRef}
            >
              <ul className="list-unstyled">
                {loading ? (
                  <Loader />
                ) : messages.length === 0 ? (
                  <div className="text-center">
                    <h4>No messages yet</h4>
                  </div>
                ) : (
                  messages?.map((messageData, index) => (
                    <li
                      key={index}
                      className={`media mb-3 d-flex ${
                        messageData?.userId === user?._id
                          ? " justify-content-end align-items-center"
                          : "align-items-center"
                      }`}
                    >
                      {/*  ------------- Image ----------- */}
                      {messageData?.userId !== user?._id && (
                        <Link
                          to={`/user/${messageData?.userId}`}
                          className="text-decoration-none"
                        >
                          <img
                            src={messageData?.userImage}
                            className="mr-3 rounded-circle"
                            alt={messageData?.username}
                            style={{
                              width: "40px",
                              height: "40px",
                              border: "1px solid #000",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                      )}
                      <div
                        style={{ maxWidth: "60%", minWidth: "30%" }}
                        className="media-body d-flex flex-column ms-2  p-2 border-1 border-dark"
                      >
                        <span
                          data-tooltip-content={format(
                            new Date(messageData?.timestamp),
                            "MMMM dd, yyyy h:mm a"
                          )}
                          data-tooltip-id="myTooltip"
                          style={{
                            background:
                              messageData?.userId === user?._id
                                ? "#e1ffc7"
                                : "#fff",

                            borderRadius: "5px 0px 5px 5px",
                            padding: "0.3rem 0.5rem",
                          }}
                          className={`d-flex flex-column ${
                            messageData?.userId === user?._id
                              ? "received"
                              : "sent"
                          }`}
                        >
                          {/* _____ USERNAME _____ */}
                          {messageData?.userId !== user?._id && (
                            <span className="mt-0 text-muted">
                              {messageData?.username}
                            </span>
                          )}
                          {/* _____ Message _____ */}

                          <span>{messageData?.message}</span>

                          <p
                            style={{
                              position: "relative",
                            }}
                          >
                            <span
                              className="text-muted"
                              style={{
                                fontSize: "0.7rem",
                                position: "absolute",
                                right: "0",
                              }}
                            >
                              {new Date(messageData?.timestamp).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }
                              )}
                              &nbsp;
                              <i
                                style={{ fontSize: ".6rem" }}
                                className="fa-regular fa-clock fa-spin"
                              ></i>
                              &nbsp;{" "}
                            </span>
                          </p>
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="card-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
