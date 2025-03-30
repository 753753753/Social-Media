// src/features/posts/postSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getpost, getuserpost, uploadpost } from '../../api/authapi';

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getuserpost();
      if (result?.userpost) {
        const updatedPosts = result.userpost.map((post) => {
          try {
            if (post.image?.data && Array.isArray(post.image.data)) {
              // Convert Buffer to Base64
              const uint8Array = new Uint8Array(post.image.data);
              const base64String = btoa(
                uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), "")
              );

              return {
                ...post,
                image: `data:image/png;base64,${base64String}`,
              };
            }
            return { ...post, image: null };
          } catch (error) {
            console.error("Error processing post image:", error, post.image);
            return { ...post, image: null }; // Ensure post doesn't break if image processing fails
          }
        });

        const count = result.count !== undefined ? result.count : updatedPosts.length;
        return { posts: updatedPosts, count };
      } else {
        return rejectWithValue("No posts found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to create (upload) a new post.
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await uploadpost(formData);
      if (data === true) {
        return data;
      } else {
        return rejectWithValue("Error uploading post");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch all posts.
export const fetchallPosts = createAsyncThunk(
  'posts/fetchallPosts',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getpost();
      if (result?.posts) {
        const updatedPosts = result.posts.map((post) => {
          if (post.image?.data) {
            const uint8Array = new Uint8Array(post.image.data);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            return {
              ...post,
              image: `data:image/png;base64,${base64String}`,
            };
          }
          return post;
        });
        return { allposts: updatedPosts };
      } else {
        return rejectWithValue("No posts found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch details for a single post.
export const fetchPostDetail = createAsyncThunk(
  'posts/fetchPostDetail',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://192.168.29.21:3000/post/getpostdetail/${postId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to fetch post detail");
      const data = await response.json();
      // Assuming API returns an array "posts" with one element.
      return data.posts[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch posts for another user (other user's posts).
// Notice: We accept a userid parameter from the caller.
export const fetchotherPosts = createAsyncThunk(
  'posts/fetchotherPosts',
  async (userid, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://192.168.9.226:3000/getuserposts/${userid}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error("Failed to fetch posts");
      const result = await response.json();
      if (result?.userpost) {
        const updatedPosts = result.userpost.map((post) => {
          if (post.image?.data) {
            const uint8Array = new Uint8Array(post.image.data);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            return {
              ...post,
              image: `data:image/png;base64,${base64String}`,
            };
          }
          return post;
        });
        return { otherposts: updatedPosts };
      } else {
        return rejectWithValue("No posts found");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    userPosts: [],
    allPosts: [],
    postDetail: null, // For a single post detail.
    // Optionally, you can store other user's posts in a separate key if desired.
    count: 0,
    loading: false,
    error: null,
    uploading: false,
    uploadError: null,
  },
  extraReducers: (builder) => {
    // fetchUserPosts
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.posts;
        state.count = action.payload.count;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createPost
      .addCase(createPost.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.uploading = false;
        // Optionally update userPosts if new post data is returned.
      })
      .addCase(createPost.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload;
      })
      // fetchallPosts
      .addCase(fetchallPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchallPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = action.payload.allposts;
      })
      .addCase(fetchallPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPostDetail
      .addCase(fetchPostDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetail = action.payload;
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchotherPosts
      .addCase(fetchotherPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchotherPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Here, you can store these posts in a separate key or merge them.
        // For this example, we'll store them in userPosts.
        state.userPosts = action.payload.otherposts;
      })
      .addCase(fetchotherPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
