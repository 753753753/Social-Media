import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getprofile, getUserProfile, updateprofile } from '../../api/authapi';

// Helper: Convert profilePicture Buffer to Base64 string.
const bufferToBase64 = (bufferObj) => {
  if (!bufferObj || !bufferObj.data) return "";
  const uint8Arr = new Uint8Array(bufferObj.data);
  let binary = "";
  uint8Arr.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

// Async thunk for fetching the logged-in user's profile.
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getprofile();

      // If the API returns an error object, reject the thunk.
      if (data.error) {
        return rejectWithValue(data.error);
      }

      // Convert profilePicture from byte array to Base64 if needed.
      if (data.profile?.profilePicture?.data) {
        const uint8Array = new Uint8Array(data.profile.profilePicture.data);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        data.profile.profilePicture = `data:image/png;base64,${base64String}`;
      }

      return data.profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating the logged-in user's profile.
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updateprofile(formData);

      if (data.error || !data.success) {
        return rejectWithValue(data.error || 'Error updating profile');
      }
      // Convert profilePicture from byte array to Base64 if needed.
      if (data.profile?.profilePicture?.data) {
        const uint8Array = new Uint8Array(data.profile.profilePicture.data);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        data.profile.profilePicture = `data:image/png;base64,${base64String}`;
      }
      return data.profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW: Async thunk for fetching another user's profile by their ID.
export const fetchUserProfileById = createAsyncThunk(
  'profile/fetchUserProfileById',
  async (userid, { rejectWithValue }) => {
    try {
      const data = await getUserProfile(userid);
      if (!data.getuserprofile) {
        throw new Error("No profile found");
      }
      // Convert profilePicture if needed.
      if (data.getuserprofile.profilePicture?.data) {
        const uint8Array = new Uint8Array(data.getuserprofile.profilePicture.data);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        data.getuserprofile.profilePicture = `data:image/png;base64,${base64String}`;
      }
      return data.getuserprofile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    // Logged in user's profile data.
    data: null,
    // For other users' profiles (like when viewing another user's profile).
    otherProfile: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {
    // Optionally, add reducers to reset errors or update success state.
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
    clearOtherProfile: (state) => {
      state.otherProfile = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProfile cases (logged-in user)
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProfile cases
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        // Optionally update the profile data with the new changes.
        if (action.payload && Object.keys(action.payload).length > 0) {
          state.data = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      // fetchUserProfileById cases (other user's profile)
      .addCase(fetchUserProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.otherProfile = action.payload;
      })
      .addCase(fetchUserProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUpdateStatus, clearOtherProfile } = profileSlice.actions;
export default profileSlice.reducer;
