import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createChallenge = createAsyncThunk(
  "createChallenge",
  async (challenge, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/challenges/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(challenge),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data) {
        return data;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);
export const getAllChallenges = createAsyncThunk(
  "getAllChallenges",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/challenges/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (data && data.challenges) {
        dispatch(setChallenges(data.challenges));
      }

      return data?.challenges;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getChallengeById = createAsyncThunk(
  "getChallengeById",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/challenges/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateChallenge = createAsyncThunk(
  "updateChallenge",
  async (editedValues, { rejectWithValue, dispatch }) => {
    const { id, title, description, points, enddate } = editedValues;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/challenges/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id, title, description, points, enddate }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data && data.challenge) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteChallenge = createAsyncThunk(
  "deleteChallenge",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/challenges/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data) {
        return data;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  }
);
export const submitChallenge = createAsyncThunk(
  "submitChallenge",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/challenges/submit/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      data && console.log("submit", data);
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  challenges: [],
  singleChallenge: [],
  loading: false,
  createLoading: false,
  editLoading: false,
  deleteLoading: false,
  error: null,
};

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    logoutChallengesSlice(state, action) {
      state.challenges = [];
      state.singleChallenge = [];
    },
    setChallenges(state, action) {
      state.challenges = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ------- createChallenge -----------
    builder.addCase(createChallenge.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createChallenge.fulfilled, (state, action) => {
      state.createLoading = false;
      state.challenges = [action.payload?.challenge, ...state.challenges];
    });
    builder.addCase(createChallenge.rejected, (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
    });
    // ------- getAllChallenges -----------

    builder.addCase(getAllChallenges.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllChallenges.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getAllChallenges.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ------- getChallengeById -----------

    builder.addCase(getChallengeById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getChallengeById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleChallenge = action.payload;
    });
    builder.addCase(getChallengeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // ------- updateChallenge -----------

    builder.addCase(updateChallenge.pending, (state) => {
      state.editLoading = true;
    });
    builder.addCase(updateChallenge.fulfilled, (state, action) => {
      state.editLoading = false;
      const updatedChallenge = action.payload?.challenge;
      state.challenges = state.challenges?.map((challenge) => {
        if (challenge?._id === updatedChallenge?._id) {
          return updatedChallenge;
        }
        return challenge;
      });
    });
    builder.addCase(updateChallenge.rejected, (state, action) => {
      state.editLoading = false;
      state.error = action.payload;
    });
    // ------- deleteChallenge -----------

    builder.addCase(deleteChallenge.pending, (state) => {
      state.deleteLoading = true;
    });
    builder.addCase(deleteChallenge.fulfilled, (state, action) => {
      state.deleteLoading = false;
      state.challenges = state.challenges?.filter(
        (challenge) => challenge._id !== action.payload?.deletedChallengeId
      );
    });
    builder.addCase(deleteChallenge.rejected, (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    });
    // ------- submitChallenge -----------

    builder.addCase(submitChallenge.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(submitChallenge.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(submitChallenge.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setChallenges, logoutChallengesSlice } = challengesSlice.actions;
export default challengesSlice.reducer;
