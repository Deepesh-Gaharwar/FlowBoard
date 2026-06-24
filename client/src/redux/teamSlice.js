import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [],
  currentTeam: null,
  loading: false,
};

const teamSlice = createSlice({
  name: "team",

  initialState,

  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },

    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTeams, setCurrentTeam, setLoading } = teamSlice.actions;

export default teamSlice.reducer;
