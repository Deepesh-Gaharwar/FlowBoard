import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
};

const projectSlice = createSlice({
  name: "project",

  initialState,

  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },

    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProjects, setCurrentProject, setLoading } =
  projectSlice.actions;

export default projectSlice.reducer;
