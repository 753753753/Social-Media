// src/features/saves/saveSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getsavedpost, savedpost } from '../../api/authapi';

// Thunk to fetch saved posts data from the API
export const fetchSavedData = createAsyncThunk(
  'saves/fetchSavedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getsavedpost();
      // Assume the API returns an object with getsavedpost property (an array)
      const savedList = response.getsavedpost || [];
      
      // Build a lookup object from the saved posts array
      const savedMap = {};
      savedList.forEach((item) => {
        const postId = item.postId?._id;
        if (postId) {
          savedMap[postId] = true;
        }
      });
      
      // Return both the lookup object and the full array of saved posts
      return { savedMap, savedPostsArray: savedList };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to toggle save status for a given post
export const toggleSave = createAsyncThunk(
  'saves/toggleSave',
  async (postId, { getState, dispatch, rejectWithValue }) => {
    try {
      // Call the API to save (or unsave) the post
      await savedpost({ postId });
      // Optimistic update: get the current state
      const { saves } = getState();
      const currentSaved = saves.savedPosts[postId] || false;
      await dispatch(fetchSavedData())
      return { postId, toggleTo: !currentSaved };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const saveSlice = createSlice({
  name: 'saves',
  initialState: {
    savedPosts: {},        // Lookup object: { [postId]: true/false }
    savedPostsArray: [],   // Array of full saved post objects
    loading: false,
    error: null,
    hasFetchedsavedpost: false, // <-- Add this
  },
  reducers: {
    // Optional additional reducers
  },
  extraReducers: (builder) => {
    builder
      // fetchSavedData
      .addCase(fetchSavedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedData.fulfilled, (state, action) => {
        state.loading = false;
        state.savedPosts = action.payload.savedMap;
        state.savedPostsArray = action.payload.savedPostsArray;
        state.hasFetchedsavedpost = true; // <-- Mark as fetched
      })
      .addCase(fetchSavedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // toggleSave
      .addCase(toggleSave.fulfilled, (state, action) => {
        const { postId, toggleTo } = action.payload;
        state.savedPosts[postId] = toggleTo;
        // Optionally, you can update savedPostsArray here if you want to add or remove the post from the array.
        // For example:
        // if (toggleTo) {
        //   // Find the post in your other posts data and add it to savedPostsArray, if not already added.
        // } else {
        //   state.savedPostsArray = state.savedPostsArray.filter(item => item.postId?._id !== postId);
        // }
      })
      .addCase(toggleSave.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default saveSlice.reducer;
