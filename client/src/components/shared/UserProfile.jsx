import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { fetchUserProfileById } from '../../features/auth/profileSlice';
import UserPost from '../ui/UserPost';
import UserProfileDetail from '../ui/UserprofileDetail';

function UserProfile() {
  const { userid } = useParams();
  const dispatch = useDispatch();
  const { otherProfile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    if (userid) {
      dispatch(fetchUserProfileById(userid));
    }
  }, [dispatch, userid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
          <div className="spinner"></div>
      </div>
  );
  }
  if (error) {
    return <div className="p-6 bg-black h-screen text-white">Error: {error}</div>;
  }
  if (!otherProfile) {
    return <div className="p-6 bg-black h-screen text-white">No profile found.</div>;
  }

  return (
    <div className="flex flex-col bg-black text-white min-h-screen">
      <UserProfileDetail userprofile={otherProfile} />
      <UserPost />
    </div>
  );
}

export default UserProfile;
