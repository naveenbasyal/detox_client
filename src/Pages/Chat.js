import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import notifySound from "../assets/notify.mp3";
import { Link } from "react-router-dom";

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
    });
    setMessage("");
  };
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-8 col-sm-12 col-lg-5 mt-2 mb-1">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Welcome, {user?.username}!</h3>
            </div>
            <div
              className="card-body"
              style={{ height: "70vh", overflowY: "scroll" }}
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
                      {messageData?.userId !== user?._id && (
                        <Link to={`/user/${messageData?.userId}`} className="text-decoration-none">
                        <img
                          src={messageData?.userImage}
                          className="mr-3 rounded-circle"
                          alt={messageData?.username}
                          style={{ width: "50px", height: "50px" }}
                          />
                          </Link>
                      )}
                      <div
                        style={{ maxWidth: "60%" }}
                        className="media-body d-flex flex-column ms-2 bg-light p-2 border-1 border-dark"
                      >
                        {messageData?.userId !== user?._id && (
                          <span className="mt-0 text-muted">
                            {messageData?.username}
                          </span>
                        )}
                        <span>{messageData?.message}</span>
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
