// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import commentReducer from '../features/auth/commentSlice'; // Import commentReducer
import likeReducer from '../features/auth/likeSlice';
import postReducer from '../features/auth/postSlice';
import profileReducer from '../features/auth/profileSlice';
import saveReducer from '../features/auth/saveSlice';
import userReducer from '../features/auth/userSlice'; // <-- new slice
import followReducer from '../features/auth/followSlice'; // <-- new slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    posts: postReducer,
    likes: likeReducer,
    saves: saveReducer,
    comments: commentReducer, // Now added properly
    users: userReducer, // <-- add here
    follows : followReducer
  },
});

export default store;
