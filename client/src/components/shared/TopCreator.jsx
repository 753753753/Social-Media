import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFollowStats, toggleFollow } from "../../features/auth/followSlice";
import { fetchAllProfiles } from '../../features/auth/userSlice';
function TopCreator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profiles, loading, error } = useSelector((state) => state.users);
   const {userfollowingCount} = useSelector((state) => state.follows);
   
  // Get follow data from Redux store
  const { followedUsers} = useSelector((state) => state.follows);
  useEffect(() => {
    dispatch(fetchFollowStats());
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  // Handle follow/unfollow toggle
  const handleFollow = (userId) => {
    dispatch(toggleFollow(userId));
  };

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

  return (
    <div className="bg-[#000000] p-6 rounded-lg ml-[-10rem]">
      <h2 className="text-xl font-bold mb-6 text-white">Top Creators</h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {profiles.map((post) => (
          <div
            key={post?._id}
            className="flex flex-col items-center bg-black border border-[#101012] shadow-lg p-4 rounded-lg"
          >
            {/* Profile Picture */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white mb-2 cursor-pointer" onClick={() => navigate(`/user/${post?._id}`)} >
              {post.userProfile?.profilePicture ? (
                <img
                  src={
                    post.userProfile?.profilePicture
                      ? `data:image/png;base64,${post.userProfile.profilePicture}`
                      : "../images/profile.png"
                  }
                  alt={post.userProfile?.username || "User"}
                  onClick={() => navigate(`/user/${post?._doc?._id}`)} // ✅ Using correct user ID
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl md:text-2xl font-bold" onClick={() => navigate(`/user/${post?._doc?._id}`)}>
                  {post.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>

            {/* Name & Username */}
            <h3 className="text-white font-semibold text-md">{post?._doc?.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{post?.userProfile?.username || "@newuser"}</p>

            <button
              className={`px-4 py-1.5 transition cursor-pointer rounded-2xl ${followedUsers[post?._id]
                  ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                  : "bg-[#877EFF] text-white hover:bg-[#877EFF]"
                }`}
              onClick={() => handleFollow(post?._id)}
            >
              {followedUsers[post?._id] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>


    </div>

  )
}

export default TopCreator
