import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk(
  "getUserProfile",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.user) {
        dispatch(setUserProfile(data.user));

        dispatch(setAdmin(data.user));
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const InspectUserProfile = createAsyncThunk(
  "InspectUserProfile",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.user) {
        dispatch(setInspectUserProfile(data.user));
      }
      return data?.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.users) {
        dispatch(setLeaderboard(data.users));
      }

      return data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "updateUserProfile",
  async (values, { rejectWithValue, dispatch }) => {
    const { id, picture, username } = values;
    console.log("values", values);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/users/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id, picture, username }),
        }
      );
      const data = await res.json();
      if (data.user) {
        dispatch(setUserProfile(data.user));
      }
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);

const initialState = {
  userProfile: null,

  inspectUserProfile: null,
  leaderboard: null,
  loading: false,
  editprofileLoading: false,
  admin: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.userProfile = action.payload;
    },
    setInspectUserProfile(state, action) {
      state.inspectUserProfile = action.payload;
    },
    setAdmin(state, action) {
      state.admin = action.payload.admin ? true : false;
    },
    setLeaderboard(state, action) {
      state.leaderboard = action.payload;
    },
    logoutUserSlice(state, action) {
      state.admin = false;
      state.userProfile = null;
    },
  },
  extraReducers: (builder) => {
    // _______GET USER PROFILE _______________

    builder
      .addCase(getUserProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // _______GET ALL USERS_______________
      .addCase(getAllUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // _______UPDATE USER PROFILE_______________
    builder
      .addCase(updateUserProfile.pending, (state, action) => {
        state.editprofileLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.editprofileLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.editprofileLoading = false;
        state.error = action.payload;
      });
  },
});
export const {
  setUserProfile,
  setLeaderboard,
  setInspectUserProfile,
  setAdmin,
  logoutUserSlice,
} = userSlice.actions;
export default userSlice.reducer;
