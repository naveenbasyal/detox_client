import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLoader from "../components/MainLoader";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const { id, token } = useParams();
  const navigate = useNavigate();
  const verifyUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/verify/${id}/${token}`
      );
      if (res?.status == 200) {
        toast.success(res?.data?.message, {
          theme: "dark",
          autoClose: 2000,
        });
        navigate("/login");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);
  return <div>{loading && <MainLoader />}</div>;
};

export default VerifyEmail;
