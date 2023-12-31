import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "../Styles/chat.css";
import "react-tooltip/dist/react-tooltip.css";
import { format } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userProfile: user } = useSelector((state) => state?.user);
  const socket = io(process.env.REACT_APP_SERVER_PORT, {
    transports: ["websocket"],
  });
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [sending, setSending] = useState(false);

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
      setSending(false);
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
                body: `${messageData.username}: ${messageData.message}`,
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
    setSending(true);

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
    <div className="container mt-2 mb-5">
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
              <h3 className="mb-0 text-white">Welcome, {user?.username}!</h3>
            </div>
            <div
              className="card-body chat-body"
              style={{
                height: "70vh",
                overflowY: "scroll",

                background:
                  " #efe7dd url(https://e1.pxfuel.com/desktop-wallpaper/461/478/desktop-wallpaper-whatsapp-dark-whatsapp-chat.jpg) repeat",
                backgroundSize: "cover",
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
                          <LazyLoadImage
                            src={messageData?.userImage}
                            className="mr-3 rounded-circle"
                            alt={messageData?.username}
                            effect="opacity"
                            height="40px"
                            width="40px"
                            style={{
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
                                ? "#005d4b"
                                : "#1f2c34",

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
                            <span className="mt-0 ">
                              {messageData?.username}
                            </span>
                          )}
                          {/* _____ Message _____ */}

                          <span className="text-light">
                            {messageData?.message}
                          </span>

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
                              {messageData?.userId === user?._id && (
                                <i
                                  style={{ fontSize: ".6rem" }}
                                  className="fa-regular fa-check-circle"
                                ></i>
                              )}
                            </span>
                          </p>
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="card-footer mb-3">
              <div className="input-group">
                <input
                  style={{
                    background: "#1f2c34",
                    border: "1px solid #000",
                  }}
                  type="text"
                  className="form-control text-light"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn "
                    style={{
                      background:"#00a884"
                    }}
                    type="button"
                    onClick={handleSendMessage}
                    disabled={sending}
                  >
                    {
                      <i
                        className={`fa-regular fa-paper-plane ${
                          sending && "fa-spin"
                        }`}
                      ></i>
                    }
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
