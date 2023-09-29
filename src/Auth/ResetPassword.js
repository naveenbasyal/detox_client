import React, { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Password icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Confirm Password icon
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, id } = useParams();
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password does not match");
      return;
    }
    console.log(password);
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/resetpassword/${id}/${token}`,
        { password }
      );

      if (res?.status == 200) {
        alert(res?.data?.message);
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      }
      setLoading(false);

      console.log(res);
    } catch (err) {
      setLoading(false);
      console.log(err);
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
          <div>
            <LockIcon fontSize="large" />
          </div>
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              required
              InputProps={{
                endAdornment: <VpnKeyIcon color="action" fontSize="small" />,
              }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              InputProps={{
                endAdornment: (
                  <CheckCircleIcon color="action" fontSize="small" />
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={handleShowPasswordToggle}
                  color="primary"
                />
              }
              label="Show Passwords"
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              type="submit"
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

export default ResetPassword;
