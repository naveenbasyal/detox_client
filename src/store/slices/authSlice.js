import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bcrypt from "bcryptjs";
import fetchToken from "../../utils/fetchToken";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk(
  "registerUser",
  async (user, { rejectWithValue }) => {
    console.log("inside store", process.env.REACT_APP_SERVER_URL);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();
      console.log(data);
      if(data){
        return data;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);
export const loginUser = createAsyncThunk(
  "loginUser",
  async (user, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();
      console.log(data);
      // data?.message && toast(data?.message);
      // if (!data?.user) {
      //   return;
      // }
      data?.token && localStorage.setItem("token", data.token);
      if (data?.user && data?.user?.admin) {
        const adminStatus = "true";
        dispatch(setIsLogin(data?.user));

        const hashedAdminStatus = bcrypt.hashSync(adminStatus, 10);
        localStorage.setItem("admin", hashedAdminStatus);
      } else if (data?.user && !data?.user?.admin) {
        dispatch(setIsLogin(data?.user));

        const adminStatus = "false";
        const hashedAdminStatus = bcrypt.hashSync(adminStatus, 10);
        localStorage.setItem("admin", hashedAdminStatus);
      }
      dispatch(setIsLogin(data?.user));
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);

const initialState = {
  isLogin: fetchToken() ? true : false,
  userProfile: null,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutAuthSlice: (state) => {
      localStorage.removeItem("token");
      state.isLogin = false;
      state.userProfile = null;
      state.isAdmin = false;
    },
    setIsLogin(state, action) {
      state.isLogin = action.payload ? true : false;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setAdmin: (state, action) => {
      state.isAdmin = action.payload && action.payload?.user?.admin;
    },
  },
  extraReducers: (builder) => {
    builder
      // ____________ Register User ______________
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //  _____________ Login User ______________
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.userProfile = action.payload?.user;
        state.isAdmin = action.payload?.user?.admin ? true : false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAuthSlice, setIsLogin, setUserProfile, setAdmin } =
  authSlice.actions;
export default authSlice.reducer;
