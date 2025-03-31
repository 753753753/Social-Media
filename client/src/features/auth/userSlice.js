import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getallprofile } from '../../api/authapi';

// Thunk to fetch all user profiles.
export const fetchAllProfiles = createAsyncThunk(
  'users/fetchAllProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getallprofile();
      // Assuming API returns an object like { getallprofile: [ ... ] }
      return data.getallprofile; // This should be an array of profile objects.
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    profiles: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
