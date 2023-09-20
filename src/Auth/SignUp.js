import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.auth);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const success = dispatch(registerUser(user));
    if (success) {
      navigate("/login");
      setUser({
        username: "",
        email: "",
        password: "",
      });
    }
  };
  return (
    <div>
      <h2>SignUp</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          onChange={handleChange}
          value={user.username}
          placeholder="username"
          name="username"
        />
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
          {loading ? <span>Loading...</span> : <span>Sign Up</span>}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
