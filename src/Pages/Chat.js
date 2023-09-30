import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userProfile: user } = useSelector((state) => state?.user);
  const socket = io("http://localhost:5000", { transports: ["websocket"] });
  const [loading, setLoading] = useState(false);

  // Function to fetch chat messages from the server
  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/chat/messages");
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("chat message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    fetchChatMessages();
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

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

  console.log(messages);
  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-8 col-sm-12 col-lg-5 my-3">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Welcome, {user?.username}!</h3>
            </div>
            <div
              className="card-body"
              style={{ height: "70vh", overflowY: "scroll" }}
            >
              <ul className="list-unstyled">
                {loading ? (
                  <Loader />
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
                        <img
                          src={messageData?.userImage}
                          className="mr-3 rounded-circle"
                          alt={messageData?.username}
                          style={{ width: "50px", height: "50px" }}
                        />
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
