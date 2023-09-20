import { decodeToken, isExpired } from "react-jwt";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = decodeToken(token);
    console.log("decodedToken", decodedToken);
    if (isExpired(token)) {
      localStorage.removeItem("token");
      return null;
    } else {
      return decodedToken;
    }
  } else {
    return null;
  }
};

export default getToken;
