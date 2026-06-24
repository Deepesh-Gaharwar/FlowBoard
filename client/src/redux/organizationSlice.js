import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizations: [],
  currentOrganization: null,
  loading: false,
};

const organizationSlice = createSlice({
  name: "organization",

  initialState,

  reducers: {
    setOrganizations: (state, action) => {
      state.organizations = action.payload;
    },

    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrganizations, setCurrentOrganization, setLoading } =
  organizationSlice.actions;

export default organizationSlice.reducer;
