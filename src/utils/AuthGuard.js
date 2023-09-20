import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import fetchToken from "./fetchToken";

const AuthGuard = ({ authRequired, children }) => {
  const navigate = useNavigate();
  const token = fetchToken();

  useEffect(() => {
    const handleRedirect = () => {
      if (authRequired && !token) {
        navigate("/login");
      }

      if (!authRequired && token) {
        navigate("/");
      }
    };

    handleRedirect();
  }, [authRequired, token, navigate]);

  return children;
};

export default AuthGuard;
