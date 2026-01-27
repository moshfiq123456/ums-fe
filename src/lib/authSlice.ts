import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  hasLoggedOut: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  hasLoggedOut: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string | null; user: any | null }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.hasLoggedOut = false; // ✅ reset logout intent
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.hasLoggedOut = true; // ✅ mark explicit logout
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
