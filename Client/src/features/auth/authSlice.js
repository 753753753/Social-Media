import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Thunk to fetch the logged-in user's profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://192.168.29.21:3000/check-auth', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return data; // Assuming data contains the user profile
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
      const response = await fetch('http://192.168.29.21:3000/logout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
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
      const response = await fetch('http://192.168.29.21:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      return data; // Assuming data contains the user profile/token
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
      const response = await fetch('http://192.168.29.21:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      const data = await response.json();
      return data; // Assuming data contains the user profile/token
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
  reducers: {
    // You can add synchronous reducers here if needed.
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProfile
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

      // Handle login
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

      // Handle register
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

      // Handle logout
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
