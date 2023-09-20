import { decodeToken, isExpired } from "react-jwt";

const fetchToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = decodeToken(token);
    if (isExpired(token)) {
      localStorage.removeItem("token");
      return null;
    } else {
      return decodedToken.id && decodedToken.email ? decodedToken : null;
    }
  } else {
    return null;
  }
};

export default fetchToken;
