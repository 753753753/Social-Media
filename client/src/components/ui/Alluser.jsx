import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFollowStats, toggleFollow } from "../../features/auth/followSlice";

function Alluser({ users }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  // Get follow data from Redux store
  const { followedUsers } = useSelector((state) => state.follows);

  // Fetch follow stats when component mounts
  useEffect(() => {
    dispatch(fetchFollowStats());
  }, [dispatch]);

  // Handle follow/unfollow toggle
  const handleFollow = (userId) => {
    dispatch(toggleFollow(userId));
  };

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user?.userProfile?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by username..."
        className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#877EFF]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((post) => (
            <div
              key={post?._id}
              className="flex flex-col items-center bg-black border border-[#101012] shadow-lg p-4 rounded-lg"
            >
              {/* Profile Picture */}
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden shadow-lg border-2 border-white mb-2 cursor-pointer"
                onClick={() => navigate(`/user/${post?._id}`)}
              >
                {post.userProfile?.profilePicture ? (
                  <img
                    src={`data:image/png;base64,${post.userProfile.profilePicture}`}
                    alt={post.userProfile?.username || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl md:text-2xl font-bold">
                    {post.userProfile?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>

              {/* Name & Username */}
              <h3 className="text-white font-semibold text-md">{post?._doc?.name}</h3>
              <p className="text-gray-400 text-sm mb-3">
                {post?.userProfile?.username || "@newuser"}
              </p>

              {/* Follow Button */}
              <button
                className={`px-4 py-1.5 transition cursor-pointer rounded-2xl ${
                  followedUsers[post?._id]
                    ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                    : "bg-[#877EFF] text-white hover:bg-[#877EFF]"
                }`}
                onClick={() => handleFollow(post?._id)}
              >
                {followedUsers[post?._id] ? "Following" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Alluser;
