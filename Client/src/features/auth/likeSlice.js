import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getlikecount, getlikepost, likepost } from '../../api/authapi';

// Thunk to fetch like data. It expects an array of posts so we can build maps.
export const fetchLikeData = createAsyncThunk(
  'likes/fetchLikeData',
  async (posts, { getState, rejectWithValue }) => {
    try {
      // Get logged-in user's ID from auth state.
      const state = getState();
      // Adjust the path if your logged-in user is stored differently.
      const loggedInUserId = state.auth.user?.user?._id; 

      // Filter out posts created by the logged-in user.
      const filteredPosts = posts.filter(
        (post) => post._id.toString() !== loggedInUserId
      );

      // Fetch like counts from the API.
      const likecountData = await getlikecount();
      const likeList = likecountData.getlikecount || [];

      // Fetch liked posts data from the API.
      const likedDataResponse = await getlikepost();
      const likeData = likedDataResponse.getsavedlike || [];

      // Create lookup objects for like counts and liked status.
      const likeCountMap = {};
      const likedMap = {};

      // Build maps using the filtered posts.
      filteredPosts.forEach((post) => {
        likeCountMap[post._id] = likeList.filter(
          (like) => like.postId === post._id
        ).length;
        likedMap[post._id] = likeData.some(
          (liked) => liked.postId._id === post._id
        );
      });

      // Return both lookup maps and the filtered liked posts data.
      return { 
        likeCounts: likeCountMap, 
        likedPosts: likedMap,
        allLikedPosts: likeData.filter(
          (liked) => liked.postId && liked.postId.userId.toString() !== loggedInUserId
        )
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to toggle like for a given post.
export const toggleLike = createAsyncThunk(
  'likes/toggleLike',
  async (postId, { getState, rejectWithValue }) => {
    try {
      await likepost({ postId });
      const { likes } = getState();
      const currentLiked = likes.likedPosts[postId] || false;
      return { postId, toggleTo: !currentLiked };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likedPosts: {},    // { [postId]: true/false }
    likeCounts: {},    // { [postId]: number }
    allLikedPosts: [], // full array of liked posts from getlikepost API (filtered)
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchLikeData
      .addCase(fetchLikeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikeData.fulfilled, (state, action) => {
        state.loading = false;
        state.likeCounts = action.payload.likeCounts;
        state.likedPosts = action.payload.likedPosts;
        state.allLikedPosts = action.payload.allLikedPosts;
      })
      .addCase(fetchLikeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // toggleLike
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, toggleTo } = action.payload;
        state.likedPosts[postId] = toggleTo;
        const currentCount = state.likeCounts[postId] || 0;
        state.likeCounts[postId] = toggleTo ? currentCount + 1 : Math.max(0, currentCount - 1);
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
