import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { followpost, getFollowStats, userfollowStats } from "../../api/authapi"; // Ensure getFollowStats is imported

export const fetchFollowStats = createAsyncThunk(
  "follows/fetchFollowStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFollowStats();
      // Expected response: { followedUsers, followingCount, followersCount , following }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchuserFollowStats = createAsyncThunk(
  "follows/fetchuserFollowStats",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userfollowStats(userId); // Pass userId directly, not as an object
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const toggleFollow = createAsyncThunk(
  "follows/toggleFollow",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const response = await followpost({ userId });
      // The API returns a key like follows (boolean)
      // Toggle the state locally:
      const { follows } = getState();
      const currentFollowed = follows.followedUsers[userId] || false;
      return { userId, toggleTo: !currentFollowed };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const followSlice = createSlice({
  name: "follows",
  initialState: {
    followedUsers: {}, // Mapping of user IDs to true/false
    following:{},
    follower:{},
    userfollowing:{},
    userfollower:{},
    followingCount: 0,
    followersCount: 0,
    loading: false,
    error: null,
    userfollowingCount: 0,
    userfollowersCount:0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowStats.fulfilled, (state, action) => {
        state.followedUsers = action.payload.followedUsers;
        state.followingCount = action.payload.followingCount;
        state.followersCount = action.payload.followersCount;
        state.following = action.payload.following;
        state.follower = action.payload.follower;
        state.loading = false;
      })
      .addCase(fetchFollowStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowStats.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { userId, toggleTo } = action.payload;
        state.followedUsers[userId] = toggleTo;
        // Update counts (optional) based on toggle result
        if (toggleTo) {
          state.followingCount += 1;
        } else {
          state.followingCount -= 1;
        }
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchuserFollowStats.fulfilled, (state, action) => {
        state.userfollowingCount = action.payload.userfollowingCount;
        state.userfollowersCount = action.payload.userfollowersCount;
        state.userfollowing = action.payload.userfollowing;
        state.userfollower = action.payload.userfollower;
        state.loading = false;
      })
      .addCase(fetchuserFollowStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchuserFollowStats.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export default followSlice.reducer;
