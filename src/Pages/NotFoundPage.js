import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
  };


  return (
    <div style={pageStyle}>
      <h1 className="text-danger" style={{fontSize:"6rem", fontWeight:"bold"}}>404</h1>
      <h3 className="mb-4" style={{fontWeight:"bold"}}>Page Not Found</h3>
      <Link to="/">
        <button className="text-uppercase btn btn-danger">Back to home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
