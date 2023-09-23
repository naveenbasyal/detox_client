import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ____________ Get Daily Entries ________________

export const getDailyEntries = createAsyncThunk(
  "getDailyEntries",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/daily-entries/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      return data.entries;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response);
    }
  }
);
// ____________ ALL Public Entries ________________
export const getAllPublicEntries = createAsyncThunk(
  "getAllPublicEntries",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/daily-entries/allpublicentries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      return data?.entry;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response);
    }
  }
);
// ____________ GEt Public Entries of Particular User while inspecting  ________________
export const getPublicEntriesById = createAsyncThunk(
  "getPublicEntriesById",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/daily-entries/publicEntry/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();

      return data?.publicEntry;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response);
    }
  }
);
export const createDailyEntries = createAsyncThunk(
  "createDailyEntries",
  async (values, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/daily-entries/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      console.log("new Entry Added", data?.entry);
      data?.entry && dispatch(getAllPublicEntries());
      return data?.entry;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response);
    }
  }
);
export const updateEntryById = createAsyncThunk(
  "updateEntryById",
  async (values, { rejectWithValue, dispatch }) => {
    const { id, content, mood, visibility } = values;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/daily-entries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id, content, mood, visibility }),
        }
      );
      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response);
    }
  }
);
const initialState = {
  dailyEntries: [],
  loading: false,
  publicEntries: [],
  userPublicEntries: [],
  createEntryLoading: false,
  updateEntryLoading: false,
  publicEntryLoading: false,
  error: null,
};

const dailyEntriesSlice = createSlice({
  name: "dailyEntries",
  initialState,
  reducers: {
    logoutEntrySlice(state) {
      state.dailyEntries = [];
      state.publicEntries = [];
      state.userPublicEntries = [];
    },
  },
  extraReducers: (builder) => {
    // ________ GET ALL DAILY ENTRIES ________

    builder
      .addCase(getDailyEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDailyEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyEntries = action.payload;
      })
      .addCase(getDailyEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ________ GET ALL PUBLIC ENTRIES ________

      .addCase(getAllPublicEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPublicEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.publicEntries = action.payload;
      })
      .addCase(getAllPublicEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ________ CREATE DAILY ENTRIES _______
      .addCase(createDailyEntries.pending, (state) => {
        state.createEntryLoading = true;
      })
      .addCase(createDailyEntries.fulfilled, (state, action) => {
        state.createEntryLoading = false;
        state.dailyEntries = [action.payload, ...state.dailyEntries];
      })
      .addCase(createDailyEntries.rejected, (state, action) => {
        state.createEntryLoading = false;
        state.error = action.payload;
      })
      // ________ UPDATE DAILY ENTRIES _______
      .addCase(updateEntryById.pending, (state) => {
        state.updateEntryLoading = true;
      })
      .addCase(updateEntryById.fulfilled, (state, action) => {
        state.updateEntryLoading = false;
        const updatedEntry = action.payload?.entry;
        state.dailyEntries = state.dailyEntries?.map((entry) =>
          entry._id === updatedEntry._id ? updatedEntry : entry
        );
      })
      .addCase(updateEntryById.rejected, (state, action) => {
        state.updateEntryLoading = false;
        state.error = action.payload;
      })
      .addCase(getPublicEntriesById.pending, (state) => {
        state.publicEntryLoading = true;
      })
      .addCase(getPublicEntriesById.fulfilled, (state, action) => {
        state.publicEntryLoading = false;
        state.userPublicEntries = action.payload;
      })
      .addCase(getPublicEntriesById.rejected, (state, action) => {
        state.publicEntryLoading = false;
        state.error = action.payload;
      });
    // ________ GET PUBLIC ENTRIES BY ID _______
  },
});
export const { logoutEntrySlice } = dailyEntriesSlice.actions;
export default dailyEntriesSlice.reducer;
