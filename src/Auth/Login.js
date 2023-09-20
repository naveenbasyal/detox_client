import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isLogin } = useSelector((state) => state?.auth);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const success = await dispatch(loginUser(user));
    console.log(success);
    if (success?.payload?.user) {
      navigate("/");
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          onChange={handleChange}
          value={user.email}
          placeholder="email"
          name="email"
        />
        <input
          type="text"
          placeholder="password"
          onChange={handleChange}
          value={user.password}
          name="password"
        />
        <button type="submit">
          {loading ? <span>Loading...</span> : <span>Login</span>}
        </button>
      </form>
    </div>
  );
};

export default Login;
