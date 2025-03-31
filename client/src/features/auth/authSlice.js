import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProfileAPI, loginUser, logout, registerUser } from "../../api/authapi";

// Thunk to fetch the logged-in user's profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProfileAPI();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for logging in
export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for registering a new user
export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await registerUser(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for logging out
export const performLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const data = await logout();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  loading: false,
  error: null,
  logoutStatus: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(performLogout.pending, (state) => {
        state.logoutStatus = 'loading';
      })
      .addCase(performLogout.fulfilled, (state) => {
        state.logoutStatus = 'succeeded';
        state.user = null;
        localStorage.removeItem('user');
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.logoutStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
