import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice";
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
import { toast } from "react-toastify";

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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f2f2f2",
      }}
      className="lev"
    >
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: "20px" }}>
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
              className="text-dark lev fw-bolder"
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
                  <Link to="/register" variant="body2" className="text-primary">
                    {"Create a new Account."}
                  </Link>
                </Grid>
              </Grid>
            </form>
            <Snackbar
              open={loginSuccess}
              autoHideDuration={2000} // Automatically close after 2 seconds
              onClose={handleCloseSuccess}
              message="Login Successful"
            />
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
