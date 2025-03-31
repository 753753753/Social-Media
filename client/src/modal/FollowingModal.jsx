
import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFollowStats, toggleFollow } from "../features/auth/followSlice";

function FollowingModal({ isOpen, onClose, following, followedUsers }) {
    if (!isOpen) return null;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Handle follow/unfollow toggle
    const handleFollow = (userId) => {
        dispatch(toggleFollow(userId));
    };

    const handleclose = () => {
        dispatch(fetchFollowStats());
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-black text-white w-[350px] sm:w-[400px] rounded-xl shadow-lg p-4 relative">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <h2 className="text-lg font-semibold">Following</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition cursor-pointer">
                        <IoClose className="text-2xl" onClick={handleclose} />
                    </button>
                </div>

            {/* Scrollable List */}
<div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800 mt-2 p-1">
    {following && following.length > 0 ? (
        following.map((user) => {
            const profilePicture = user?.userProfile?.profilePicture || "";
            const profileImageSrc = profilePicture.startsWith("data")
                ? profilePicture
                : profilePicture
                ? `data:image/png;base64,${profilePicture}`
                : "/default-profile.png"; // Fallback to a default image

            return (
                <div
                    key={user?._id || Math.random()} // Ensure a unique key
                    className="flex items-center justify-between p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer border border-[#101012] mb-1"
                >
                    {/* Profile Picture */}
                    <img
                        src={profileImageSrc}
                        alt={user?.userProfile?.username || "User"}
                        className="w-12 h-12 rounded-full object-cover border border-gray-600 shadow-md"
                        onClick={() => user?.followingUserId?._id && navigate(`/user/${user.followingUserId._id}`)}
                    />

                    {/* User Details */}
                    <div
                        className="ml-3 flex-1"
                        onClick={() => user?.followingUserId?._id && navigate(`/user/${user.followingUserId._id}`)}
                    >
                        <p className="font-semibold">{user?.followingUserId?.name || "Unknown User"}</p>
                        <p className="text-gray-400 text-sm">{user?.userProfile?.username || "No username"}</p>
                    </div>

                    {/* Follow Button */}
                    <button
                        className={`px-4 py-1.5 transition cursor-pointer rounded-2xl ${
                            followedUsers[user?.followingUserId?._id]
                                ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                                : "bg-[#877EFF] text-white hover:bg-[#877EFF]"
                        }`}
                        onClick={() => user?.followingUserId?._id && handleFollow(user.followingUserId._id)}
                    >
                        {followedUsers[user?.followingUserId?._id] ? "Following" : "Follow"}
                    </button>
                </div>
            );
        })
    ) : (
        <p className="text-center text-gray-400 py-4">No following users</p>
    )}
</div>

            </div>
        </div>
    );
}

export default FollowingModal;
