import React from "react";
import loader_img from "../assets/images/favicon.png";
import "./Styles/MainLoader.css"
const MainLoader = () => {

  return (
    <div className="loader">
      <img src={loader_img} alt="loading" />
    </div>
  );
};

export default MainLoader;
