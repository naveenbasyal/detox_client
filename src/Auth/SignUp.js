import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice";
import {
  Avatar,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import brand_logo from "../assets/images/favicon.png";

import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import { LazyLoadImage } from "react-lazy-load-image-component";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.auth);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot be longer than 30 characters")
      .matches(
        /^[a-zA-Z][a-zA-Z0-9\s]*$/,
        "Username must start with a letter and contain only letters, numbers, and one space"
      ),
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email address format"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")

      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const success = await dispatch(registerUser(values));
      if (success) {
        // navigate("/login");
        setMessage(success?.payload?.message);
        formik.resetForm();
      } else {
        formik.setFieldError("password", "Invalid credentials");
        toast.error("Invalid credentials. Registration failed.", {
          autoClose: 5000,
          theme: "dark",
        });
      }
    },
  });

  const styles = {
    height: `calc(100vh - 4rem)`,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
      <section className="register-form d-flex flex-column" style={styles}>
        <Container component="main" maxWidth="xs">
          <Paper elevation={3} style={{ padding: "20px" }} className="card">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main", color: "white" }}>
                <LockOutlined />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                className="lev fw-bolder  fs-3"
              >
                Sign Up
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  variant="outlined"
                  InputProps={
                    show
                      ? {
                          endAdornment: (
                            <i
                              className="fa-solid fa-eye-slash text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShow(!show)}
                            ></i>
                          ),
                        }
                      : {
                          endAdornment: (
                            <i
                              className="fa-solid fa-eye"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShow(!show)}
                            ></i>
                          ),
                        }
                  }
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={show ? "text" : "password"}
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                {message && (
                  <div className="form-group">
                    <div className="text-danger">{message}</div>
                  </div>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="my-4"
                  color="primary"
                  disabled={!!loading || !!message}
                >
                  {loading ? (
                    <ThreeDots height={24} width={24} color="#fff" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
                <Grid container justifyContent="flex-end" className="mt-4">
                  <Grid item>
                    <Link to="/login" variant="body2" className="text-primary">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
        </Container>
      </section>
    </>
  );
};

export default SignUp;
