import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import AuthLayout from './auth/AuthLayout';
import Login from './auth/form/Login';
import Register from './auth/form/Register';
import PostDetail from './components/shared/PostDetail';
import UserProfile from './components/shared/UserProfile';
import EditProfile from './components/ui/EditProfile';
import { fetchProfile } from './features/auth/authSlice';
import './index.css';
import Layout from './routes/Layout';
import CreatePost from './routes/createpost/CreatePost';
import Explore from './routes/explore/Explore';
import Home from './routes/home/Home';
import User from "./routes/people/User";
import ProfileLayout from './routes/profile/ProfileLayout';
import SavedPost from './routes/saved/SavedPost';
function App() {
  const dispatch = useDispatch();

  // On app load, check if the user is authenticated
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);


  return (
    <main className='font-grotesk h-screen'>
      <Routes>

        {/* Default route: redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<Layout />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfileLayout />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/saved" element={<SavedPost />} />
            <Route path="/people" element={<User />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/user/:userid" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
    </main>
  );
}

export default App;
