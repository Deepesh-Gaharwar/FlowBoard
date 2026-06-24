import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/authSlice";
import storageModule from "redux-persist/lib/storage";
import dashboardReducer from "./dashboardSlice";
import organizationReducer from "./organizationSlice";
import teamReducer from "./teamSlice";
import projectReducer from "./projectSlice";

const storage = storageModule.default;
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  organization: organizationReducer,
  team: teamReducer,
  project: projectReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
