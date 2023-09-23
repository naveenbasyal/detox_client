import React from "react";
import { Puff } from "react-loader-spinner";

const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

      }}
    >
      <Puff
        height="80"
        width="80"
        radius={1}
        color="#B9B4C7"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
