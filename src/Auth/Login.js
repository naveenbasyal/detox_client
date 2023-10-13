import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, loginUser } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import {
  Email,
  LockOutlined,
  Mail,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { ThreeDots } from "react-loader-spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import brand_logo from "../assets/images/favicon.png";
import bcrypt from "bcryptjs";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state?.auth);
  const [loginSuccess, setLoginSuccess] = useState(false); // State to manage the success message
  const [show, setShow] = useState(false); // State to manage the password visibility
  const [message, setMessage] = useState("");
  const handleCloseSuccess = () => {
    setLoginSuccess(false);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const success = await dispatch(loginUser(values));

      if (success?.payload?.message) {
        setMessage(success?.payload?.message);
      }
      if (success?.payload?.user) {
        setLoginSuccess(true);
        navigate("/");
      }
    },
  });

  const continueWithGoogle = async (credentialResponse) => {
    console.log(credentialResponse);
    const profileDetails = jwtDecode(credentialResponse?.credential);
    console.log(profileDetails);
    const success = await dispatch(googleLogin(profileDetails));
    if (success?.payload?.message) {
      setMessage(success?.payload?.message);
    }
    if (success?.payload?.user) {
      setLoginSuccess(true);
      navigate("/");
    }
  };
  return (
    <>
      <div className=" my-4 d-flex align-items-center container ms-2 fs-2">
        <LazyLoadImage src={brand_logo} alt="DeToxifyMe" height="39px" />
        <strong
          className="fs-2 ms-2 fw-bolder"
          style={{ letterSpacing: "1.7px" }}
        >
          Detoxify<span className="active-link">Me</span>
        </strong>
      </div>
      <div
        style={{
          height: `calc(100vh - 4rem)`,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="lev"
      >
        <Container component="main" maxWidth="xs">
          <Paper elevation={3} style={{ padding: "20px" }} className="card">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlined />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                sx={{ mt: 2 }}
                className="text-light lev fw-bolder"
              >
                Login
              </Typography>
              <form
                onSubmit={formik.handleSubmit}
                style={{ width: "100%", marginTop: "20px" }}
              >
                <TextField
                  type="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Mail color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                  {...formik.getFieldProps("email")}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  type={show ? "text" : "password"}
                  label="Password"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        onClick={() => setShow(!show)}
                        position="end"
                        style={{ cursor: "pointer" }}
                      >
                        {show ? (
                          <VisibilityOff color="primary" />
                        ) : (
                          <Visibility color="secondary" />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  margin="normal"
                  {...formik.getFieldProps("password")}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                {message && <Typography color="error">{message}</Typography>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="text-white"
                  sx={{ mt: 2, mb: 1, background: "#1976D2" }}
                  disabled={loading}
                >
                  {loading ? (
                    <ThreeDots height={24} width={24} color="#FFFFFF" />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Grid container className="my-2">
                  <Grid item xs>
                    <Link
                      to="/forgot-password"
                      variant="body2"
                      className="text-primary"
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item xs>
                    <Link
                      to="/register"
                      variant="body2"
                      className="text-primary"
                    >
                      {"Create a new Account."}
                    </Link>
                  </Grid>
                </Grid>
                <hr />
                {/* _______ Google Login _________ */}
                <Grid container className="my-3 d-flex justify-content-center">
                  <Grid
                    item
                    xs={12}
                    md={12}
                    className="d-flex justify-content-center"
                  >
                    <GoogleLogin
                      size="large"
                      shape="pill"
                      text="continue_with"
                      width={250}
                      onSuccess={(credentialResponse) => {
                        continueWithGoogle(credentialResponse);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default Login;
