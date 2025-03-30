import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addcomment, getcomment } from '../../api/authapi';

// Initial state holds a mapping of postId to comments array,
// plus loading and error flags.
const initialState = {
  commentsByPost: {}, // e.g., { 'postId1': [comment1, comment2], ... }
  loading: false,
  error: null,
};

// Thunk to fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const data = await getcomment(postId);
      // Assuming the API returns data in data.getcomment (an array)
      return { postId, comments: data.getcomment || [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to add a comment for a given post
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, commentText }, { rejectWithValue }) => {
    try {
      const response = await addcomment({ postId, comment: commentText });
      // Assuming the API returns an object with a "comment" property
      if (response && response.comment) {
        return { postId, comment: response.comment };
      } else {
        return rejectWithValue("Unexpected comment structure");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // You can add synchronous reducers if needed
    resetComments: (state) => {
      state.commentsByPost = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchComments cases
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comments } = action.payload;
        state.commentsByPost[postId] = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createComment cases
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comment } = action.payload;
        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId].push(comment);
        } else {
          state.commentsByPost[postId] = [comment];
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export any synchronous actions if needed.
export const { resetComments } = commentSlice.actions;

export default commentSlice.reducer;
