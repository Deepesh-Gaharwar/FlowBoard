import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  overview: null,
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    setOverview: (state, action) => {
      state.overview = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOverview, setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;
