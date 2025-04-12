// src/app/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // defaults to localStorage

import authReducer from '../features/auth/authSlice';
import commentReducer from '../features/auth/commentSlice';
import followReducer from '../features/auth/followSlice';
import likeReducer from '../features/auth/likeSlice';
import postReducer from '../features/auth/postSlice';
import profileReducer from '../features/auth/profileSlice';
import saveReducer from '../features/auth/saveSlice';
import userReducer from '../features/auth/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  posts: postReducer,
  likes: likeReducer,
  saves: saveReducer,
  comments: commentReducer,
  users: userReducer,
  follows: followReducer,
});

// Only persist specific slices if needed
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['posts' , 'saves'], // Only persist posts (you can add more if needed)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // These are required to make redux-persist work with RTK
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
