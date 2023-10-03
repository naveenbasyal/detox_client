import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/forgotpassword`,
        { email }
      );

      const data = res.data;
      console.log(data);
      setLoading(false);
      alert(data?.message);
      setMessage(data?.message);
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert(err?.response?.data?.message);
    }
  };

  return (
    <Container>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} sm={6}>
          <div className="d-flex align-items-center">
            <h2 className="fw-bold display-2">Forgot Password</h2>
            <LockIcon fontSize="large" />
          </div>
          <form onSubmit={handleResetPassword}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              color="primary"
              name="email"
              value={email}
              margin="normal"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <p className="fw-bold text-success ">{message && message}.</p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              type="submit"
              disabled={message || loading }
            >
              {loading ? (
                <ThreeDots height={24} width={24} color="#FFFFFF" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
